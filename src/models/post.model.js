import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        privacy: {
            type: String,
            trim: true,
            enum: ["Public", "Followers"],
            required: true,
            index: true,
        },
        title: {
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
            },
        ],
        videos: [
            {
                type: String,
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        unLikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        shares: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        views: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        reports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Report",
            },
        ],
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
