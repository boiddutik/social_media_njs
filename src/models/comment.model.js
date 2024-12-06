import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
            index: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            index: true,
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gym",
            index: true,
        },
        text: {
            type: String,
            trim: true,
            required: true,
            maxlength: 500,
        },
        media: [
            {
                type: {
                    type: String,
                    enum: ["Image", "Video", "Audio", "File"],
                },
                url: {
                    type: String,
                },
            },
        ],
        replies: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Profile",
                    required: true,
                    index: true,
                },
                text: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 500,
                },
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
                reports: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Report",
                    },
                ],
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                default: [],
            },
        ],
        unLikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                default: [],
            },
        ],
        reports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Report",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

commentSchema.index({ post: 1, user: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
