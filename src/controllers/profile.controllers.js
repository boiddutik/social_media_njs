import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";


const getCurrentUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }
        return res.status(200).json({ profile });
    } catch (error) {
        console.error("Error getting current user's profile:", error.message);
        res.status(500).json({ message: "Could not retrieve profile details.", error: error.message });
    }
};

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

        if (updateData._id || updateData.userName || updateData.user) {
            return res.status(400).json({ message: "Cannot update _id(profileId), user(userId), userName." });
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

const getProfileByProfileIdDetails = async (req, res) => {
    const { profileId } = req.params;
    try {
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }
        return res.status(200).json({ profile });
    } catch (error) {
        console.error("Error getting profile details:", error.message);
        res.status(500).json({ message: "Could not retrieve profile details.", error: error.message });
    }
};

const getFollowers = async (req, res) => {
    const { profileId } = req.params;

    try {
        const profile = await Profile.findById(profileId).populate("followers");
        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }
        return res.status(200).json({ followers: profile.followers });
    } catch (error) {
        console.error("Error getting followers:", error.message);
        res.status(500).json({ message: "Could not retrieve followers.", error: error.message });
    }
};

const getFollowing = async (req, res) => {
    const { profileId } = req.params;

    try {
        const profile = await Profile.findById(profileId).populate("followerings");
        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }
        return res.status(200).json({ following: profile.followerings });
    } catch (error) {
        console.error("Error getting following:", error.message);
        res.status(500).json({ message: "Could not retrieve following list.", error: error.message });
    }
};

