import './index.css';
import './loading-spinner.css';
import Split from 'split.js';

const typescriptContainer = document.getElementById('typescript-container');
const jsonSchemaContainer = document.getElementById('json-schema-container');
const validationOutputContainer = document.getElementById('validation-output-container');

if (jsonSchemaContainer === null || typescriptContainer === null || validationOutputContainer === null) throw new Error();

let typescriptEditor: any;
let jsonSchemaEditor: any;
let validationOutputEditor: any;
let codeEditorModule: any = null;

const initPage = (async () => {
    console.log('hi');
    Split([typescriptContainer, jsonSchemaContainer, validationOutputContainer], {
        gutterSize: 10,
        onDragStart: () => {
            if (codeEditorModule !== null) {
                if (typeof typescriptEditor !== 'undefined') codeEditorModule.hideEditor(typescriptEditor);
                if (typeof jsonSchemaEditor !== 'undefined') codeEditorModule.hideEditor(jsonSchemaEditor);
                if (typeof validationOutputEditor !== 'undefined') codeEditorModule.hideEditor(validationOutputEditor);
            }
        },
        onDragEnd: () => {
            if (codeEditorModule !== null) {
                if (typeof typescriptEditor !== 'undefined') {
                    codeEditorModule.showEditor(typescriptEditor);
                    typescriptEditor.layout();
                }
                if (typeof jsonSchemaEditor !== 'undefined') {
                    codeEditorModule.showEditor(jsonSchemaEditor);
                    jsonSchemaEditor.layout();
                }
                if (typeof validationOutputEditor !== 'undefined') {
                    codeEditorModule.showEditor(validationOutputEditor);
                    validationOutputEditor.layout();
                }
            }
        }
    });
    console.log('hey');
});

initPage()
    .then(() => import(/* webpackChunkName: "init-editors" */'./init-editors')).then((codeEditorModuleImport) => {
        codeEditorModule = codeEditorModuleImport;
    });
