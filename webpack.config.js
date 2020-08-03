var pkg = require('./package.json');

module.exports = {
  entry: pkg.main,
  output: {
    path: './samples',
    filename: 'bundle.js',
    library: pkg.name,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?presets[]=es2015' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  devtool: 'source-map'
};
