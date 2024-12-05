import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true
    },
    text: {
        type: String,
        trim: true,
        required: true,
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
    replies: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true
            },
            text: {
                type: String,
                required: true,
                trim: true,
            },
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
            reports: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Report",
                }
            ],
            createdAt: {
                type: Date,
                default: Date.now()
            }
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
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        }
    ],
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)