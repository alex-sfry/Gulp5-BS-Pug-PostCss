import path from 'path';
import { fileURLToPath } from 'url';
// import TerserPlugin from "terser-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('mode - production');

export default {
    mode: 'production',
    entry: {
        main: './src/js/main.js',
    },
    output: {
        publicPath: '/',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // clean: false
    },
    resolve: {
        extensions: ['.js']
    },
    devtool: 'source-map',
    optimization: {
        usedExports: true,
        minimize: true,
    },
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] }
                }
            },
        ],
    },
    performance: {
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000
    }
};