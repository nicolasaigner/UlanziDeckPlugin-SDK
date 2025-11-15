import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './plugin/app.js',
  target: 'node', // ambiente alvo: Node.js
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module', // define o formato de saída como módulo ES
    chunkFormat: 'module' // define o formato dos chunks diretamente
  },
  mode: 'development', // modo: 'development' (desenvolvimento) ou 'production' (produção)
  module: {
    rules: [
      {
        // tratamento especial do caminho das fontes geradas pelo svgdom após o empacotamento
        test: path.resolve(__dirname, 'node_modules/svgdom/src/utils/defaults.js'),
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: /__dirname\s*=\s*[^\)]+\)/,
                  replace:" __dirname = dirname(process.argv[1]"
                },
                {
                  search: /fontDir\s*=\s*[^\)]+\)/,
                  replace:" fontDir = join(__dirname, 'fonts/')"
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        // exclude: /node_modules/, // Se você quiser incluir arquivos JS dentro de node_modules, pode comentar esta linha
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: false }]],
          },
        },
      },
    ],
  },
  // Configuração de plugins
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/svgdom/fonts/OpenSans-Regular.ttf', to: 'fonts/' },
      ],
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  experiments: {
      outputModule: true, // Habilita a saída de módulos
  }
};