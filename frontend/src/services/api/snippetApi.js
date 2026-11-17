import api from './axios.js';

// Fetch all snippets with optional search and filters.
export const getUserSnippets = async (params = {}) => {
    const response = await api.get('/snippets', { params });
    return response.data;
};

// Fetch a single snippet.
export const getSnippetById = async (snippetId) => {
    const response = await api.get(`/snippets/${snippetId}`);
    return response.data;
};

// Create a new snippet.
export const createSnippet = async (snippetData) => {
    const response = await api.post('/snippets', snippetData);
    return response.data;
};

// Update an existing snippet.
export const updateSnippet = async (snippetId, snippetData) => {
    const response = await api.patch(
        `/snippets/${snippetId}`,
        snippetData
    );
    return response.data;
};

// Delete a snippet.
export const deleteSnippet = async (snippetId) => {
    const response = await api.delete(`/snippets/${snippetId}`);
    return response.data;
};
