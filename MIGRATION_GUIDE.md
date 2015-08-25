# Migrating from v0.x to v1.x

In version 1.x, We've switched from a *synchronous* API to an *asynchronous* one using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
because synchronous ajax calls are [deprecated](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests#Synchronous_request) 
and frowned upon due to performance implications.

> **HEADS UP:** StackTrace.JS does *NOT* provide a Promises polyfill by default, but we do distribute a [version with polyfills](https://raw.githubusercontent.com/stacktracejs/stacktrace.js/master/dist/stacktrace-with-polyfills.min.js)! 
> Check [the Promises page on caniuse.com](http://caniuse.com/#feat=promises) to determine if you need one.

All methods now return [stackframe](https://github.com/stacktracejs/stackframe)s. 
This Object representation is modeled closely after StackFrame representations in Gecko and V8.
All you have to do to get stacktrace.js v0.x behavior is call `.toString()` on a stackframe.

### Use Case: Give me a trace from wherever I am right now

v0.x:
```js
printStackTrace();
=> Array[String]
```

v1.x:
```js
StackTrace.get().then(callback).catch(errback);
=> Promise(Array[StackFrame], Error)
```

`StackTrace.get()` returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Use Case: Parse this error


v0.x:
```js
var error = new Error('Boom');
printStackTrace({e: error});
=> Array[String]
```

v1.x:
```js
var error = new Error('Boom');
StackTrace.fromError(error).then(callback).catch(errback);
=> Promise(Array[StackFrame], Error)
```

If this is all you need, you don't even need the full stacktrace.js library! Just use [error-stack-parser](https://github.com/stacktracejs/error-stack-parser)!
```js
ErrorStackParser.parse(new Error('boom'));
```

### Use Case: Give me a trace anytime this function is called

Instrumenting now takes `Function` references instead of `String`s. 

v0.x:
```js
function interestingFn() {...}; 

var p = new printStackTrace.implementation();
p.instrumentFunction(this, 'interestingFn', logStackTrace);
=> Function (instrumented)

p.deinstrumentFunction(this, 'interestingFn');
=> Function (original)
```

v1.x:
```js
function interestingFn() {...};
 
StackTrace.instrument(interestingFn, callback, errback);
=> Function (instrumented)

StackTrace.deinstrument(interestingFn);
=> Function (original)
```
