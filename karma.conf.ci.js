module.exports = function (config) {
    'use strict';
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
        process.exit(1);
    }

    // Check out https://saucelabs.com/platforms for all browser/platform combos
    var customLaunchers = {
        // FIXME: for iOS8 - TypeError: Can only call XMLHttpRequest.send on instances of XMLHttpRequest
        //slIOS8: {
        //    base: 'SauceLabs',
        //    browserName: 'iPhone',
        //    platform: 'OS X 10.9',
        //    version: '8.1'
        //},
        slChrome: {
            base: 'SauceLabs',
            browserName: 'chrome'
        },
        slFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox'
        },
        slOpera: {
            base: 'SauceLabs',
            browserName: 'opera'
        },
        slIE11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        }
        //slIE9: {
        //    base: 'SauceLabs',
        //    browserName: 'internet explorer',
        //    platform: 'Windows 7',
        //    version: '9'
        //}
    };

    config.set({
        basePath: '',
        frameworks: ['jasmine', 'sinon'],
        files: [
            'node_modules/error-stack-parser/dist/error-stack-parser.min.js',
            'node_modules/stack-generator/dist/stack-generator.min.js',
            'node_modules/stacktrace-gps/dist/stacktrace-gps.min.js',
            'stacktrace.js',
            'spec/spec-helper.js',
            'spec/*-spec.js'
        ],
        exclude: [],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 240000,
        captureTimeout : 240000,
        sauceLabs: {
            testName: 'stacktrace.js unit tests',
            recordScreenshots: false,
            connectOptions: {
                port: 5757,
                logfile: 'sauce_connect.log'
            }
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['progress', 'saucelabs', 'coverage'],
        preprocessors: {
            'stacktrace.js': 'coverage'
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage'
        },
        singleRun: true
    });
};
