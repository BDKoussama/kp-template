module.exports = {
    entry: './source/js/app.js',
    output: {
      filename: 'bundle.js',
    },
    module: {
     rules: [{
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel-loader',
     }]
    },
  };