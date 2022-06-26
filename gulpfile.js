//--------------------------
//Dependencies
//--------------------------
import images from 'gulp-imagemin';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import pug from 'gulp-pug';
import { ChildProcess } from 'child_process';
import changed from 'gulp-changed';

const sass = gulpSass(dartSass);

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var file_sources = {
    styleSRC: 'assets/css/main.scss',
    pugSRC: '_pugfiles/*.pug',
    jsSRC: 'assets/js/functions.js',
    fontSRC: 'assets/fonts',
    imageSRC: 'assets/img/**/*'
};
var file_dest = {
    styleDEST: 'assets/css',
    htmlDEST: '_includes',
    jsDEST: 'assets/js',
    fontDEST: 'assets/fonts',
    imageDEST: 'assets/img-min'
};

var watch_sources={
    stylesWatch: [
        'assets/css/0-tools/**',
        'assets/css/1-base/**',
        'assets/css/2-modules/**',
        'assets/css/3-sections/**',
        'assets/css/4-layouts/**',
        'assets/css/main.scss'
                ],
    pugWatch: '_pugfiles/*.pug',
    jsWatch: [
        'assets/js/functions.js'
            ],
    htmlWatch: [
        'index.html',
         '_layouts/*.html',
          '_includes/*'
        ],
    imageWatch:[
        'assets/img/**/*'
    ]
};

var jekyllSources = {
    cssBuild: '_site/assets/css'
};

gulp.task('sass', done=>{
    gulp.src(file_sources.styleSRC)
    .pipe(sourcemaps.init())
    .pipe( sass({
        errorLogToConsole: true,
        outputStyle: 'expanded'
    }) )
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({
        cascade: false,
        grid: "autoplace"
    }) )
    .pipe(cleanCSS())
    .pipe(rename( { suffix:'.min' } ))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jekyllSources.cssBuild))
    .pipe(browserSync.stream())
    .pipe(gulp.dest(file_dest.styleDEST));
});