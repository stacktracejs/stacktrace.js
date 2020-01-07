module.exports = function (config) {
    'use strict';
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
        process.exit(1);
    }

    var customLaunchers = {
        slChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: 'latest'
        },
        slChromeBeta: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: 'beta'
        },
        slFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: 'latest'
        },
        slFirefoxBeta: {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: 'beta'
        },
        slSafari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.14',
            version: 'latest'
        },
        slEdge: {
            base: 'SauceLabs',
            browserName: 'microsoftedge',
            platform: 'Windows 10',
            version: 'latest'
        },
        slIE11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },
        slIE10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '10'
        },
        slIE9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '10',
            'x-ua-compatible': 'IE=EmulateIE9'
        },
        slIE8: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '10',
            'x-ua-compatible': 'IE=EmulateIE8'
        }
    };

    config.set({
        basePath: '',
        frameworks: ['jasmine-ajax', 'jasmine'],
        files: [
            'node_modules/es6-promise/dist/es6-promise.js',
            'polyfills.js',
            'node_modules/stacktrace-gps/dist/stacktrace-gps.min.js',
            'node_modules/error-stack-parser/dist/error-stack-parser.js',
            'node_modules/stack-generator/dist/stack-generator.js',
            'stacktrace.js',
            'spec/fixtures/*.js',
            'spec/spec-helper.js',
            'spec/*-spec.js'
        ],
        exclude: [],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 240000,
        captureTimeout: 240000,
        sauceLabs: {
            testName: 'stacktrace.js unit tests',
            recordScreenshots: false,
            connectOptions: {
                port: 5757,
                logfile: 'sauce_connect.log'
            },
            build: process.env.TRAVIS_BUILD_ID || Math.floor((new Date).getTime() / 1000 - 1230768000).toString(),
            tags: [process.env.TRAVIS_BRANCH || "local"]
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['progress', 'saucelabs', 'coverage', 'coveralls'],
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
