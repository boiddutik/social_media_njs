import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            trim: true,
            enum: ["Post", "Event"],
            require: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        privacy: {
            type: String,
            trim: true,
            enum: ["Public", "Everyone"],
            require: true,
            index: true,
        },
        associates: [
            {
                role: {
                    type: String,
                    enum: ["Manager", "Fighter", "Coordinator"],
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Profile",
                },
            },
        ],
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
        latitude: {
            type: String,
            trim: true,
        },
        longitude: {
            type: String,
            trim: true,
        },
        venue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GYM",
            index: true,
        },
        address: {
            type: String,
            trim: true,
        },
        media: [
            {
                type: {
                    type: String,
                    enum: ["image", "video", "reel", "highlight"],
                },
                url: {
                    type: String,
                },
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
        conversations: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Conversation",
            default: [],
        },
        purchasedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                index: true,
            },
        ],
        interestedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                index: true,
            },
        ],
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
