// jscs:disable maximumLineLength
/* global Errors: false */
describe('StackTrace', function() {

    beforeEach(function() {
        if (typeof Promise === 'undefined') {
            ES6Promise.polyfill();
        }
    });

    describe('#get', function() {
        it('gets stacktrace from current location', function testStackTraceGet(done) {
            StackTrace.get().then(callback, done.fail)['catch'](done.fail);

            function callback(stackFrames) {
                expect(stackFrames[0].functionName).toMatch(/.*testStackTraceGet$/);
                done();
            }
        });
    });

    describe('#getSync', function() {
        it('gets stacktrace from current location', function testStackTraceGetSync() {
            var stackframes = StackTrace.getSync();
            expect(stackframes[0].functionName).toMatch(/.*testStackTraceGetSync/);
        });

        it('does not filter if filter is explictly disabled', function() {
            var stackframes = StackTrace.getSync({filter: null});
            expect(stackframes[0].functionName).toMatch(/(StackGenerator\$\$backtrace|StackTrace\$\$GenerateError)/);
        });
    });

    describe('#fromError', function() {
        beforeEach(function() {
            jasmine.Ajax.install();
        });
        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('rejects with Error given unparsable Error object', function(done) {
            StackTrace.fromError({message: 'ERROR_MESSAGE'})
                .then(done.fail)['catch'](done);
        });

        it('parses stacktrace from given Error object', function(done) {
            jasmine.Ajax.stubRequest('http://path/to/file.js').andError();

            StackTrace.fromError(Errors.IE_11)
                .then(callback, done.fail)['catch'](done.fail);

            function callback(stackFrames) {
                expect(stackFrames.length).toEqual(3);
                expect(stackFrames[0].fileName).toEqual('http://path/to/file.js');
                done();
            }
        });

        it('filters returned stack', function(done) {
            function onlyFoos(stackFrame) {
                return stackFrame.functionName === 'foo';
            }

            jasmine.Ajax.stubRequest('http://path/to/file.js').andError();

            StackTrace.fromError(Errors.IE_11, {filter: onlyFoos})
                .then(callback, done.fail)['catch'](done.fail);

            function callback(stackFrames) {
                expect(stackFrames.length).toEqual(1);
                expect(stackFrames[0].fileName).toEqual('http://path/to/file.js');
                expect(stackFrames[0].functionName).toEqual('foo');
                done();
            }
        });

        it('uses source maps to enhance stack frames', function(done) {
            var sourceCache = {
                'http://path/to/file.js': 'function increment(){\nsomeVariable+=2;\nnull.x()\n}\nvar someVariable=2;increment();',
                'http://path/to/file.min.js': 'function increment(){someVariable+=2;null.x()}var someVariable=2;increment();\n//# sourceMappingURL=file.min.js.map',
                'http://path/to/file.min.js.map': '{"version":3,"file":"file.min.js","sources":["file.js"],"names":["increment","someVariable","x"],"mappings":"AAAA,QAASA,aACLC,cAAgB,CAChB,MAAKC,IAET,GAAID,cAAe,CACnBD"}'
            };

            var stack = 'TypeError: Cannot read property \'x\' of null\n   at increment (http://path/to/file.min.js:1:38)';
            StackTrace.fromError({stack: stack}, {offline: true, sourceCache: sourceCache})
                .then(callback, done.fail)['catch'](done.fail);

            function callback(stackFrames) {
                expect(stackFrames.length).toEqual(1);
                expect(stackFrames[0]).toMatchStackFrame(['increment', undefined, 'http://path/to/file.js', 3, 4]);
                done();
            }
        });
    });

    describe('#generateArtificially', function() {
        it('gets stacktrace from current location', function(done) {
            var stackFrameFilter = function(stackFrame) {
                return stackFrame.getFunctionName() &&
                    stackFrame.getFunctionName().indexOf('testGenerateArtificially') > -1;
            };

            (function testGenerateArtificially() {
                StackTrace.generateArtificially({filter: stackFrameFilter})
                    .then(callback, done.fail)['catch'](done.fail);
            })();

            function callback(stackFrames) {
                expect(stackFrames[0]).toMatchStackFrame(['testGenerateArtificially', []]);
                done();
            }
        });
    });

    describe('#instrument', function() {
        it('throws Error given non-function input', function() {
            expect(function() {
                StackTrace.instrument('BOGUS');
            })
                .toThrow(new Error('Cannot instrument non-function object'));
        });

        it('wraps given function and calls given callback when called', function(done) {
            function interestingFn() {
                return 'something';
            }

            var wrapped = StackTrace.instrument(interestingFn, callback, done.fail);
            expect(wrapped()).toBe('something');

            function callback(stackFrames) {
                if (stackFrames[0].fileName) { // Work around IE9-
                    expect(stackFrames[0].fileName).toMatch('stacktrace-spec.js');
                }
                done();
            }
        });

        it('calls callback with stack trace when wrapped function throws an Error', function(done) {
            function interestingFn() {
                throw new Error('BOOM');
            }

            var wrapped = StackTrace.instrument(interestingFn, callback, done.fail);

            // Exception should be re-thrown from instrument
            expect(function() {
                wrapped();
            }).toThrow(new Error('BOOM'));

            function callback(stackFrames) {
                if (stackFrames[0].fileName) { // Work around IE9-
                    expect(stackFrames[0].fileName).toMatch('stacktrace-spec.js');
                }
                done();
            }
        });

        it('does not re-instrument already instrumented function', function() {
            function interestingFn() {
                return 'something';
            }

            var wrapped = StackTrace.instrument(interestingFn);
            expect(StackTrace.instrument(wrapped)).toEqual(wrapped);
        });
    });

    describe('#deinstrument', function() {
        it('throws Error given non-function input', function() {
            expect(function() {
                StackTrace.deinstrument('BOGUS');
            }).toThrow(new Error('Cannot de-instrument non-function object'));
        });

        it('given unwrapped input, returns input', function() {
            function interestingFn() {
                return 'something';
            }

            expect(StackTrace.deinstrument(interestingFn)).toEqual(interestingFn);
        });

        it('de-instruments instrumented function', function() {
            function interestingFn() {
                return 'something';
            }

            var wrapped = StackTrace.instrument(interestingFn);
            expect(wrapped.__stacktraceOriginalFn).toEqual(interestingFn);

            var unwrapped = StackTrace.deinstrument(wrapped);
            expect(unwrapped.__stacktraceOriginalFn).toBeUndefined();
            expect(unwrapped).toEqual(interestingFn);
        });
    });

    describe('#report', function() {
        beforeEach(function() {
            jasmine.Ajax.install();
        });
        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('sends POST request to given URL with a message', function(done) {
            var url = 'http://domain.ext/endpoint';
            var errorMsg = 'BOOM';
            var stackframes = [new StackFrame('fn', undefined, 'file.js', 32, 1)];

            StackTrace.report(stackframes, url, errorMsg).then(callback, done.fail)['catch'](done.fail);

            var postRequest = jasmine.Ajax.requests.mostRecent();
            postRequest.respondWith({status: 201, contentType: 'text/plain', responseText: 'OK'});

            function callback() {
                expect(postRequest.data()).toEqual({message: errorMsg, stack: stackframes});
                expect(postRequest.method).toBe('post');
                expect(postRequest.url).toBe(url);
                done();
            }
        });

        it('sends POST request to given URL without a message', function(done) {
            var url = 'http://domain.ext/endpoint';
            var stackframes = [new StackFrame('fn', undefined, 'file.js', 32, 1)];

            StackTrace.report(stackframes, url).then(callback, done.fail)['catch'](done.fail);

            var postRequest = jasmine.Ajax.requests.mostRecent();
            postRequest.respondWith({status: 201, contentType: 'text/plain', responseText: 'OK'});

            function callback() {
                expect(postRequest.data()).toEqual({stack: stackframes});
                expect(postRequest.method).toBe('post');
                expect(postRequest.url).toBe(url);
                done();
            }
        });

        it('rejects if POST request fails', function(done) {
            var url = 'http://domain.ext/endpoint';
            var stackframes = [new StackFrame('fn', undefined, 'file.js', 32, 1)];

            jasmine.Ajax.stubRequest(url).andError();
            StackTrace.report(stackframes, url).then(done.fail, done)['catch'](done);
        });
    });
});
