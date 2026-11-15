
import { Router } from 'express';
import { createSnippet, getUserSnippets, getSnippetById, updateSnippet, deleteSnippet } from '../controllers/snippet.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Base route: /api/snippets
// Protected routes
router.post('/', verifyJWT, createSnippet);
router.get('/', verifyJWT, getUserSnippets);
router.get('/:snippetId', verifyJWT, getSnippetById);
router.patch('/:snippetId', verifyJWT, updateSnippet);
router.delete('/:snippetId', verifyJWT, deleteSnippet);

export default router;
