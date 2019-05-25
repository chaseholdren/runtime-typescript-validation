import * as BrowserFS from 'browserfs';
import { FSModule } from 'browserfs/dist/node/core/FS';

const fileSystemConfig = {
    fs: "InMemory",
    options: {
        // options for the file system
    }
};

const createFileSystemAsync: () => Promise<FSModule> = () => {
    return new Promise((resolve, reject) => {

        BrowserFS.configure(fileSystemConfig, function (error) {
            if (error) reject(error);

            const fs = BrowserFS.BFSRequire('fs');
            resolve(fs);
        });
    })
}

let fileSystemSingleton: FSModule | undefined;

type AsyncFileSystem = {
    writeFileAsync: (fileName: string, fileContents: string) => Promise<{}>
} & FSModule;

export const getFileSystemAsync = async () => {
    if (typeof fileSystemSingleton === 'undefined') fileSystemSingleton = await createFileSystemAsync();
    const fileSystem = fileSystemSingleton;


    const writeFileAsync = (fileName: string, fileContents: string) => {
        return new Promise((resolve, reject) => {
            fileSystem.writeFile(fileName, fileContents, (error) => {
                if(error) reject(error);
                resolve();
            })

        })
    };

    const asyncFileSystem = fileSystem as AsyncFileSystem;
    asyncFileSystem.writeFileAsync = writeFileAsync;
    return asyncFileSystem;
}
