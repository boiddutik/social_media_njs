import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';

import { ApiError } from "../utils/api.error.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const createUser = async (req, res) => {
    try {
        const { userName, email, password, fullName, dob, profession, gender, country, state, city } = req.body;
        const avatar = req.files?.avatar?.[0]?.path;
        const cover = req.files?.cover?.[0]?.path || "";
        // console.log("Uploaded files:", req.files);
        // console.log(`UserName: ${userName}`);
        // console.log(`Email: ${email}`);
        // console.log(`Password: ${password}`);
        // console.log(`Full Name: ${fullName}`);
        // console.log(`Date of Birth: ${dob}`);
        // console.log(`Profession: ${profession}`);
        // console.log(`Avatar: ${avatar}`);
        // console.log(`Cover: ${cover}`);

        if (!userName || !email || !password || !fullName || !dob || !profession || !avatar || !gender || !country || !state || !city) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Check if userName already exists in the database
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            if (avatar) fs.unlinkSync(avatar);
            if (cover) fs.unlinkSync(cover);
            return res.status(400).json({
                message: `UserName ${userName} is already taken.`,
            });
        }

        // Check if email already exists in the database
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            if (avatar) fs.unlinkSync(avatar);
            if (cover) fs.unlinkSync(cover);
            return res.status(400).json({
                message: `Email ${email} is already in use.`,
            });
        }

        const createdUser = await User.create({
            userName,
            email,
            password,
        });

        // console.log(`User created:`, createdUser);

        const profile = new Profile({
            user: createdUser._id,
            userName,
            fullName,
            dob,
            profession,
            avatar,
            cover,
            gender,
            country,
            state,
            city
        });

        await profile.save();

        createdUser.profile = profile._id;
        await createdUser.save({ validateBeforeSave: false });

        // Exclude sensitive data
        const userWithoutSensitiveData = await User.findById(createdUser._id).select("-password -refreshToken");

        return res.status(201).json({
            message: "Account created successfully.",
            user: userWithoutSensitiveData,
        });

    } catch (error) {
        console.error("Error creating user:", error.message);

        if (error.code === 11000) {
            return res.status(400).json({
                message: `Duplicate field: ${Object.keys(error.keyValue).join(", ")} already exists.`,
            });
        }

        res.status(500).json({ message: "Could not create account.", error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, userName, password } = req.body
    if (!userName && !email) {
        res.status(400).json({ message: "Credential is missing." });
    }
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (!user) {
        res.status(404).json({ message: "User does not exist" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid user credentials" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const loggedInUserProfile = await Profile.findById(user.profile)
    // console.log(loggedInUserProfile)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).json({
            message: "User logged In Successfully.",
            user: loggedInUser, jwt: accessToken, rwt: refreshToken, profile: loggedInUserProfile,
        });
}

const logOut = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined,
        }
    },
        { new: true }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "User logged Out.",
        })

}

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            res.status(401).json({ message: "Invalid Refresh Token" });
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            res.status(401).json({ message: "Token expired!" });
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id)
        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options).json({
                message: "New Refresh Token Generated.",
                jwt: accessToken, rwt: newRefreshToken,
            });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong, while generating the token!" });
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
        throw new ApiError(401, "Please enter a new password!")
    }
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "Couldnot find user.")
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect old password.")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.status(200).json({ "message": "Password Changed." })
}

const changeUsername = async (req, res) => {
    const { userName } = req.body;
    if (userName.length < 3) {
        throw new ApiError(401, "Username cannot be less than 3 units.")
    }
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "Couldnot find user.")
    }
    user.userName = userName
    await user.save({ validateBeforeSave: false })
    return res.status(200).json({ "message": "Username updated.", "userName": username })
}

const changeEmail = async (req, res) => {
    const { email } = req.body;
    if (email.length < 8) {
        throw new ApiError(401, "Please enter a valid email.")
    }
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "Couldnot find user.")
    }
    user.email = email
    await user.save({ validateBeforeSave: false })
    return res.status(200).json({ "message": "Email updated.", "email": email })
}

const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user?._id)
    if (!user) {
        res.status(404).json({ message: "User does not exist" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const loggedInUserProfile = await Profile.findById(user.profile)
    // console.log(loggedInUserProfile)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).json({
            message: "Current User Details.",
            user: loggedInUser, jwt: accessToken, rwt: refreshToken, profile: loggedInUserProfile,
        });
}

export {
    createUser, loginUser, logOut, refreshAccessToken, changePassword, changeUsername, changeEmail, getCurrentUser
}
