// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
//const SplitChunksPlugin = require('')
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const fs = require('fs');
const version = fs.readFileSync('./VERSION');
const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';



const config = {
    entry: {
        index: './src/index.js',
        db: './src/db.js',
        components: './src/components.js'
    },
    output: {
        filename: `[name].${version}.bundle.js`,
        path: path.resolve(__dirname, 'client/dist')
    },
    optimization: {
        usedExports: true
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    devtool: 'source-map',
    plugins: [

        //new Split
        /*new HtmlWebpackPlugin({
            template: 'index.hbs',
        }),
*/
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /client\/\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
  //      config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        
    } else {
        config.mode = 'development';
    }
    return config;
};
