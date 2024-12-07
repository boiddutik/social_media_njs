import { Post } from "../models/post.model.js";
import { Profile } from "../models/profile.model.js";


export const createPost = async (req, res) => {
    const { title, description, type, privacy } = req.body;
    const images = req.files?.image ? req.files.image.map(file => file.path) : [];
    const videos = req.files?.video ? req.files.video.map(file => file.path) : [];
    const userId = req.user.id;
    try {
        const post = new Post({
            user: userId,
            title,
            description,
            type,
            images,
            videos,
            privacy
        });
        await post.save();
        const profile = await Profile.findOne({ user: userId });
        profile.posts.push(post._id);
        await profile.save();
        return res.status(201).json(post);
    } catch (error) {
        console.error("Error creating post:", error.message);
        return res.status(500).json({ message: "Error creating post" });
    }
};


export const toggleLike = async (req, res) => {
    const { postId } = req.params;
    const profileId = req.user.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        if (post.likes.includes(profileId)) {
            post.likes = post.likes.filter((userId) => userId.toString() !== profileId);
            profile.likedPosts = profile.likedPosts.filter((postId) => postId.toString() !== postId);
        } else {
            post.likes.push(profileId);
            profile.likedPosts.push(postId);
        }
        await post.save();
        await profile.save();
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error toggling like:", error.message);
        return res.status(500).json({ message: "Error toggling like" });
    }
};


export const getAllPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ user: userId });
        if (!posts) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        return res.status(500).json({ message: "Error fetching posts" });
    }
};

export const getPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error.message);
        return res.status(500).json({ message: "Error fetching post" });
    }
};


export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, description, privacy, images, videos } = req.body;
    const userId = req.user.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: "You can only update your own posts" });
        }
        post.title = title || post.title;
        post.description = description || post.description;
        post.privacy = privacy || post.privacy;
        post.images = images || post.images;
        post.videos = videos || post.videos;
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error updating post:", error.message);
        return res.status(500).json({ message: "Error updating post" });
    }
};


export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user is the creator of the post
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own posts" });
        }

        // Delete the post
        await post.remove();

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        return res.status(500).json({ message: "Error deleting post" });
    }
};
