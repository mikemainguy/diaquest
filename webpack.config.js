const path = require('path');
const fs = require('fs');
const version = fs.readFileSync('./VERSION');
const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';



const config = {
    entry: {
        index: './src/index.js',
        db: './src/db.js',
        localdb: './src/local.js',
        components: {
            import: './src/components.js',
            dependOn: 'index'
        },
        speech: './src/speech.js',
        conference: {
            import: './src/conference.js',
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
