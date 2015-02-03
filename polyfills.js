// ES5 Polyfills
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(obj) {
        var args = slice.call(arguments, 1);
        var self = this;
        var F = function() {};
        var bounded = function() {
            return self.apply(
                this instanceof F ? this : (obj || {}),
                args.concat(slice.call(arguments))
            );
        };
        F.prototype = this.prototype || {};
        bounded.prototype = new F();
        return bounded;
    };
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        if (this === void 0 || this === null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        var T;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }

        var A = new Array(len);
        var k = 0;

        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }

        return A;
    };
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback/*, thisArg*/) {
        if (this === void 0 || this === null) {
            throw new TypeError('this is null or not defined');
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (callback.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this === null || this === undefined) {
            throw new TypeError(' this is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
