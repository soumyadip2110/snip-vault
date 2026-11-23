import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchSnippets } from './snippetThunks.js';

function SnippetList() {
    const dispatch = useDispatch();

    const { snippets, status, error } = useSelector(
        (state) => state.snippets
    );

    // Fetch snippets when this component loads.
    useEffect(() => {
        dispatch(fetchSnippets());
    }, [dispatch]);

    if (status === 'loading') {
        return <p>Loading your snippets...</p>;
    }

    if (status === 'failed') {
        return <p>Error loading snippets: {error}</p>;
    }

    return (
        <section>
            <h2>My Snippets</h2>

            {snippets.length === 0 ? (
                <p>You haven't created any snippets yet.</p>
            ) : (
                <div>
                    {snippets.map((snippet) => (
                        <article key={snippet._id}>
                            <h3>{snippet.title}</h3>

                            <p>{snippet.description || 'No description provided.'}</p>

                            <p>
                                **Language:** {snippet.language}
                            </p>

                            {snippet.tags?.length > 0 && (
                                <div>
                                    <strong>Tags: </strong>
                                    {snippet.tags.map((tag, index) => (
                                        <span key={`${tag}-${index}`}>
                                            {tag}{' '}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <pre>
                                <code>{snippet.code}</code>
                            </pre>

                            <hr />
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SnippetList;
