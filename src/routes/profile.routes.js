import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { getCurrentUserProfile, updateProfileAvatar, updateProfileCover, updateProfileDetails, getProfileByProfileIdDetails, getFollowers, getFollowing, followProfile, followRequestDecision, unfollowProfile, blockProfile, unblockProfile, searchUsers } from "../controllers/profile.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// secured routes
router.route("/me").get(verifyJWT, getCurrentUserProfile);
router.route("/update-profile-avatar").post(verifyJWT, upload, updateProfileAvatar)
router.route("/update-profile-cover").post(verifyJWT, upload, updateProfileCover)
router.route("/change-profile-detail").post(verifyJWT, updateProfileDetails)
router.route("/:profileId").get(verifyJWT, getProfileByProfileIdDetails);
router.route("/:profileId/followers").get(verifyJWT, getFollowers);
router.route("/:profileId/following").get(verifyJWT, getFollowing);
router.route("/follow/:profileId").post(verifyJWT, followProfile)
router.route("/follow-request-dicision/:profileId").post(verifyJWT, followRequestDecision)
router.route("/unfollow/:profileId").post(verifyJWT, unfollowProfile);
router.route("/block/:profileId").post(verifyJWT, blockProfile);
router.route("/unblock/:profileId").post(verifyJWT, unblockProfile);
router.route("/search").get(verifyJWT, searchUsers);


export default router