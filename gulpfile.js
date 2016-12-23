var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync').create(),
    del = require('del');

var paths = {
    src: {
        js: 'src/javascript/**/*.js',
        sass: 'src/sass/**/*.scss',
        sassIndex: 'src/sass/luis.scss',
    },
    output: {
        root: 'dist/',
        css: 'dist/assets/css/',
        js: 'dist/assets/js/'
    }
};

// Dev Tasks
// gulp.task('devStyles', function() {
//     return sass('src/sass/glance.scss', { style: 'expanded'})
//         .pipe(autoprefixer('last 2 version'))
//         .pipe(gulp.dest('src/css'))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(cssnano())
//         .pipe(gulp.dest('src/css'))
//         .pipe(notify({ message: 'Style task complete' }));
// });

gulp.task('styles', function() {
    return sass('src/sass/luis.scss', { style: 'expanded'})
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))

        //.pipe(browserSync.stream())

        .pipe(notify({ message: 'Style task complete' }));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('lib', function() {
    return gulp.src('src/lib/**/*')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('scripts', function() {
    return gulp.src('src/javascript/**/*.js')
    // return gulp.src(['src/javascript/**/*.module.js', 'src/javascript/**/*.js'])
    // return gulp.src([
    //         'src/javascript/**/spinner.module.js',
    //         'src/javascript/**/data.module.js',
    //         'src/javascript/**/*.module.js',
    //         'src/javascript/**/*.js'
    //     ])
        //.pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })) // 5 - caching
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img', 'dist/assets/fonts']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('fonts', 'styles', 'scripts', 'images');
});

gulp.task('watch', function() {

    // Watch font files
    gulp.watch('src/fonts/**/*', ['fonts']);

    // Watch .scss files
    gulp.watch('src/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/javascript/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('styles-watch', ['styles'], function (done) {
    browserSync.reload();
    done();
});

// Static Server + watching scss/html files
gulp.task('serve', ['styles', 'scripts', 'images'], function() {

    browserSync.init({
        server: './'
    });

    // gulp.watch('src/sass/**/*.scss', ['styles-watch']);
    // gulp.watch('src/javascript/**/*.js', ['js-watch']);

    gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
    gulp.watch('src/javascript/**/*.js', ['scripts', browserSync.reload]);
    gulp.watch('src/images/**/*', ['images', browserSync.reload]);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('dev', ['serve']);
