import defaultTypescriptText from "./default-editor-value.ts.text";
import './index.css';
import { createTypescriptEditor, createJsonEditor } from "./code-editor";
import { generateJsonSchema } from './generate-json-schema';
import { default as Ajv } from 'ajv';

(async () => {
    const typescriptContainer = document.getElementById('typescript-container');
    const jsonSchemaContainer = document.getElementById('json-schema-container');
    const validationOutputContainer = document.getElementById('validation-output-container');

    if (jsonSchemaContainer === null || typescriptContainer === null || validationOutputContainer === null) throw new Error();

    const typescriptEditor = createTypescriptEditor(typescriptContainer, defaultTypescriptText, {readOnly: false});

    const validationOutputEditor = createJsonEditor(validationOutputContainer, JSON.stringify({errorCount: 1}));

    const generatedJsonSchema = await generateJsonSchema(defaultTypescriptText);
    const jsonSchemaString = JSON.stringify(generatedJsonSchema, undefined, 1);

    const jsonSchemaEditor = createJsonEditor(jsonSchemaContainer, jsonSchemaString, { readOnly: true });

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

        const jsonSchemaValidator = new Ajv()
            // .addSchema(jsonSchema)
            .compile(singleGameJsonSchema);

        const isInputValid = jsonSchemaValidator({didWin: "nope"});

        if (!isInputValid) {
            validationOutputEditor.setValue(JSON.stringify(jsonSchemaValidator.errors, undefined, 1));
        } else {
            validationOutputEditor.setValue(JSON.stringify([]));
        }


    };

    await updateValidationEditor();
})();
