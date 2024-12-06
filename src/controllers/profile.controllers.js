import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";

const updateProfileAvatar = async (req, res) => {
    try {
        const { profileId } = req.body;
        const avatar = req.file?.path;
        if (!profileId || !avatar) {
            return res.status(400).json({ message: "Missing required fields: profileId or avatar." });
        }
        if (!mongoose.isValidObjectId(profileId)) {
            return res.status(400).json({ message: "Invalid profile ID." });
        }
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { avatar },
            { new: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }
        return res.status(200).json({
            message: "Avatar updated successfully.",
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Error updating avatar:", error.message);
        res.status(500).json({ message: "Could not update avatar.", error: error.message });
    }
};

const updateProfileCover = async (req, res) => {
    try {
        const { profileId } = req.body;
        const cover = req.file?.path;
        if (!profileId || !cover) {
            return res.status(400).json({ message: "Missing required fields: profileId or cover." });
        }
        if (!mongoose.isValidObjectId(profileId)) {
            return res.status(400).json({ message: "Invalid profile ID." });
        }
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { cover },
            { new: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }
        return res.status(200).json({
            message: "Cover updated successfully.",
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Error updating cover:", error.message);
        res.status(500).json({ message: "Could not update cover.", error: error.message });
    }
};

const updateProfileDetails = async (req, res) => {
    try {
        const { profileId, ...updateData } = req.body;

        if (!profileId || !mongoose.isValidObjectId(profileId)) {
            return res.status(400).json({ message: "Invalid or missing profile ID." });
        }

        if (updateData._id || updateData.userName) {
            return res.status(400).json({ message: "Cannot update _id or userName." });
        }

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Error updating profile details:", error.message);
        res.status(500).json({ message: "Could not update profile.", error: error.message });
    }
};


export {
    updateProfileAvatar, updateProfileCover, updateProfileDetails
}
