const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: "cheap-module-eval-source-map",
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
        new CopyPlugin ([
            {from: './src/index.html', to: './index.html'},
            {from: './src/assets', to: './assets'}
        ])
    ]
};
