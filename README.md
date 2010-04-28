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

*New!* Bookmarklet: [stacktrace.js](javascript:(function(){loadJS=function(){s=document.createElement('SCRIPT');s.type='text/javascript';s.src='http://eriwen.com/js/stacktrace.js';document.getElementsByTagName('head')[0].appendChild(s);};alertTrace=function(){alert(printStackTrace().join('\n'))};attachToWinError=function(){window.onerror=alertTrace};attachToCustomFunc=function(fn){eval('_old_'+fn+'='+fn+';'+fn+'=function(args){alertTrace();_old_'+fn+'.call(this,args);}')};c=document.createElement('SPAN');cs=c.style;cs.position='absolute';cs.top='0';cs.right='0';cs.backgroundColor='#ddf';t=document.createTextNode('stacktrace.js:');c.appendChild(t);b3=document.createElement('INPUT');b3.type='button';b3.value='Load';b3.onclick=loadJS;c.appendChild(b3);b1=document.createElement('INPUT');b1.type='button';b1.value='window.onerror';b1.onclick=attachToWinError;c.appendChild(b1);i=document.createElement('INPUT');i.type='text';c.appendChild(i);b2=document.createElement('INPUT');b2.type='button';b2.value='Custom';b2.onclick=function(){attachToCustomFunc(i.value)};c.appendChild(b2);document.body.appendChild(c);})();)

You can also pass in your own Error to get a stacktrace:

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

Some people recommend just assigning it to `window.onerror`:

    window.onerror = function() {
	    alert(printStacktrace().join('\n\n'));
    }

# What browsers does Javascript Stacktrace support? #
It is currently tested and working on:

 - Firefox (and Iceweasel) 0.9+  
 - Google Chrome 1+  
 - Safari 3.0+  
 - IE 5.5+  
 - Konqueror 3.5+  
 - Flock 1.0+  
 - SeaMonkey 1.0+  
 - K-Meleon 1.5.3+  
 - Epiphany 2.28.0+  
 - Iceape 1.1+

Working (readable, valid stack trace) but not perfectly tested on:  

 - Opera 7+
