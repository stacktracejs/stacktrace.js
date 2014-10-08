/* global StackFrame: false, ErrorStackParser: false */
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
    if (typeof define === 'function' && define.amd) {
        define(['error-stack-parser', 'stack-generator'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('error-stack-parser'), require('stack-generator'));
    } else {
        root.StackTrace = factory(root.ErrorStackParser, root.StackGenerator);
    }
}(this, function (ErrorStackParser, StackGenerator) {
    // { filter: fnRef
    //   sourceMap: ???
    //   cors: ???
    //   enhancedFunctionNames: true
    //   enhancedSourceLocations: true
    //   formatter: fnRef
    // }

    // Do not process or try to enhance filtered StackFrames
    // new StackTrace()
    //      .withEnhancedFunctionNames()
    //      .withEnhancedSourceLocations()
    //      .withFilter(fn)
    //      .withMaxStackSize(10)
    //      .withFormatter(fn)
    //      .instrument(fn)
    //      .get(opts) => Array[StackFrame]

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
        return (eval("var __temp = null"), (typeof __temp === "undefined"));
    }

    return function StackTrace() {
        // TODO: utils to facilitate automatic bug reporting

        this.options = {};

        /**
         * Get a backtrace from invocation point.
         * @param opts Options Object
         * @return Array[StackFrame]
         */
        this.get = function (opts) {
            try {
                throw new Error("From StackTrace.get()");
            } catch (e) {
                if (e['stack'] || e['opera#sourceloc']) {
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

            var stackframes = new ErrorStackParser().parse(error); //ErrorStackParser.parse(error)
            if (typeof opts.filter === 'function') {
                // TODO: stackframes = stackframes.filter(opts.filter);
            }
            // TODO: apply enhancements here
            if (typeof opts.formatter === 'function') {
                // TODO: stackframes = stackframes.map(opts.formatter);
            }

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

        this.withFilter = function withFilter(fn) {
            if (typeof fn !== 'function') {
                throw new TypeError('Can only apply filter with a function')
            }
            this.options.filter = fn;
            return this;
        };

        this.withFormatter = function withFormatter(fn) {
            this.options.formatter = fn;
            return this;
        };
    }
}));

