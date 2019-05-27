const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {

    const isProduction = env === 'prod' || env === 'production';

    return {
        externals: {
            os: 'os'
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"],
            // Use our versions of Node modules.
            alias: {
                'fs': 'browserfs/dist/shims/fs.js',
                'buffer': 'browserfs/dist/shims/buffer.js',
                'path': 'browserfs/dist/shims/path.js',
                'processGlobal': 'browserfs/dist/shims/process.js',
                'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
                'bfsGlobal': require.resolve('browserfs')
            }
        },
        plugins: [
            isProduction ? new CleanWebpackPlugin() : () => {},
            new HtmlWebpackPlugin({
                title: 'Runtime Typescript Validation',
                template: path.resolve(__dirname, 'src/index.html'),
                showErrors: process.env.NODE_ENV === 'development',
            }),
            // Expose BrowserFS, process, and Buffer globals.
            // NOTE: If you intend to use BrowserFS in a script tag, you do not need
            // to expose a BrowserFS global.
            new webpack.ProvidePlugin({
                BrowserFS: 'bfsGlobal',
                process: 'processGlobal',
                Buffer: 'bufferGlobal',
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
        ],
        // DISABLE Webpack's built-in process and Buffer polyfills!
        node: {
            process: false,
            Buffer: false,
            os: 'empty',
            module: 'empty'
        },
        mode: isProduction ? 'production' : 'development',
        devtool: "inline-source-map",
        entry: {
            "app": './src/index.ts',
        },
        output: {
            globalObject: 'self',
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        module: {
            // noParse: /browserfs\.js/,
            rules: [{
                    test: /\.text$/i,
                    use: 'raw-loader',
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.css$/,
                    use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: process.env.NODE_ENV === 'development',
                            },
                        },
                        'css-loader',
                    ],
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
