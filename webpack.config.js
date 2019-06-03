const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devtool = process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map';

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: devtool,
    entry: {
        app: './src/index.js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/'
                    }
                }]
            }
        ]
    },

    devServer: {
        contentBase: './dist',
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, './dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin ([
            {from: './src/index.html', to: './index.html'},
            {from: './src/assets/favicon.png', to: './assets'}
        ])
    ]
};
