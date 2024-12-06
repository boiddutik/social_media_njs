import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createGym,
    getAllGyms,
    getGymById,
    updateGym,
    deleteGym,
    likeGym,
    unlikeGym,
    addComment,
    removeComment
} from "../controllers/gym.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/gyms")
    .get(verifyJWT, getAllGyms)
    .post(verifyJWT, upload, createGym);

router.route("/gyms/:gymId")
    .get(verifyJWT, getGymById)
    .put(verifyJWT, upload, updateGym)
    .delete(verifyJWT, deleteGym);

router.route("/gyms/:gymId/like")
    .post(verifyJWT, likeGym);

router.route("/gyms/:gymId/unlike")
    .post(verifyJWT, unlikeGym);

router.route("/gyms/:gymId/comment")
    .post(verifyJWT, addComment);

router.route("/gyms/:gymId/comment/:commentId")
    .delete(verifyJWT, removeComment);

router.route("/gyms/:gymId/join")
    .post(verifyJWT, joinGym);

router.route("/gyms/:gymId/unjoin")
    .post(verifyJWT, unjoinGym);

export default router;
