module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine-ajax', 'jasmine'],
        files: [
            'node_modules/es6-promise/dist/es6-promise.js',
            'node_modules/stacktrace-gps/dist/stacktrace-gps.min.js',
            'node_modules/error-stack-parser/dist/error-stack-parser.js',
            'node_modules/stack-generator/dist/stack-generator.js',
            'stacktrace.js',
            'spec/fixtures/*.js',
            'spec/spec-helper.js',
            'spec/*-spec.js'
        ],
        reporters: ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        customLaunchers: {
            Chrome_Travis: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        //browsers: ['ChromeCanary', 'Firefox'],
        browsers: ['PhantomJS2'],
        singleRun: false
    });
};
