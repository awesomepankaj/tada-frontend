var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
      path.resolve(__dirname, 'app/main.js')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    module: {
      loaders: [
        {test: /\.woff|\.woff2|\.svg|.eot|\.ttf|\.png|\.gif|\.ico|\.html/, loader: 'file-loader'},
        {test: /\.json$/, loader: 'file-loader'},
        {test: /\.css$/, loader: "style!css"},
        {test: /\.scss$/, loader: 'style!css!sass'},
        {test: /\.js$/, exclude: /node_modules/, loader: "babel"}

      ]
    },
    resolve: {
      extensions: ['', '.js', '.json', '.css']
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
             "window.jQuery": "jquery"
        }),
        new webpack.IgnorePlugin(/\/iconv-loader$/)
    ]
};
