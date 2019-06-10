const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var babelOptions = {
    "presets": [
        "@babel/preset-env"
    ]
};

module.exports = (env) => {

    const isProduction = env === 'prod' || env === 'production';

    return {
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"],
        },
        plugins: [
            isProduction ? new CleanWebpackPlugin() : () => {},
            new HtmlWebpackPlugin({
                title: 'Runtime Typescript Validation',
                template: path.resolve(__dirname, 'src/index.html'),
                showErrors: process.env.NODE_ENV === 'development',
            }),
        ],
        mode: isProduction ? 'production' : 'development',
        devtool: "inline-source-map",
        entry: {
            "app": './src/index.ts',
        },
        output: {
            globalObject: 'self',
            filename: '[name].bundle.js',
            chunkFilename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        resolveLoader: {
            modules: [
                'node_modules',
                path.resolve(__dirname, 'loaders')
            ]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        },
                        'ts-loader',
                        'typescript-json-schema-loader',
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g|gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                        },
                    }, ],
                },
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000,
            overlay: process.env.NODE_ENV === 'development',
        },
        stats: {
            warningsFilter: (warningText) => {
                const annoyingWarningFirstLine = "./node_modules/typescript/lib/typescript.js 94814:19-45";
                const annoyingWarningSecondLine = "Critical dependency: the request of a dependency is an expression";
                const shouldFilter = warningText.includes(annoyingWarningFirstLine) && warningText.includes(annoyingWarningSecondLine);

                return shouldFilter;
            }
        }
    };
};
