import { User } from "../models/user.model.js"

export const checkUserExists = async (req, res, next) => {
    try {
        const { userName, email } = req.body;

        // Check if userName already exists
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({
                message: `UserName ${userName} is already taken.`,
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: `Email ${email} is already in use.`,
            });
        }

        // Proceed to the next middleware/route handler if no conflict
        next();
    } catch (error) {
        console.error("Error in checkUserExists middleware:", error);
        return res.status(500).json({
            message: "Server error. Could not check user existence.",
        });
    }
};


