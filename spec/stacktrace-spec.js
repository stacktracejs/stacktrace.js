/* global Errors: false */
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

    describe('#get', function () {
        it('gets stacktrace from current location', function () {
            runs(function testStackTraceGet() {
                StackTrace.get().then(callback, errback)['catch'](debugErrback);
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
        var server;
        beforeEach(function () {
            server = sinon.fakeServer.create();
        });
        afterEach(function () {
            server.restore();
        });

        it('rejects with Error given unparsable Error object', function () {
            runs(function () {
                StackTrace.fromError({message: 'ERROR_MESSAGE'})
                    .then(callback, errback)['catch'](errback);
            });
            waits(100);
            runs(function () {
                expect(callback).not.toHaveBeenCalled();
                expect(errback).toHaveBeenCalled();
            });
        });

        it('parses stacktrace from given Error object', function () {
            runs(function () {
                server.respondWith('GET', 'http://path/to/file.js', [404, { 'Content-Type': 'text/plain' }, '']);
                StackTrace.fromError(Errors.IE_11)
                    .then(callback, debugErrback)['catch'](debugErrback);
                server.respond();
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                var stackFrames = callback.mostRecentCall.args[0];
                expect(stackFrames.length).toEqual(3);
                expect(stackFrames[0].fileName).toEqual('http://path/to/file.js');
                expect(errback).not.toHaveBeenCalled();
            });
        });

        it('filters returned stack', function () {
            runs(function () {
                function onlyFoos(stackFrame) {
                    return stackFrame.functionName === 'foo';
                }

                server.respondWith('GET', 'http://path/to/file.js', [404, { 'Content-Type': 'text/plain' }, '']);
                StackTrace.fromError(Errors.IE_11, {filter: onlyFoos})
                    .then(callback, debugErrback)['catch'](debugErrback);
                server.respond();
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                var stackFrames = callback.mostRecentCall.args[0];
                expect(stackFrames.length).toEqual(1);
                expect(stackFrames[0].fileName).toEqual('http://path/to/file.js');
                expect(stackFrames[0].functionName).toEqual('foo');
                expect(errback).not.toHaveBeenCalled();
            });
        });

        it('uses source maps to enhance stack frames', function () {
            runs(function () {
                var sourceMin = 'var foo=function(){};function bar(){}var baz=eval("XXX");\n//@ sourceMappingURL=test.js.map';
                var sourceMap = '{"version":3,"sources":["./test.js"],"names":["foo","bar","baz","eval"],"mappings":"AAAA,GAAIA,KAAM,YACV,SAASC,QACT,GAAIC,KAAMC,KAAK","file":"test.min.js"}';
                server.respondWith('GET', 'http://path/to/file.js', [200, { 'Content-Type': 'application/x-javascript' }, sourceMin]);
                server.respondWith('GET', 'test.js.map', [200, { 'Content-Type': 'application/json' }, sourceMap]);

                var stack = 'TypeError: Unable to get property \'undef\' of undefined or null reference\n   at foo (http://path/to/file.js:45:13)';
                StackTrace.fromError({stack: stack}).then(callback, errback)['catch'](debugErrback);
                server.respond();
            });
            waits(100);
            runs(function () {
                server.respond();
            });
            waits(100);
            runs(function () {
                expect(callback).toHaveBeenCalled();
                var stackFrames = callback.mostRecentCall.args[0];
                expect(stackFrames.length).toEqual(1);
                expect(stackFrames[0]).toMatchStackFrame(['foo', undefined, 'http://path/to/file.js', 45, 13]);
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
                StackTrace.generateArtificially({filter: stackFrameFilter})
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
