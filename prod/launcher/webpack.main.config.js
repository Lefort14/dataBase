import path from 'path';
export default {
    entry: './launcher/src/electron.ts',
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { configFile: path.resolve('./tsconfig.electron.json') }
            }
        ]
    },
    resolve: { extensions: ['.ts', '.js'] },
    output: {
        filename: 'electron.js',
        path: path.resolve('.webpack/electron')
    }
};
