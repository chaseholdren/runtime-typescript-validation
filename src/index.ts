import defaultTypescriptText from "./default-editor-value.ts.text";
import './index.css';
import './loading-spinner.css';
import { generateJsonSchema } from './generate-json-schema';
import { default as Ajv } from 'ajv';
import Split from 'split.js';

// declare namespace codeEditorModule {
//     export const createTypescriptEditor: (domElement: HTMLElement, codeEditorContents: string) => Promise<{}>;
// }

const typescriptContainer = document.getElementById('typescript-container');
const jsonSchemaContainer = document.getElementById('json-schema-container');
const validationOutputContainer = document.getElementById('validation-output-container');

if (jsonSchemaContainer === null || typescriptContainer === null || validationOutputContainer === null) throw new Error();

let typescriptEditor: any;
let jsonSchemaEditor: any;
let validationOutputEditor: any;
let codeEditorModule: any;

const initPage = (async () => {
    console.log('hi');
    Split([typescriptContainer, jsonSchemaContainer, validationOutputContainer], {
        gutterSize: 10,
        onDragStart: () => {
            if (typeof typescriptEditor !== 'undefined') codeEditorModule.hideEditor(typescriptEditor);
            if (typeof jsonSchemaEditor !== 'undefined') codeEditorModule.hideEditor(jsonSchemaEditor);
            if (typeof validationOutputEditor !== 'undefined') codeEditorModule.hideEditor(validationOutputEditor);
        },
        onDragEnd: () => {
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
    });
    console.log('hey');


});

const initEditors = async (codeEditorModule: typeof import('./code-editor')) => {
    console.log('hi2');
    codeEditorModule.onDidCreateEditor(() => {
        const loadingSpinners = document.querySelectorAll(".root-editors-container .loading-spinner");
        loadingSpinners.forEach((spinner) => {
            spinner.remove();
        })
    })

    typescriptEditor = await codeEditorModule.createTypescriptEditor(
        typescriptContainer,
        defaultTypescriptText,
        { readOnly: false, extraEditorClassName: "typescript-editor" }
    );

    validationOutputEditor = await codeEditorModule.createJsonEditor(
        validationOutputContainer,
        JSON.stringify({ errorCount: 1 }),
        { extraEditorClassName: "typescript-editor" }
    );

    const generatedJsonSchema = await generateJsonSchema(defaultTypescriptText);
    const jsonSchemaString = JSON.stringify(generatedJsonSchema, undefined, 1);

    jsonSchemaEditor = await codeEditorModule.createJsonEditor(
        jsonSchemaContainer,
        jsonSchemaString,
        { readOnly: true, extraEditorClassName: "typescript-editor" }
    );

    const updateJsonSchemaEditorFromTypescriptString = async (typescriptString: string) => {
        const generatedJsonSchema = await generateJsonSchema(typescriptString);

        const jsonSchemaString = JSON.stringify(generatedJsonSchema, undefined, 1);
        jsonSchemaEditor.setValue(jsonSchemaString);
    }

    typescriptEditor.getModel().onDidChangeContent(async () => {
        await updateJsonSchemaEditorFromTypescriptString(typescriptEditor.getValue());
    });

    const updateValidationEditor = async () => {
        const jsonSchema = JSON.parse(jsonSchemaEditor.getValue());
        const { SingleGame } = jsonSchema.definitions;

        const singleGameJsonSchema = {
            ...jsonSchema,
            ...SingleGame,
        };

        const jsonSchemaValidator = new Ajv({ allErrors: true })
            // .addSchema(jsonSchema)
            .compile(singleGameJsonSchema);

        const isInputValid = jsonSchemaValidator({ didWin: "nope" });

        if (!isInputValid) {
            validationOutputEditor.setValue(JSON.stringify(jsonSchemaValidator.errors, undefined, 1));
        } else {
            validationOutputEditor.setValue(JSON.stringify([]));
        }


    };

    await updateValidationEditor();

    jsonSchemaEditor.getModel().onDidChangeContent(async () => {
        await updateValidationEditor();
    });
    console.log('hey2');
};

initPage()
    .then(() => import(/* webpackChunkName: "code-editor" */'./code-editor'))
    .then(initEditors);
