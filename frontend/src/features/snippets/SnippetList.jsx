import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchSnippets } from './snippetThunks.js';

function SnippetList() {
    const dispatch = useDispatch();

    const { snippets, status, error } = useSelector(
        (state) => state.snippets
    );

    useEffect(() => {
        dispatch(fetchSnippets());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <p className="py-8 text-center text-slate-500">
                Loading your snippets...
            </p>
        );
    }

    if (status === 'failed') {
        return (
            <p className="rounded-md bg-red-50 p-4 text-red-700">
                Error loading snippets: {error}
            </p>
        );
    }

    return (
        <section>
            <h2 className="mb-6 text-2xl font-semibold">
                My Snippets
            </h2>

            {snippets.length === 0 ? (
                <p className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-500">
                    You haven't created any snippets yet.
                </p>
            ) : (
                <div className="grid gap-5">
                    {snippets.map((snippet) => (
                        <article
                            key={snippet._id}
                            className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <h3 className="mb-2 text-lg font-semibold">
                                {snippet.title}
                            </h3>

                            <p className="mb-3 text-sm text-slate-600">
                                {snippet.description || 'No description provided.'}
                            </p>

                            <p className="mb-3 text-sm text-slate-500">
                                <strong>Language:</strong> {snippet.language}
                            </p>

                            {snippet.tags?.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {snippet.tags.map((tag, index) => (
                                        <span
                                            key={`${tag}-${index}`}
                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <pre className="overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
                                <code>{snippet.code}</code>
                            </pre>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SnippetList;
