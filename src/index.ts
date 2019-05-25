import { execFromProgram } from './typescript-json-schema';
import "./typescriptServices";
import { defaultTypescriptText } from "./monaco-init";
import "./monaco-init";
import * as ts from "./typescript";
import * as BrowserFS from 'browserfs';

var fileSystemConfig = {
    fs: "InMemory",
    options: {
        // options for the file system
    }
};
BrowserFS.configure(fileSystemConfig, function (e) {
    if (e) {
        // An error occurred.
        throw e;
    }
    // Otherwise, you can interact with the configured backends via our Node FS polyfill!
    var fs = BrowserFS.BFSRequire('fs');
    fs.readdir('/', function (e, contents) {
        // etc.
    });

    const fileName = 'input-file.ts';

    fs.writeFile(fileName, defaultTypescriptText, (err) => {

        if(err) throw err;

        const sourceFile = ts.createSourceFile('input-file.ts', defaultTypescriptText, ts.ScriptTarget.ESNext);

        console.log(sourceFile);

        const options = {
            // noEmit: true,
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            lib: ["dom", "es6", "esnext", "esnext.symbol"],
        };

        // const compilerHost = ts.createCompilerHost(options, false);

        console.log(`hey`);
        const program = ts.createProgram([sourceFile.fileName], options);
        console.log(`hey again`);
        try {
            const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile);
            console.log(`hey again again`);
            console.log(diagnostics);
        } catch (error) {
            console.error(error);
        }

        execFromProgram(program);
        console.log(`hey again again end`);
    });
});

