import { GYM } from "../models/GYM";
import { Comment } from "../models/Comment";
import { Profile } from "../models/Profile"; // Ensure Profile is imported

export const createGym = async (req, res) => {
    const { Name, description, latitude, longitude, address, media } = req.body;
    const ownerId = req.user.id;
    try {
        const gym = new GYM({
            owner: ownerId,
            Name,
            description,
            latitude,
            longitude,
            address,
            media,
        });
        await gym.save();
        const ownerProfile = await Profile.findOne({ user: ownerId });
        if (!ownerProfile) {
            const newProfile = new Profile({
                user: ownerId,
                bio: `${req.user.name}'s Profile`,
                avatar: req.user.avatar || "default_avatar_url",
            });
            await newProfile.save();
        }
        return res.status(201).json(gym);
    } catch (error) {
        console.error("Error creating gym:", error.message);
        res.status(500).json({ message: "Error creating gym" });
    }
};

export const getAllGyms = async (req, res) => {
    try {
        const gyms = await GYM.find()
            .populate("owner")
            .populate("comments")
            .populate("likes")
            .populate("unLikes")
            .populate("shares")
            .populate("views");
        const gymsWithProfiles = await Promise.all(gyms.map(async (gym) => {
            const profile = await Profile.findOne({ user: gym.owner._id });
            gym.owner.profile = profile;
            return gym;
        }));

        return res.status(200).json(gymsWithProfiles);
    } catch (error) {
        console.error("Error fetching gyms:", error.message);
        res.status(500).json({ message: "Error fetching gyms" });
    }
};

export const getGymById = async (req, res) => {
    const { gymId } = req.params;
    try {
        const gym = await GYM.findById(gymId)
            .populate("owner")
            .populate("comments")
            .populate("likes")
            .populate("unLikes")
            .populate("shares")
            .populate("views");
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        const profile = await Profile.findOne({ user: gym.owner._id });
        gym.owner.profile = profile;
        return res.status(200).json(gym);
    } catch (error) {
        console.error("Error fetching gym:", error.message);
        res.status(500).json({ message: "Error fetching gym" });
    }
};

export const updateGym = async (req, res) => {
    const { gymId } = req.params;
    const { Name, description, latitude, longitude, media } = req.body;
    const userId = req.user.id;
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        if (gym.owner.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this gym" });
        }
        gym.Name = Name || gym.Name;
        gym.description = description || gym.description;
        gym.latitude = latitude || gym.latitude;
        gym.longitude = longitude || gym.longitude;
        gym.media = media || gym.media;
        await gym.save();
        return res.status(200).json(gym);
    } catch (error) {
        console.error("Error updating gym:", error.message);
        res.status(500).json({ message: "Error updating gym" });
    }
};

export const deleteGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;

    try {
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        if (gym.owner.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this gym" });
        }
        await gym.remove();
        return res.status(200).json({ message: "Gym deleted successfully" });
    } catch (error) {
        console.error("Error deleting gym:", error.message);
        res.status(500).json({ message: "Error deleting gym" });
    }
};

export const likeGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) return res.status(404).json({ message: "Gym not found" });
        if (gym.likes.includes(userId)) {
            return res.status(400).json({ message: "You already liked this gym." });
        }
        gym.likes.push(userId);
        await gym.save();
        return res.status(200).json(gym);
    } catch (error) {
        console.error("Error liking gym:", error.message);
        res.status(500).json({ message: "Error liking gym" });
    }
};

export const unlikeGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) return res.status(404).json({ message: "Gym not found" });
        if (!gym.likes.includes(userId)) {
            return res.status(400).json({ message: "You haven't liked this gym yet." });
        }
        gym.likes = gym.likes.filter(id => id.toString() !== userId);
        await gym.save();
        return res.status(200).json(gym);
    } catch (error) {
        console.error("Error unliking gym:", error.message);
        res.status(500).json({ message: "Error unliking gym" });
    }
};

export const addComment = async (req, res) => {
    const { gymId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) return res.status(404).json({ message: "Gym not found" });
        const comment = new Comment({
            user: userId,
            text,
            gym: gymId,
        });
        await comment.save();
        gym.comments.push(comment);
        await gym.save();
        return res.status(201).json(comment);
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ message: "Error adding comment" });
    }
};

export const removeComment = async (req, res) => {
    const { gymId, commentId } = req.params;
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) return res.status(404).json({ message: "Gym not found" });
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        gym.comments = gym.comments.filter(c => c.toString() !== commentId);
        await gym.save();
        await comment.remove();
        return res.status(200).json({ message: "Comment removed" });
    } catch (error) {
        console.error("Error removing comment:", error.message);
        res.status(500).json({ message: "Error removing comment" });
    }
};

export const joinGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;
    const { role } = req.body; // Role like "Manager", "Fighter", "Owner", "Member" etc.
    if (!role || !["Manager", "Fighter", "Coordinator", "Owner", "Member"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }

        const alreadyJoined = gym.associates.some(associate => associate.user.toString() === userId);
        if (alreadyJoined) {
            return res.status(400).json({ message: "You are already a member of this gym" });
        }
        gym.associates.push({
            user: userId,
            role
        });
        let userProfile = await Profile.findOne({ user: userId });
        if (!userProfile) {
            userProfile = new Profile({
                user: userId,
                bio: `This is the profile of user ${userId}`,
                avatar: "default_avatar_url",
                associatedGyms: [gymId],
            });
            await userProfile.save();
        } else {
            if (!userProfile.associatedGyms.includes(gymId)) {
                userProfile.associatedGyms.push(gymId);
                await userProfile.save();
            }
        }
        await gym.save();
        return res.status(200).json({ message: "Successfully joined the gym" });
    } catch (error) {
        console.error("Error joining gym:", error.message);
        res.status(500).json({ message: "Error joining gym" });
    }
};

export const unjoinGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;
    try {
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        const associateIndex = gym.associates.findIndex(associate => associate.user.toString() === userId);
        if (associateIndex === -1) {
            return res.status(400).json({ message: "You are not a member of this gym" });
        }
        gym.associates.splice(associateIndex, 1);
        await gym.save();
        const userProfile = await Profile.findOne({ user: userId });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        userProfile.associatedGyms = userProfile.associatedGyms.filter(gymIdInProfile => gymIdInProfile.toString() !== gymId.toString());
        await userProfile.save();
        return res.status(200).json({ message: "Successfully left the gym" });
    } catch (error) {
        console.error("Error leaving gym:", error.message);
        res.status(500).json({ message: "Error leaving gym" });
    }
};
