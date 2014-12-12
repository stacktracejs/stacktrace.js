(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
    if (typeof define === 'function' && define.amd) {
        define(['error-stack-parser', 'stack-generator', 'stacktrace-gps', 'es6-promise'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('error-stack-parser'), require('stack-generator'), require('stacktrace-gps'), require('es6-promise'));
    } else {
        root.StackTrace = factory(root.ErrorStackParser, root.StackGenerator, root.StackTraceGPS, root.ES6Promise);
    }
}(this, function StackTrace(ErrorStackParser, StackGenerator, StackTraceGPS, ES6Promise) {
    ES6Promise.polyfill();
    var Promise = ES6Promise.Promise;

    /**
     * Merge 2 given Objects. If a conflict occurs the second object wins.
     * Does not do deep merges.
     * @param first Object
     * @param second Object
     * @returns new Object merged first and second
     * @private
     */
    function _merge(first, second) {
        var target = {};

        [first, second].forEach(function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    target[prop] = obj[prop];
                }
            }
            return target;
        });

        return target;
    }

    return function StackTrace() {
        this.options = {
            filter: function (stackframe) {
                // Filter out stackframes for this library by default
                return (stackframe.functionName || '').indexOf('StackTrace$$') !== 0 &&
                    (stackframe.functionName || '').indexOf('ErrorStackParser$$') !== 0 &&
                    (stackframe.functionName || '').indexOf('StackTraceGPS$$') !== 0 &&
                    (stackframe.functionName || '').indexOf('StackGenerator$$') !== 0;
            }
        };

        /**
         * Get a backtrace from invocation point.
         * @param opts Options Object
         * @return Array[StackFrame]
         */
        this.get = function StackTrace$$get(opts) {
            var err = new Error();
            if (err.stack || err['opera#sourceloc']) {
                return this.fromError(err, opts);
            } else {
                return this.generateArtificially(opts);
            }
        };

        /**
         * Given an error object, parse it.
         * @param error Error object
         * @param opts Object for options
         * @return Array[StackFrame]
         */
        this.fromError = function StackTrace$$fromError(error, opts) {
            opts = _merge(this.options, opts);
            return new Promise(function (resolve) {
                var stackframes = ErrorStackParser.parse(error);
                if (typeof opts.filter === 'function') {
                    stackframes = stackframes.filter(opts.filter);
                }
                resolve(Promise.all(stackframes.map(this.getMappedLocation)));
            }.bind(this));
        };

        this.getMappedLocation = function StackTrace$$getMappedLocation(stackframe) {
            return new Promise(function (resolve) {
                // TODO: pass along pre-cache
                new StackTraceGPS().getMappedLocation(stackframe)
                    .then(function onResolved(loc) {
                        resolve(new StackFrame(loc.name, stackframe.args, loc.source, loc.line, loc.column));
                    })['catch'](function onError() {
                    resolve(stackframe);
                });
            });
        };

        /**
         * Use StackGenerator to generate a backtrace.
         * @param opts Object options
         * @returns Array[StackFrame]
         */
        this.generateArtificially = function StackTrace$$generateArtificially(opts) {
            opts = _merge(this.options, opts);
            var stackFrames = StackGenerator.backtrace(opts);
            if (typeof opts.filter === 'function') {
                stackFrames = stackFrames.filter(opts.filter);
            }
            return Promise.resolve(stackFrames);
        };
    };
}));

