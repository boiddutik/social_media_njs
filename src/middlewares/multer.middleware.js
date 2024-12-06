import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");
const uploadDir = path.join(rootDir, "public", "temp");

try {
    fs.mkdirSync(uploadDir, { recursive: true });
    // console.log(`Directory ${uploadDir} created or already exists.`);
} catch (error) {
    console.error("Error creating directory:", error);
}

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 },
}).fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
    { name: "image", maxCount: 10 },
    { name: "video", maxCount: 10 },
]);
