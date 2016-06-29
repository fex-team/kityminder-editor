/**
 * 原来的打包结果还不够独立，在 /dist 基础上把所有依赖的 js/css 打包成一个 all.js/all.css
 *
 * 由于用到 gulp-useref，需要在 dist/index.html 增加一些注释，用新文件 index.html.useref 表示
 *
 *
 * ##tasks
 *
 * - `cp` 拷贝图片、字体等资源
 * - 'useref' 根据新增的注释标识，收集相应资源，打包成 all.xx
 */


var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename")


var config = {
    src: {
        html: 'dist/index.html.useref',
        copy: [
            'dist/**/images/**',
            'favicon.ico',
            'bower_components/bootstrap/dist/**/fonts/**'
        ]
    },
    dest: 'dist-standalone/'
}

gulp.task('cp', function() {
    gulp.src(config.src.copy)
        .pipe(gulp.dest(config.dest));
})

gulp.task('useref',  function() {
    return gulp.src(config.src.html)
        .pipe(rename('index.html'))
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(config.dest));
})

gulp.task('default', ['cp', 'useref'])