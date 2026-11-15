import { Snippet } from '../models/snippet.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const normalizeTags = (tags) => {
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
        throw new ApiError(400, 'Tags must be an array of strings');
    }

    // The spread operator (...) takes the elements from the Set, and puts them into a new array as it's wraped in square brackets [].
    return [...new Set(
        tags.map(tag => tag.trim().toLowerCase()).filter(Boolean)
    )];
};

const createSnippet = asyncHandler(async (req, res) => {
    const { title, description = '', code, language, tags = [], isPublic = false } = req.body;

    if (![title, code, language].every(
        value => typeof value === 'string' && value.trim()
    )) {
        throw new ApiError(400, 'Title, code, and language are required');
    }

    if (typeof description !== 'string' || typeof isPublic !== 'boolean') {
        throw new ApiError(400, 'Invalid description or visibility value');
    }

    const snippet = await Snippet.create({
        title,
        description,
        code,
        language,
        tags: normalizeTags(tags),
        isPublic,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, snippet, 'Snippet created successfully')
    );
});

const getUserSnippets = asyncHandler(async (req, res) => {});

const getSnippetById = asyncHandler(async (req, res) => {});

const updateSnippet = asyncHandler(async (req, res) => {});

// Delete a snippet
const deleteSnippet = asyncHandler(async (req, res) => {});

export {
    createSnippet,
    getUserSnippets,
    getSnippetById,
    updateSnippet,
    deleteSnippet
};