import mongoose from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Profile } from "./profile.model.js"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "UserName is required."],
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        index: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    // if (this.isModified("userName")) {
    //     const profile = await Profile.findOne({ user: this._id });
    //     if (profile) {
    //         profile.userName = this.userName;
    //         await profile.save();
    //     }
    // }
    next();
});

// userSchema.post("save", async function (doc, next) {
//     console.log(`---DOC log--- ${doc}`)
//     try {
//         console.log(`Creating profile for newly created user: ${doc._id}`);
//         const profile = new Profile({
//             user: doc._id,
//             userName: doc.userName,
//             fullName: doc.fullName || "",
//             dob: doc.dob || new Date(),
//             profession: doc.profession || "",
//             avatar: doc.avatar || "",
//             cover: doc.cover || "",
//         });
//         await profile.save();
//         console.log(`Profile created with ID: ${profile._id}`);
//         doc.profile = profile._id;
//         await doc.save({ validateBeforeSave: false });
//         console.log(`User profile assigned successfully.`);
//         next();
//     } catch (error) {
//         console.error("Error in post-save hook:", error);
//         next(error);
//     }
// });
// userSchema.post("save", async function (doc, next) {
//     try {
//         let profile = await Profile.findOne({ user: doc._id });
//         if (!profile) {
//             profile = new Profile({
//                 user: doc._id,
//                 userName: doc.userName,
//                 fullName: doc.fullName,
//                 avatar: "",
//                 profession: "",
//             });
//             await profile.save();
//         }
//         doc.profile = profile._id;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)