import * as ts from "typescript";
import { getFileSystemAsync } from './browser-filesystem';
import { generateSchema } from 'typescript-json-schema';

export const generateJsonSchema = async (typescriptString: string) => {
    const fileName = 'input-file.ts';
    const fileContents = typescriptString;
    const fileSystem = await getFileSystemAsync();

    await fileSystem.writeFileAsync(fileName, fileContents);

    const sourceFile = ts.createSourceFile(fileName, fileContents, ts.ScriptTarget.ESNext);

    const program = ts.createProgram([sourceFile.fileName], { target: ts.ScriptTarget.ES2016, module: ts.ModuleKind.ESNext });

    const args = { ignoreErrors: true };

    const jsonSchema = generateSchema(program, "*", args);

    if (jsonSchema === null) throw new Error('JSON Schema Output was null.');
    
    return jsonSchema;
}
