const gulp = require("gulp");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const pug = require('gulp-pug');
const webserver = require('gulp-webserver');

const paths = {
  sass: ['./src/css/**/*.sass'],
  pug: ['./src/**/*.pug'],
  js: ['./src/js/**/*.js']
}


 
gulp.task('webserver', () => {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      // directoryListing: true,
      open: true,
      port: 8001
    }));
});

gulp.task('templates', () => {
  return gulp.src('./src/**/!(_)*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
  return gulp.src('./src/css/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('imageMin', () => {
  gulp.src('src/img/*')
    .pipe(imagemin([imagemin.jpegtran({ progressive: true })]))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('watch', () => {
  gulp.watch(paths.pug, gulp.series("templates"));
  gulp.watch("src/js/**/*.js", gulp.series("scripts"));
  gulp.watch("src/img/*", gulp.series("imageMin"));
  gulp.watch(paths.sass, gulp.series("sass"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel('sass', 'templates', 'scripts', 'webserver', 'watch'))
);
