import { Snippet } from '../models/snippet.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper functions
const normalizeTags = (tags) => {
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
        throw new ApiError(400, 'Tags must be an array of strings');
    }

    // The spread operator (...) takes the elements from the Set, and puts them into a new array as it's wraped in square brackets [].
    const normalizedTags = [
        ...new Set(tags.map(tag => tag.trim().toLowerCase()).filter(Boolean))
    ];

    if (normalizedTags.length > 10) {
        throw new ApiError(400, 'Maximum 10 tags allowed');
    }

    if (normalizedTags.some(tag => tag.length > 20)) {
        throw new ApiError(400, 'Each tag must be at most 20 characters');
    }

    return normalizedTags;
};

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Controllers
const createSnippet = asyncHandler(async (req, res) => {
    const {
        title,
        description = '',
        notes = '',
        code,
        language,
        tags = [],
        isPublic = false
    } = req.body;

    if (![title, code, language].every(
        value => typeof value === 'string' && value.trim()
    )) {
        throw new ApiError(400, 'Title, code, and language are not provided or invalid!');
    }

    if (
        typeof description !== 'string' ||
        typeof notes !== 'string' ||
        typeof isPublic !== 'boolean'
    ) {
        throw new ApiError(400, 'Invalid description, notes, or visibility value');
    }

    const snippet = await Snippet.create({
        title: title.trim(),
        description: description.trim(),
        notes: notes.trim(),
        code,
        language: language.trim(),
        tags: normalizeTags(tags),
        isPublic,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, snippet, 'Snippet created successfully')
    );
});

const getUserSnippets = asyncHandler(async (req, res) => {
    const { search, language, tag } = req.query;

    if ([search, language, tag].some(
        value => value !== undefined && typeof value !== 'string'
    )) {
        throw new ApiError(400, `Invalid query parameter`);
    }

    const filter = {
        owner: req.user._id
    };

    // Search by title or description (options: 'i' = case insensitive)
    if (search?.trim()) {
        const searchRegex = escapeRegex(search.trim());

        filter.$or = [
            { title: { $regex: searchRegex, $options: 'i' } },
            { description: { $regex: searchRegex, $options: 'i' } }
        ];
    }

    // Filter by programming language
    if (language?.trim()) {
        filter.language = language.trim().toLowerCase();
    }

    // Filter by tag
    if (tag?.trim()) {
        filter.tags = tag.trim().toLowerCase();
    }

    const snippets = await Snippet.find(filter)
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, snippets, 'Snippets fetched successfully')
    );
});

const getSnippetById = asyncHandler(async (req, res) => {
    const snippet = await Snippet.findOne({
        _id: req.params.snippetId,
        owner: req.user._id
    });

    if (!snippet) {
        throw new ApiError(404, 'Snippet not found');
    }

    return res.status(200).json(
        new ApiResponse(200, snippet, 'Snippet fetched successfully')
    );
});

const updateSnippet = asyncHandler(async (req, res) => {
    const { title, description, notes, code, language, tags, isPublic } = req.body;
    const updates = {};

    const stringFields = { title, description, notes, code, language };

    // Validate string fields
    for (const [key, value] of Object.entries(stringFields)) {
        if (value !== undefined) {
            if (typeof value !== 'string') {
                throw new ApiError(400, `Invalid ${key}`);
            }

            if (['title', 'code', 'language'].includes(key) && !value.trim()) {
                throw new ApiError(400, `${key} cannot be empty`);
            }

            updates[key] = ['title', 'language', 'description', 'notes'].includes(key)
                ? value.trim()
                : value;
        }
    }

    // Validate tags
    if (tags !== undefined) {
        updates.tags = normalizeTags(tags);
    }

    // Validate visibility
    if (isPublic !== undefined) {
        if (typeof isPublic !== 'boolean') {
            throw new ApiError(400, 'Visibility must be a boolean');
        }

        updates.isPublic = isPublic;
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, 'No valid fields provided for update');
    }

    const snippet = await Snippet.findOneAndUpdate(
        {
            _id: req.params.snippetId,
            owner: req.user._id
        },
        { $set: updates },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if (!snippet) {
        throw new ApiError(404, 'Snippet not found');
    }

    return res.status(200).json(
        new ApiResponse(200, snippet, 'Snippet updated successfully')
    );
});

const deleteSnippet = asyncHandler(async (req, res) => {
    const snippet = await Snippet.findOneAndDelete({
        _id: req.params.snippetId,
        owner: req.user._id
    });

    if (!snippet) {
        throw new ApiError(404, 'Snippet not found');
    }

    return res.status(200).json(
        new ApiResponse(200, {}, 'Snippet deleted successfully')
    );
});

export {
    createSnippet,
    getUserSnippets,
    getSnippetById,
    updateSnippet,
    deleteSnippet
};