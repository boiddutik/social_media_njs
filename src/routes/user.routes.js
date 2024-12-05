import { Router } from "express";
// import { upload } from "../middlewares/multer.middleware.js"
import { registerUser } from "../controllers/user.controllers.js"

const router = Router();

// router.route("/register-user").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "cover", maxCount: 1 }]), registerUser)
router.route("/register-user").post(registerUser)

export default router