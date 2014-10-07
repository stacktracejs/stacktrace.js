/* global StackTrace: false */
describe('StackTrace', function () {
    describe('#constructor', function () {
        it('should allow empty arguments', function () {
            expect(function () {
                new StackTrace();
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

    describe('#withFilter', function () {
        var unit = new StackTrace();
        xit('throws an error given input other than a function', function () {
            expect(function () {
                unit.withFilter('BOGUS')
            }).toThrow(new TypeError('Can only apply filter with a function'));
        });
    });
});