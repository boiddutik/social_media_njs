import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { updateProfileAvatar, updateProfileCover, updateProfileDetails, followProfile, followRequestDecision, unfollowProfile, blockProfile, unblockProfile, searchUsers } from "../controllers/profile.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// secured routes
router.route("/logout").post(verifyJWT, upload, updateProfileAvatar)
router.route("/refresh-access-token").post(verifyJWT, upload, updateProfileCover)
router.route("/change-password").post(verifyJWT, updateProfileDetails)
router.route("/follow/:profileId").post(verifyJWT, followProfile)
router.route("/follow-request-dicision/:profileId").post(verifyJWT, followRequestDecision)
router.route("/unfollow/:profileId").post(verifyJWT, unfollowProfile);
router.route("/block/:profileId").post(verifyJWT, blockProfile);
router.route("/unblock/:profileId").post(verifyJWT, unblockProfile);
router.route("/search").get(verifyJWT, searchUsers);


export default router