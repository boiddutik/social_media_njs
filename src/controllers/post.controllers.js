import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Profile } from '../models/Profile';

export const createPost = async (req, res) => {
    const { title, description, type, media } = req.body;
    const userId = req.user.id;
    try {
        const post = new Post({
            user: userId,
            title,
            description,
            type,
            media,
        });
        await post.save();

        // Update user's profile
        const profile = await Profile.findOne({ user: userId });
        profile.posts.push(post._id);
        await profile.save();

        return res.status(201).json(post);
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ message: "Error creating post" });
    }
};

export const getAllPosts = async (req, res) => {
    const { page = 1, limit = 10, typeFilter } = req.query;
    try {
        const posts = await Post.find(typeFilter ? { type: typeFilter } : {})
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("user")
            .populate("comments")
            .populate("likes")
            .populate("unLikes")
            .populate("shares")
            .populate("views");

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ message: "Error fetching posts" });
    }
};

export const getPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId)
            .populate("user")
            .populate("comments")
            .populate("likes")
            .populate("unLikes")
            .populate("shares")
            .populate("views");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error.message);
        res.status(500).json({ message: "Error fetching post" });
    }
};

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, description, type, media } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.type = type || post.type;
        post.media = media || post.media;

        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).json({ message: "Error updating post" });
    }
};

export const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove the post from the user's profile
        const profile = await Profile.findOne({ user: post.user });
        profile.posts = profile.posts.filter(id => id.toString() !== postId);
        await profile.save();

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({ message: "Error deleting post" });
    }
};

export const likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You already liked this post." });
        }

        post.likes.push(userId);
        await post.save();

        // Update profile's liked posts
        const profile = await Profile.findOne({ user: userId });
        profile.likedPosts.push(postId);
        await profile.save();

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error liking post:", error.message);
        res.status(500).json({ message: "Error liking post" });
    }
};

export const unlikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: "You haven't liked this post yet." });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        // Update profile's liked posts
        const profile = await Profile.findOne({ user: userId });
        profile.likedPosts = profile.likedPosts.filter(id => id.toString() !== postId);
        await profile.save();

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error unliking post:", error.message);
        res.status(500).json({ message: "Error unliking post" });
    }
};

export const getComments = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate('comments');
        if (!post) return res.status(404).json({ message: "Post not found" });

        const commentsWithReplies = await Promise.all(post.comments.map(async (comment) => {
            const replies = await Comment.find({ parentComment: comment._id }).populate('user');
            return {
                ...comment.toObject(),
                replies,
            };
        }));
        return res.status(200).json(commentsWithReplies);
    } catch (error) {
        console.error("Error retrieving comments:", error.message);
        res.status(500).json({ message: "Error retrieving comments" });
    }
};

export const reportPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.reported = true;
        await post.save();

        return res.status(200).json({ message: "Post reported successfully" });
    } catch (error) {
        console.error("Error reporting post:", error.message);
        res.status(500).json({ message: "Error reporting post" });
    }
};

export const expressInterest = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.interestedUsers.includes(userId)) {
            return res.status(400).json({ message: "You have already expressed interest in this post." });
        }

        post.interestedUsers.push(userId);
        await post.save();

        return res.status(200).json({ message: "Interest expressed" });
    } catch (error) {
        console.error("Error expressing interest:", error.message);
        res.status(500).json({ message: "Error expressing interest" });
    }
};

export const purchasePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.purchasedUsers.includes(userId)) {
            return res.status(400).json({ message: "You have already purchased this post." });
        }

        post.purchasedUsers.push(userId);
        await post.save();

        // Update profile's purchased posts
        const profile = await Profile.findOne({ user: userId });
        profile.purchasedPosts.push(postId);
        await profile.save();

        return res.status(200).json({ message: "Post purchased successfully" });
    } catch (error) {
        console.error("Error purchasing post:", error.message);
        res.status(500).json({ message: "Error purchasing post" });
    }
};

export const addAssociate = async (req, res) => {
    const { postId } = req.params;
    const { associateId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.associates.push(associateId);
        await post.save();

        return res.status(200).json({ message: "Associate added" });
    } catch (error) {
        console.error("Error adding associate:", error.message);
        res.status(500).json({ message: "Error adding associate" });
    }
};

export const removeAssociate = async (req, res) => {
    const { postId } = req.params;
    const { associateId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.associates = post.associates.filter(id => id.toString() !== associateId);
        await post.save();

        return res.status(200).json({ message: "Associate removed" });
    } catch (error) {
        console.error("Error removing associate:", error.message);
        res.status(500).json({ message: "Error removing associate" });
    }
};


// export const addComment = async (req, res) => {
//     const { postId } = req.params;
//     const { text } = req.body;
//     const userId = req.user.id;
//     try {
//         const post = await Post.findById(postId);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         const comment = new Comment({
//             user: userId,
//             text,
//             post: postId,
//         });

//         await comment.save();
//         post.comments.push(comment);
//         await post.save();

//         // Add to profile's commented posts
//         const profile = await Profile.findOne({ user: userId });
//         profile.commentedPosts.push(postId);
//         await profile.save();

//         return res.status(201).json(comment);
//     } catch (error) {
//         console.error("Error adding comment:", error.message);
//         res.status(500).json({ message: "Error adding comment" });
//     }
// };

// export const removeComment = async (req, res) => {
//     const { postId, commentId } = req.params;
//     try {
//         const post = await Post.findById(postId);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         const comment = await Comment.findById(commentId);
//         if (!comment) return res.status(404).json({ message: "Comment not found" });

//         post.comments = post.comments.filter(c => c.toString() !== commentId);
//         await post.save();

//         await comment.remove();

//         // Update profile's commented posts
//         const profile = await Profile.findOne({ user: comment.user });
//         profile.commentedPosts = profile.commentedPosts.filter(id => id.toString() !== postId);
//         await profile.save();

//         return res.status(200).json({ message: "Comment removed" });
//     } catch (error) {
//         console.error("Error removing comment:", error.message);
//         res.status(500).json({ message: "Error removing comment" });
//     }
// };