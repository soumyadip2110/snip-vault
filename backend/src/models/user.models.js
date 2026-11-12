import mongoose, { Schema } from 'mongoose'

const userSchema = Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required!']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model('User', userSchema)