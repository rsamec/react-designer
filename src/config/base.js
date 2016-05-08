'use strict';


// Settings configured here will be merged into the final config object.
export default {
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  node: {
    net: "empty",
    tls: "empty"
  }
}
