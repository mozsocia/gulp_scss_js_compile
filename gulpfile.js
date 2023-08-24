const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('node-sass'))
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
var del = require('del');
const browsersync = require('browser-sync').create();


function cleanDist() {
  return del('dist'); // Delete the 'dist' folder
}


// Sass Task
function scssTask() {
  return src(['app/scss/main.scss', 'app/scss/style.scss'], { sourcemaps: false })
    .pipe(sass())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

function minifyCssTask() {
  return src("dist/*.css")
    .pipe(postcss([cssnano()]))
    .pipe(rename(function (path) {
      // path.dirname += "/ciao";
      // path.basename += "-goodbye";
      path.extname = ".min.css";
    }))
    .pipe(dest('dist', { sourcemaps: '.' }));
}


function copyToHtmlCss() {
  return src(['dist/*.css'])
    .pipe(dest('../html/dist/assets/css'));
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: false })
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, cleanDist,copyToHtmlCss, minifyCssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  cleanDist,
  scssTask,
  minifyCssTask,
  copyToHtmlCss,
  jsTask,
  browsersyncServe,
  watchTask
);