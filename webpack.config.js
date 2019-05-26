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
            }
        ]
    },

    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, './dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin ([
            {from: './src/index.html', to: './index.html'}
        ])
    ]
};
