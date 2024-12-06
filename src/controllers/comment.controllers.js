import { Comment } from "../models/comment.model.js";
import { Profile } from "../models/profile.model.js";

export const createComment = async (req, res) => {
    try {
        const { user, post, text, media } = req.body;
        const userProfile = await Profile.findOne({ user: user });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        const postExists = await Post.findById(post);
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }
        const newComment = new Comment({
            user,
            post,
            text,
            media,
        });
        await newComment.save();
        if (!userProfile.commentedPosts.includes(newComment._id)) {
            userProfile.commentedPosts.push(newComment._id);
            await userProfile.save();
        }
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId })
            .populate("user", "name avatar userName fullName")
            .exec();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId).populate("user", "name avatar userName fullName");
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text, media } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this comment" });
        }
        comment.text = text;
        comment.media = media;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await comment.remove();
        const userProfile = await Profile.findOne({ user: comment.user });
        if (userProfile) {
            userProfile.commentedPosts = userProfile.commentedPosts.filter(
                (commentId) => commentId.toString() !== comment._id.toString()
            );
            await userProfile.save();
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user } = req.body;
        const userProfile = await Profile.findOne({ user: user });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (!comment.likes.includes(user)) {
            comment.likes.push(user);
            await comment.save();
        }
        res.status(200).json({ message: "Comment liked", likes: comment.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unLikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user } = req.body;


        const userProfile = await Profile.findOne({ user: user });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.likes = comment.likes.filter((like) => like.toString() !== user);
        await comment.save();

        res.status(200).json({ message: "Comment unliked", likes: comment.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reportComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user } = req.body;
        const userProfile = await Profile.findOne({ user: user });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (!comment.reports.includes(user)) {
            comment.reports.push(user);
            await comment.save();
        }
        res.status(200).json({ message: "Comment reported", reports: comment.reports });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createReply = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user, text } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        const newReply = {
            user,
            text,
        };
        comment.replies.push(newReply);
        await comment.save();
        const userProfile = await Profile.findOne({ user });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        res.status(201).json(newReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateReply = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { text } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });
        if (reply.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this reply" });
        }
        reply.text = text;
        await comment.save();
        res.status(200).json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });
        if (reply.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this reply" });
        }
        reply.remove();
        await comment.save();
        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likeReply = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { user } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        if (!reply.likes.includes(user)) {
            reply.likes.push(user);
            await comment.save();
        }
        res.status(200).json({ message: "Reply liked", likes: reply.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unLikeReply = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { user } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });
        reply.likes = reply.likes.filter((like) => like.toString() !== user);
        await comment.save();
        res.status(200).json({ message: "Reply unliked", likes: reply.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reportReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { user } = req.body;
        const userProfile = await Profile.findOne({ user: user });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        const reply = await Comment.findById(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });
        if (!reply.reports.includes(user)) {
            reply.reports.push(user);
            await reply.save();
        }

        return res.status(200).json({ message: "Reply reported", reports: reply.reports });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

