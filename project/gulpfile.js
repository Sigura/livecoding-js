+(function(require) {
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
//var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
//var react = require('gulp-react');
var server = require('gulp-develop-server');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');
var babelify = require('babelify');
var reload = browserSync.reload;
var port = 5000;
var proxy = 3000;

gulp.task('styles', function () {
    return gulp.src('webapp/styles/main.css')
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
    return gulp.src(['webapp/scripts/**/*.js', 'nodeapp/**/*.js'])
        .pipe($.react())
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function () {
    var assets = $.useref.assets({searchPath: ['.tmp', 'webapp', 'dist']})
    var uglify = $.uglify();
    var isJs = function(file){
        var res = /.*\.js$/i.test(file.path) && !/.*\.react\.js$/i.test(file.path);
        //console.log('isJS', file.path, res);
        return res;
    };
    assets.on('error', $.util.log);
    uglify.on('error', $.util.log);
  
    return gulp.src(['webapp/*.html'])
        .pipe(assets)
        .pipe($.if('*.js', uglify))
        .pipe($.if('*.css', $.csso()))
        .pipe($.useref.restore())
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
        filter: '**/*.{eot,svg,ttf,woff,woff2}',
        paths: 'webapp'
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

gulp.task( 'server:restart', function() {
    server.restart( function( error ) {
        if( ! error ) browserSync.reload();
    });
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist/*']));

gulp.task('serve', ['styles', 'templates', 'fonts'], function () {

    server.listen( {
        path: './nodeapp/server.js',
        //sexecArgv: [ '--harmony' ],
        verbose: true,
        env: {
          'serve': 'gulp',
          'port': port
        }
    }, function( error ) {
        if( ! error ) browserSync({
            notify: false,
            logPrefix: 'BS',
            proxy: 'http://localhost:' + port,
            //files: ['webapp/**/*.*', '!webapp/style/**/*.css'],
            port: proxy,
            // Run as an https by uncommenting 'https: true'
            // Note: this uses an unsigned certificate which on first access
            //       will present a certificate warning in the browser.
            // https: true,
            //server: ['dist', 'webapp']
        });
    } );
    gulp.watch( ['./nodeapp/**/*.js'], [ 'server:restart' ] )


    // watch for changes
    gulp.watch([
        'webapp/*.html',
        //'.tmp/scripts/**/*.js'
    ], [reload]);

    gulp.watch('webapp/styles/**/*.css', ['styles']);
    gulp.watch('webapp/fonts/**/*', ['fonts', reload]);
    gulp.watch('webapp/scripts/**/*.js', ['templates', reload]);
    //gulp.watch('webapp/bower.json', ['wiredep', 'fonts']);
});

gulp.task('bundle', function () {
    
    var uglify = $.uglify();
    uglify.on('error', $.util.log);

    return gulp.src('webapp/scripts/main.react.js')
    .pipe($.browserify({
        insertGlobals : false,
        transform: ['babelify', 'reactify'],
        debug: false
    }))
    .pipe($.stripDebug())
    .pipe(uglify)
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('templates', function () {
    
    return gulp.src('webapp/scripts/main.react.js')
    .pipe($.browserify({
        insertGlobals : false,
        transform: ['babelify', 'reactify'],
        debug: true
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'));

});

gulp.task('build', ['bundle', 'html', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*');//.pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
})(require);