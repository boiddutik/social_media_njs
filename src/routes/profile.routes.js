import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { updateProfileAvatar, updateProfileCover, updateProfileDetails, followProfile, followRequestDecision } from "../controllers/profile.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// secured routes
router.route("/logout").post(verifyJWT, upload, updateProfileAvatar)
router.route("/refresh-access-token").post(verifyJWT, upload, updateProfileCover)
router.route("/change-password").post(verifyJWT, updateProfileDetails)
router.route("/follow/:profileId").post(verifyJWT, followProfile)
router.route("/follow-request-dicision/:profileId").post(verifyJWT, followRequestDecision)

export default router