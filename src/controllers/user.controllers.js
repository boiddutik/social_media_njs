import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/api.error.js"
import { ApiResponse } from "../utils/api.response.js";

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
        const { userName, email, password, fullName, dob, profession } = req.body;
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

        if (!userName || !email || !password || !fullName || !dob || !profession || !avatar) {
            return res.status(400).json({ message: "Missing required fields." });
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
            cover
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
        .json(new ApiResponse(200, {}, "User logged Out"))
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

// const refreshAccessToken = async (req, res) => {
// return res.status(200).cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options).json({
//         message: "User logged In Successfully.",
//         user: loggedInUser, jwt: accessToken, rwt: refreshToken, profile: loggedInUserProfile,
//     });
//     res.status(401).json({ message: "Invalid user credentials" });
// }

export {
    createUser, loginUser, logOut, refreshAccessToken
}
