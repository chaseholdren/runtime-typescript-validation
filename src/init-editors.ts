import defaultTypescriptText from "./default-editor-value.ts.text";
import { generateJsonSchema } from './generate-json-schema';
import { default as Ajv } from 'ajv';

const typescriptContainer = document.getElementById('typescript-container');
const jsonSchemaContainer = document.getElementById('json-schema-container');
const validationOutputContainer = document.getElementById('validation-output-container');
let codeEditorExport: any = null;

export const hideEditor = (...args: any[]) => { if (codeEditorExport !== null) return codeEditorExport.hideEditor(args)};
export const showEditor = (...args: any[]) => { if (codeEditorExport !== null) return codeEditorExport.showEditor(args) };

if (jsonSchemaContainer === null || typescriptContainer === null || validationOutputContainer === null) throw new Error();

let typescriptEditor: any;
let jsonSchemaEditor: any;
let validationOutputEditor: any;

const initEditors = async (codeEditorModule: typeof import('./code-editor')) => {
    codeEditorExport = codeEditorModule;
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

import(/* webpackChunkName: "code-editor" */'./code-editor')
.then(initEditors);
