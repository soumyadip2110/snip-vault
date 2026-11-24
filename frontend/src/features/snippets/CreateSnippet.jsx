import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSnippetThunk } from './snippetThunks.js';
import CodeEditor from './components/CodeEditor.jsx';

function CreateSnippet() {
    const dispatch = useDispatch();

    const { operationStatus, operationError } = useSelector(
        (state) => state.snippets
    );

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        code: '',
        language: '',
        tags: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const snippetData = {
            ...formData,
            tags: formData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
        };

        try {
            await dispatch(createSnippetThunk(snippetData)).unwrap();

            setFormData({
                title: '',
                description: '',
                code: '',
                language: '',
                tags: ''
            });
        } catch {
            // The error is already stored in Redux.
        }
    };

    const isSubmitting = operationStatus === 'loading';

    return (
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-semibold">
                Create a Snippet
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="mb-1 block text-sm font-medium">
                        Title
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="mb-1 block text-sm font-medium">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        maxLength={500}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
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
                    <label htmlFor="language" className="mb-1 block text-sm font-medium">
                        Programming Language
                    </label>

                    <input
                        id="language"
                        name="language"
                        type="text"
                        value={formData.language}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        placeholder="e.g. javascript"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="mb-1 block text-sm font-medium">
                        Tags
                    </label>

                    <input
                        id="tags"
                        name="tags"
                        type="text"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. react, hooks, frontend"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-xs text-slate-500">
                        Separate tags with commas.
                    </p>
                </div>

                {operationError && (
                    <p role="alert" className="text-sm text-red-600">
                        {operationError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Snippet'}
                </button>
            </form>
        </section>
    );
}

export default CreateSnippet;
