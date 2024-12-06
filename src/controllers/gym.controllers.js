import { GYM } from "../models/GYM";
import { Comment } from "../models/Comment";  // Assuming you have this model
import { Profile } from "../models/Profile";  // Assuming you have this model

// Create a new gym
export const createGym = async (req, res) => {
    const { Name, description, latitude, longitude, address, media } = req.body;
    const ownerId = req.user.id; // From the verified JWT

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
        return res.status(201).json(gym);
    } catch (error) {
        console.error("Error creating gym:", error.message);
        res.status(500).json({ message: "Error creating gym" });
    }
};

// Get all gyms
export const getAllGyms = async (req, res) => {
    try {
        const gyms = await GYM.find()
            .populate("owner")
            .populate("comments")
            .populate("likes")
            .populate("unLikes")
            .populate("shares")
            .populate("views");
        return res.status(200).json(gyms);
    } catch (error) {
        console.error("Error fetching gyms:", error.message);
        res.status(500).json({ message: "Error fetching gyms" });
    }
};

// Get a gym by ID
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
        return res.status(200).json(gym);
    } catch (error) {
        console.error("Error fetching gym:", error.message);
        res.status(500).json({ message: "Error fetching gym" });
    }
};

// Update gym details
export const updateGym = async (req, res) => {
    const { gymId } = req.params;
    const { Name, description, latitude, longitude, media } = req.body;

    try {
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
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

// Delete gym
export const deleteGym = async (req, res) => {
    const { gymId } = req.params;

    try {
        const gym = await GYM.findByIdAndDelete(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        return res.status(200).json({ message: "Gym deleted successfully" });
    } catch (error) {
        console.error("Error deleting gym:", error.message);
        res.status(500).json({ message: "Error deleting gym" });
    }
};

// Like a gym
export const likeGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;

    try {
        const gym = await GYM.findById(gymId);
        if (!gym) return res.status(404).json({ message: "Gym not found" });

        // Check if user already liked the gym
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

// Unlike a gym
export const unlikeGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;

    try {
        const gym = await GYM.findById(gymId);
        if (!gym) return res.status(404).json({ message: "Gym not found" });

        // Check if user has liked the gym
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

// Add a comment to a gym
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

// Remove a comment from a gym
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

// Join a gym (add the profile to associates)
export const joinGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;
    const { role } = req.body; // Role like "Manager", "Fighter", etc.

    if (!role || !["Manager", "Fighter", "Coordinator"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        // Find the gym by ID
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }

        // Check if the profile is already an associate of the gym
        const alreadyJoined = gym.associates.some(associate => associate.user.toString() === userId);
        if (alreadyJoined) {
            return res.status(400).json({ message: "You are already a member of this gym" });
        }

        // Add the profile to the gym's associates
        gym.associates.push({
            user: userId,
            role
        });
        await gym.save();

        return res.status(200).json({ message: "Successfully joined the gym" });
    } catch (error) {
        console.error("Error joining gym:", error.message);
        res.status(500).json({ message: "Error joining gym" });
    }
};

// Unjoin a gym (remove the profile from associates)
export const unjoinGym = async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user.id;

    try {
        // Find the gym by ID
        const gym = await GYM.findById(gymId);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }

        // Check if the profile is an associate of the gym
        const associateIndex = gym.associates.findIndex(associate => associate.user.toString() === userId);
        if (associateIndex === -1) {
            return res.status(400).json({ message: "You are not a member of this gym" });
        }

        // Remove the profile from the gym's associates
        gym.associates.splice(associateIndex, 1);
        await gym.save();

        return res.status(200).json({ message: "Successfully left the gym" });
    } catch (error) {
        console.error("Error leaving gym:", error.message);
        res.status(500).json({ message: "Error leaving gym" });
    }
};


// export {
//     createGym,
//     getAllGyms,
//     getGymById,
//     updateGym,
//     deleteGym,
//     likeGym,
//     unlikeGym,
//     addComment,
//     removeComment,
//     joinGym,
//     unjoinGym
// };
