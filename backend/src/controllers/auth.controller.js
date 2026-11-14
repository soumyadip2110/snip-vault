import { User } from "../models/user.model";
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

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

    const createdUser = await User.findById(newUser?._id).select('-password -refreshToken');

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, 'User registered successfully')
    );

});

const loginUser = async (req, res) => { };

export { registerUser, loginUser };