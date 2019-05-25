import * as monaco from 'monaco-editor';
import defaultTypescriptText from './default-editor-value.ts.text';

// @ts-ignore
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId: any, label: string): any {
        if (label === 'json') {
            return './json.worker.bundle.js';
        }
        if (label === 'css') {
            return './css.worker.bundle.js';
        }
        if (label === 'html') {
            return './html.worker.bundle.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js';
    }
}

const container = document.getElementById('container');
if (container !== null) {
    monaco.editor.create(container, {
        value:
            defaultTypescriptText,
        language: 'typescript'
    });
}
