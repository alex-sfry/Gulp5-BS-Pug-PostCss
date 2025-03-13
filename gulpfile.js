import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import purgecss from 'gulp-purgecss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
// import rename from 'gulp-rename';
import postcssNested from 'postcss-nested';
import webpack from 'webpack-stream';
import wpConfig from './webpack.config.js';
import wpCompiler from 'webpack';
import { deleteAsync } from 'del';
import pug from 'gulp-pug';

export const dest = {
    root: './dist/',
    css: './dist/css/',
    js: './dist/js/',
    cssDev: './src/css/',
    pug: './src/'
};
export const src = {
    pug: './src/*.pug',
    js: './src/js/main.js',
    scss: './src/scss/style.scss',
    scssBs: './src/bootstrapSCSS/bootstrap.scss',
    purgecss: './src/css/*.css',
    content: ['./src/**/*.html', './src/**/*.js']
}

const sass = gulpSass(dartSass);

export const clean = async () => {
    await deleteAsync(['dist/**']);
}

export const moveJs = () => {
    return gulp.src('./src/js/*.min.js')
        .pipe(gulp.dest(dest.js))
}

export const moveCss = () => {
    return gulp.src('./src/css/*.css', { ignore: './src/css/style.css' })
        .pipe(gulp.dest(dest.css))
}

export const moveHtml = () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest(dest.root))
}

export const moveFonts = () => {
    return gulp.src('./src/fonts/**', { encoding: false })
        .pipe(gulp.dest(`${dest.root}fonts/`))
}

export const moveImages = () => {
    return gulp.src('./src/images/**', { encoding: false })
        .pipe(gulp.dest(`${dest.root}images/`))
}

export const scssBs = () => {
    return gulp.src(src.scssBs)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest.cssDev));
};

export const scss = () => {
    return gulp.src(src.scss)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest.cssDev));
};

export const postCss = () => {
    const plugins = [
        autoprefixer(),
        postcssNested(),
        cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }),
    ];

    return gulp.src(src.purgecss)
        .pipe(plumber())
        .pipe(purgecss({
            content: src.content,
            variables: true,
            safelist: []
        }))
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.css));
};

export const wp = () => {
    return gulp.src(src.js)
        .pipe(plumber())
        .pipe(webpack(wpConfig, wpCompiler))
        .pipe(gulp.dest(dest.js));
};

export const pug2html = () => {
    return gulp.src(src.pug)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(dest.pug));
}

export const watch = () => {
    gulp.watch('./src//*.pug', pug2html);
    gulp.watch('./src/bootstrapSCSS/*', scssBs);
    gulp.watch('./src/scss/*', scss);
};

export const dev = gulp.series(pug2html, scss, watch);
export const devBs = gulp.series(gulp.parallel(pug2html, scss, scssBs), watch);
export const move = gulp.parallel(moveJs, moveCss, moveHtml, moveFonts, moveImages,);
export const build = gulp.series(clean, gulp.parallel(move, wp, postCss));

export default devBs;
