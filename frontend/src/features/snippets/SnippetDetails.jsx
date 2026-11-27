import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteSnippetThunk, fetchSnippetById, updateSnippetThunk } from './snippetThunks.js';
import { clearSelectedSnippet } from './snippetSlice.js';
import CodeEditor from './components/CodeEditor.jsx';

function SnippetDetails() {
    const { snippetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        selectedSnippet,
        selectedSnippetStatus,
        selectedSnippetError,
        operationStatus,
        operationError,
    } = useSelector((state) => state.snippets);

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        notes: '',
        code: '',
        language: '',
        tags: '',
    });

    const handleEditClick = () => {
        setFormData({
            title: selectedSnippet.title,
            description: selectedSnippet.description || '',
            notes: selectedSnippet.notes || '',
            code: selectedSnippet.code,
            language: selectedSnippet.language,
            tags: selectedSnippet.tags?.join(', ') || '',
        });

        setIsEditing(true);
    };

    const handleSave = async () => {
        const snippetData = {
            ...formData,
            tags: formData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
        };

        try {
            await dispatch(
                updateSnippetThunk({
                    snippetId,
                    snippetData,
                })
            ).unwrap();

            setIsEditing(false);
        } catch (error) {
            // Redux will store the update error.
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this snippet?'
        );

        if (!confirmed) return;

        try {
            await dispatch(deleteSnippetThunk(snippetId)).unwrap();
            navigate('/');
        } catch (error) {
            // The Redux slice will store the error.
        }
    };

    useEffect(() => {
        dispatch(clearSelectedSnippet());
        dispatch(fetchSnippetById(snippetId));
    }, [dispatch, snippetId]);

    return (
        <div className="mx-auto max-w-4xl p-6">
            <Link
                to="/"
                className="mb-6 inline-block text-sm text-blue-600 hover:underline"
            >
                &larr; Back to My Snippets
            </Link>

            {selectedSnippetStatus === 'loading' && (
                <p className="py-8 text-center text-slate-500">
                    Loading snippet...
                </p>
            )}

            {selectedSnippetStatus === 'failed' && (
                <p className="rounded-md bg-red-50 p-4 text-red-700">
                    Error loading snippet: {selectedSnippetError}
                </p>
            )}

            {selectedSnippetStatus === 'succeeded' && selectedSnippet && (
                <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    {isEditing ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">Edit Snippet</h1>

                            {operationError && (
                                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                                    {operationError}
                                </p>
                            )}

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Notes (Markdown supported)
                                </label>

                                <textarea
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    rows={6}
                                    placeholder="Write explanations, examples, or additional notes..."
                                    className="w-full rounded-md border p-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Code
                                </label>

                                <CodeEditor
                                    value={formData.code}
                                    onChange={(code) =>
                                        setFormData((previousData) => ({
                                            ...previousData,
                                            code,
                                        }))
                                    }
                                    language={formData.language}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    value={formData.language}
                                    onChange={(e) =>
                                        setFormData({ ...formData, language: e.target.value })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tags: e.target.value })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                disabled={operationStatus === 'loading'}
                                className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={operationStatus === 'loading'}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {operationStatus === 'loading' ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="mb-3 text-2xl font-bold">
                                {selectedSnippet.title}
                            </h1>

                            <div className="mb-4 flex gap-2">
                                <button
                                    onClick={handleEditClick}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Edit Snippet
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                >
                                    Delete Snippet
                                </button>
                            </div>

                            <p className="mb-4 text-slate-600">
                                {selectedSnippet.description || 'No description provided.'}
                            </p>

                            <div className="mb-5">
                                <h2 className="mb-2 text-lg font-semibold">
                                    Notes
                                </h2>

                                {selectedSnippet.notes?.trim() ? (
                                    <div className="whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                        {selectedSnippet.notes}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No notes added.
                                    </p>
                                )}
                            </div>

                            <p className="mb-4 text-sm text-slate-500">
                                <strong>Language:</strong> {selectedSnippet.language}
                            </p>

                            {selectedSnippet.tags?.length > 0 && (
                                <div className="mb-5 flex flex-wrap gap-2">
                                    {selectedSnippet.tags.map((tag, index) => (
                                        <span
                                            key={`${tag}-${index}`}
                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mb-5">
                                <CodeEditor
                                    value={selectedSnippet.code}
                                    language={selectedSnippet.language}
                                    readOnly={true}
                                />
                            </div>
                        </>
                    )}
                </article>
            )}
        </div>
    );
}

export default SnippetDetails;