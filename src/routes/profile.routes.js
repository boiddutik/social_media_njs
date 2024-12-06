import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { updateProfileAvatar, updateProfileCover, updateProfileDetails } from "../controllers/profile.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// secured routes
router.route("/logout").post(verifyJWT, upload, updateProfileAvatar)
router.route("/refresh-access-token").post(verifyJWT, upload, updateProfileCover)
router.route("/change-password").post(verifyJWT, updateProfileDetails)

export default router