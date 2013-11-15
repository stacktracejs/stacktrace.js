/*global require, console*/
var ExceptionLab = require("./ExceptionLab");
//stacktrace.js

var lastException;

function info(text) {
    console.log(text);
}

function dumpException(ex) {
    ex = ex || new Error("Default error");
    var text = "{\n  " + ExceptionLab.getExceptionProps(ex).join(",\n  ") + "\n}";
    info(text);
    lastException = ex;
    console.log(ex.arguments);
}

function dumpExceptionMultiLine() {
    var fn = function() {
        return {
            name: "provide multi-line message in exception"
        };
    };
    try {
        fn.nonExistentMethod();
    } catch (ex) {
        dumpException(ex);
    }
}

dumpExceptionMultiLine();

/*
> Object.getOwnPropertyNames(lastException)
[ 'stack', 'arguments', 'type', 'message' ]
*/
