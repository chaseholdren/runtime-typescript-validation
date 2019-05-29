const TJS = require('typescript-json-schema');
const babelParser = require('@babel/parser');
const t = require('@babel/types');
const traverse = require("@babel/traverse").default;

const generateJsonSchema = async (fileName) => {

    const program = TJS.getProgramFromFiles([fileName]);

    const args = {
        ...TJS.getDefaultArgs(),
    };

    const schema = TJS.generateSchema(program, '*', args);

    return schema;
};


module.exports = function(sourceCode) {
    var callback = this.async();

    const ast = babelParser.parse(sourceCode, {
        sourceType: 'module',
        plugins: [
           "typescript",
           "dynamicImport",
           "classProperties",
           "classPrivateProperties",
           "classPrivateMethods",
        ]
    });

    traverse(ast, {
        NewExpression: function(path) {
            console.log(JSON.stringify(path.node, undefined, 2));
            if (path.node.callee.name === "Validator") {
                const params = path.node.typeParameters.params;

                console.log(`${path.node.callee.name} for type ${params[0].typeName.name}`)
            };
        }
    })

    generateJsonSchema(this.resourcePath)
        .then((output) => {
            const jsonSchema = JSON.stringify(output, undefined, 2);

            const result = `
                export default ${jsonSchema};
            `;

            console.log(result);

            callback(null, sourceCode);
        });
};
