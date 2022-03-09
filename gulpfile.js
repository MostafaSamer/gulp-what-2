const { src, dest, watch, parallel } = require("gulp");

// COPY FILES
function copy(cb) {
    src('routes/*.js')
        .pipe(dest('copies'));
    cb();
}
exports.copy = copy;
// run: gulp copy

// BUILD SASS TO CSS
const sass = require('gulp-sass')(require('sass'));
function generateCSS(cb) {
    src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/stylesheets'));
    cb();
}
exports.css = generateCSS;
// run: gulp css

// BUILD EJS TO HTML AND RENAME
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
function generateHTML(cb) {
    src("./views/index.ejs")
        .pipe(ejs({
            title: "Hello Semaphore!",
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(dest("public"));
    cb();
}
exports.html = generateHTML;
// run: gulp html

// START ELSLINT
const eslint = require("gulp-eslint");
function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}
exports.lint = runLinter;
// run: gulp lint

// WATCHING
function watchFiles(cb) {
    watch('views/**.ejs', generateHTML);
    watch('sass/**.scss', generateCSS);
    watch([ '**/*.js', '!node_modules/**'], parallel(runLinter));
}
exports.watch = watchFiles;
// run: gulp watch
