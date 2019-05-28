import defaultTypescriptText from "./default-editor-value.ts.text";
import './index.css';
import './loading-spinner.css';
import Split from 'split.js';

const typescriptContainer = document.getElementById('typescript-container');
const jsonSchemaContainer = document.getElementById('json-schema-container');
const validationOutputContainer = document.getElementById('validation-output-container');

if (jsonSchemaContainer === null || typescriptContainer === null || validationOutputContainer === null) throw new Error();

let typescriptEditor: any = null;
let jsonSchemaEditor: any = null;
let validationOutputEditor: any = null;

const safeHideEditor = (editor: any) => {
    if (editor !== null) {
        editor.getDomNode().hidden = true;
    }
}

const safeShowEditor = (editor: any) => {
    if (editor !== null) {
        editor.getDomNode().hidden = false;
        editor.layout();
    }
}

Split([typescriptContainer, jsonSchemaContainer, validationOutputContainer], {
    gutterSize: 5,
    onDragStart: () => {
        safeHideEditor(typescriptEditor);
        safeHideEditor(jsonSchemaEditor);
        safeHideEditor(validationOutputEditor);
    },
    onDragEnd: () => {
        safeShowEditor(typescriptEditor);
        safeShowEditor(jsonSchemaEditor);
        safeShowEditor(validationOutputEditor);
    }
});

const createEditors = (async () => {
    await import(/* webpackChunkName: "code-editor" */'./code-editor');
    await import(/* webpackChunkName: "ajv" */'ajv');
    await import(/* webpackChunkName: "generate-json-schema" */'./generate-json-schema');
    console.log(defaultTypescriptText);
});

createEditors();
