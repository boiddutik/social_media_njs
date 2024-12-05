import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Derive the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the root directory where public/temp will be created
const rootDir = path.resolve(__dirname, "../../"); // Resolves to the project root folder

// Define the upload directory relative to the root folder
const uploadDir = path.join(rootDir, "public", "temp");

// Ensure the directory exists, if not, create it
try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Directory ${uploadDir} created or already exists.`);
} catch (error) {
    console.error("Error creating directory:", error);
}

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the upload directory for the files
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename based on timestamp
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Set up multer upload configuration
export const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // Limit file size to 500MB
}).fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
    { name: "image", maxCount: 10 },
    { name: "video", maxCount: 10 },
]);
