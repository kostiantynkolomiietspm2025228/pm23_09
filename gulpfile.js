import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import browserSyncLib from 'browser-sync';
import fileinclude from 'gulp-file-include';
import rename from 'gulp-rename';

const browserSync = browserSyncLib.create();
const scssCompiler = gulpSass(sass);


function html() {
    return gulp.src('src/app/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/app'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

function scss() {
    return gulp.src('src/app/scss/main.scss')
        .pipe(scssCompiler().on('error', scssCompiler.logError))
        .pipe(cssnano())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

function js() {
    return gulp.src('src/app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

// JSON-дані: src/app/data.json -> dist/data.json (поруч з index.html)
function data() {
    return gulp.src('src/app/data.json')
        .pipe(gulp.dest('dist'));
}

// Перезавантаження сторінки (для JSON browserSync.stream() не підходить)
function reload(done) {
    browserSync.reload();
    done();
}

function images() {
    return gulp.src('src/app/images/*.{jpg,jpeg,png,gif,svg}', {
        encoding: false
    })
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

// BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
}

// Watcher
function watchFiles() {
    gulp.watch('src/app/components/**/*.html', html);
    gulp.watch('src/app/*.html', html);
    gulp.watch('src/app/scss/**/*.scss', scss);
    gulp.watch('src/app/js/**/*.js', js);
    gulp.watch('src/app/data.json', gulp.series(data, reload));
    gulp.watch('src/app/images/**/*', images);
}

export function bootstrapCss() {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'));
}

export function bootstrapJs() {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('dist/js'));
}

export { html, scss, js, data, images, watchFiles, serve };

export default gulp.series(
    html,
    scss,
    js,
    data,
    images,
    bootstrapCss,
    bootstrapJs,
    gulp.parallel(watchFiles, serve)
);