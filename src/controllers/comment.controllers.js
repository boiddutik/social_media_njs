import { Comment } from "../models/commentModel.js";


export const createComment = async (req, res) => {
    try {
        const { user, post, text, media } = req.body;

        const newComment = new Comment({
            user,
            post,
            text,
            media,
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate("user", "name");
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId).populate("user", "name");
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
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { text, media },
            { new: true }
        );
        if (!updatedComment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user } = req.body;
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
        const { commentId, replyId } = req.params;
        const { user } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        if (!reply.reports.includes(user)) {
            reply.reports.push(user);
            await comment.save();
        }

        res.status(200).json({ message: "Reply reported", reports: reply.reports });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
