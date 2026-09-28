import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import browserSyncLib from 'browser-sync';
import fileinclude from 'gulp-file-include';

const browserSync = browserSyncLib.create();
const scssCompiler = gulpSass(sass);

// HTML
function html() {
    return gulp.src('src/app/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/app'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

// SCSS
function scss() {
    return gulp.src('src/app/scss/*.scss')
        .pipe(scssCompiler().on('error', scssCompiler.logError))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

// JS
function js() {
    return gulp.src('src/app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

//gulp Images
//  function images() {
//      return gulp.src('src/app/images/*.{jpg,jpeg,png,gif,svg}')
//         // .pipe(imagemin())
//      .pipe(gulp.dest('dist/images'));
// }
function images() {
    return gulp.src('src/app/images/*.{jpg,jpeg,png,gif,svg}', {
        encoding: false
    })
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
    gulp.watch('src/app/*.html', html);
    gulp.watch('src/app/scss/**/*.scss', scss);
    gulp.watch('src/app/js/**/*.js', js);
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
export { html, scss, js, images, watchFiles, serve };

export default gulp.series(
    html,
    scss,
    js,
    images,
    bootstrapCss,
    bootstrapJs,
    gulp.parallel(watchFiles, serve) // Тепер сервер і стеження працюватимуть разом
);