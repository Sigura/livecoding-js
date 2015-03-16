+(function(require) {
'use strict';
// generated on 2015-02-24 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var reactify = require('reactify');
var reload = browserSync.reload;
var port = 5000;
var proxy = 3000;

gulp.task('styles', function () {
  return gulp.src('webapp/styles/main.css')
    .pipe($.sourcemaps.init())
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src('webapp/scripts/**/*.js')
    //.pipe($.react())
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles', 'templates'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'webapp', '.']});

  return gulp.src('webapp/*.html')
    .pipe(assets)
    .pipe($.if('*.jsx', $.browserify({
      insertGlobals : false,
      transform: ['reactify'],
      debug: true,
      extensions: ['.jsx']
    })))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('webapp/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('webapp/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'webapp/*.*',
    '!webapp/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('nodemon', function (cb) {
    var called = false;
	return nodemon({
	  script: 'nodeapp/server.js',
      verbose: true,
      ignore: ['webapp', 'test', 'dist', '.tmp', '.git', 'bower_components', 'webapp/bower_components'],
      env: {
          'serve': 'gulp',
          'port': port
      }
	}).on('start', function () {
      if (!called) { cb(); }
      called = true;
  });
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'templates', 'fonts', 'nodemon'], function () {
  browserSync({
    notify: false,
    proxy: 'http://localhost:' + port,
    files: ['.tmp/**/*.*', 'webapp/**/*.*', 'webapp/bower_components/**/*.*'],
    port: proxy//,
    // server: {
      // baseDir: ['.tmp', 'webapp', 'dist'],
      // routes: {
        // '/bower_components': 'bower_components'
      // }
    // }
  });

  // watch for changes
  gulp.watch([
    'webapp/*.html',
    'webapp/scripts/**/*.js'
    //'webapp/scripts/**/*.jsx'
  ]).on('change', reload);

  gulp.watch('webapp/styles/**/*.css', ['styles']);
  gulp.watch('webapp/fonts/**/*', ['fonts']);
  //gulp.watch('webapp/scripts/**/*.js', ['templates', reload]);
  gulp.watch('webapp/scripts/**/*.jsx', ['templates', reload]);
  //gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('templates', function () {
    
  return gulp.src('webapp/scripts/**/*.jsx')
    .pipe($.react())
    .pipe($.browserify({
      insertGlobals : false,
      transform: ['reactify'],
      debug: true,
      extensions: ['.jsx']
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'));
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('webapp/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('webapp'));
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
})(require);