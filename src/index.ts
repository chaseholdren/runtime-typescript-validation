// const defaultTypescriptText = require("!!raw-loader!./default-editor-value");
// const gameValidator = require("./default-editor-value").gameValidator;
// const defaultValidationTarget = require("./default-validation-target");
// require("./index.css");
// require("./loading-spinner.css");
// const split = require("split.js");

import defaultTypescriptText from "!!raw-loader!./default-editor-value";
import { gameValidator } from "./default-editor-value";
import defaultValidationTarget from "./default-validation-target";
import './index.css';
import './loading-spinner.css';
import Split from 'split.js';

console.log(defaultTypescriptText);
console.log(gameValidator.validate({}));

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
    // const codeEditorModulePromise = import(/* webpackChunkName: "code-editor" */'./code-editor');
    // const ajvModulePromise = import(/* webpackChunkName: "ajv" */'ajv');
    // const codeEditorModule = await codeEditorModulePromise;
    // const ajv = await ajvModulePromise;
    // const Ajv = ajv.default;

    // const defaultTypescriptJsonSchema = {

    // };

    // codeEditorModule.onDidCreateEditor(() => {
    //     const loadingSpinners = document.querySelectorAll(".root-editors-container .loading-spinner");
    //     loadingSpinners.forEach((spinner) => {
    //         spinner.remove();
    //     })
    // })

    // const typescriptEditor = await codeEditorModule.createTypescriptEditor(
    //     typescriptContainer,
    //     defaultTypescriptText,
    //     { readOnly: false, extraEditorClassName: "typescript-editor" }
    // );

    // const validationOutputEditor = await codeEditorModule.createJsonEditor(
    //     validationOutputContainer,
    //     JSON.stringify({ errorCount: 1 }),
    //     { extraEditorClassName: "typescript-editor" }
    // );

    // const objectToValidateEditor = await codeEditorModule.createTypescriptEditor(
    //     objectToValidateContainer,
    //     JSON.stringify(defaultValidationTarget, undefined, 1),
    //     { readOnly: false, extraEditorClassName: "json-object-to-validate-editor" }
    // );

    // // const generatedJsonSchema = await generateJsonSchema(defaultTypescriptText);
    // const jsonSchemaString = JSON.stringify(defaultTypescriptJsonSchema, undefined, 1);

    // const jsonSchemaEditor = await codeEditorModule.createJsonEditor(
    //     jsonSchemaContainer,
    //     jsonSchemaString,
    //     { readOnly: true, extraEditorClassName: "typescript-editor" }
    // );

    // const updateJsonSchemaEditorFromTypescriptString = async (typescriptString: string) => {
    //     // const generatedJsonSchema = await generateJsonSchema(typescriptString);

    //     const newJsonSchemaString = JSON.stringify(jsonSchemaString, undefined, 1);
    //     jsonSchemaEditor.setValue(newJsonSchemaString);
    // }

    // typescriptEditor.getModel().onDidChangeContent(async () => {
    //     await updateJsonSchemaEditorFromTypescriptString(typescriptEditor.getValue());
    // });

    // const updateValidationEditor = async () => {
    //     const jsonSchema = JSON.parse(jsonSchemaEditor.getValue());

    //     const validationInputSource = objectToValidateEditor.getValue();

    //     const editorOutput = {
    //         definition: "",
    //         validationTarget: {},
    //     };

    //     try {
    //         const editorOutputAttempt = eval(`(() => {${validationInputSource} return validate;})()`);
    //         editorOutput.definition = editorOutputAttempt.definition;
    //         editorOutput.validationTarget = editorOutputAttempt.validationTarget;
    //     } catch (error) {
    //     }

    //     const { definition, validationTarget } = editorOutput;

    //     const targetDefinition = jsonSchema.definitions[definition];

    //     const jsonSchemaForFirstDefinition = {
    //         ...jsonSchema,
    //         ...targetDefinition,
    //     };

    //     const jsonSchemaValidator = new Ajv({ allErrors: true })
    //         .compile(jsonSchemaForFirstDefinition);

    //     jsonSchemaValidator(validationTarget);
    //     const output = {
    //         source: validationTarget,
    //         errors: jsonSchemaValidator.errors || [],
    //     }
    //     validationOutputEditor.setValue(JSON.stringify(output, undefined, 1));
    // };

    // await updateValidationEditor();

    // jsonSchemaEditor.getModel().onDidChangeContent(async () => {
    //     await updateValidationEditor();
    // });

    // objectToValidateEditor.getModel().onDidChangeContent(async () => {
    //     await updateValidationEditor();
    // });
});

createEditors();
