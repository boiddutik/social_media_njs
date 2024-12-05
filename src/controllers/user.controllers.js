


import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";

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
        console.log("Uploaded files:", req.files);

        const { userName, email, password, fullName, dob, profession } = req.body;
        const avatar = req.files?.avatar?.[0]?.path;
        const cover = req.files?.cover?.[0]?.path || "";

        console.log(`UserName: ${userName}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Full Name: ${fullName}`);
        console.log(`Date of Birth: ${dob}`);
        console.log(`Profession: ${profession}`);
        console.log(`Avatar: ${avatar}`);
        console.log(`Cover: ${cover}`);

        if (!userName || !email || !password || !fullName || !dob || !profession || !avatar) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Create the user with all the necessary profile data
        const createdUser = await User.create({
            userName,
            email,
            password,
        });

        console.log(`User created:`, createdUser);

        // After user creation, create the profile for the user
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




export {
    createUser
}
