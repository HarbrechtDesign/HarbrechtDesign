var gulp = require("gulp"),
    gutil = require("gulp-util"),
    sass = require("gulp-sass"),
    header = require("gulp-header"),
    browserSync = require("browser-sync"),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    cssnano = require("gulp-cssnano"),
    concat = require('gulp-concat'),
    package = require("./package.json");

var banner = [
    "/*!\n" +
    " * <%= package.name %>\n" +
    " * <%= package.title %>\n" +
    " * <%= package.url %>\n" +
    " * @author <%= package.author %>\n" +
    " * @version <%= package.version %>\n" +
    " * Copyright " +
    new Date().getFullYear() +
    ". <%= package.license %> licensed.\n" +
    " */",
    "\n"
].join("");

gulp.task("css", function() {
    gulp
        .src("node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css")
        .pipe(gulp.dest("public/css"));
    gulp
        .src(["resources/scss/app.scss"])
        // .pipe(concat("app.scss"))
        .pipe(sass({
            debugInfo: true,
            lineNumbers: true
        }).on("error", sass.logError))
        .pipe(autoprefixer("last 4 version"))
        .pipe(gulp.dest("public/css"))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(header(banner, { package: package }))
        .pipe(gulp.dest("public/css"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", function() {
    gulp
        .src(["./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min","./node_modules/body-scroll-lock/lib/bodyScrollLock.js", "resources/js/app.js"])
        .pipe(concat("app.js"))
        .pipe(gulp.dest("public/js"))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .on("error", function(err) {
            gutil.log(gutil.colors.red("[Error]"), err.toString());
        })
        .pipe(gulp.dest("public/js"))
        .pipe(browserSync.reload({ stream: true, once: true }));
});

gulp.task("browser-sync", function() {
    browserSync.init(null, {
        server: {
            baseDir: "public"
        },
        ghostMode: false
    });
});
gulp.task("bs-reload", function() {
    browserSync.reload();
});

gulp.task("default", ["css", "js", "browser-sync"], function() {
    gulp.watch("resources/scss/**/*.scss", ["css", "bs-reload"]);
    gulp.watch("resources/js/*.js", ["js","bs-reload"]);
    gulp.watch("public/*.html", ["bs-reload"]);
});