var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    serve = require('gulp-serve'),
    webserver = require('gulp-webserver'),
    fs = require('fs'),
    assets = ['assets/components/polyfills.js'],
    components = JSON.parse(fs.readFileSync('assets/components.json'));

for (var index = 0; index < components.length; index++) {
    assets.push(components[index]);
}

assets.push('assets/POWLib.js');

gulp.task('PowServe', function () {
    return gulp.src(assets)
            .pipe(concat('POWLib.min.js'))
            //.pipe(uglify())
            .pipe(gulp.dest('public/js/compiled'))
            .pipe(webserver({
                port: 3000,
                livereload: false,
                directoryListing: {
                    path: "D:/soloProjects/powjs/powjs/public/"
                }
            }));
  });

gulp.task('PowBuild', function() {
        return gulp.src(assets)
                    .pipe(concat('POWLib.min.js'))
                    //.pipe(uglify())
                    .pipe(gulp.dest('public/js/compiled'));
    }
);