/* global StackFrame: false, ErrorStackParser: false */
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
    if (typeof define === 'function' && define.amd) {
        define(['error-stack-parser', 'stack-generator', 'stacktrace-gps'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('error-stack-parser'), require('stack-generator'), require('stacktrace-gps'));
    } else {
        root.StackTrace = factory(root.ErrorStackParser, root.StackGenerator, root.StackTraceGPS);
    }
}(this, function (ErrorStackParser, StackGenerator, StackTraceGPS) {
    // { filter: fnRef
    //   sourceMap: ???
    //   cors: ???
    //   enhancedFunctionNames: true
    //   enhancedSourceLocations: true
    //   formatter: fnRef
    // }

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
        var prop;

        [first, second].forEach(function (obj) {
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    target[prop] = obj[prop];
                }
            }
            return target;
        });

        return target;
    }

    /**
     * Return true if called from context within strict mode.
     * @private
     */
    function _isStrictMode() {
        return (eval("var __temp = null"), (typeof __temp === "undefined")); // jshint ignore:line
    }

    return function StackTrace() {
        // TODO: utils to facilitate automatic bug reporting
        this.gps = undefined;
        this.options = {};

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

            var stackframes = ErrorStackParser.parse(error);
            if (typeof opts.filter === 'function') {
                stackframes = stackframes.filter(opts.filter);
            }

            stackframes.map(function(sf) {
                if (typeof this.gps !== 'function') {
                    this.gps = new StackTraceGPS();
                }
                this.gps.findFunctionName(sf, function(name) {
                    sf.setFunctionName(name);
                    return sf;
                }, function(err) {
                    return sf;
                });
            }.bind(this));

            return stackframes;
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

