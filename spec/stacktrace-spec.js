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
            runs(function () {
                new StackTrace().get().then(callback, errback);
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0][0].fileName).toMatch(/stacktrace\-spec\.js\b/);
                expect(errback).not.toHaveBeenCalled();
            });
        });
    });

    describe('#fromError', function () {
        it('rejects with Error given non-Error object', function () {
            runs(function () {
                new StackTrace().fromError('BOGUS').then(callback, errback);
            });
            waits(100);
            runs(function () {
                expect(callback).not.toHaveBeenCalled();
                expect(errback).toHaveBeenCalled();
            });
        });

        it('parses stacktrace from given Error object', function () {
            runs(function () {
                try {
                    throw new Error('Yikes!');
                } catch (e) {
                    new StackTrace().fromError(e).then(callback, errback);
                }
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                expect(errback).not.toHaveBeenCalled();
            });
        });

        it('totally extracts function names', function () {
            var TEST_FUNCTION = function () {
                try {
                    throw new Error('Yikes!');
                } catch (e) {
                    function onlySpecSourcesPlease(stackFrame) {
                        return (stackFrame.fileName || '').indexOf('stacktrace-spec.js') !== -1;
                    }

                    new StackTrace().fromError(e, {filter: onlySpecSourcesPlease})
                        .then(callback, errback);
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

    describe('#getMappedLocation', function() {
        var server;
        beforeEach(function () {
            server = sinon.fakeServer.create();
        });
        afterEach(function () {
            server.restore();
        });

        it('defaults to given stackframe if source map location not found', function() {
            runs(function() {
                var stackframe = new StackFrame(undefined, [], 'http://localhost:9999/test.min.js', 1, 32);
                new StackTrace().getMappedLocation(stackframe).then(callback, errback);
                server.requests[0].respond(404, {}, '');
            });
            waits(100);
            runs(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0]).toMatchStackFrame([undefined, [], 'http://localhost:9999/test.min.js', 1, 32]);
                expect(errback).not.toHaveBeenCalled();
            });
        });

        it('uses source maps to enhance stack frames', function () {
            runs(function() {
                var stackframe = new StackFrame(undefined, [], 'http://localhost:9999/test.min.js', 1, 32);
                new StackTrace().getMappedLocation(stackframe).then(callback, errback);
                var source = 'var foo=function(){};function bar(){}var baz=eval("XXX");\n//@ sourceMappingURL=test.js.map';
                server.requests[0].respond(200, { 'Content-Type': 'application/x-javascript' }, source);
            });
            waits(100);
            runs(function() {
                var sourceMap = '{"version":3,"sources":["./test.js"],"names":["foo","bar","baz","eval"],"mappings":"AAAA,GAAIA,KAAM,YACV,SAASC,QACT,GAAIC,KAAMC,KAAK","file":"test.min.js"}';
                server.requests[1].respond(200, { 'Content-Type': 'application/json' }, sourceMap);
            });
            waits(100);
            runs(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0]).toMatchStackFrame(['bar', [], './test.js', 2, 9]);
                expect(errback).not.toHaveBeenCalled();
            });
        });
    });

    describe('#generateArtificially', function () {
        var unit = new StackTrace();
        it('gets stacktrace from current location', function testGenerateArtificially() {
            var stackFrames = unit.generateArtificially().filter(function (stackFrame) {
                return stackFrame.getFunctionName() && stackFrame.getFunctionName().indexOf('testGenerateArtificially') > -1;
            });
            expect(stackFrames.length).toEqual(1);
        });
    });
});
