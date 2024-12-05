import mongoose from "mongoose"

const reelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    caption: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    images: [
        {
            type: String,
        }
    ],
    videos: [
        {
            type: String,
        }
    ],
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    unLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    shares: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        }
    ],
}, { timestamps: true })

export const Reel = mongoose.model("Reel", reelSchema)