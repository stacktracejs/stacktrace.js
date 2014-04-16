/*global require,phantom*/
var printStackTrace = require('../stacktrace.js');
var exLab = require('../test/functional/ExceptionLab.js');
//console.log(exLab.getExceptionProps);

function f1() {
    try {
        this.undef();
    } catch (e) {
        console.log(exLab.getExceptionProps(e));
        //console.log(e.stackArray);
        //console.log(exLab.getExceptionProps(e.stackArray[0]));
        //console.log(exLab.getExceptionProps(e.stackArray[1]));
        //console.log(exLab.getExceptionProps(e.stackArray[2]));
        //console.log(exLab.getExceptionProps(e.stackArray[3]));

        console.log('stack:', printStackTrace({e: e}));
        var p = new printStackTrace.implementation();
        console.log('other:', p.run(e, 'other'));
    }
}

function f2() {
    f1(0, 'abc', f1, {a: 0});
}

(function longName_$1() {
    "use strict";
    f2();
}());

phantom.exit();
