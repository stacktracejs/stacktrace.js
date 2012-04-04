# What is stacktrace.js? #
A Javascript tool that allows you to debug your Javascript by giving you a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify)

# How do I use stacktrace.js? #
Just include stacktrace.js file on your page, and call it like so:
    
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

Bookmarklet available on the [project home page](http://stacktracejs.com). 

You can also pass in your own Error to get a stacktrace *not in IE or Safari, though :(*

    <script type="text/javascript">
		var lastError;
		try {
		    // error producing code
		} catch(e) {
		   lastError = e;
		   // do something else with error
		}

		// Returns stacktrace from lastError!
		printStackTrace({e: lastError});
    </script>

# Function Instrumentation #
You can now have any (public or privileged) function give you a stacktrace when it is called:

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
