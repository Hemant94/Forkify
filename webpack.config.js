const path  = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = 
{
    /*in web pack there are 4 core concepts components
    the entry point
    the output
    loaders and plugins
    */
    entry: ['babel-polyfill', './src/js/index.js'],

    output:{
        path: path.resolve(__dirname,'dist'),
        filename: 'js/bundle.js'
    },
    devServer:{
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template:'./src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                     loader: 'babel-loader'   
                }
            }
        ]
    }
};