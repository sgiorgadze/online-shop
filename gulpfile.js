const {
    watch,
    dest,
    src,
    series
} = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

sass.compiler = require('node-sass');

var config = {
    paths: {
        scss: './src/scss/**/*.scss',
        html: './public/index.html'
    },
    output: {
        cssName: 'bundle.min.css',
        path: './public'
    },
    isDevelop: true
};

function scss() {
    return src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        // .pipe(gulpIf(!config.isDevelop, autoprefixer()))
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(dest(config.output.path))
        .pipe(browserSync.stream());
};

function serve() {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    });

    watch(config.paths.scss, series(scss));
    watch(config.paths.html).on('change', browserSync.reload);
};

exports.default = series(scss, serve);