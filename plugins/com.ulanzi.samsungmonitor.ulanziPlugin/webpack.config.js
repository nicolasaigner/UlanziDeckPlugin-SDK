import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './plugin/app.js',
  target: 'node',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: false }]],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: false, // Desabilitar minificação temporariamente para debug
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js'],
    fullySpecified: false, // Permite imports sem extensão
  },
  externals: {
    // Não empacotar node_modules nativos
    'ws': 'commonjs ws',
    'axios': 'commonjs axios',
    'events': 'commonjs events'
  }
};

