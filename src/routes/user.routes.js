import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { createUser } from "../controllers/user.controllers.js"

const router = Router();

// router.route("/register-user").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "cover", maxCount: 1 }]), registerUser)
router.route("/create-user").post(upload, createUser)

export default router