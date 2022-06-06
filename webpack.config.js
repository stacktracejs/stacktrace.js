var path = require('path');

module.exports = {
    entry: './node_modules/source-map/lib/source-map-consumer.js',
    output: {
        library: 'SourceMap',
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    }
};
