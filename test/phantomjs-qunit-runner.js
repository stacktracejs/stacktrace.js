/*
 * QUnit Qt+WebKit powered headless test runner using Phantomjs
 * 
 * Phantomjs installation: http://code.google.com/p/phantomjs/wiki/BuildInstructions
 * 
 * Run with:
 *  phantomjs test.js [url-of-your-qunit-testsuite]
 *  
 * E.g.
 *  phantomjs test.js http://localhost/qunit/test
 */
 
function consoleLogging(done) {
    var module;
    QUnit.moduleStart = function(context) {
        module = context.name;
    }
    var current_test_assertions = [];
    QUnit.testDone = function(result) {
        var name = module + ": " + result.name;
        if (result.failed) {
            console.log("\u001B[31m✖ " + name);
            for (var i = 0; i < current_test_assertions.length; i++) {
                console.log("    " + current_test_assertions[i]);
            }
            console.log("\u001B[39m");
        }
        current_test_assertions = [];
    };
 
    QUnit.log = function(details) {
        if (details.result) {
            return;
        }
        var response = details.message || "";
        if (details.expected) {
            if (response) {
                response += ", ";
            }
            response = "expected: " + details.expected + ", but was: " + details.actual;
        }
        current_test_assertions.push("Failed assertion: " + response);
    };
 
    QUnit.done = function(result) {
        console.log("Took " + result.runtime + "ms to run " + result.total + " tests. \u001B[32m✔ " + result.passed + "\u001B[39m \u001B[31m✖ " + result.failed + "\u001B[39m ");
        done(result.failed > 0 ? 1 : 0);
    };
}

function junitLogging(done) {
    var module, moduleStart, testStart, testCases = [],
        current_test_assertions = [];
    console.log('<?xml version="1.0" encoding="UTF-8"?>');
    console.log('<testsuites name="testsuites">');
    QUnit.begin = function() {
        // That does not work when invoked in PhantomJS
    }
 
    QUnit.moduleStart = function(context) {
        moduleStart = new Date();
        module = context.name;
        testCases = [];
    }
 
    QUnit.moduleDone = function(context) {
        // context = { name, failed, passed, total }
        var xml = '\t<testsuite name="' + context.name + '" errors="0" failures="' + context.failed + '" tests="' + context.total + '" time="' + (new Date() - moduleStart) / 1000 + '"';
        if (testCases.length) {
            xml += '>\n';
            for (var i = 0, l = testCases.length; i < l; i++) {
                xml += testCases[i];
            }
            xml += '\t</testsuite>';
        } else {
            xml += '/>\n';
        }
        console.log(xml);
    }
 
    QUnit.testStart = function() {
        testStart = new Date();
    }
 
    QUnit.testDone = function(result) {
        // result = { name, failed, passed, total }
        var xml = '\t\t<testcase classname="' + module + '" name="' + result.name + '" time="' + (new Date() - testStart) / 1000 + '"';
        if (result.failed) {
            xml += '>\n';
            for (var i = 0; i < current_test_assertions.length; i++) {
                xml += "\t\t\t" + current_test_assertions[i];
            }
            xml += '\t\t</testcase>\n';
        } else {
            xml += '/>\n';
        }
        current_test_assertions = [];
        testCases.push(xml);
    };
 
    QUnit.log = function(details) {
        //details = { result , actual, expected, message }
        if (details.result) {
            return;
        }
        var message = details.message || "";
        if (details.expected) {
            if (message) {
                message += ", ";
            }
            message = "expected: " + details.expected + ", but was: " + details.actual;
        }
        var xml = '<failure type="failed" message="' + message + '"/>\n'
 
        current_test_assertions.push(xml);
    };
 
    QUnit.done = function(result) {
        console.log('</testsuites>');
        done(result.failed > 0 ? 1 : 0);
    };
}
 
if (phantom.state.length === 0) {
    if (phantom.args.length < 1) {
        console.log('Usage: phantomjs-test-runner.js [-j|--junit] <some URL>');
        phantom.exit();
    } else {
        window.console.debug = function() {};
        phantom.state = "console";
        var args = phantom.args.slice();
        var url = args.pop();
        if (args.length) {
            var arg = args.pop().toLowerCase();
            switch (arg) {
            case "-j":
            case "--junit":
                phantom.state = "junit";
                break;
            default:
 
            }
        }
        phantom.open(url);
    }
} else {
    if (phantom.loadStatus === 'success') {
        this[phantom.state + "Logging"](function(returnCode) {
            phantom.exit(returnCode);
        });
    } else {
        console.log(phantom.loadStatus + ' to load the address: ' + phantom.args[phantom.args.length - 1]);
        phantom.exit(1);
    }
}