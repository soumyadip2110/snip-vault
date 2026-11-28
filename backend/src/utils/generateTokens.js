import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            // email: user.email,
            // firstName: user.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            jwtid: randomUUID()
        }
    );
};