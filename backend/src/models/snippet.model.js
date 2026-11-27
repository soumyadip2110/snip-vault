import mongoose, { Schema } from 'mongoose';

const snippetSchema = Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            default: '',
            maxlength: 500,
        },
        notes: {
            type: String,
            trim: true,
            default: ''
        },
        code: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 50,
        },
        tags: {
            type: [String],
            default: []
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Snippet = mongoose.model('Snippet', snippetSchema);