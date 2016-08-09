var browserify = require('browserify');
var concat = require('gulp-concat');
var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma');
var path = require('path');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var vinylBuffer = require('vinyl-buffer');
var vinylSourceStream = require('vinyl-source-stream');

var polyfills = [
    './node_modules/es6-promise/dist/es6-promise.js',
    './node_modules/json3/lib/json3.js',
    './polyfills.js'
];
var sources = 'stacktrace.js';

gulp.task('lint', function() {
    return gulp.src(sources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function(done) {
    var server = new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
    server.start();
});

gulp.task('test-pr', ['dist'], function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['Firefox', 'Chrome_Travis'],
        singleRun: true
    }, done).start();
});

gulp.task('test-ci', ['dist'], function(done) {
    var server = new karma.Server({
        configFile: __dirname + '/karma.conf.ci.js',
        singleRun: true
    }, done);
    server.start();
});

gulp.task('dist', function() {
    browserify({
        entries: sources,
        debug: true,
        standalone: 'StackTrace'
    }).bundle()
        .pipe(vinylSourceStream(sources))
        .pipe(gulp.dest('dist'))
        .pipe(vinylBuffer())
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));

    browserify({
        entries: polyfills.concat(sources),
        debug: true,
        standalone: 'StackTrace'
    }).bundle()
        .pipe(vinylSourceStream('stacktrace.js'))
        .pipe(vinylBuffer())
        .pipe(concat(sources.replace('.js', '-with-promises-and-json-polyfills.js')))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'coverage', 'dist']));

gulp.task('pr', ['lint', 'test-pr'], function() {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('ci', ['lint', 'test-ci'], function() {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['clean'], function(cb) {
    runSequence('lint', 'dist', 'test', cb);
});
