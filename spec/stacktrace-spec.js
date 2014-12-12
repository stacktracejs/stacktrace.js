describe('StackTrace', function () {
    var callback;
    var debugCallback;
    var errback;
    var debugErrback;

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
        errback = jasmine.createSpy('errback');
        debugCallback = function (stackframes) {
            console.log(stackframes);
        };
        debugErrback = function (e) {
            console.log(e.message);
            console.log(e.stack);
        };
    });

    describe('#constructor', function () {
        it('should allow empty arguments', function () {
            expect(function () {
                new StackTrace(); // jshint ignore:line
            }).not.toThrow();
        });
    });

    describe('#get', function () {
        it('gets stacktrace from current location', function () {
            runs(function testStackTraceGet() {
                new StackTrace().get().then(callback, errback)['catch'](debugErrback);
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0][0].functionName).toEqual('testStackTraceGet');
                expect(errback).not.toHaveBeenCalled();
            });
        });
    });

    describe('#fromError', function () {
        it('rejects with Error given non-Error object', function () {
            runs(function () {
                new StackTrace().fromError('BOGUS')
                    .then(callback, errback)['catch'](errback);
            });
            waits(100);
            runs(function () {
                expect(callback).not.toHaveBeenCalled();
                expect(errback).toHaveBeenCalled();
            });
        });

        it('parses stacktrace from given Error object', function () {
            //FIXME: shims for IE9
            runs(function () {
                try {
                    throw new Error('Yikes!');
                } catch (e) {
                    new StackTrace().fromError(e)
                        .then(callback, errback)['catch'](errback);
                }
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(errback).not.toHaveBeenCalled();
            });
        });

        it('totally extracts function names', function () {
            //FIXME: shims for IE9
            //FIXME: need function name for opera 12
            var TEST_FUNCTION = function TEST_FUNCTION() {
                try {
                    throw new Error('Yikes!');
                } catch (e) {
                    function onlySpecSourcesPlease(stackFrame) {
                        return (stackFrame.fileName || '').indexOf('stacktrace-spec.js') !== -1;
                    }

                    new StackTrace().fromError(e, {filter: onlySpecSourcesPlease})
                        .then(callback, errback)['catch'](errback);
                }
            };
            runs(TEST_FUNCTION);
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                var stackFrames = callback.mostRecentCall.args[0];
                expect(stackFrames.length).toEqual(1);
                expect(stackFrames[0].fileName).toMatch(/stacktrace\-spec\.js\b/);
                expect(stackFrames[0].functionName).toEqual('TEST_FUNCTION');
                expect(errback).not.toHaveBeenCalled();
            });
        });

        xit('uses source maps to enhance stack frames', function () {

        });
    });

    describe('#getMappedLocation', function () {
        var server;
        beforeEach(function () {
            server = sinon.fakeServer.create();
        });
        afterEach(function () {
            server.restore();
        });

        it('defaults to given stackframe if source map location not found', function () {
            runs(function () {
                var stackframe = new StackFrame(undefined, [], 'http://localhost:9999/test.min.js', 1, 32);
                new StackTrace().getMappedLocation(stackframe).then(callback, errback)['catch'](debugErrback);
                server.requests[0].respond(404, {}, '');
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0]).toMatchStackFrame([undefined, [], 'http://localhost:9999/test.min.js', 1, 32]);
                expect(errback).not.toHaveBeenCalled();
            });
        });

        it('uses source maps to enhance stack frames', function () {
            runs(function () {
                var stackframe = new StackFrame(undefined, [], 'http://localhost:9999/test.min.js', 1, 32);
                new StackTrace().getMappedLocation(stackframe).then(callback, errback)['catch'](debugErrback);
                var source = 'var foo=function(){};function bar(){}var baz=eval("XXX");\n//@ sourceMappingURL=test.js.map';
                server.requests[0].respond(200, {'Content-Type': 'application/x-javascript'}, source);
            });
            waits(100);
            runs(function () {
                var sourceMap = '{"version":3,"sources":["./test.js"],"names":["foo","bar","baz","eval"],"mappings":"AAAA,GAAIA,KAAM,YACV,SAASC,QACT,GAAIC,KAAMC,KAAK","file":"test.min.js"}';
                server.requests[1].respond(200, {'Content-Type': 'application/json'}, sourceMap);
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0]).toMatchStackFrame(['bar', [], './test.js', 2, 9]);
                expect(errback).not.toHaveBeenCalled();
            });
        });
    });

    describe('#generateArtificially', function () {
        it('gets stacktrace from current location', function () {
            runs(function testGenerateArtificially() {
                var stackFrameFilter = function (stackFrame) {
                    return stackFrame.getFunctionName() &&
                        stackFrame.getFunctionName().indexOf('testGenerateArtificially') > -1;
                };
                new StackTrace().generateArtificially({filter: stackFrameFilter})
                    .then(callback, errback)['catch'](debugErrback);
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0][0]).toMatchStackFrame(['testGenerateArtificially', []]);
                expect(errback).not.toHaveBeenCalled();
            });
        });
    });
});
