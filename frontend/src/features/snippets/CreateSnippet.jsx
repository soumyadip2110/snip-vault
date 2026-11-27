import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSnippetThunk } from './snippetThunks.js';
import SnippetForm from './components/SnippetForm.jsx';

function CreateSnippet() {
    const dispatch = useDispatch();

    const { operationStatus, operationError } = useSelector(
        (state) => state.snippets
    );

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        notes: '',
        code: '',
        language: '',
        tags: ''
    });

    const handleCreate = async (snippetData) => {
        try {
            await dispatch(createSnippetThunk(snippetData)).unwrap();

            setFormData({
                title: '',
                description: '',
                notes: '',
                code: '',
                language: '',
                tags: ''
            });
        } catch {
            // The error is already stored in Redux.
        }
    };

    return (
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
            <SnippetForm
                mode="create"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreate}
                isSubmitting={operationStatus === 'loading'}
                operationError={operationError}
            />
        </section>
    );
}

export default CreateSnippet;
