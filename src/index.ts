import { execFromProgram } from './typescript-json-schema';
import defaultTypescriptText from "./default-editor-value.ts.text";
import "./monaco-init";
import * as ts from "typescript";
import { getFileSystemAsync } from './browser-filesystem';

(async () => {
    const fileName = 'input-file.ts';
    const fileContents = defaultTypescriptText;
    const fileSystem = await getFileSystemAsync();

    await fileSystem.writeFileAsync(fileName, fileContents);

    const sourceFile = ts.createSourceFile(fileName, fileContents, ts.ScriptTarget.ESNext);

    const program = ts.createProgram([sourceFile.fileName], { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext });

    execFromProgram(program);
})();

