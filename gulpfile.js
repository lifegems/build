var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var srcmaps       = require('gulp-sourcemaps');
var njks          = require('gulp-nunjucks-render');

gulp.task('serve', ['html', 'fonts', 'sass', 'js'], function() {
   browserSync.init({
      server: {
         baseDir: "./dist"
      }
   });

   browserSync.reload();

   gulp.watch("assets/scss/**/*.scss", ['sass']);
   gulp.watch(["**/*.njk"], ['html']);
   gulp.watch("js/**/*.js", ['js']);
});

gulp.task('fonts', function() {
   return gulp.src("assets/fonts/**/*")
      .pipe(gulp.dest("./dist/assets/fonts"))
      .pipe(browserSync.stream());
});

gulp.task('html', function() {
   return gulp.src('pages/**/*.njk')
      .pipe(njks({
         path: ["templates", "partials"]
      }))
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

gulp.task('js', function() {
   return gulp.src("js/**/*.js")
      .pipe(gulp.dest("./dist/js/"))
      .pipe(browserSync.stream());
});

gulp.task('sass', function() {
   return gulp.src("assets/scss/**/*.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./dist/assets/stylesheets'))
      .pipe(browserSync.stream());
});