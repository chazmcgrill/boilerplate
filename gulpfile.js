const gulp = require("gulp");
const uglify = require("gulp-uglify-es").default;
const browserSync = require('browser-sync').create();
const plugs = require('gulp-load-plugins')();

const DEV_DIR = './dist/';

// -- FILE PATHS

const paths = {
  sass: {
    src: 'src/css/**/*.sass',
    dist: 'dist/assets/css'
  },
  pug: {
    src: './src/**/!(_)*.pug',
    watch: './src/**/*.pug',
    dist: 'dist'
  },
  js: {
    src: 'src/js/**/*.js',
    dist: 'dist/assets/js'
  },
  img: {
    src: 'src/img/*',
    dist: 'dist/assets/img'
  }
}


// -- FILE TASKS

gulp.task('templates', () => {
  return gulp.src(paths.pug.src)
    .pipe(plugs.pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dist));
});

gulp.task('sass', () => {
  return gulp.src(paths.sass.src)
    .pipe(plugs.sass().on('error', plugs.sass.logError))
    .pipe(gulp.dest(paths.sass.dist));
});

gulp.task('scripts', () => {
  return gulp.src(paths.js.src)
    .pipe(plugs.babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(plugs.concat('app.js'))
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('imageMin', () => {
  return gulp.src(paths.img.src)
    .pipe(plugs.imagemin([plugs.imagemin.jpegtran({ progressive: true })]))
    .pipe(gulp.dest(paths.img.dist))
});


// -- MAIN TASKS

gulp.task('browser-sync', () => {
  browserSync.init({
    server: { baseDir: DEV_DIR }
  });

  gulp.watch(paths.pug.watch, gulp.series("templates")).on('change', browserSync.reload);
  gulp.watch(paths.js.src, gulp.series("scripts")).on('change', browserSync.reload);
  gulp.watch(paths.img.src, gulp.series("imageMin")).on('change', browserSync.reload);
  gulp.watch(paths.sass.src, gulp.series("sass")).on('change', browserSync.reload);
});

const build = gulp.series('sass', 'templates', 'scripts', 'imageMin', 'browser-sync');

gulp.task('default', build);
gulp.task('prod', build);