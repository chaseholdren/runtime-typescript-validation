import defaultTypescriptText from "./default-editor-value.ts.text";
import "./monaco-editor";
import * as ts from "typescript";
import { getFileSystemAsync } from './browser-filesystem';
import { generateSchema } from 'typescript-json-schema';

(async () => {
    const fileName = 'input-file.ts';
    const fileContents = defaultTypescriptText;
    const fileSystem = await getFileSystemAsync();

    await fileSystem.writeFileAsync(fileName, fileContents);

    const sourceFile = ts.createSourceFile(fileName, fileContents, ts.ScriptTarget.ESNext);

    const program = ts.createProgram([sourceFile.fileName], { target: ts.ScriptTarget.ES2016, module: ts.ModuleKind.ESNext });

    const args = { ignoreErrors: true };

    const jsonSchema = generateSchema(program, "*", args);
    const jsonSchemaString = JSON.stringify(jsonSchema, undefined, 1);
    console.log(jsonSchemaString);
    
    const jsonSchemaOutputDomElement = document.getElementById('json-schema-output');
    if (jsonSchemaOutputDomElement !== null) jsonSchemaOutputDomElement.innerHTML = jsonSchemaString;
})();

