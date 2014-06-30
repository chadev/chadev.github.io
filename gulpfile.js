// include gulp and required plugins
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var cp = require('child_process');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


// build the jekyll site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// rebuild jekyll and do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// compile sass into both _site/assets/css (for live injecting) and site (for future jekyll builds)
gulp.task('compile-sass', function () {
    return gulp.src('assets/sass/**/*.scss')
        .pipe(sass({ sourcemap: true, style: 'compressed'}))
        .on("error", notify.onError(function (error) {
            return "Dang! " + error.message;
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('_site/assets/css'));
});

// minify PNG, JPEG, GIF and SVG images
gulp.task('imagemin', function () {
    return gulp.src('assets/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('_site/assets/images/'));
});

// start a server and watch for html and css changes
gulp.task('browser-sync', ['compile-sass', 'jekyll-build'], function() {  
    browserSync.init(['_site/assets/css/*.css'], {
        server: {
            baseDir: '_site'
        }
    });
});

// watch for changes
gulp.task('default', ['imagemin', 'browser-sync'], function () {  
    gulp.watch(['assets/sass/**/*.scss'], ['compile-sass']);
    gulp.watch(['assets/images/**/*'], ['imagemin']);
    gulp.watch([ '*.yml', '*.md', '_devs/*.md', '*.html', '_includes/*.html', '_layouts/*.html'], ['jekyll-rebuild']);
});