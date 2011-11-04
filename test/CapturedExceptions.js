var CapturedExceptions = {};

CapturedExceptions.opera_964 = {
  message: "Statement on line 42: Type mismatch (usually non-object value supplied where object required)\n" +
  "Backtrace:\n" +
  "  Line 42 of linked script file://localhost/G:/js/stacktrace.js\n" +
  "                this.undef();\n" +
  "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n" +
  "            ex = ex || this.createException();\n" +
  "  Line 18 of linked script file://localhost/G:/js/stacktrace.js: In function printStackTrace\n" +
  "        var p = new printStackTrace.implementation(), result = p.run(ex);\n" +
  "  Line 4 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function bar\n" +
  "             printTrace(printStackTrace());\n" +
  "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function bar\n" +
  "           bar(n - 1);\n" +
  "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n" +
  "           bar(2);\n" +
  "  Line 15 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n" +
  "         foo();\n" +
  "",
  'opera#sourceloc': 42,
  stacktrace: "  ...  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n" +
  "            ex = ex || this.createException();\n" +
  "  Line 18 of linked script file://localhost/G:/js/stacktrace.js: In function printStackTrace\n" +
  "        var p = new printStackTrace.implementation(), result = p.run(ex);\n" +
  "  Line 4 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function bar\n" +
  "             printTrace(printStackTrace());\n" +
  "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function bar\n" +
  "           bar(n - 1);\n" +
  "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n" +
  "           bar(2);\n" +
  "  Line 15 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n" +
  "         foo();\n" +
  ""
};

CapturedExceptions.opera_1010 = {
  message: "Statement on line 42: Type mismatch (usually non-object value supplied where object required)",
  'opera#sourceloc': 42,
  stacktrace: "  Line 42 of linked script file://localhost/G:/js/stacktrace.js\n" +
  "                this.undef();\n" +
  "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n" +
  "            ex = ex || this.createException();\n" +
  "  Line 18 of linked script file://localhost/G:/js/stacktrace.js: In function printStackTrace\n" +
  "        var p = new printStackTrace.implementation(), result = p.run(ex);\n" +
  "  Line 4 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function bar\n" +
  "             printTrace(printStackTrace());\n" +
  "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function bar\n" +
  "           bar(n - 1);\n" +
  "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n" +
  "           bar(2);\n" +
  "  Line 15 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n" +
  "         foo();\n" +
  ""
};

CapturedExceptions.opera_1063 = {
  message: "'this.undef' is not a function",
  stack: "<anonymous function: createException>([arguments not available])@file://localhost/G:/js/stacktrace.js:42\n" +
  "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
  "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:4\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:7\n" +
  "foo([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:11\n" +
  "@file://localhost/G:/js/test/functional/testcase1.html:15",
  stacktrace: "<anonymous function: createException>([arguments not available])@file://localhost/G:/js/stacktrace.js:42\n" +
  "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
  "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:4\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:7\n" +
  "foo([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:11\n" +
  "@file://localhost/G:/js/test/functional/testcase1.html:15"
};

CapturedExceptions.opera_1111 = {
  message: "'this.undef' is not a function",
  stack: "<anonymous function: createException>([arguments not available])@file://localhost/G:/js/stacktrace.js:42\n" +
  "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
  "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:4\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:7\n" +
  "foo([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:11\n" +
  "@file://localhost/G:/js/test/functional/testcase1.html:15",
  stacktrace: "Error thrown at line 42, column 12 in <anonymous function: createException>() in file://localhost/G:/js/stacktrace.js:\n" +
  "    this.undef();\n" +
  "called from line 27, column 8 in <anonymous function: run>(ex) in file://localhost/G:/js/stacktrace.js:\n" +
  "    ex = ex || this.createException();\n" +
  "called from line 18, column 4 in printStackTrace(options) in file://localhost/G:/js/stacktrace.js:\n" +
  "    var p = new printStackTrace.implementation(), result = p.run(ex);\n" +
  "called from line 4, column 5 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    printTrace(printStackTrace());\n" +
  "called from line 7, column 4 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    bar(n - 1);\n" +
  "called from line 11, column 4 in foo() in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    bar(2);\n" +
  "called from line 15, column 3 in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    foo();"
};

CapturedExceptions.opera_1151 = {
  message: "'this.undef' is not a function",
  stack: "<anonymous function: createException>([arguments not available])@file://localhost/G:/js/stacktrace.js:42\n" +
  "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
  "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:4\n" +
  "bar([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:7\n" +
  "foo([arguments not available])@file://localhost/G:/js/test/functional/testcase1.html:11\n" +
  "@file://localhost/G:/js/test/functional/testcase1.html:15",
  stacktrace: "Error thrown at line 42, column 12 in <anonymous function: createException>() in file://localhost/G:/js/stacktrace.js:\n" +
  "    this.undef();\n" +
  "called from line 27, column 8 in <anonymous function: run>(ex) in file://localhost/G:/js/stacktrace.js:\n" +
  "    ex = ex || this.createException();\n" +
  "called from line 18, column 4 in printStackTrace(options) in file://localhost/G:/js/stacktrace.js:\n" +
  "    var p = new printStackTrace.implementation(), result = p.run(ex);\n" +
  "called from line 4, column 5 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    printTrace(printStackTrace());\n" +
  "called from line 7, column 4 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    bar(n - 1);\n" +
  "called from line 11, column 4 in foo() in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    bar(2);\n" +
  "called from line 15, column 3 in file://localhost/G:/js/test/functional/testcase1.html:\n" +
  "    foo();"
};
