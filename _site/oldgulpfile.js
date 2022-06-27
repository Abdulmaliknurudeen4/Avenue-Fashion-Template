//--------------------------
//Dependencies
//--------------------------
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    pug = require('gulp-pug'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    child_process = require('child_process'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

const { src, task, watch, series, parallel, dest } = require('gulp');
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

/**
 * 
 *  Jekyll ChildProcess Function Builder
 */
function reloadSync(done){
    browserSync.reload();
    done();
}

function jekyllBuild(done){
    browserSync.notify(messages.jekyllBuild);
    child_process.spawn('jekyll.bat', ['build'], {stdio:'inherit'})
    .on('close',done);

    //Not Calling the done(); fixes the Error of the 
    //Jekyll Site not being built before reloading
 // done();   
}

function cssTask(done) {
    src(file_sources.styleSRC)
    .pipe( sourcemaps.init() )
    .pipe( sass({
        errorLogToConsole: true,
        outputStyle: 'expanded'
    }) )
    .on( 'error', console.error.bind( console ) )
    .pipe( autoprefixer({
        cascade: false,
        grid: "autoplace"
    }) )
    .pipe( cleanCSS() )
    .pipe( rename( { suffix:'.min' } ) )
    .pipe( sourcemaps.write('./') )
    .pipe( dest(jekyllSources.cssBuild) )
    .pipe( browserSync.stream() )
    .pipe( dest(file_dest.styleDEST) );
    

    done();
}

function pugTask(done) {
    src( file_sources.pugSRC )
    .pipe( pug( {
        pretty: true
    } ))
    .pipe( dest(file_dest.htmlDEST) );

    done();
}

function jsTask(done){
    src( file_sources.jsSRC )
    .pipe( sourcemaps.init() )
    .pipe(concat('functions.min.js'))
    .pipe( uglify() )
    .pipe( sourcemaps.write('./') )
    .pipe( dest(file_dest.jsDEST) );
    done();
}



function watch_files(){

    watch(watch_sources.stylesWatch, cssTask);

    watch(watch_sources.jsWatch, series(jsTask, jekyllBuild, reloadSync));
    watch(watch_sources.pugWatch, pugTask);
    watch(watch_sources.htmlWatch, series(jekyllBuild, reloadSync));
     watch(watch_sources.imageWatch, imageminTask);

    // watch(watch_sources.pugWatch, series(pugTask, jekyllBuild, reloadSync));

    // watch(watch_sources.imageWatch, imageminTask);
    // watch(watch_sources.jsWatch, series(esCompileJS, reloadSync));
}

function browser_sync() {
    browserSync.init({
        server:{
            baseDir:'_site'
        },
        notify: true
    });
}



function imageminTask(done) {
    src( file_sources.imageSRC )
    .pipe( changed(file_dest.imageDEST) )
    .pipe( imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.optipng({optimizationLevel:5}),
        imagemin.mozjpeg({progressive:true})
    ]) )
    .pipe(dest( file_dest.imageDEST, {overwrite: true} ));

    done();
}
//exports
exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.pugTask = pugTask;
exports.browser_sync = browser_sync;
exports.reloadSync = reloadSync;
exports.jekyllBuild=jekyllBuild;
exports.imageminTask = imageminTask;


//individual tasks
task("css", cssTask);
task("pug", pugTask);
task("js", jsTask);
task('jekyll_rebuild', jekyllBuild);
task("img", imageminTask);

//high level Tasks

task('rebuild', parallel(cssTask, imageminTask, pugTask, jsTask, jekyllBuild));
task('default', parallel(browser_sync,watch_files));