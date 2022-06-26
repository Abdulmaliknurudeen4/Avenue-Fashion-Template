//--------------------------
//Dependencies
//--------------------------
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import pug from 'gulp-pug';
import { spawn } from 'child_process';
import changed from 'gulp-changed';
import gulpPugLinter from 'gulp-pug-linter';
import imageminGifsicle from 'imagemin-gifsicle';
import optipng from 'imagemin-optipng';
import mozjpeg from 'imagemin-jpegtran';
import svgo from 'imagemin-svgo';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);
const browserSyncInstance = browserSync.create();

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

gulp.task('sass',async function(){
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

gulp.task('reloadSync', async function(){
    browserSyncInstance.reload();
});

gulp.task('jekyllBuild', function(done){
    browserSyncInstance.notify(messages.jekyllBuild);
    spawn('jekyll.bat', ['build'], {stdio:'inherit'})
    .on('close',done);
});

gulp.task('pug', async function(){
    gulp.src(file_sources.pugSRC)
    .pipe(gulpPugLinter({ reporter: 'default' }))
    .pipe(pug( {
        pretty: true
    } ))
    .pipe(gulp.dest(file_dest.htmlDEST));
});

gulp.task('js', async function() {
    gulp.src(file_sources.jsSRC)
    .pipe(sourcemaps.init())
    .pipe(concat('functions.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(file_dest.jsDEST));
});

gulp.task('imagemin', async function(){

    const imageOptimization = [
        imageminGifsicle({interlaced: true}),
        mozjpeg({quality: 75, progressive: true}),
        optipng({optimizationLevel: 5}),
        svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ];
    gulp.src(file_sources.imageSRC)
    .pipe( changed(file_dest.imageDEST))
    .pipe(imagemin(imageOptimization))
    .pipe(gulp.dest( file_dest.imageDEST, {overwrite: true} ));
});

gulp.task('browserSync', async function(){
        browserSyncInstance.init({
            server:{
                baseDir:'_site'
            },
            notify: true
        });
});

gulp.task('watch', async function(){
    gulp.watch(watch_sources.stylesWatch,gulp.series('sass'));
    gulp.watch(watch_sources.jsWatch,gulp.series('js'));
    gulp.watch(watch_sources.pugWatch,gulp.series('pug'));
    gulp.watch(watch_sources.htmlWatch,gulp.series('jekyllBuild', 'reloadSync'));
    gulp.watch(watch_sources.imageWatch,gulp.series('imagemin'));
});

gulp.task('rebuild', gulp.parallel('sass', 'imagemin', 'pug', 'js', 'jekyllBuild'))
gulp.task('default', gulp.parallel('browserSync', 'watch'));