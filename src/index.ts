import defaultTypescriptText from "./default-editor-value.ts.text";
import './index.css';
import './loading-spinner.css';
import { createTypescriptEditor, createJsonEditor, onDidCreateEditor } from "./code-editor";
import { generateJsonSchema } from './generate-json-schema';
import { default as Ajv } from 'ajv';
import Split from 'split.js';

const typescriptContainer = document.getElementById('typescript-container');
const jsonSchemaContainer = document.getElementById('json-schema-container');
const validationOutputContainer = document.getElementById('validation-output-container');

if (jsonSchemaContainer === null || typescriptContainer === null || validationOutputContainer === null) throw new Error();

const initPage = (async () => {
    onDidCreateEditor(() => {
        const loadingSpinners = document.querySelectorAll(".root-editors-container .loading-spinner");
        loadingSpinners.forEach((spinner) => {
            spinner.remove();
        })
    })

    const typescriptEditor = createTypescriptEditor(
        typescriptContainer,
        defaultTypescriptText,
        { readOnly: false, extraEditorClassName: "typescript-editor" }
    );

    const validationOutputEditor = createJsonEditor(
        validationOutputContainer,
        JSON.stringify({ errorCount: 1 }),
        { extraEditorClassName: "typescript-editor" }
    );

    const generatedJsonSchema = await generateJsonSchema(defaultTypescriptText);
    const jsonSchemaString = JSON.stringify(generatedJsonSchema, undefined, 1);

    const jsonSchemaEditor = createJsonEditor(
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

    Split([typescriptContainer, jsonSchemaContainer, validationOutputContainer], {
        gutterSize: 5,
        onDragEnd: () => {
            typescriptEditor.layout();
            jsonSchemaEditor.layout();
            validationOutputEditor.layout();
        }
    });
});

initPage();
// if(false) initPage();
