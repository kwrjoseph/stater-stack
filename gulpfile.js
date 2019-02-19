//Gulp require _____________variables 

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var fs = require('fs');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var pkg = require('./package.json');
var mdir = require('make-dir');


// Set the banner content
var banner = ['/*!\n',
    ' * Kim joseph - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
    ' */\n',
    ''
].join('');

//Gulp enviroment _______________dev build functions

// Compile sass
gulp.task('sass', function() {
    return gulp.src('public/sass/app.scss')
        .pipe(sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
});

// Minify compiled dist folder CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('public/css/app.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/des'));
});

//concat all js scripts into one file
gulp.task('concat', function() {
    return gulp.src('public/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js/main'));
});

// Minify dist folder JS
gulp.task('minify-js', function() {
    return gulp.src('public/js/main/app.js')
        .pipe(uglify().on('error', function(e) {
            console.log(e);
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/des'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['minify-js'], function(done) {
    browserSync.reload();
    done();
});

// // Copy src files to dis folder
// gulp.task('copy_src', function() {

//     gulp.src(['templates/src/css/**/*'])
//         .pipe(gulp.dest('templates/dist/css'));

//     gulp.src(['templates/src/img/**/*'])
//         .pipe(gulp.dest('templates/dist/img'));

//     gulp.src(['templates/src/fonts/*'])
//         .pipe(gulp.dest('templates/dist/fonts'));

//     gulp.src(['templates/src/js/*.js'])
//         .pipe(gulp.dest('templates/dist/js'));
// });

// Run_________________ everything
gulp.task('default', ['sass', 'concat', 'minify-css', 'minify-js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})


// Static Server + watching scss/html files
gulp.task('dev', ['sass', 'concat', 'minify-css', 'minify-js'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch('public/sass/*.scss', ['sass']);
    gulp.watch('public/css/*.css', ['minify-css']);
    gulp.watch('public/js/main/*.js', ['minify-js']);
    gulp.watch('public/js/*.js', ['concat'])

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("*.html").on('change', browserSync.reload);
});