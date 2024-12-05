import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
        index: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
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
    isSeen: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

export const Chat = mongoose.model("Chat", chatSchema)