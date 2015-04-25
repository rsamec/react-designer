'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    connect = $.connectMulti,
    wiredep = require('wiredep').stream,
    devServer = connect(),
    proServer = connect(),
    babel = require("gulp-babel");

gulp.task('connect-dev', devServer.server({
    root: ['src'],
    port: 8989,
    livereload: true
}));

gulp.task("babel", function () {
    return gulp.src("src/app.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('connect-pro', proServer.server({
    root: ['dist'],
    port: 9090,
    livereload: true
}));

gulp.task('clean', function() {
    return gulp.src(['dist'], {read: false})
            .pipe($.rimraf());
});

gulp.task('lint', function() {
    return gulp.src(['src/app/*.js', 'src/app/**/*.js'])
            .pipe($.jshint('.jshintrc'))
            .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('robots', function() {
    gulp.src('src/robots.txt')
        .pipe(gulp.dest('dist/'));
});

gulp.task('static', function() {
    gulp.src('src/static/*')
        .pipe(gulp.dest('dist/static/'));
});

gulp.task('config', function() {
    gulp.src('src/config/*')
        .pipe(gulp.dest('dist/config/'));
});

gulp.task('fonts', function() {
    gulp.src('src/bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('images', function() {
    gulp.src('src/assets/images/*')
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('styles', function() {
    gulp.src('src/assets/styles/*.css')
        .pipe(gulp.dest('dist/assets/styles'));
});

gulp.task('base', ['robots', 'static', 'config', 'fonts', 'images', 'styles']);

gulp.task('scripts', ['lint'], function() {
    return gulp.src(['src/app/app.js'])
            .pipe($.browserify({
                transform: ['reactify'],
                extensions: ['.jsx'],
                insertGlobals : true,
                shim: {
                    tinymce: {
                        path: 'node_modules/tinymce/tinymce.min.js',
                        exports: 'tinymce'
                    }
                }
            }))
            .on('prebundle', function(bundler) {
                bundler.require('react');
            })
            .pipe(gulp.dest('dist/scripts/'))
            .pipe($.size());
});

gulp.task('html', ['base', 'scripts'], function() {
    var assets = $.useref.assets();
    return gulp.src('src/*.html')
            .pipe(assets)
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe(gulp.dest('dist'))
            .pipe($.size());
});

gulp.task('compress', ['html'], function() {
    gulp.src(['dist/scripts/app.js', 'dist/scripts/vendor.js'])
        .pipe($.uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('wiredep', function() {
    gulp.src('src/*.html')
        .pipe(wiredep({
            directory: 'src/bower_components',
            ignorePath: 'src/'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('browserify', ['lint'], function() {
    return gulp.src(['src/app/app.js'])
            .pipe($.browserify({
                transform: ['reactify'],
                extensions: ['.jsx'],
                shim: {
                    tinymce: {
                        path: 'node_modules/tinymce/tinymce.js',
                        exports: 'tinymce'
                    }
                }
            }))
            .on('prebundle', function(bundler) {
                bundler.require('react');
            })
            .pipe(gulp.dest('src/scripts/'))
            .pipe($.size());
});

gulp.task('stylus', function () {
    gulp.src('assets/styles/propertyGrid.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./css/build'));
});

gulp.task('refresh', ['browserify'], function() {
    gulp.src('src/scripts/app.js')
        .pipe(devServer.reload());
});

gulp.task('watch', ['connect-dev'], function() {
    gulp.watch([
        'src/*.html',
        'src/assets/styles/*.css',
        'src/assets/images/*',
        'src/app/*.js',
        'src/app/**/*.js'
    ], function(event) {
        return gulp.src(event.path)
                .pipe(devServer.reload());
    });

    gulp.watch(['src/app/*.js', 'src/app/**/*.js'], ['refresh']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('development', ['browserify'], function() {
    gulp.start('watch');
});

gulp.task('build', ['compress'], function() {
    gulp.start('connect-pro');
});

gulp.task('production', ['clean'], function() {
    gulp.start('build');
});
