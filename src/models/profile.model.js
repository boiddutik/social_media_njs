import mongoose from "mongoose"

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    userName: {
        // here it is not unique anymore,
        // before userName in User & Profile is in sync
        // userName can only be updated via User
        type: String,
        required: [true, "UserName is required."],
        index: true
    },
    fullName: {
        type: String,
        required: [true, "FullName is required."],
        trim: true
    },
    profession: {
        type: String,
        required: [true, "Profession is required."],
    },
    bio: {
        type: String,
        default: "",
    },
    dob: {
        type: Date,
        required: [true, "Dob is required."],
    },
    avatar: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: ""
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followerings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    blockList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isOnline: {
        type: Boolean,
        default: true,
    },
    lastOnlineAt: {
        type: Date,
    },
    lastOnlineAtVisible: {
        type: Boolean,
        default: true,
    },
    isProfileVisible: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

export const Profile = mongoose.model("Profile", profileSchema)