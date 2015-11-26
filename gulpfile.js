var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');

var isProduction = process.argv.indexOf('--prod') >= 0 || process.env.NODE_ENV === 'production';

var errorHandler = function(error) {
  $.util.log(error.toString());
  this.emit('end');
};

gulp.task('clean', function(done) {
  rimraf('build', done);
});

gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe($.cssGlobbing({
      extensions: '.scss'
    }))
    .pipe($.sass().on('error', errorHandler))
    .pipe($.combineMq())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('build/styles'))
    .pipe($.connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src(['src/scripts/*.js'], {
      read: false
    })
    .pipe($.rollup({
      format: 'iife'
    }).on('error', errorHandler))
    .pipe(gulp.dest('build/scripts'))
    .pipe($.connect.reload());
});

gulp.task('html', ['styles', 'scripts'], function() {

  var injected = gulp.src(['styles/*.css', 'scripts/*.js'], {
    read: false,
    // cwd: 'build'
  });

  return gulp.src('src/**/[^_]*.jade')
    .pipe($.jade().on('error', errorHandler))
    .pipe($.inject(injected, {addRootSlash: false}))
    .pipe(gulp.dest('build'))
    .pipe($.connect.reload());
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*.{svg,png,jpg,gif}')
    .pipe(gulp.dest('build/images'))
    .pipe($.connect.reload());
});

gulp.task('deploy', ['build'], function() {
  return gulp.src('build/**/*')
    .pipe(gulp.dest('.'));
})

gulp.task('serve', ['build'], function(done) {
  $.connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/**/*.jade', ['html']);
});

gulp.task('build', ['styles', 'scripts', 'html', 'images']);

gulp.task('default', ['serve', 'watch']);
