// import { asyncHandler } from "../utils/asyncHandler.js"
// import { ApiResponse } from "../utils/apiResponse.js"
// import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = (req, res) => {
    const reqHead = req.headers;
    const reqBody = req.body;
    const reqParams = req.params;
    console.log("+++++++++++++++")
    console.log(reqHead)
    console.log(reqBody)
    console.log(reqParams)
    console.log("+++++++++++++++")

}

// const registerUser = asyncHandler(async (req, res) => {
//     const { userName, fullName, email, password } = req.body;
//     if (
//         [userName, fullName, email, password].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }
//     const userAlreadyExists = await User.findOne({
//         $or: [{ userName }, { email }]
//     })
//     if (userAlreadyExists) {
//         throw new ApiError(409, "User already exists")
//     }
//     const avatar = req.files?.avatar[0]?.path;
//     let cover;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         cover = req.files.coverImage[0].path
//     }
//     if (!avatar) {
//         throw new ApiError(400, "Avatar file is required")
//     }
//     const createdUser = await User.create(
//         {
//             userName: userName,
//             fullName,
//             avatar: avatar,
//             cover: cover || "",
//             email,
//             password,
//         },
//     )
//     const user = await User.findById(createdUser._id).select("-password -refreshToken")
//     if (!user) {
//         throw new ApiError(500, "Something went wrong while registering user")
//     }
//     return res.status(201).json(new ApiResponse(201, user, "User registration complete."))
// })

export {
    registerUser
}