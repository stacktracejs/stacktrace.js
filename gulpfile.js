var concat = require('gulp-concat');
var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var polyfills = [
    './node_modules/es6-promise/dist/es6-promise.js',
    './node_modules/json3/lib/json3.js',
    './polyfills.js'
];
var dependencies = [
    './node_modules/stacktrace-gps/dist/stacktrace-gps.min.js',
    './node_modules/stack-generator/dist/stack-generator.js',
    './node_modules/error-stack-parser/dist/error-stack-parser.js'
];
var sources = 'stacktrace.js';

gulp.task('lint', function () {
    return gulp.src(sources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
    var server = new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
    server.start();
});

gulp.task('test-ci', ['dist'], function (done) {
    var server = new karma.Server({
        configFile: __dirname + '/karma.conf.ci.js',
        singleRun: true
    }, done);
    server.start();
});

gulp.task('copy', function () {
    return gulp.src(sources)
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['copy'], function () {
    gulp.src(polyfills.concat(dependencies.concat(sources)))
        .pipe(sourcemaps.init())
        .pipe(concat(sources.replace('.js', '-with-polyfills.min.js')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));

    return gulp.src(dependencies.concat(sources))
        .pipe(sourcemaps.init())
        .pipe(concat(sources.replace('.js', '.min.js')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'coverage', 'dist']));

gulp.task('ci', ['lint', 'test-ci'], function () {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['clean'], function (cb) {
    runSequence('lint', 'dist', 'test', cb);
});
