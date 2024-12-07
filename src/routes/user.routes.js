import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { createUser, loginUser, logOut, refreshAccessToken, changePassword, changeUsername, changeEmail, getCurrentUser } from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { checkUserExists } from "../middlewares/check.user.exist.js"

const router = Router();

// router.route("/register-user").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "cover", maxCount: 1 }]), registerUser)
router.route("/create-user").post(checkUserExists, upload, createUser)
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logOut)
router.route("/refresh-access-token").post(verifyJWT, refreshAccessToken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/change-usernamen").post(verifyJWT, changeUsername)
router.route("/change-email").post(verifyJWT, changeEmail)
router.route("/get-current-user").post(verifyJWT, getCurrentUser)


export default router