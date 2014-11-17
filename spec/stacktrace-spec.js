/* global StackTrace: false */
describe('StackTrace', function () {
    describe('#constructor', function () {
        it('should allow empty arguments', function () {
            expect(function () {
                new StackTrace(); // jshint ignore:line
            }).not.toThrow();
        });
    });

    describe('#get', function () {
        var unit = new StackTrace();
        it('gets stacktrace from current location', function () {
            var stackFrames = unit.get().filter(function (stackFrame) {
                return stackFrame.getFileName().indexOf('stacktrace-spec.js') > -1;
            });
            expect(stackFrames.length).toEqual(1);
        });
    });

    describe('#fromError', function () {
        var unit = new StackTrace();
        it('parses stacktrace from given Error object', function () {
            var err;
            try {
                throw new Error('Yikes!');
            } catch (e) {
                err = e;
            }
            var stackFrames = unit.fromError(err).filter(function (stackFrame) {
                return stackFrame.getFileName().indexOf('stacktrace-spec.js') > -1;
            });
            expect(stackFrames.length).toEqual(1);
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