const followProfile = async (req, res) => {
    try {
        const { profileId } = req.params; // Receiver's profile
        const senderId = req.user.id; // The ID of the currently authenticated user (sender)

        // Ensure that the sender is not trying to follow their own profile
        if (profileId === senderId) {
            return res.status(400).json({ message: "You cannot follow your own profile." });
        }

        // Find the profiles for both the sender and the receiver
        const senderProfile = await Profile.findOne({ user: senderId });
        const receiverProfile = await Profile.findOne({ user: profileId });

        if (!senderProfile || !receiverProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Check if the receiver's profile is private
        if (receiverProfile.isPrivateProfile) {
            // If private, add the follow request (non-direct relationship)
            if (!senderProfile.sentFollowRequests.includes(profileId)) {
                senderProfile.sentFollowRequests.push(profileId);
                await senderProfile.save();

                receiverProfile.recievedFollowRequests.push(senderId);
                await receiverProfile.save();

                return res.status(200).json({ message: "Follow request sent successfully." });
            } else {
                return res.status(400).json({ message: "Follow request already sent." });
            }
        } else {
            // If not private, create a direct relationship
            if (!senderProfile.followerings.includes(profileId)) {
                senderProfile.followerings.push(profileId);
                await senderProfile.save();

                if (!receiverProfile.followers.includes(senderId)) {
                    receiverProfile.followers.push(senderId);
                    await receiverProfile.save();
                }

                return res.status(200).json({
                    message: "Followed successfully. Direct relationship established.",
                });
            } else {
                return res.status(400).json({ message: "Already following this profile." });
            }
        }
    } catch (error) {
        console.error("Error following profile:", error.message);
        res.status(500).json({ message: "Could not follow profile.", error: error.message });
    }
};

const followRequestDecision = async (req, res) => {
    const { profileId } = req.params;
    const senderId = req.user.id;

    try {
        const receiverProfile = await Profile.findOne({ user: profileId });
        const senderProfile = await Profile.findOne({ user: senderId });

        if (!receiverProfile || !senderProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Check if the follow request exists in the receiver's received requests
        const followRequestIndex = receiverProfile.recievedFollowRequests.indexOf(senderId);
        if (followRequestIndex === -1) {
            return res.status(400).json({ message: "No follow request found from this user." });
        }

        // Remove the follow request from receiver's received list
        receiverProfile.recievedFollowRequests.splice(followRequestIndex, 1);
        await receiverProfile.save();

        // Decision: true (accept) or false (deny)
        const { decision } = req.body; // decision: true or false

        if (decision === true) {
            // Add each other as followers (establish the relationship)
            if (!senderProfile.followerings.includes(profileId)) {
                senderProfile.followerings.push(profileId);
                await senderProfile.save();
            }
            if (!receiverProfile.followers.includes(senderId)) {
                receiverProfile.followers.push(senderId);
                await receiverProfile.save();
            }

            return res.status(200).json({ message: "Follow request accepted." });
        } else if (decision === false) {
            // Optionally, respond with denial
            return res.status(200).json({ message: "Follow request denied." });
        } else {
            return res.status(400).json({ message: "Invalid decision. Use 'true' for accept or 'false' for deny." });
        }
    } catch (error) {
        console.error("Error processing follow request:", error.message);
        res.status(500).json({ message: "Could not process follow request.", error: error.message });
    }
};

const unfollowProfile = async (req, res) => {
    const { profileId } = req.params;
    const senderId = req.user.id;

    try {
        const receiverProfile = await Profile.findOne({ user: profileId });
        const senderProfile = await Profile.findOne({ user: senderId });

        if (!receiverProfile || !senderProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Check if the sender is already following the receiver
        if (!senderProfile.followerings.includes(profileId)) {
            return res.status(400).json({ message: "You are not following this user." });
        }

        // Remove receiver from sender's following list and sender from receiver's followers list
        senderProfile.followerings = senderProfile.followerings.filter(id => id.toString() !== profileId);
        receiverProfile.followers = receiverProfile.followers.filter(id => id.toString() !== senderId);

        await senderProfile.save();
        await receiverProfile.save();

        return res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error) {
        console.error("Error unfollowing profile:", error.message);
        res.status(500).json({ message: "Could not unfollow profile.", error: error.message });
    }
};

const blockProfile = async (req, res) => {
    const { profileId } = req.params;
    const senderId = req.user.id;

    try {
        const receiverProfile = await Profile.findOne({ user: profileId });
        const senderProfile = await Profile.findOne({ user: senderId });

        if (!receiverProfile || !senderProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Check if sender is already blocking the receiver
        if (senderProfile.blockList.includes(profileId)) {
            return res.status(400).json({ message: "You have already blocked this user." });
        }

        // Add the receiver to sender's block list
        senderProfile.blockList.push(profileId);
        await senderProfile.save();

        // Optionally, remove the user from followerings or followers if needed
        senderProfile.followerings = senderProfile.followerings.filter(id => id.toString() !== profileId);
        receiverProfile.followers = receiverProfile.followers.filter(id => id.toString() !== senderId);

        await senderProfile.save();
        await receiverProfile.save();

        return res.status(200).json({ message: "User blocked successfully." });
    } catch (error) {
        console.error("Error blocking profile:", error.message);
        res.status(500).json({ message: "Could not block profile.", error: error.message });
    }
};

const unblockProfile = async (req, res) => {
    const { profileId } = req.params;
    const senderId = req.user.id;

    try {
        const receiverProfile = await Profile.findOne({ user: profileId });
        const senderProfile = await Profile.findOne({ user: senderId });

        if (!receiverProfile || !senderProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Check if sender is blocking the receiver
        if (!senderProfile.blockList.includes(profileId)) {
            return res.status(400).json({ message: "You are not blocking this user." });
        }

        // Remove the receiver from sender's block list
        senderProfile.blockList = senderProfile.blockList.filter(id => id.toString() !== profileId);
        await senderProfile.save();

        return res.status(200).json({ message: "User unblocked successfully." });
    } catch (error) {
        console.error("Error unblocking profile:", error.message);
        res.status(500).json({ message: "Could not unblock profile.", error: error.message });
    }
};

const searchUsers = async (req, res) => {
    const { query } = req.query;  // The search query passed by the client (userName, fullName, email)

    if (!query) {
        return res.status(400).json({ message: "Search query is required." });
    }

    try {
        // Search for users based on userName, fullName, or email
        const userResults = await User.find({
            $or: [
                { userName: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        });

        if (userResults.length === 0) {
            return res.status(404).json({ message: "No users found matching the search query." });
        }

        // Retrieve profiles for the found users
        const profiles = await Profile.find({
            user: { $in: userResults.map(user => user._id) }
        });

        return res.status(200).json({
            message: "Profiles found.",
            profiles,
        });
    } catch (error) {
        console.error("Error searching users:", error.message);
        res.status(500).json({ message: "Could not perform search.", error: error.message });
    }
};

export {
    getCurrentUserProfile, updateProfileAvatar, updateProfileCover, updateProfileDetails, getProfileByProfileIdDetails, getFollowers, getFollowing, followProfile, followRequestDecision, unfollowProfile, blockProfile, unblockProfile, searchUsers
}
