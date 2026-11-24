import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSnippets } from './snippetThunks.js';
import CodeEditor from './components/CodeEditor.jsx';

function SnippetList() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [language, setLanguage] = useState('');
    const [tag, setTag] = useState('');

    const debounceTimer = useRef(null);

    const { snippets, status, error } = useSelector(
        (state) => state.snippets
    );

    useEffect(() => {
        clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            const params = {};

            if (search.trim()) params.search = search.trim();
            if (language.trim()) params.language = language.trim();
            if (tag.trim()) params.tag = tag.trim();

            dispatch(fetchSnippets(params));
        }, 350);

        return () => clearTimeout(debounceTimer.current);
    }, [dispatch, search, language, tag]);

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

            <div className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                <input
                    type="text"
                    placeholder="Filter by language..."
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                <input
                    type="text"
                    placeholder="Filter by tag..."
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                <button
                    type="button"
                    onClick={() => {
                        setSearch('');
                        setLanguage('');
                        setTag('');
                    }}
                    className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 sm:col-span-2 lg:col-span-3"
                >
                    Clear Filters
                </button>
            </div>

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
                                <Link
                                    to={`/snippets/${snippet._id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {snippet.title}
                                </Link>
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

                            <div className="mb-4">
                                <CodeEditor
                                    value={snippet.code}
                                    language={snippet.language}
                                    readOnly={true}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SnippetList;
