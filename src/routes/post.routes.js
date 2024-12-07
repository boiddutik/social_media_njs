// import { Router } from "express";
// import { upload } from "../middlewares/multer.middleware.js";
// import {
//     createPost,
//     getAllPosts,
//     getPostById,
//     updatePost,
//     deletePost,
//     likePost,
//     unlikePost,
//     // addComment,
//     // removeComment,
//     reportPost,
//     expressInterest,
//     purchasePost,
//     addAssociate,
//     removeAssociate
// } from "../controllers/post.controllers.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const router = Router();


// router.route("/create-post").post(verifyJWT, upload, createPost);
// router.route("/get-posts").get(verifyJWT, getAllPosts);
// router.route("/posts/:postId").get(verifyJWT, getPostById);
// router.route("/posts/:postId").put(verifyJWT, upload, updatePost);
// router.route("/posts/:postId").delete(verifyJWT, upload, deletePost);
// router.route("/posts/:postId/like").post(verifyJWT, likePost);
// router.route("/posts/:postId/unlike").post(verifyJWT, unlikePost);
// router.route("/posts/:postId/report").post(verifyJWT, reportPost);
// router.route("/posts/:postId/interest").post(verifyJWT, expressInterest);
// router.route("/posts/:postId/purchase").post(verifyJWT, purchasePost);
// router.route("/posts/:postId/associates").post(verifyJWT, addAssociate);
// router.route("/posts/:postId/associates").delete(verifyJWT, removeAssociate);

// // router.route("/posts/:postId/comment")
// //     .post(verifyJWT, addComment);

// // router.route("/posts/:postId/comment/:commentId")
// //     .delete(verifyJWT, removeComment);

// export default router;


import express from "express";
import {
    createPost,
    toggleLike,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
} from "../controllers/post.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Route for creating a post
router.post('/create-post', verifyJWT, upload, createPost);

// Route to like/unlike a post (toggle like)
router.post('/:postId/like', verifyJWT, toggleLike);

// Route to get all posts for a user
router.get('/user/:userId', verifyJWT, getAllPosts);

// Route to get a specific post by ID
router.get('/:postId', verifyJWT, getPostById);

// Route to update a post
router.put('/:postId', verifyJWT, upload, updatePost);

// Route to delete a post
router.delete('/:postId', verifyJWT, deletePost);

export default router;
