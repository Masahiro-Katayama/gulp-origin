const gulp = require('gulp');
// エラー時終了しないようにする
const plumber = require('gulp-plumber');
// ブラウザ同期
const browserSync = require('browser-sync').create();
// ejs関連
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const htmlmin = require('gulp-htmlmin');
// sass関連
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
// babel
const babel = require('gulp-babel');
// 画像圧縮関連
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
// TypeScript関連
const ts = require('gulp-typescript');

/**
 * ブラウザ同期
 */
gulp.task('serve', done => {
  browserSync.init({
    server: {
      baseDir: 'dist',
      index: 'index.html',
    },
  });
  done();
});

gulp.task('watch', () => {
  gulp.watch('src/ejs/**/*.ejs', gulp.series('ejs'));
  gulp.watch('src/scss/**/*.scss', gulp.series('css', 'scss'));
  gulp.watch('src/js/**/*.js', gulp.series('babel'));
  gulp.watch('src/img/**/*.{jpg,jpeg,png,svg,gif}', gulp.series('imagemin'));
  gulp.watch('src/ts/**/*.ts', gulp.series('typescript'));
  gulp.watch('dist/*.html').on('change', browserSync.reload);
  gulp.watch('dist/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('serve', 'watch'));

/**
 * ejs
 */
gulp.task('ejs', () => {
  return gulp
    .src(['src/ejs/**/*.ejs', '!src/ejs/**/_*.ejs'])
    .pipe(plumber())
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
    .pipe(htmlmin({ removeComments: true }))
    .pipe(gulp.dest('dist'));
});

/**
 * css
 */
gulp.task('css', () => {
  return gulp
    .src(['src/scss/**/*.scss', '!src/scss/**/_*.scss'])
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest('dist/css'));
});

/**
 * scss
 */
gulp.task('scss', () => {
  return gulp
    .src(['src/scss/**/*.scss', '!src/scss/**/_*.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(sourcemaps.write())
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

/**
 * babel
 */
gulp.task('babel', () => {
  return gulp
    .src(['src/js/**/*.js', '!src/js/**/_*.js'])
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(gulp.dest('dist/js'));
});

/**
 * 画像圧縮
 */
gulp.task('imagemin', () => {
  return gulp
    .src('src/img/*.{jpg,jpeg,png,gif,svg}')
    .pipe(plumber())
    .pipe(imagemin([pngquant({ quality: [0.65, 0.8], speed: 1 }), mozjpeg({ quality: 80, progressive: true }), imagemin.svgo(), imagemin.gifsicle()]))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

/**
 * TypeScript
 */
gulp.task('typescript', () => {
  return gulp
    .src(['src/ts/**/*.ts', '!src/ts/**/_*.ts'])
    .pipe(sourcemaps.init())
    .pipe(
      ts({
        target: 'ES5',
        noImplicitAny: true,
        removeComments: false,
        outFile: 'main.js', //変更したファイル名
      })
    )
    .pipe(gulp.dest('dist/ts'));
});
