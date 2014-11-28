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
}(this, function StackTrace(ErrorStackParser, StackGenerator, StackTraceGPS, RSVP) {
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
                return (stackframe.fileName || '').indexOf('stacktrace.') === -1;
            }
        };

        /**
         * Get a backtrace from invocation point.
         * @param opts Options Object
         * @return Array[StackFrame]
         */
        this.get = function (opts) {
            try {
                throw new Error('From StackTrace.get()');
            } catch (e) {
                if (e.stack || e['opera#sourceloc']) {
                    return this.fromError(e, _merge(this.options, opts));
                } else {
                    return this.generateArtificially(_merge(this.options, opts));
                }
            }
        };

        /**
         * Given an error object, parse it.
         * @param error Error object
         * @param opts Object for options
         * @return Array[StackFrame]
         */
        this.fromError = function fromError(error, opts) {
            opts = _merge(this.options, opts);
            return new Promise(function (resolve) {
                var stackframes = ErrorStackParser.parse(error);
                if (typeof opts.filter === 'function') {
                    stackframes = stackframes.filter(opts.filter);
                }

                resolve(Promise.all(stackframes.map(this.getMappedLocation)));
            }.bind(this));
        };

        this.getMappedLocation = function getMappedLocation(stackframe) {
            return new Promise(function(resolve) {
                new StackTraceGPS().getMappedLocation(stackframe)
                    .then(function (loc) {
                        resolve(new StackFrame(loc.name, stackframe.args, loc.source, loc.line, loc.column));
                    })['catch'](function() {
                        resolve(stackframe);
                    });
            });
        };

        /**
         * Use StackGenerator to generate a backtrace.
         * @param opts Object options
         * @returns Array[StackFrame]
         */
        this.generateArtificially = function generateArtificially(opts) {
            return StackGenerator.backtrace(opts);
        };
    };
}));

