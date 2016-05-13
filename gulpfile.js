var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

gulp.task('sass', function () {
    gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({sourceComments: 'map'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'));
});

gulp.task('sass:dist', function () {
    gulp.src('src/scss/bstree.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('js:dist', function () {
    return gulp.src('src/js/jquery.bstree.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch('src/scss/*.scss', ['sass']).on('change', function(event) {
            gutil.log('File', gutil.colors.cyan(event.path), 'was', gutil.colors.yellow(event.type), ', running tasks...');
        });
    gulp.watch('src/css/*.css').on('change', browserSync.reload);
    gulp.watch('src/js/*.js').on('change', browserSync.reload);
    gulp.watch('demo/**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['sass']);

gulp.task('dist', ['sass:dist', 'js:dist']);