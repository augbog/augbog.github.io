var gulp        = require('gulp'),
  minifyCSS     = require('gulp-minify-css'),
  sass          = require('gulp-sass'),
  browserify    = require('gulp-browserify'),
  browserSync   = require('browser-sync'),
  uglify        = require('gulp-uglify'),
  rename        = require('gulp-rename'),
  notify        = require('gulp-notify'),
  replace       = require('gulp-replace'),
  inject        = require('gulp-inject'),
  svgstore      = require('gulp-svgstore'),
  svgmin        = require('gulp-svgmin'),
  beep          = require('beepbeep'),
  colors        = require('colors'),
  plumber       = require('gulp-plumber'),
  path          = require('path'),
  eslint        = require('gulp-eslint'),
  jsonlint      = require('gulp-jsonlint');

// error handling convenience wrapper
gulp.plumbedSrc = function(){
  return gulp.src.apply(gulp, arguments)
    .pipe(plumber({
      errorHandler: function(err) {
        beep();
        console.log('ERROR:'.bold.red);
        console.log(JSON.stringify(err).bold.red);
        this.emit('end');
      }
    }));
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: path.join(__dirname, 'build')
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

gulp.task('scripts', function () {
  gulp.plumbedSrc('./js/main.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/js/'))
    .pipe(uglify())
    .pipe(rename({
       extname: '.min.js'
     }))
    .pipe(replace('./build/js/*.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(notify({ message: 'JS files complete' }));

  gulp.plumbedSrc('./js/quote.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/js/'))
    .pipe(uglify())
    .pipe(rename({
       extname: '.min.js'
     }))
    .pipe(replace('./build/js/*.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(notify({ message: 'JS files complete' }));
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
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['eslint', 'scripts']);
});

gulp.task('default', ['watch']);
