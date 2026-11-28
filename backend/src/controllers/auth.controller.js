import { cookieOptions } from '../utils/cookieOptions.js';
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const generateAccessAndRefreshTokens = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.previousRefreshToken = undefined;
    user.previousRefreshTokenExpiresAt = undefined;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};


const registerUser = asyncHandler(async (req, res) => {
    const { firstName, email, password } = req.body;
    const requiredFields = [firstName, email, password];

    if (requiredFields.some(
        field => typeof field !== 'string' || !field.trim()
    )) {
        throw new ApiError(400, 'All fields are required!');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existedUser = await User.findOne({ email: normalizedEmail });
    if (existedUser) {
        throw new ApiError(409, 'User with this email already exists!');
    }

    const newUser = await User.create({
        firstName: firstName.trim(),
        email: normalizedEmail,
        password
    });

    const createdUser = await User.findById(newUser?._id)
        .select('-password -refreshToken -previousRefreshToken -previousRefreshTokenExpiresAt');

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, 'User registered successfully')
    );

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const requiredFields = [email, password];

    if (requiredFields.some(
        field => typeof field !== 'string' || !field.trim()
    )) {
        throw new ApiError(400, 'All fields are required!');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, 'Invalid user credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    const loggedInUser = await User.findById(user._id)
        .select('-password -refreshToken -previousRefreshToken -previousRefreshTokenExpiresAt');

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    user: loggedInUser
                },
                'User logged in successfully'
            )
        );

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Unauthorized request');
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decodedToken?._id);

    if (!user || !user.refreshToken) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const now = new Date();
    const graceExpiry = new Date(now.getTime() + 10 * 1000);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Rotate only when the incoming token is current
    // and the previous-token grace period has ended.
    const rotatedUser = await User.findOneAndUpdate(
        {
            _id: user._id,
            refreshToken: incomingRefreshToken,
            $or: [
                {
                    previousRefreshTokenExpiresAt: {
                        $lte: now
                    }
                },
                {
                    previousRefreshTokenExpiresAt: {
                        $exists: false
                    }
                },
                {
                    previousRefreshTokenExpiresAt: null
                }
            ]
        },
        {
            $set: {
                refreshToken: newRefreshToken,
                previousRefreshToken: incomingRefreshToken,
                previousRefreshTokenExpiresAt: graceExpiry
            }
        },
        {
            new: true
        }
    );

    let activeRefreshToken;

    if (rotatedUser) {
        // A normal rotation succeeded.
        activeRefreshToken = rotatedUser.refreshToken;
    } else {
        // Another request may have rotated this token already,
        // or the cooldown may still be active.
        const validSession = await User.findOne({
            _id: user._id,
            previousRefreshTokenExpiresAt: {
                $gt: now
            },
            $or: [
                {
                    refreshToken: incomingRefreshToken
                },
                {
                    previousRefreshToken: incomingRefreshToken
                }
            ]
        });

        if (!validSession || !validSession.refreshToken) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        // Reuse the current token without rotating again.
        activeRefreshToken = validSession.refreshToken;
    }

    const safeUser = await User.findById(user._id)
        .select(
            '-password -refreshToken -previousRefreshToken -previousRefreshTokenExpiresAt'
        );

    return res
        .status(200)
        .cookie('refreshToken', activeRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    user: safeUser
                },
                'Access token refreshed successfully'
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
                previousRefreshToken: 1,
                previousRefreshTokenExpiresAt: 1
            }
        }
    );

    return res
        .status(200)
        .clearCookie('refreshToken', cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                'User logged out successfully'
            )
        );
});

export { registerUser, loginUser, refreshAccessToken, logoutUser };