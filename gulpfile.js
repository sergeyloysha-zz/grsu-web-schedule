var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyhtml = require('gulp-minify-html');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var open = require('gulp-open');

var buildDir = 'build';

var appScripts = [
  'app/app.js',
  'app/controllers.js',
  'app/directives.js',
  'app/services.js',
  'app/filters.js'
];

var appStyles = [
  'assets/styles/*.less'
];
var appImages = [
  'assets/images/**'
];
var appFonts = [
  'assets/fonts/**'
];

// Vendor Files
var vendorScripts = [
  'app/vendors/jquery/dist/jquery.min.js',
  'app/vendors/angular/angular.js',
  'app/vendors/angular-route/angular-route.js',
  'app/vendors/bootstrap/dist/js/bootstrap.min.js'
];

var vendorStyles = [
  'app/vendors/bootstrap/dist/css/bootstrap.min.css'
];

// Start the server
gulp.task('server', function() {
  connect.server({
    root: buildDir,
    port: 2000,
    host: '127.0.0.1',
    livereload: true
  });
});

// Bower
gulp.task('bower', function() {
  gulp.src('bower_components/**/')
    .pipe(gulp.dest('app/vendors'));
});

// Vendor
gulp.task('vendors', ['bower'], function() {
  gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(buildDir + '/scripts'))
  gulp.src(vendorStyles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(buildDir + '/assets/styles'))
});

// Scripts
gulp.task('scripts', function () {
	gulp.src(appScripts)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(buildDir + '/scripts'))
})
// Views
gulp.task('views', function() {

  var opts = {
    quotes: true
  };

  gulp.src('index.html')
    .pipe(minifyhtml(opts))
    .pipe(gulp.dest(buildDir));
  gulp.src('assets/views/**/*.html')
    .pipe(minifyhtml(opts))
    .pipe(gulp.dest(buildDir + '/assets/views'))
});

// Styles
gulp.task('styles', function() {
  gulp.src('assets/styles/app.less')
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest(buildDir + '/assets/styles/'))
});

// Images
gulp.task('images', function() {
  gulp.src(appImages)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(buildDir + '/assets/images/'))
});

// Fonts
gulp.task('fonts', function() {
  gulp.src(appFonts)
    .pipe(gulp.dest(buildDir + '/assets/fonts/'))
});

// Default task
gulp.task('default', function() {
  gulp.start('scripts', 'vendors', 'views', 'styles', 'images', 'fonts');
});

// Watch
gulp.task('watch', ['default', 'server'], function() {

  // Watch app style, JS and image files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles, ['styles']);
  gulp.watch(appImages, ['images']);

  // Watch HTML files
  gulp.watch(['index.html', 'assets/views/**/*.html'], ['views']);

  // Watch any files in build/, reload on change
  watch(buildDir + '/**').pipe(connect.reload());

});