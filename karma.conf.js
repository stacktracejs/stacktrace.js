module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'sinon'],
        files: [
            'node_modules/error-stack-parser/dist/error-stack-parser.min.js',
            'node_modules/stack-generator/dist/stack-generator.min.js',
            'node_modules/stacktrace-gps/dist/stacktrace-gps.min.js',
            'stacktrace.js',
            'spec/*-spec.js'
        ],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            '*.js': 'coverage'
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeCanary', 'Firefox', 'Opera'],
        singleRun: false
    });
};
