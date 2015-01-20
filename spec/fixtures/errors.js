/* exported Errors */
var Errors = {};

Errors.IE_11 = {
    message: "Unable to get property 'undef' of undefined or null reference",
    stack: "TypeError: Unable to get property 'undef' of undefined or null reference\n" +
    "   at Anonymous function (http://path/to/file.js:47:21)\n" +
    "   at foo (http://path/to/file.js:45:13)\n" +
    "   at bar (http://path/to/file.js:108:1)",
    description: "Unable to get property 'undef' of undefined or null reference"
};
