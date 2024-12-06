import mongoose from "mongoose";

const gymSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        associates: [
            {
                role: {
                    type: String,
                    enum: ["Manager", "Fighter", "Coordinator", "Member"],
                    default: "Member"
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Profile",
                },
            },
        ],
        Name: {
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
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GYM",
            index: true,
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

// Compound index for optimized queries
gymSchema.index({ conversation: 1, sender: 1 });

export const GYM = mongoose.model("GYM", gymSchema);
