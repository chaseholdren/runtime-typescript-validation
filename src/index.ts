import defaultTypescriptText from "./default-editor-value.ts.text";
import { createTypescriptEditor } from "./code-editor";
import * as ts from "typescript";
import { getFileSystemAsync } from './browser-filesystem';
import { generateSchema } from 'typescript-json-schema';

(() => {
    const typescriptContainer = document.getElementById('typescript-container');
    if (typescriptContainer === null) return;
    const typescriptEditor = createTypescriptEditor(typescriptContainer, defaultTypescriptText);
    typescriptEditor.getModel().onDidChangeContent((contentChangedEvent) => {
    });
})();

const get

