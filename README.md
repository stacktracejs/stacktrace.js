# What is stacktrace.js? #
A Javascript tool that allows you to debug your JavaScript by giving you a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify)

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

// Returns stacktrace from lastError!
printStackTrace({e: lastError});
```

# Function Instrumentation #
You can now have any (public or privileged) function give you a stacktrace when it is called:

```javascript
var p = new printStackTrace.implementation();
p.instrumentFunction(this, 'baz', logStackTrace);
function logStackTrace(stack) {
    console.log(stack.join('\n'));
}
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
 - Safari 3.0+
 - Opera 7+
 - IE 5.5+
 - Konqueror 3.5+
 - Flock 1.0+
 - SeaMonkey 1.0+
 - K-Meleon 1.5.3+
 - Epiphany 2.28.0+
 - Iceape 1.1+

## Contributions
This project is made possible due to the efforts of these fine people:

* [Eric Wendelin](http://eriwen.com)
* [Luke Smith](http://lucassmith.name/)
* Loic Dachary
* Johan Euphrosine
* Øyvind Sean Kinsey
* Victor Homyakov

### Making contributions
When submitting your pull requests, please do the following to make it easier to incorporate your changes:

* Include unit and/or functional tests that validate changes you're making.
* Run unit tests in the latest IE, Firefox, Chrome, Safari and Opera and make sure they pass.
* Rebase your changes onto origin/HEAD if you can do so cleanly.
* If submitting additional functionality, provide an example of how to use it.
* Please keep code style consistent with surrounding code.

### Testing
There are a few ways to run tests:

* You can run tests in PhantomJS by simply running `gradlew test` from your favorite shell.
* Run tests with JSTestDriver using `gradlew jstd`
* Point any browser to `≤project dir>/test/TestStacktrace.html` for unit tests
* Point your browser to `≤project dir>/test/functional/index.html` for more real-world functional tests
