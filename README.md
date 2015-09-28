# stacktrace.js
## Framework-agnostic, micro-library for getting stack traces in all web browsers
[![Build Status](https://travis-ci.org/stacktracejs/stacktrace.js.svg?branch=master)](https://travis-ci.org/stacktracejs/stacktrace.js) [![Coverage Status](https://img.shields.io/coveralls/stacktracejs/stacktrace.js.svg)](https://coveralls.io/r/stacktracejs/stacktrace.js?branch=master) [![Code Climate](https://codeclimate.com/github/stacktracejs/stacktrace.js/badges/gpa.svg)](https://codeclimate.com/github/stacktracejs/stacktrace.js)

Debug and profile your JavaScript with a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify).

stacktrace.js uses browsers' `Error.stack` mechanism to generate stack traces, parses them, enhances them with 
[source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) and uses 
[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
to return an Array of [StackFrames](https://github.com/stacktracejs/stackframe).

#### Upgrading? Check the [0.x -> 1.x Migration Guide](http://www.stacktracejs.com/#!/docs/v0-migration-guide)

## Usage
#### Get a stack trace from current location
```js
var callback = function(stackframes) {
    var stringifiedStack = stackframes.map(function(sf) { 
        return sf.toString(); 
    }).join('\n'); 
    console.log(stringifiedStack); 
};

var errback = function(err) { console.log(err.message); };

StackTrace.get().then(callback).catch(errback)
=> Promise(Array[StackFrame], Error)
=> callback([StackFrame('func1', [], 'file.js', 203, 9), StackFrame('func2', [], 'http://localhost:3000/file.min.js', 1, 3284)])
```

#### window.onerror integration
Automatically handle errors
```js
window.onerror = function(msg, file, line, col, error) {
    // callback is called with an Array[StackFrame]
    StackTrace.fromError(error).then(callback).catch(errback);
};
```

#### Get stack trace from an Error
```js
var error = new Error('BOOM!'); 

StackTrace.fromError(error).then(callback).catch(errback)
=> Promise(Array[StackFrame], Error)
```

#### Generate a stacktrace from walking arguments.callee
This might capture arguments information, but isn't supported in ES5 strict-mode
```js
StackTrace.generateArtificially().then(callback).catch(errback)
=> Promise(Array[StackFrame], Error)
```

#### Trace every time a given function is invoked
```js
// callback is called with an Array[StackFrame] every time  
// the wrapped interestingFn is called
StackTrace.instrument(interestingFn, callback, errback)
=> Instrumented Function

StackTrace.deinstrument(interestingFn)
=> De-instrumented Function
```

## Get stacktrace.js
```
npm install stacktrace-js
bower install stacktrace-js
component install stacktracejs/stacktrace.js
http://cdnjs.com/libraries/stacktrace.js
```

## API

#### `StackTrace.get(/*optional*/ options)` => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)(Array[[StackFrame](https://github.com/stacktracejs/stackframe)])
Generate a backtrace from invocation point, then parse and enhance it.

**(Optional) options: Object**
* *filter: Function([StackFrame](https://github.com/stacktracejs/stackframe) => Boolean)* - Only include stack entries matching for which `filter` returns `true` 
* *sourceCache: Object (String URL => String Source)* - Pre-populate source cache to avoid network requests
* *offline: Boolean (default: false)* - Set to `true` to prevent all network requests
 
#### `StackTrace.fromError(error, /*optional*/ options)` => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)(Array[[StackFrame](https://github.com/stacktracejs/stackframe)])
Given an Error object, use [error-stack-parser](https://github.com/stacktracejs/error-stack-parser)
to parse it and enhance location information with [stacktrace-gps](https://github.com/stacktracejs/stacktrace-gps).
 
**error: Error**

**(Optional) options: Object**
* *filter: Function([StackFrame](https://github.com/stacktracejs/stackframe) => Boolean)* - Only include stack entries matching for which `filter` returns `true`
* *sourceCache: Object (String URL => String Source)* - Pre-populate source cache to avoid network requests
* *offline: Boolean (default: false)* - Set to `true` to prevent all network requests
 
#### `StackTrace.generateArtificially(/*optional*/ options)` => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)(Array[[StackFrame](https://github.com/stacktracejs/stackframe)])
Use [stack-generator](https://github.com/stacktracejs/stack-generator) to generate a backtrace by walking the `arguments.callee.caller` chain.

**(Optional) options: Object**
* *filter: Function([StackFrame](https://github.com/stacktracejs/stackframe) => Boolean)* - Only include stack entries matching for which `filter` returns `true`
* *sourceCache: Object (String URL => String Source)* - Pre-populate source cache to avoid network requests
* *offline: Boolean (default: false)* - Set to `true` to prevent all network requests
 
#### `StackTrace.instrument(fn, callback, /*optional*/ errback)` => Function
* Given a function, wrap it such that invocations trigger a callback that is called with a stack trace.

* **fn: Function** - to wrap, call callback on invocation and call-through
* **callback: Function** - to call with stack trace (generated by `StackTrace.get()`) when fn is called
* **(Optional) errback: Function** - to call with Error object if there was a problem getting a stack trace. 
Fails silently (though `fn` is still called) if a stack trace couldn't be generated.
 
#### `StackTrace.deinstrument(fn)` => Function
Given a function that has been instrumented, revert the function to it's original (non-instrumented) state.

* **fn: Function** - Instrumented Function

#### `StackTrace.report(stackframes, url)` => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)(String)
Given an Array of StackFrames, serialize and POST to given URL. Promise is resolved with response text from POST request.

Example JSON POST data:
```
{
  stack: [
    {functionName: 'fn', fileName: 'file.js', lineNumber: 32, columnNumber: 1},
    {functionName: 'fn2', fileName: 'file.js', lineNumber: 543, columnNumber: 32},
    {functionName: 'fn3', fileName: 'file.js', lineNumber: 8, columnNumber: 1}
  ]
}
```

* **stackframes: Array([StackFrame](https://github.com/stacktracejs/stackframe))** - Previously wrapped Function
* **url: String** - URL to POST stack JSON to

## Browser Support
* Chrome 1+
* Firefox 3+
* Safari 5+
* Opera 9+
* IE 6+
* iOS 7+
* Android 4.0+

> **HEADS UP**: You won't get the benefit of [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
in IE9- or other very old browsers.

## Using node.js/io.js only? 
I recommend the [stack-trace node package](https://www.npmjs.com/package/stack-trace) specifically built for node. 
It has a very similar API and also supports source maps.

## Contributing
Want to be listed as a *Contributor*? Start with the [Contributing Guide](https://github.com/stacktracejs/stacktrace.js/blob/master/CONTRIBUTING.md)!

This project is made possible due to the efforts of these fine people:

* [Eric Wendelin](http://www.eriwen.com)
* [Victor Homyakov](https://github.com/victor-homyakov)
* [Oliver Salzburg](https://github.com/oliversalzburg)
* [Many others](https://github.com/stacktracejs/stacktrace.js/graphs/contributors)
