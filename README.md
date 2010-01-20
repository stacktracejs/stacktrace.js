# What is Javascript Stacktrace? #
A Javascript tool that allows you to debug your Javascript by giving you a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify)

# How do I use Javascript Stacktrace? #
Currently, stacktrace.js requires [jQuery](http://jquery.com) but that is likely to change soon. Just include jQuery and stacktrace.js file on your page, and call it like so:
    
    <script type="text/javascript" src="path/to/jquery.js" />
    <script type="text/javascript" src="path/to/stacktrace.js" />
    <script type="text/javascript">
        ... your code ...
        if (errorCondition) {
	         var trace = printStacktrace();
	         //Output however you want!
	         alert(trace.join('\n\n'));
        }
        ... more code of yours ...
    </script>

Some people recommend just assigning it to `window.onerror`:

    window.onerror = function() {
	    alert(printStacktrace().join('\n\n'));
    }

# What browsers does Javascript Stacktrace support? #
It is currently tested and working on:
* Firefox 2+
* Safari 3+
* Opera 9.51+
* IE 6+

Untested but likely working on:
* Chrome 1+
* IE 5-5.5
* Safari 1-2
* Opera 8-9
