import defaultTypescriptText from "./default-editor-value.ts.text";
import defaultJsonToValidate from './defaultJsonToValidate.json';
import './index.css';
import './loading-spinner.css';
import Split from 'split.js';

const typescriptContainer = document.getElementById('typescript-container') as HTMLElement;
const jsonSchemaContainer = document.getElementById('json-schema-container') as HTMLElement;
const jsonObjectToValidateContainer = document.getElementById('json-object-to-validate-container') as HTMLElement;
const validationOutputContainer = document.getElementById('validation-output-container') as HTMLElement;

const containerElements = [typescriptContainer, jsonSchemaContainer, jsonObjectToValidateContainer, validationOutputContainer]
    .map((element) => {
        if (element === null) throw new Error();
        return element;
    });

let typescriptEditor: any = null;
let jsonSchemaEditor: any = null;
let jsonObjectToValidateEditor: any = null;
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

Split(containerElements, {
    gutterSize: 10,
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
    const codeEditorModulePromise = import(/* webpackChunkName: "code-editor" */'./code-editor');
    const ajvModulePromise = import(/* webpackChunkName: "ajv" */'ajv');
    const generateJsonSchemaModulePromise = import(/* webpackChunkName: "generate-json-schema" */'./generate-json-schema');
    const codeEditorModule = await codeEditorModulePromise;
    const ajv = await ajvModulePromise;
    const Ajv = ajv.default;
    const generateJsonSchema = (await generateJsonSchemaModulePromise).generateJsonSchema;

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

    jsonObjectToValidateEditor = await codeEditorModule.createJsonEditor(
        jsonObjectToValidateContainer,
        JSON.stringify(defaultJsonToValidate, undefined, 1),
        { readOnly: false, extraEditorClassName: "json-object-to-validate-editor" }
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
        const firstDefinition = Object.values(jsonSchema.definitions)[0];

        const jsonSchemaForFirstDefinition = {
            ...jsonSchema,
            ...firstDefinition,
        };

        const jsonSchemaValidator = new Ajv({ allErrors: true })
            .compile(jsonSchemaForFirstDefinition);

        const jsonToValidate = JSON.parse(jsonObjectToValidateEditor.getValue());

        jsonSchemaValidator(jsonToValidate);

        const output = {
            errors: jsonSchemaValidator.errors || [],
        }
        validationOutputEditor.setValue(JSON.stringify(output, undefined, 1));
    };

    await updateValidationEditor();

    jsonSchemaEditor.getModel().onDidChangeContent(async () => {
        await updateValidationEditor();
    });

    jsonObjectToValidateEditor.getModel().onDidChangeContent(async () => {
        await updateValidationEditor();
    });
});

createEditors();
