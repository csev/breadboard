const gulp      = require('gulp');
const concat    = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const config    = require('../config').css;

gulp.task('minify-css', function() {
  return gulp.src(config.src)
    .pipe(concat('breadboard.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.dest))
});
