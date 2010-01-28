# What is Javascript Stacktrace? #
A Javascript tool that allows you to debug your Javascript by giving you a [stack trace](http://en.wikipedia.org/wiki/Stack_trace) of function calls leading to an error (or any condition you specify)

# How do I use Javascript Stacktrace? #
Just include stacktrace.js file on your page, and call it like so:
    
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
 * Firefox (and Iceweasel) 0.9+
 * Safari 3+
 * IE 5.5+
 * Konqueror 3.5+
 * Flock 1.0+
 * SeaMonkey 1.0+
 * K-Meleon 1.5.3+
 * Epiphany 2.28.0+

Working (readable, valid stack trace) but not perfectly tested on:
 * Chrome 1+
 * Opera 7+
