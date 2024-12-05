import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema({
    people: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
        index: true,
    }]
}, { timestamps: true })

export const Conversation = mongoose.model("Conversation", conversationSchema)