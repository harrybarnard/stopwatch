'use strict';
 
const Gulp = require('gulp');
const Uglify = require('gulp-uglify');
const Sourcemaps = require('gulp-sourcemaps');
const Sass = require('gulp-sass');

Sass.compiler = require('node-sass');

/**
 * Watch the JS source code for changes and run a build task
 */
 const watchJs = Gulp.series(function(done) {
    Gulp.watch('./src/js/**/*.js', buildJs);

    done();
})

/**
 * Build and process the SASS source code.
 */
const buildJs = Gulp.series(function(done) {
    Gulp.src('./src/js/**/*.js')
        .pipe(Sourcemaps.init())
        .pipe(Uglify())
        .pipe(Sourcemaps.write())
        .pipe(Gulp.dest('./public/js'));
    
    done();
})

/**
 * Watch the SASS source code for changes and run a build task
 */
const watchSass = Gulp.series(function(done) {
    Gulp.watch('./src/scss/**/*.scss', buildSass);

    done();
})

/**
 * Build and process the SASS source code.
 */
const buildSass = Gulp.series(function(done) {
    Gulp.src('./src/scss/**/*.scss')
        .pipe(Sourcemaps.init())
        .pipe(Sass({outputStyle: 'compressed'}).on('error', Sass.logError))
        .pipe(Sourcemaps.write())
        .pipe(Gulp.dest('./public/css'));
    
    done();
})

const buildTask = Gulp.series(Gulp.parallel(buildJs, buildSass), function(done) {
    done();
})

const watchTask = Gulp.series(Gulp.parallel(watchJs, watchSass), function(done) {
    done();
})

exports.default = buildTask
exports.watch = watchTask