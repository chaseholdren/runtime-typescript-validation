import * as monaco from 'monaco-editor';

// @ts-ignore
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId: any, label: string): any {
        if (label === 'json') {
            return './json.worker.bundle.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js';
    }
}

const commonDefaultOptions: monaco.editor.IEditorConstructionOptions = {
    lineNumbers: "off",
    // roundedSelection: false,
    scrollBeyondLastLine: false,
    theme: "vs-dark",
    autoIndent: true,
    contextmenu: false,
    glyphMargin: false,
    formatOnPaste: true,
    formatOnType: true,
    minimap: {
        enabled: false,
    }
};

export const createTypescriptEditor = (domElement: HTMLElement, codeEditorContents: string, options?: monaco.editor.IEditorConstructionOptions) => {
    const combinedOptions = {
        ...commonDefaultOptions,
        value: codeEditorContents,
        language: 'typescript',
        ...options,
    };

    return monaco.editor.create(domElement, combinedOptions);
}

export const createJsonEditor = (domElement: HTMLElement, codeEditorContents: string, options?: monaco.editor.IEditorConstructionOptions) => {
    const combinedOptions = {
        ...commonDefaultOptions,
        value: codeEditorContents,
        language: 'json',
        ...options,
    };

    return monaco.editor.create(domElement, combinedOptions);
}
