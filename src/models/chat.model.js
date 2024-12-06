import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
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
            trim: true,
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
        isSeen: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ["Regular", "media"],
            default: "text",
        },
    },
    { timestamps: true }
);

// Compound index for optimized queries
chatSchema.index({ conversation: 1, sender: 1 });

export const Chat = mongoose.model("Chat", chatSchema);
