import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    getUserSnippets as getUserSnippetsApi,
    getSnippetById as getSnippetByIdApi,
    createSnippet as createSnippetApi,
    updateSnippet as updateSnippetApi,
    deleteSnippet as deleteSnippetApi
} from '../../services/api/snippetApi.js';

// Extract a useful error message from failed API requests.
const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || 'Something went wrong';
};

// Fetch all snippets with optional search and filters.
export const fetchSnippets = createAsyncThunk(
    'snippets/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            return await getUserSnippetsApi(params);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// Fetch a single snippet by ID.
export const fetchSnippetById = createAsyncThunk(
    'snippets/fetchById',
    async (snippetId, { rejectWithValue }) => {
        try {
            return await getSnippetByIdApi(snippetId);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// Create a new snippet.
export const createSnippetThunk = createAsyncThunk(
    'snippets/create',
    async (snippetData, { rejectWithValue }) => {
        try {
            return await createSnippetApi(snippetData);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// Update an existing snippet.
export const updateSnippetThunk = createAsyncThunk(
    'snippets/update',
    async ({ snippetId, snippetData }, { rejectWithValue }) => {
        try {
            return await updateSnippetApi(snippetId, snippetData);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// Delete a snippet.
export const deleteSnippetThunk = createAsyncThunk(
    'snippets/delete',
    async (snippetId, { rejectWithValue }) => {
        try {
            await deleteSnippetApi(snippetId);
            return snippetId;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);
