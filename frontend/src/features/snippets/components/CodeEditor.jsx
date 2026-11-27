import { useEffect, useRef } from 'react';
import { basicSetup, EditorView } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

const getLanguageExtension = (language) => {
    const normalizedLanguage = language?.trim().toLowerCase();

    switch (normalizedLanguage) {
        case 'javascript':
        case 'js':
            return javascript();

        case 'python':
        case 'py':
            return python();

        case 'html':
            return html();

        case 'css':
            return css();

        case 'json':
            return json();

        case 'c':
        case 'cpp':
        case 'c++':
        case 'cxx':
        case 'h':
        case 'hpp':
            return cpp();

        default:
            return [];
    }
};

function CodeEditor({
    value = '',
    onChange,
    language = '',
    readOnly = false,
    onSubmitShortcut,
}) {
    const editorContainerRef = useRef(null);
    const editorViewRef = useRef(null);

    const languageCompartment = useRef(new Compartment());
    const readOnlyCompartment = useRef(new Compartment());

    const valueRef = useRef(value);
    const onChangeRef = useRef(onChange);
    const languageRef = useRef(language);
    const readOnlyRef = useRef(readOnly);
    const onSubmitShortcutRef = useRef(onSubmitShortcut);

    // Keep the latest props available to the editor.
    valueRef.current = value;
    onChangeRef.current = onChange;
    languageRef.current = language;
    readOnlyRef.current = readOnly;
    onSubmitShortcutRef.current = onSubmitShortcut;

    // Create and destroy the editor.
    useEffect(() => {
        const state = EditorState.create({
            doc: valueRef.current,
            extensions: [
                basicSetup,
                keymap.of([
                    {
                        key: 'Mod-Enter',
                        run: () => {
                            if (!onSubmitShortcutRef.current) return false;

                            onSubmitShortcutRef.current();
                            return true;
                        },
                    },
                    indentWithTab,
                ]),
                oneDark,
                EditorView.lineWrapping,

                languageCompartment.current.of(
                    getLanguageExtension(languageRef.current)
                ),

                readOnlyCompartment.current.of([
                    EditorState.readOnly.of(readOnlyRef.current),
                    EditorView.editable.of(!readOnlyRef.current),
                ]),

                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChangeRef.current?.(
                            update.state.doc.toString()
                        );
                    }
                }),
            ],
        });

        const view = new EditorView({
            state,
            parent: editorContainerRef.current,
        });

        editorViewRef.current = view;

        return () => {
            view.destroy();
            editorViewRef.current = null;
        };
    }, []);

    // Update the editor when its value changes externally.
    useEffect(() => {
        const view = editorViewRef.current;

        if (!view || view.state.doc.toString() === value) {
            return;
        }

        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: value,
            },
        });
    }, [value]);

    // Update syntax highlighting when the language changes.
    useEffect(() => {
        editorViewRef.current?.dispatch({
            effects: languageCompartment.current.reconfigure(
                getLanguageExtension(language)
            ),
        });
    }, [language]);

    // Toggle between editable and read-only modes.
    useEffect(() => {
        editorViewRef.current?.dispatch({
            effects: readOnlyCompartment.current.reconfigure([
                EditorState.readOnly.of(readOnly),
                EditorView.editable.of(!readOnly),
            ]),
        });
    }, [readOnly]);

    return (
        <div
            ref={editorContainerRef}
            className="overflow-hidden rounded-md border border-slate-300 text-sm"
        />
    );
}

export default CodeEditor;
