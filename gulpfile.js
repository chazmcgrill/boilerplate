const gulp = require("gulp");
const uglify = require("gulp-uglify-es").default;
const browserSync = require('browser-sync').create();
const plugs = require('gulp-load-plugins')();

const paths = {
  sass: ['./src/css/**/*.sass'],
  pug: ['./src/**/*.pug'],
  js: ['./src/js/**/*.js']
}

gulp.task('browser-sync', () => {
  return browserSync.init({
    server: { baseDir: "./dist/" }
  });
});

gulp.task('templates', () => {
  return gulp.src('./src/**/!(_)*.pug')
    .pipe(plugs.pug({ pretty: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
  return gulp.src('./src/css/*.sass')
    .pipe(plugs.sass().on('error', plugs.sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(plugs.babel({presets: ['env']}))
    .pipe(uglify())
    .pipe(plugs.concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('imageMin', () => {
  gulp.src('src/img/*')
    .pipe(plugs.imagemin([plugs.imagemin.jpegtran({ progressive: true })]))
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
  gulp.series(gulp.parallel('sass', 'browser-sync', 'templates', 'scripts', 'watch'))
);
