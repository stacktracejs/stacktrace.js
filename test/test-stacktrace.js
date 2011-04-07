//
//     Copyright (C) 2008 Loic Dachary <loic@dachary.org>
//     Copyright (C) 2008 Johan Euphrosine <proppy@aminche.com>
//     Copyright (C) 2010 Eric Wendelin <emwendelin@gmail.com>
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

(function(window, document, undefined) {
	// Testing util functions
	var UnitTest = function() {};
	UnitTest.fn = UnitTest.prototype = {
	    genericError: null,
	    createGenericError: function() {
		if (UnitTest.prototype.genericError != null) {
		    return UnitTest.prototype.genericError;
		}
		return new Error();
	    },
	    /**
	     * An Error Chrome without arguments will emulate a Firefox
	     */
	    createErrorWithNoChromeArguments: function() {
		var err, options = {};
		try {
		    var oEvent = document.createEvent("KeyEvents");
		    oEvent.initKeyEvent(eventName, true, true, window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
		} catch(e) {
		    err = e;
		}
		return err;
	    }
	};

	module("invocation");

	test("printStackTrace", function() {
	    expect(1);
	    var r = printStackTrace();
	    equals(r.constructor, Array, 'printStackTrace returns an array');
	});

	test("printStackTrace options", function() {
	    expect(1);
	    var guessFunctions = printStackTrace.implementation.prototype.guessFunctions;
	    printStackTrace.implementation.prototype.guessFunctions = function() {
	        printStackTrace.implementation.prototype.guessFunctions = guessFunctions;
	        ok(true, 'guessFunctions called');
	    };
	    var r = printStackTrace({guess: true});
	});

	module("mode");

	test("mode", function() {
	    expect(1);
	    equals("chrome firefox other opera opera10".indexOf(printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError())) >= 0,true);
	});

	test("run mode", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    p.other = p.firefox = p.chrome = p.opera = p.opera10 = function() {
		equals(1, 1, 'called mode() successfully');
	    };
	    p.run();
	});

	test("run chrome", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    p.other = p.opera = p.opera10 = p.firefox = function() { equals(1, 0, 'must not call run for any mode other than "chrome"'); };
	    p.chrome = function() { equals(1, 1, 'called run for "chrome"'); };
	    p.run({arguments: true, stack: 'ignored\n at f0 (file.js:132:3)\n at file.js:135:3\n at f1 (file.js:132:13)\n at file.js:135:23\n at Object.<anonymous> (file.js:137:9)\n at file.js:137:32 at process (file.js:594:22)'});
	});

	test("run firefox", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    //p._mode = 'firefox';
	    p.other = p.opera = p.opera10 = p.chrome = function() { equals(1, 0, 'must not call run for any mode other than "firefox"'); };
	    p.firefox = function() { equals(1, 1, 'called run for "firefox"'); };
	    p.run({stack: 'f1(1,"abc")@file.js:40\n()@file.js:41\n@:0  \nf44()@file.js:494'});
	});

	test("run opera", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    //p._mode = 'opera';
	    p.opera10 = p.other = p.firefox = p.chrome = function() { equals(1, 0, 'must not call run for any mode other than "opera"'); };
	    p.opera = function() { equals(1, 1, 'called run for "opera"'); };
	    if (typeof window !== 'undefined' && !window.opera) { window.opera = "fake"; window.fakeOpera = true; }
	    p.run({message: 'ignored\nignored\nignored\nignored\nLine 40 of linked script http://site.com: in function f1\n      discarded()\nLine 44 of linked script http://site.com\n     f1(1, "abc")\nignored\nignored'});
	    if (window.fakeOpera) { delete window.opera; delete window.fakeOpera; }
	});

	test("run opera10", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    //p._mode = 'opera10';
	    p.opera = p.other = p.firefox = p.chrome = function() { equals(1, 0, 'must not be called'); };
	    p.opera10 = function() { equals(1, 1, 'called run for "opera10"'); };
	    if (typeof window !== 'undefined' && !window.opera) { window.opera = "fake"; window.fakeOpera = true; }
	    p.run({stack: 'ignored\nf1([arguments not available])@http://site.com/main.js:2\n<anonymous function: f2>([arguments not available])@http://site.com/main.js:4\n@',
		stacktrace: 'ignored\nError thrown at line 129, column 5 in <anonymous function>():\nignored\nError thrown at line 129, column 5 in <anonymous function>():\nignored\nError thrown at line 124, column 4 in <anonymous function>():\nignored\nError thrown at line 594, column 2 in process():\nignored\nError thrown at line 124, column 4 in <anonymous function>():\nignored\nError thrown at line 1, column 55 in discarded():\n    this.undef();\ncalled from line 1, column 333 in f1(arg1, arg2):\n   discarded();\ncalled from line 1, column 470 in <anonymous function>():\n   f1(1, "abc");\ncalled from line 1, column 278 in program code:\n   f2();' });
	    if (window.fakeOpera) { delete window.opera; delete window.fakeOpera; }
	});

	test("run other", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    //p._mode = 'other';
	    p.opera = p.opera10 = p.firefox = p.chrome = function() { equals(1,0,'must not be called'); };
	    p.other = function() { equals(1, 1, 'called run for other browser'); };
	    p.run({});
	});

	test("function instrumentation", function() {
	    expect(4);
	    this.toInstrument = function() { equals(1, 1, 'called instrumented function'); }
	    this.callback = function(stacktrace) { ok(typeof stacktrace !== 'undefined', 'called callback'); }
	    printStackTrace.implementation.prototype.instrumentFunction(this, 'toInstrument', this.callback);
	    ok(this.toInstrument._instrumented, 'function instrumented');
	    this.toInstrument();
	    printStackTrace.implementation.prototype.deinstrumentFunction(this, 'toInstrument');
	    ok(!this.toInstrument._instrumented, 'function deinstrumented');
	    this.toInstrument = this.callback = null;
	});

	test("firefox", function() {
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createErrorWithNoChromeArguments());
	    var e = [];
	    e.push({stack: 'f1(1,"abc")@file.js:40\n()@file.js:41\n@:0  \nf44()@file.js:494'});
	    if(mode == 'firefox') {
	        function f1(arg1, arg2) {
	            try {this.undef();} catch (exception) {
	                e.push(exception);
	            }
	        }
	        var f2 = function() {
	            f1(1, "abc");
	        };
	        f2();
	    }
	    expect(3 * e.length);
	    for(var i = 0; i < e.length; i++) {
	        var stack = printStackTrace.implementation.prototype.firefox(e[i]);
	        //equals(stack.join("\n"), '', 'debug');
	        equals(stack[0].indexOf('f1(1,"abc")') >= 0, true, 'f1');
	        equals(stack[1].indexOf('{anonymous}()@') >= 0, true, 'f2 anonymous');
	        equals(stack[2].indexOf('@:0'), -1, '@:0 discarded');
	    }
	});

	test("chrome", function() {
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
	    var e = [];
	    e.push({ stack: 'ignored\n at f0 (file.js:132:3)\n at file.js:135:3\n at f1 (file.js:132:13)\n at file.js:135:23\n at Object.<anonymous> (file.js:137:9)\n at file.js:137:32 at process (file.js:594:22)'});
	    if(mode == 'chrome') {
	        function f0() {
	            try {this.undef();} catch (exception) {
	                e.push(exception);
	            }
	        }
	        function f1(arg1, arg2) {
	            f0();
	        }
	        var f2 = function() {
	            f1(1, "abc");
	        };
	        f2();
	    }
	    expect(4 * e.length);
	    for(var i = 0; i < e.length; i++) {
	        var message = printStackTrace.implementation.prototype.chrome(e[i]);
	        //equals(message.join("\n"), '', 'debug');
	        equals(message[0].indexOf('f0') >= 0, true, 'f0 is top of stack');
	        equals(message[1].indexOf('f1') >= 0, true, 'f1 is second called function');
	        equals(message[2].indexOf('anonymous') >= 0, true, 'f2 anonymous function called');
	        equals(message[3].indexOf('unknown source'), -1, 'unknown source discarded');
	    }
	});

	test("opera10", function() {
		var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
		var e = [];
		e.push({ stack: 'ignored\nf1([arguments not available])@http://site.com/main.js:2\n<anonymous function: f2>([arguments not available])@http://site.com/main.js:4\n@',
		 	stacktrace: 'ignored\nError thrown at line 129, column 5 in <anonymous function>():\nignored\nError thrown at line 129, column 5 in <anonymous function>():\nignored\nError thrown at line 124, column 4 in <anonymous function>():\nignored\nError thrown at line 594, column 2 in process():\nignored\nError thrown at line 124, column 4 in <anonymous function>():\nignored\nError thrown at line 1, column 55 in discarded():\n    this.undef();\ncalled from line 1, column 333 in f1(arg1, arg2):\n   discarded();\ncalled from line 1, column 470 in <anonymous function>():\n   f1(1, "abc");\ncalled from line 1, column 278 in program code:\n   f2();' });
		if (mode == 'opera10') {
	        function discarded() {
	            try {this.undef();} catch (exception) {
	                e.push(exception);
	            }
	        }
	        function f1(arg1, arg2) {
				var blah = arg1;
	            discarded();
	        }
	        var f2 = function() {
	            f1(1, "abc");
	        };
	        f2();
		}
	    expect(3 * e.length);
	    for(var i = 0; i < e.length; i++) {
	        var stack = printStackTrace.implementation.prototype.opera10(e[i]);
			var stack_string = stack.join('\n');
			//equals(stack_string, '', 'debug');
	        equals(stack_string.indexOf('ignored'), -1, 'ignored');
	        equals(stack[5].indexOf('f1(') >= 0, true, 'f1 function name');
	        equals(stack[6].indexOf('{anonymous}()') >= 0, true, 'f2 is anonymous');
			//FIXME: Clean up stack[2], opera has some internal stack weirdness
	    }
	});

	test("opera", function() {
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
	    var e = [];
	    e.push({ message: 'ignored\nignored\nignored\nignored\nLine 40 of linked script http://site.com: in function f1\n      discarded()\nLine 44 of linked script http://site.com\n     f1(1, "abc")\nignored\nignored'});
	    if(mode == 'opera') {
	        function discarded() {
	            try {this.undef();} catch (exception) {
	                e.push(exception);
	            }
	        }
	        function f1(arg1, arg2) {
	            discarded();
	        }
	        var f2 = function() {
	            f1(1, "abc");
	        };
	        f2();
	    }
	    expect(5 * e.length);
	    for(var i = 0; i < e.length; i++) {
	        var message = printStackTrace.implementation.prototype.opera(e[i]);
	        var message_string = message.join("\n");
	        equals(message_string.indexOf('ignored'), -1, 'ignored');
	        equals(message[0].indexOf('f1()') >= 0, true, 'f1 function name');
	        equals(message[0].indexOf('discarded()') >= 0, true, 'f1 statement');
	        equals(message[1].indexOf('{anonymous}()@') >= 0, true, 'f2 is anonymous');
	        equals(message[1].indexOf('f1(1, "abc")') >= 0, true, 'f2 statement');
	    }
	});

	test("other", function() {
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
	    var frame = function(args, fun, caller) {
	        this['arguments'] = args;
	        this.caller = caller;
	        this.fun = fun;
	    };
	    frame.prototype.toString = function() { return 'function '+this.fun+'() {}'; };
	    function f10() {}
	    var frame_f2 = new frame([], '', undefined);
	    var frame_f1 = new frame([1, 'abc', f10, {1: {2: {3: 4} } }], 'FUNCTION f1  (a,b,c)', frame_f2);
	    expect(mode == 'other' ? 4 : 2);
	    var message = printStackTrace.implementation.prototype.other(frame_f1);
	    var message_string = message.join("\n");
	    equals(message[0].indexOf('f1(1,"abc",#function,#object)') >= 0, true, 'f1');
	    equals(message[1].indexOf('{anonymous}()') >= 0, true, 'f2 anonymous');
	    if(mode == 'other') {
	        function f1(arg1, arg2) {
	            var message = printStackTrace.implementation.prototype.other(arguments.callee);
	            var message_string = message.join("\n");
	            //equals(message_string, '', 'debug');
	            equals(message[0].indexOf('f1(1,"abc",#function,#object)') >= 0, true, 'f1');
	            equals(message[1].indexOf('{anonymous}()') >= 0, true, 'f2 anonymous');
	        }
	        var f2 = function() {
	            f1(1, 'abc', f10, {1: {2: {3: 4} } });
	        };
	        f2();
	    }
	});

	module("util");

	test("recursion other", function() {
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
	    expect(mode == 'other' ? 2 : 0);
	    if (mode == 'other') {
		    function recurse(b) {
			    if (!b) {
			    var message = printStackTrace.implementation.prototype.other(arguments.callee);
			    var message_string = message.join("\n");
			    //alert((arguments.callee + "").replace(/{[\s\S]*/, "") + "\n" +
				//(arguments.callee.caller + "").replace(/{[\s\S]*/, "") + "\n" +
				//(arguments.callee.caller.caller + "").replace(/{[\s\S]*/, "") + "\n" +
				//message_string);
		            //equals(message_string, '', 'debug');
				    equals(message[0].indexOf('recurse(false)') >= 0, true, 'first recurse false');
				    equals(message[1].indexOf('recurse(true)') >= 0, true, 'second recurse true');
			    } else {
				    recurse(true);
			    }
		    }
		    recurse(false);
	    }
	});

	test("stringify", function() {
	    expect(5);
	    equals(printStackTrace.implementation.prototype.stringifyArguments(["a", 1, {}, function() {}, undefined]), '"a",1,#object,#function,undefined');
	    equals(printStackTrace.implementation.prototype.stringifyArguments([0, 1, 2, 3]), '0,1,2,3');
	    equals(printStackTrace.implementation.prototype.stringifyArguments([['a', null]]), '["a",null]');
	    equals(printStackTrace.implementation.prototype.stringifyArguments([[2, 4, 6, 8, 10, 12, 14]]), '[2...14]');
	    equals(printStackTrace.implementation.prototype.stringifyArguments([]), '');
	});

	test("isSameDomain", function() {
		expect(1);
		ok(printStackTrace.implementation.prototype.isSameDomain(location.href));
	});

	test("guessFunctionNameFromLines", function() {
	    expect(3);
	    equals(printStackTrace.implementation.prototype.guessFunctionNameFromLines(2, ['var a = function() {', 'var b = 2;', '};']), 'a');
	    equals(printStackTrace.implementation.prototype.guessFunctionNameFromLines(2, ['function a() {', 'var b = 2;', '};']), 'a');
	    equals(printStackTrace.implementation.prototype.guessFunctionNameFromLines(2, ['var a = 1;', 'var b = 2;', 'var c = 3;']), '(?)');
	});

	test("getSource cache miss", function() {
	    expect(3);
	    var p = new printStackTrace.implementation();
	    var file = 'file:///test';
	    p.ajax = function(fileArg, callback) {
	        equals(fileArg, file, 'cache miss');
	        return 'line0\nline1\n';
	    };
	    var lines = p.getSource(file);
	    equals(lines[0], 'line0');
	    equals(lines[1], 'line1');
	});

	test("getSource cache hit", function() {
	    expect(2);
	    var p = new printStackTrace.implementation();
	    var file = 'file:///test';
	    p.ajax = function(fileArg, callback) {
	        ok(false, 'not called');
	    };
	    p.sourceCache[file] = ['line0', 'line1'];
	    var lines = p.getSource(file);
	    equals(lines[0], 'line0');
	    equals(lines[1], 'line1');
	});

	test("sync ajax", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    var data = p.ajax(document.location.href);
	    ok(data.indexOf('stacktrace') >= 0, 'synchronous get');
	});

	test("guessFunctionName", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    var file = 'http://' + window.location.hostname + '/file.js';
	    p.sourceCache[file] = ['var a = function() {', 'var b = 2;', '};'];
	    equals(p.guessFunctionName(file, 2), 'a');
	});

	test("guessFunctionName exception", function() {
	    expect(1);
	    var p = new printStackTrace.implementation();
	    p.getSource = function() {
	        throw 'permission denied';
	    };
	    var file = 'file:///test';
	    equals(p.guessFunctionName(file, 2), 'getSource failed with url: file:///test, exception: permission denied');
	});

	test("guessFunctions firefox", function() {
	    var results = [];
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createErrorWithNoChromeArguments());
	    var p = new printStackTrace.implementation();
	    p._mode = 'firefox';
	    var file = 'http://' + window.location.hostname + '/file.js';
	    p.sourceCache[file] = ['var f2 = function() {', 'var b = 2;', '};'];
	    results.push(['(?)()@'+file+':74','run()@'+file+':72','f2()@'+file+':1']);

	    if (mode == 'firefox') {
	        var f2 = function() {
	            try {
	                this.undef();
	            } catch(e) {
	                results.push(p.run());
	            }
	        };
	        f2();
	    }

	    expect(results.length * 1);
	    for (var i = 0; i < results.length; ++i) {
	        // equals(p.guessFunctions(results[i]), '', 'debug');
	        equals(p.guessFunctions(results[i])[2].substring(0, 2), 'f2', 'guessed f2 as 3rd result: ' + p.guessFunctions(results[i])[2]);
	        //equals(p.guessFunctions(results[i])[2].indexOf('f2'), 0, 'guessed f2 as 3rd result');
	    }
	});

	test("guessFunctions chrome", function() {
	    var results = [];
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
	    var p = new printStackTrace.implementation();
	    p._mode = 'chrome';
	    var file = 'http://' + window.location.hostname + '/file.js';
	    p.sourceCache[file] = ['var f2 = function() {', 'var b = 2;', '};'];
	    results.push(['run() ('+file+':1:1)', 'f2() ('+file+':1:1)']);

	    if (mode == 'chrome') {
	        var f2 = function() {
	            try {
	                this.undef();
	            } catch(e) {
	                results.push(p.run());
	            }
	        };
	        f2();
	    }

	    expect(results.length);
	    for (var i = 0; i < results.length; ++i) {
	        // equals((results[i]), '', 'debug');
	        equals(p.guessFunctions(results[i])[1].indexOf('f2()'), 0, 'f2');
	    }
	});

	test("guessFunctions opera", function() {
		var results = [];
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
		var p = new printStackTrace.implementation();
		p._mode = 'opera';
		var file = 'http://' + window.location.hostname + '/file.js';
		p.sourceCache[file] = ['var f2 = function() {', 'var b = 2;', '};'];
		results.push(['f2()@'+file+':2 -- code']);

		if (mode == 'opera') {
		    var f2 = function() {
		        try {
		            this.undef();
		        } catch(e) {
		            results.push(p.run());
		        }
		    };
		    f2();
		}

		expect(results.length * 1);
		for (var i = 0; i < results.length; ++i) {
			// equals(p.guessFunctions(results[i]), '', 'debug');
		    equals(p.guessFunctions(results[i])[0].indexOf('f2'), 0, 'f2');
		}
	});

	test("guessFunctions other", function() {
	    var results = [];
	    var mode = printStackTrace.implementation.prototype.mode(UnitTest.fn.createGenericError());
	    var p = new printStackTrace.implementation();
	    p._mode = 'other';
	    var file = 'http://' + window.location.hostname + '/file.js';
	    p.sourceCache[file] = ['var f2 = function() {', 'var b = 2;', '};'];
	    results.push(['{anonymous}()']);

	    if (mode == 'other') {
	        var f2 = function() {
	            try { this.undef(); } catch(e) {
	                results.push(p.run());
	            }
	        };
	        f2();
	    }

	    expect(1 * results.length);
	    for (var i = 0; i < results.length; ++i) {
	        //equals((results[i]), '', 'debug');
	        equals(p.guessFunctions(results[i])[0].indexOf('{anonymous}'), 0, 'no file and line number on other');
	    }
	});
})(window, document);