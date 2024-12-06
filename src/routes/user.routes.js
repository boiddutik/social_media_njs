import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { createUser, loginUser, logOut } from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// router.route("/register-user").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "cover", maxCount: 1 }]), registerUser)
router.route("/create-user").post(upload, createUser)
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logOut)

export default router