// Type definitions for stacktrace.js v2.0
// Project: https://github.com/stacktracejs/stacktrace.js
// Definitions by: Eric Wendelin <https://github.com/exceptionless>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
import StackFrame from "stackframe";

declare namespace StackTrace {

    export interface SourceCache {
        [key: string]: string | Promise<string>;
    }

    export interface StackTraceOptions {
        filter?: (stackFrame: StackFrame) => boolean;
        sourceCache?: SourceCache;
        offline?: boolean;
    }

    /**
     * Get a backtrace from invocation point.
     *
     * @param options Options Object
     * @return Array[StackFrame]
     */
    export function get(options?: StackTraceOptions): Promise<StackFrame[]>;

    /**
     * Get a backtrace from invocation point, synchronously. Does not
     * attempt to map sources.
     *
     * @param options Options Object
     * @return Array[StackFrame]
     */
    export function getSync(options?: StackTraceOptions): StackFrame[];

    /**
     * Given an error object, parse it.
     *
     * @param error Error object
     * @param options Object for options
     * @return Array[StackFrame]
     */
    export function fromError(error: Error, options?: StackTraceOptions): Promise<StackFrame[]>;

    /**
     * Use StackGenerator to generate a backtrace.
     * @param options Object options
     * @returns Array[StackFrame]
     */
    export function generateArtificially(options?: StackTraceOptions): Promise<StackFrame[]>;

    /**
     * Given a function, wrap it such that invocations trigger a callback that
     * is called with a stack trace.
     *
     * @param {Function} fn to be instrumented
     * @param {Function} callback function to call with a stack trace on invocation
     * @param {Function} errback optional function to call with error if unable to get stack trace.
     * @param {Object} thisArg optional context object (e.g. window)
     */
    export function instrument<TFunc extends Function>(fn: TFunc, callback: (stackFrames: StackFrame[]) => void, errback?: (error: Error) => void, thisArg?: any): TFunc;

    /**
     * Given a function that has been instrumented,
     * revert the function to it's original (non-instrumented) state.
     *
     * @param fn {Function}
     */
    export function deinstrument<TFunc extends Function>(fn: TFunc): TFunc;

    /**
     * Given an Array of StackFrames, serialize and POST to given URL.
     *
     * @param stackframes - Array[StackFrame]
     * @param url - URL as String
     * @param errorMsg - Error message as String
     * @param requestOptions - Object with headers information
     * @return Promise<any>
     */
    export function report(stackframes: StackFrame[], url: string, errorMsg?: string, requestOptions?: object): Promise<any>;
}

declare module "stacktrace-js" {
    export = StackTrace;
}
