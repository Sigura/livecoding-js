+(function(require) {
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var server = require('gulp-develop-server');
var reload = browserSync.reload;
var port = 5000;
var proxy = 3000;

gulp.task('styles', function () {
    return gulp.src('webapp/styles/main.css')
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true, once: true}));
});

gulp.task('jshint', function () {
    return gulp.src([
        'gulpfile.js',
        'webapp/scripts/**/*.js',
        'nodeapp/**/*.js',
        '!webapp/scripts/components/timepicker.js'
    ])
        .pipe(reload({stream: true, once: true}))
        .pipe($.eslint())
        .pipe($.eslint.format());
        //.pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

gulp.task('html', ['styles'], function () {
    var assets = $.useref.assets({searchPath: ['.tmp', 'webapp', 'dist']});
    var uglify = $.uglify();

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
        if( !error ) {
            browserSync.reload();
        }
    });
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist/*']));

gulp.task('serve', ['styles', 'templates', 'fonts', 'jshint'], function () {

    server.listen( {
        path: './nodeapp/server.js',
        //sexecArgv: [ '--harmony' ],
        verbose: true,
        env: {
          'serve': 'gulp',
          'port': port
        }
    }, function( error ) {
        if( !error ){
            browserSync({
                notify: false,
                logPrefix: 'BS',
                proxy: 'http://localhost:' + port,
                port: proxy
            });
        }
    } );
    gulp.watch( ['./nodeapp/**/*.js'], [ 'server:restart' ] );

    // watch for changes
    gulp.watch([
        'webapp/*.html'
    ], ['html']);

    gulp.watch('webapp/styles/**/*.css', ['styles']);
    gulp.watch('webapp/fonts/**/*', ['fonts']);
    gulp.watch('webapp/scripts/**/*.js', ['templates', reload]);
    //gulp.watch('webapp/bower.json', ['wiredep', 'fonts']);
});

gulp.task('bundle', function () {

    var uglify = $.uglify();
    uglify.on('error', $.util.log);

    return gulp.src('webapp/scripts/main.react.js')
    .pipe($.browserify({
        insertGlobals: false,
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
        insertGlobals: false,
        transform: ['babelify', 'reactify'],
        debug: true
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'));

});

gulp.task('build', ['bundle', 'html', 'images', 'fonts', 'extras', 'jshint'], function () {
    return gulp.src('dist/**/*');//.pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

})(require);
