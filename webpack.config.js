const path = require('path');
const fs = require('fs');
const version = fs.readFileSync('./VERSION');
const isProduction = process.env.NODE_ENV == 'production';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const stylesHandler = 'style-loader';

const config = {
    entry: {
        index: './client/webpack/index.js',
        db: './client/webpack/db.js',
        localdb: './client/webpack/local.js',
        graphql: './client/webpack/graphql.js',
        components: {
            import: './client/webpack/components.js',
            dependOn: 'index'
        },
        speech: './client/webpack/speech.js',
        conference: {
            import: './client/webpack/conference.js',
            dependOn: 'index'
        }
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
        new CleanWebpackPlugin()
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
