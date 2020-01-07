var browserify = require('browserify');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
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

gulp.task('dist', function() {
    browserify({
        entries: sources,
        debug: true,
        standalone: 'StackTrace'
    }).bundle()
        .pipe(vinylSourceStream(sources))
        .pipe(gulp.dest('dist'))
        .pipe(vinylBuffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(rename({extname: '.min.js'}))
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
        .pipe(gulp.dest('dist'))
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'dist']));

gulp.task('default', ['clean'], function(cb) {
    runSequence('dist', 'test', cb);
});
