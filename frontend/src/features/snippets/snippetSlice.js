import { createSlice } from '@reduxjs/toolkit';

import {
    fetchSnippets,
    fetchSnippetById,
    createSnippetThunk,
    updateSnippetThunk,
    deleteSnippetThunk
} from './snippetThunks.js';

const initialState = {
    snippets: [],
    selectedSnippet: null,
    status: 'idle',
    error: null,
    operationStatus: 'idle',
    operationError: null,
    selectedSnippetStatus: 'idle',
    selectedSnippetError: null,
};

const snippetSlice = createSlice({
    name: 'snippets',
    initialState,

    reducers: {
        clearSelectedSnippet: (state) => {
            state.selectedSnippet = null;
        },

        clearSnippetError: (state) => {
            state.error = null;
            state.operationError = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch all snippets
            .addCase(fetchSnippets.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSnippets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.snippets = action.payload.data;
            })
            .addCase(fetchSnippets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch a single snippet
            .addCase(fetchSnippetById.pending, (state) => {
                state.selectedSnippetStatus = 'loading';
                state.selectedSnippetError = null;
            })
            .addCase(fetchSnippetById.fulfilled, (state, action) => {
                state.selectedSnippetStatus = 'succeeded';
                state.selectedSnippet = action.payload.data;
            })
            .addCase(fetchSnippetById.rejected, (state, action) => {
                state.selectedSnippetStatus = 'failed';
                state.selectedSnippetError = action.payload;
            })

            // Create a snippet
            .addCase(createSnippetThunk.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(createSnippetThunk.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.snippets.unshift(action.payload.data);
            })
            .addCase(createSnippetThunk.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Update a snippet
            .addCase(updateSnippetThunk.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(updateSnippetThunk.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';

                const updatedSnippet = action.payload.data;

                const index = state.snippets.findIndex(
                    (snippet) => snippet._id === updatedSnippet._id
                );

                if (index !== -1) {
                    state.snippets[index] = updatedSnippet;
                }

                if (state.selectedSnippet?._id === updatedSnippet._id) {
                    state.selectedSnippet = updatedSnippet;
                }
            })
            .addCase(updateSnippetThunk.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Delete a snippet
            .addCase(deleteSnippetThunk.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(deleteSnippetThunk.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';

                state.snippets = state.snippets.filter(
                    (snippet) => snippet._id !== action.payload
                );

                if (state.selectedSnippet?._id === action.payload) {
                    state.selectedSnippet = null;
                }
            })
            .addCase(deleteSnippetThunk.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            });
    }
});

export const {
    clearSelectedSnippet,
    clearSnippetError
} = snippetSlice.actions;

export default snippetSlice.reducer;
