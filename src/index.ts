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
    const generateJsonSchemaModule = await generateJsonSchemaModulePromise;

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

    const generatedJsonSchema = await generateJsonSchemaModule.generateJsonSchema(defaultTypescriptText);
    const jsonSchemaString = JSON.stringify(generatedJsonSchema, undefined, 1);

    jsonSchemaEditor = await codeEditorModule.createJsonEditor(
        jsonSchemaContainer,
        jsonSchemaString,
        { readOnly: true, extraEditorClassName: "typescript-editor" }
    );

    const updateJsonSchemaEditorFromTypescriptString = async (typescriptString: string) => {
        const generatedJsonSchema = await generateJsonSchemaModule.generateJsonSchema(typescriptString);

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
});

createEditors();
