const TJS = require('typescript-json-schema');

module.exports = loader;

function loader(contents) {
    return loadJsonSchemaFromTypescript(this, contents);
};

function loadJsonSchemaFromTypescript(loaderContext, contents) {


    const fileName = loaderContext.resourcePath;

    const program = TJS.getProgramFromFiles([fileName]);

    const schemaObject = TJS.generateSchema(program, '*', {
        ...TJS.getDefaultArgs(),
    });

    const schemaString = JSON.stringify(schemaObject);

    console.log(loaderContext);
    console.log(schemaString);
    console.log(contents);

    contents = contents.replace(/\"\[SCHEMA_GOES_HERE\]\"/g, schemaString);

    return `export default ${contents}`;

    // const result = `
    // ${sourceCode}

    // export const jsonSchema = ${schemaString};
    // `

    // callback(null, schemaString)
    // return `"${encodeURI(schemaString)}"`;
};
