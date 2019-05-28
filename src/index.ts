import defaultTypescriptText from "./default-editor-value.ts.text";
import defaultValidationTarget from "./default-validation-target.ts.text";
import './index.css';
import './loading-spinner.css';
import Split from 'split.js';

const typescriptContainer = document.getElementById('typescript-container') as HTMLElement;
const jsonSchemaContainer = document.getElementById('json-schema-container') as HTMLElement;
const objectToValidateContainer = document.getElementById('object-to-validate-container') as HTMLElement;
const validationOutputContainer = document.getElementById('validation-output-container') as HTMLElement;

const containerElements = [typescriptContainer, jsonSchemaContainer, objectToValidateContainer, validationOutputContainer]
    .map((element) => {
        if (element === null) throw new Error();
        element.childNodes.forEach(child => child.remove());
        return element;
    });

Split(containerElements, {
    gutterSize: 12,
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

    const typescriptEditor = await codeEditorModule.createTypescriptEditor(
        typescriptContainer,
        defaultTypescriptText,
        { readOnly: false, extraEditorClassName: "typescript-editor" }
    );

    const validationOutputEditor = await codeEditorModule.createJsonEditor(
        validationOutputContainer,
        JSON.stringify({ errorCount: 1 }),
        { extraEditorClassName: "typescript-editor" }
    );

    const objectToValidateEditor = await codeEditorModule.createTypescriptEditor(
        objectToValidateContainer,
        defaultValidationTarget,
        { readOnly: false, extraEditorClassName: "json-object-to-validate-editor" }
    );

    const generatedJsonSchema = await generateJsonSchema(defaultTypescriptText);
    const jsonSchemaString = JSON.stringify(generatedJsonSchema, undefined, 1);

    const jsonSchemaEditor = await codeEditorModule.createJsonEditor(
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

        const validationInputSource = objectToValidateEditor.getValue();

        const editorOutput = {
            definition: "",
            validationTarget: {},
        };

        try {
            const editorOutputAttempt = eval(`(() => {${validationInputSource} return validate;})()`);
            editorOutput.definition = editorOutputAttempt.definition;
            editorOutput.validationTarget = editorOutputAttempt.validationTarget;
        } catch (error) {
        }

        const { definition, validationTarget } = editorOutput;

        const targetDefinition = jsonSchema.definitions[definition];

        const jsonSchemaForFirstDefinition = {
            ...jsonSchema,
            ...targetDefinition,
        };

        const jsonSchemaValidator = new Ajv({ allErrors: true })
            .compile(jsonSchemaForFirstDefinition);

        jsonSchemaValidator(validationTarget);
        const output = {
            source: validationTarget,
            errors: jsonSchemaValidator.errors || [],
        }
        validationOutputEditor.setValue(JSON.stringify(output, undefined, 1));
    };

    await updateValidationEditor();

    jsonSchemaEditor.getModel().onDidChangeContent(async () => {
        await updateValidationEditor();
    });

    objectToValidateEditor.getModel().onDidChangeContent(async () => {
        await updateValidationEditor();
    });
});

createEditors();
