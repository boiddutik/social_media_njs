import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    removeComment,
    reportPost,
    expressInterest,
    purchasePost,
    addAssociate,
    removeAssociate
} from "../controllers/post.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/posts")
    .get(verifyJWT, getAllPosts)
    .post(verifyJWT, upload, createPost);

router.route("/posts/:postId")
    .get(verifyJWT, getPostById)
    .put(verifyJWT, upload, updatePost)
    .delete(verifyJWT, upload, deletePost);


router.route("/posts/:postId/like")
    .post(verifyJWT, likePost);

router.route("/posts/:postId/unlike")
    .post(verifyJWT, unlikePost);


router.route("/posts/:postId/comment")
    .post(verifyJWT, addComment);

router.route("/posts/:postId/comment/:commentId")
    .delete(verifyJWT, removeComment);


router.route("/posts/:postId/report")
    .post(verifyJWT, reportPost);


router.route("/posts/:postId/interest")
    .post(verifyJWT, expressInterest);

router.route("/posts/:postId/purchase")
    .post(verifyJWT, purchasePost);


router.route("/posts/:postId/associates")
    .post(verifyJWT, addAssociate)
    .delete(verifyJWT, removeAssociate);

export default router;
