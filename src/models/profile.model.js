import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    // Basic User Information
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: [true, "UserName is required."],
        index: true
    },
    fullName: {
        type: String,
        required: [true, "FullName is required."],
        trim: true
    },
    gender: {
        type: String,
        required: [true, "Gender is required."],
        enum: ["Male", "Female"]
    },
    dob: {
        type: Date,
        required: [true, "Dob is required."]
    },
    country: {
        type: String,
        required: [true, "Country is required."]
    },
    state: {
        type: String,
        required: [true, "State is required."]
    },
    city: {
        type: String,
        required: [true, "City is required."]
    },
    profession: {
        type: String,
        required: [true, "Profession is required."],
        trim: true
    },
    bio: {
        type: String,
        default: "",
        trim: true
    },
    avatar: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: ""
    },

    // Physical Attributes
    height: {
        type: Number
    },
    weight: {
        type: Number
    },

    // Additional Data
    intensity: {
        type: String,
        trim: true
    },
    goal: {
        type: String,
        trim: true
    },
    practicing: {
        type: String,
        trim: true
    },

    // Posts and Engagement
    conversations: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Conversation",
        default: []
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },
    pinnedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        validate: {
            validator: (arr) => arr.length <= 5,
            message: "Pin up to 5 posts only."
        },
        default: []
    },
    likedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },
    unLikedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },
    commentedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: []
    },
    sharedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },
    associatedEvents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },
    purchasedEvents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },

    // Relationship with Gym
    associatedGyms: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Gym",
        default: []
    },

    // Relationships
    sentFollowRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    recievedFollowRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    followerings: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    blockList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    // Activity Tracking
    isOnline: {
        type: Boolean,
        default: true
    },
    lastOnlineAt: {
        type: Date
    },
    lastOnlineAtVisible: {
        type: Boolean,
        default: true
    },
    activityCount: {
        type: Number,
        default: 0
    },

    // Privacy and Matchability
    isPrivateProfile: {
        // People must send follow-request 
        // to see this profile's contents
        type: Boolean,
        default: false
    },
    isProfileMatchable: {
        // This must be true (unaffected by isPrivateProfile)
        // if want to match with fighters
        type: Boolean,
        default: true
    },

    // Content Preferences
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (value) {
                return value.length <= 10;
            },
            message: "You can select up to 10 tags only."
        }
    },
    interests: {
        type: [String],
        default: [],
        trim: true
    },

    // Related Entities
    wallets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Wallet",
        default: []
    },
    sponsors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Sponsor",
        default: []
    },
    fights: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Fight",
        default: []
    },
    achievements: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Achievement",
        default: []
    }
}, { timestamps: true });

// Indexes
profileSchema.index({ userName: 1, isProfileMatchable: 1 });
profileSchema.index({ followers: 1 });

export const Profile = mongoose.model("Profile", profileSchema);
