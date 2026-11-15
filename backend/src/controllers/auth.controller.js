import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const generateAccessAndRefreshTokens = async (user) => {
    // try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

    // Let unexpected errors reach the existing error middleware, which can log them properly.

    // } catch (error) {
    //     throw new ApiError(500, 'Something went wrong while generating access and refresh tokens')
    // }
}

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
        .select('-password -refreshToken');

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
        .select('-password -refreshToken');

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };

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

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                'Access token refreshed successfully'
            )
        );
});

export { registerUser, loginUser, refreshAccessToken };