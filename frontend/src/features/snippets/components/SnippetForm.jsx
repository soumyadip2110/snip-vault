import { useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor.jsx';
import MarkdownField from './MarkdownField.jsx';
import { validateSnippet } from '../../../utils/snippetValidation.js';

function SnippetForm({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isSubmitting,
    operationError,
    mode = 'create',
}) {
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const formRef = useRef(null);
    const isEditMode = mode === 'edit';

    useEffect(() => {
        if (
            !formData.title &&
            !formData.description &&
            !formData.notes &&
            !formData.code &&
            !formData.language &&
            !formData.tags
        ) {
            setValidationErrors({});
            setHasSubmitted(false);
        }
    }, [formData]);

    const handleChange = (name, value) => {
        const updatedData = {
            ...formData,
            [name]: value,
        };

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        if (hasSubmitted) {
            const errors = validateSnippet(updatedData);

            setValidationErrors((previousErrors) => ({
                ...previousErrors,
                [name]: errors[name],
            }));
        }
    };

    const handleFormKeyDown = (event) => {
        if (event.key !== 'Enter') return;

        if (event.ctrlKey || event.metaKey) {
            // CodeMirror handles this shortcut internally.
            if (event.target.closest('.cm-editor')) return;

            event.preventDefault();
            event.currentTarget.requestSubmit();
            return;
        }

        // Prevent accidental submission from single-line inputs.
        if (event.target.tagName === 'INPUT') {
            event.preventDefault();
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        setHasSubmitted(true);

        const errors = validateSnippet(formData);
        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) return;

        // Clear old validation errors after successful validation.
        setValidationErrors({});

        const snippetData = {
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
            notes: formData.notes.trim(),
            language: formData.language.trim(),
            tags: [
                ...new Set(
                    formData.tags
                        .split(',')
                        .map((tag) => tag.trim().toLowerCase())
                        .filter(Boolean)
                ),
            ],
        };

        onSubmit(snippetData);
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            onKeyDown={handleFormKeyDown}
            className="space-y-4"
        >
            <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Snippet' : 'Create a Snippet'}
            </h2>

            {operationError && (
                <p
                    role="alert"
                    className="rounded-md bg-red-50 p-3 text-sm text-red-700"
                >
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
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    maxLength={100}
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                />

                {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {validationErrors.title}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Description
                </label>

                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={2}
                    maxLength={500}
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Notes (Markdown supported)
                </label>

                <MarkdownField
                    value={formData.notes}
                    onChange={(notes) => handleChange('notes', notes)}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Code
                </label>

                <CodeEditor
                    value={formData.code}
                    onChange={(code) => handleChange('code', code)}
                    language={formData.language}
                    onSubmitShortcut={() => formRef.current?.requestSubmit()}
                />

                {validationErrors.code && (
                    <p className="mt-1 text-sm text-red-600">
                        {validationErrors.code}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Programming Language
                </label>

                <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    required
                    maxLength={50}
                    placeholder="e.g. javascript"
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                />

                {validationErrors.language && (
                    <p className="mt-1 text-sm text-red-600">
                        {validationErrors.language}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Tags
                </label>

                <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="e.g. react, hooks, frontend"
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                />

                {validationErrors.tags && (
                    <p className="mt-1 text-sm text-red-600">
                        {validationErrors.tags}
                    </p>
                )}

                <p className="mt-1 text-xs text-slate-500">
                    Separate tags with commas.
                </p>
            </div>

            <div className="flex gap-2">
                {isEditMode && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? (isEditMode ? 'Saving...' : 'Creating...')
                        : (isEditMode ? 'Save Changes' : 'Create Snippet')}
                </button>
            </div>
        </form>
    );
}

export default SnippetForm;
