import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownField({ value = '', onChange, readOnly = false }) {
    const markdownPreview = (
        <div className="min-h-40 rounded-md border border-slate-200 bg-slate-50 p-4">
            {value.trim() ? (
                <div className="space-y-3 wrap-break-word text-sm leading-6 text-slate-700">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-2xl font-bold">{children}</h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-xl font-semibold">{children}</h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-lg font-semibold">{children}</h3>
                            ),
                            p: ({ children }) => <p>{children}</p>,
                            ul: ({ children }) => (
                                <ul className="list-disc space-y-1 pl-6">{children}</ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal space-y-1 pl-6">{children}</ol>
                            ),
                            li: ({ children }) => <li>{children}</li>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-slate-300 pl-4 italic">
                                    {children}
                                </blockquote>
                            ),
                            code: ({ children, className }) => (
                                <code
                                    className={`rounded bg-slate-200 px-1 py-0.5 font-mono text-sm ${className || ''}`}
                                >
                                    {children}
                                </code>
                            ),
                            pre: ({ children }) => (
                                <pre className="overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
                                    {children}
                                </pre>
                            ),
                            a: ({ children, href }) => (
                                <a
                                    href={href}
                                    className="text-blue-600 underline"
                                >
                                    {children}
                                </a>
                            ),
                            table: ({ children }) => (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        {children}
                                    </table>
                                </div>
                            ),
                            th: ({ children }) => (
                                <th className="border border-slate-300 bg-slate-200 p-2">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="border border-slate-300 p-2">
                                    {children}
                                </td>
                            ),
                            hr: () => <hr className="border-slate-300" />,
                            del: ({ children }) => (
                                <del className="text-slate-500">{children}</del>
                            ),
                        }}
                    >
                        {value}
                    </ReactMarkdown>
                </div>
            ) : (
                <p className="text-sm text-slate-400">
                    Markdown preview will appear here...
                </p>
            )}
        </div>
    );

    if (readOnly) {
        return markdownPreview;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <h3 className="mb-2 text-sm font-medium">Write Markdown</h3>

                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows={12}
                    placeholder="Write your notes using Markdown..."
                    className="w-full rounded-md border border-slate-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <h3 className="mb-2 text-sm font-medium">Live Preview</h3>
                {markdownPreview}
            </div>
        </div>
    );
}

export default MarkdownField;
