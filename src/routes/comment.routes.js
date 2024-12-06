import express from "express";
import {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment,
    likeComment,
    unLikeComment,
    reportComment,
    createReply,
    updateReply,
    deleteReply,
    likeReply,
    unLikeReply,
    reportReply,
} from "../controllers/comment.controllers.js";

const router = express.Router();


router.post("/", createComment);
router.get("/:postId", getComments);
router.get("/:commentId", getCommentById);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);


router.put("/:commentId/like", likeComment);
router.put("/:commentId/unlike", unLikeComment);


router.put("/:commentId/report", reportComment);


router.post("/:commentId/reply", createReply);
router.put("/:commentId/reply/:replyId", updateReply);
router.delete("/:commentId/reply/:replyId", deleteReply);


router.put("/:commentId/reply/:replyId/like", likeReply);
router.put("/:commentId/reply/:replyId/unlike", unLikeReply);


router.put("/:commentId/reply/:replyId/report", reportReply);

export default router;
