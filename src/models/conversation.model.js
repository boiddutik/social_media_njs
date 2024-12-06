import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Connection", "Event", "Group"],
            required: true,
        },
        people: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                required: true,
                index: true,
            },
        ],
        title: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

conversationSchema.index({ type: 1, people: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
