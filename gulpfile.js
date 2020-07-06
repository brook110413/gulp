const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');

sass.compiler = require('node-sass');

// gulp 4 推薦寫法
function copyHTML() {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
}

function scss() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
}

function browser() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 8080, // 預設為3000,也可使用8080
  });
}

function watch() {
  gulp.watch('./src/**/*.html', gulp.series(copyHTML));
  gulp.watch('./src/sass/**/*.scss', gulp.series(scss));
}

function deploy() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
};

exports.default = gulp.series(copyHTML, scss, gulp.parallel(browser, watch)); // 只需輸入 gulp 就可以執行
exports.build = gulp.series(copyHTML, scss);
exports.deploy = deploy;