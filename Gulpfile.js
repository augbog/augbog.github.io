var gulp        = require('gulp'),
  minifyCSS     = require('gulp-minify-css'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  browserify    = require('gulp-browserify'),
  browserSync   = require('browser-sync'),
  uglify        = require('gulp-uglify'),
  rename        = require('gulp-rename'),
  notify        = require('gulp-notify'),
  replace       = require('gulp-replace'),
  inject        = require('gulp-inject'),
  svgstore      = require('gulp-svgstore'),
  svgmin        = require('gulp-svgmin'),
  plumber       = require('gulp-plumber'),
  eslint        = require('gulp-eslint'),
  jsonlint      = require('gulp-jsonlint'),
  beep          = require('beepbeep'),
  colors        = require('colors'),
  path          = require('path'),
  sourcemaps    = require('gulp-sourcemaps'),
  autoprefixer  = require('autoprefixer'),
  merge         = require('merge-stream');;

// error handling convenience wrapper
gulp.plumbedSrc = function(){
  return gulp.src.apply(gulp, arguments)
    .pipe(plumber({
      errorHandler: function(err) {
        beep();
        console.log('ERROR:'.bold.red);
        console.log(JSON.stringify(err, null, 2).bold.red);
        this.emit('end');
      }
    }));
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    host: 'localhost',
    port: 8000,
    open: false
  });
});

gulp.task('sass', function () {
  return gulp.plumbedSrc('./sass/**/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer({
        browsers: ['last 2 versions']
      }
    )]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(notify({ message: 'CSS complete' }));
});

gulp.task('svgstore', function () {
  var svgSprite = gulp.plumbedSrc('./svg/*.svg')
    .pipe(svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
            plugins: [{
                cleanupIDs: {
                    prefix: prefix + '-',
                    minify: true
                }
            }]
        }
    }))
    .pipe(rename({prefix: 'svg-'}))
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("social-icons.svg"))
    .pipe(gulp.dest('./build/img'));

    return gulp.plumbedSrc('./index.html')
      .pipe(inject(svgSprite, {
        transform: function(filePath, file) {
          return file.contents.toString();
        }
      }))
      .pipe(gulp.dest('./'));
});

gulp.task('scripts', function() {
  var mainJS = gulp.plumbedSrc('./js/main.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/js/'))
    .pipe(uglify())
    .pipe(rename({
       extname: '.min.js'
     }))
    .pipe(replace('./build/js/*.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(notify({ message: 'JS files complete' }));

  var quoteJS = gulp.plumbedSrc('./js/quote.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/js/'))
    .pipe(uglify())
    .pipe(rename({
       extname: '.min.js'
     }))
    .pipe(replace('./build/js/*.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(notify({ message: 'JS files complete' }));

  return merge(mainJS, quoteJS);
});

gulp.task('scripts-watch', ['scripts'], function() {
  browserSync.reload();
});

gulp.task('sass-watch', ['sass'], function() {
  browserSync.reload();
});

gulp.task('eslint', function() {
  return gulp.plumbedSrc('./js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(notify({ message: 'ESLint complete' }));
});

gulp.task('jsonlint', function() {
  return gulp.plumbedSrc('./json/**/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.failAfterError())
    .pipe(notify({ message: 'JSONLint complete' }));
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('./sass/**/*.scss', ['sass-watch']);
  gulp.watch('./js/*.js', ['eslint', 'scripts-watch']);
});

gulp.task('default', ['watch']);
