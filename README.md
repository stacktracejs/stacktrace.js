# Welcome to stacktrace.js! [![Code Climate](https://codeclimate.com/github/eriwen/javascript-stacktrace.png)](https://codeclimate.com/github/eriwen/javascript-stacktrace)
A JavaScript tool that allows you to debug your JavaScript by giving you a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify)

# How do I use stacktrace.js? #
Just include stacktrace.js file on your page, and call it like so:

```html
<script type="text/javascript" src="path/to/stacktrace.js" />
<script type="text/javascript">
    ... your code ...
    if (errorCondition) {
         var trace = printStackTrace();
         //Output however you want!
         alert(trace.join('\n\n'));
    }
    ... more code of yours ...
</script>
```

Bookmarklet available on the [project home page](http://stacktracejs.com).

You can also pass in your own Error to get a stacktrace *not available in IE or Safari 5-*

```javascript
var lastError;
try {
    // error producing code
} catch(e) {
   lastError = e;
   // do something else with error
}

if (lastError) {
    // Returns stacktrace from lastError!
    var trace = printStackTrace({e: lastError});
    alert('Error!\n' + 'Message: ' + lastError.message + '\nStack trace:\n' + trace.join('\n'));
}
```

Note that error message is not included in stack trace.

# Function Instrumentation #
You can now have any (public or privileged) function give you a stacktrace when it is called:

```javascript
function logStackTrace(stack) {
    console.log(stack.join('\n'));
}
var p = new printStackTrace.implementation();
p.instrumentFunction(this, 'baz', logStackTrace);

function foo() {
    var a = 1;
    bar();
}
function bar() {
    baz();
}
foo(); //Will log a stacktrace when 'baz()' is called containing 'foo()'!

p.deinstrumentFunction(this, 'baz'); //Remove function instrumentation
```

# What browsers does stacktrace.js support? #
It is currently tested and working on:

 - Firefox (and Iceweasel) 0.9+
 - Google Chrome 1+
 - Safari 3.0+ (including iOS 1+)
 - Opera 7+
 - IE 5.5+
 - Konqueror 3.5+
 - Flock 1.0+
 - SeaMonkey 1.0+
 - K-Meleon 1.5.3+
 - Epiphany 2.28.0+
 - Iceape 1.1+

## Contributions [![Stories in Ready](http://badge.waffle.io/eriwen/javascript-stacktrace.png)](http://waffle.io/eriwen/javascript-stacktrace)  

This project is made possible due to the efforts of these fine people:

* [Eric Wendelin](http://eriwen.com)
* [Luke Smith](http://lucassmith.name/)
* Loic Dachary
* Johan Euphrosine
* Øyvind Sean Kinsey
* Victor Homyakov
