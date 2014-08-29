# Welcome to stacktrace.js! [![Code Climate](https://codeclimate.com/github/stacktracejs/stacktrace.js.png)](https://codeclimate.com/github/stacktracejs/stacktrace.js)
A JavaScript tool that allows you to debug your JavaScript by giving you a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify)

# Usage
Just include stacktrace.js file on your page, and call it like so:

```html
<script type="text/javascript" src="https://rawgithub.com/stacktracejs/stacktrace.js/master/stacktrace.js"></script>
<script type="text/javascript">
    // your code...
    var trace = printStackTrace();
    alert(trace.join('\n\n')); // Output however you want!
    // more code of yours...
</script>
```

You can also pass in your own Error to get a stacktrace *not available in IE or Safari 5-*

```html
<script type="text/javascript" src="https://rawgithub.com/stacktracejs/stacktrace.js/master/stacktrace.js"></script>
<script type="text/javascript">
    try {
        // error producing code
    } catch(e) {
        var trace = printStackTrace({e: e});
        alert('Error!\n' + 'Message: ' + e.message + '\nStack trace:\n' + trace.join('\n'));
        // do something else with error
    }
</script>
```

Note that error message is not included in stack trace.

Bookmarklet available on the [project home page](http://stacktracejs.com).

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

# Get stacktrace.js
```
npm install stacktrace-js
bower install stacktrace-js
component install stacktrace.js
wget https://rawgithub.com/stacktracejs/stacktrace.js/master/stacktrace.js
```

# Browser Support
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
 - PhantomJS

## Contributions [![Stories in Ready](http://badge.waffle.io/stacktracejs/stacktrace.js.png)](http://waffle.io/stacktracejs/stacktrace.js)  

This project is made possible due to the efforts of these fine people:

* [Eric Wendelin](http://www.eriwen.com)
* [Victor Homyakov] (https://github.com/victor-homyakov)
* [Luke Smith](http://lucassmith.name/)
* [Many others](https://github.com/stacktracejs/stacktrace.js/graphs/contributors)
