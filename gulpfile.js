var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		minifycss    = require('gulp-minify-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		jade         = require('gulp-jade'),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglifyjs'),
		spritesmith  = require('gulp.spritesmith'),
		sourcemaps	 = require('gulp-sourcemaps');

gulp.task('browser-sync', ['styles', 'scripts', 'jade'], function() {
		browserSync.init({
				server: {
						baseDir: "./app"
				},
				notify: false
		});
});

gulp.task('styles', function () {
	return gulp.src('dev/sass/**/*\.+(sass|scss|css)')
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	// .pipe(minifycss())
	.pipe(sourcemaps.write(''))
	.pipe(gulp.dest('app/assets/css'))
	.pipe(browserSync.stream());
});

// //install
// //npm i browser-sync gulp gulp-less gulp-autoprefixer gulp-sourcemaps gulp-plumber
// var browserSync = require('browser-sync');
// var less = require('gulp-less');
// var autoprefixer = require('gulp-autoprefixer');
// var sourcemaps = require('gulp-sourcemaps');
// var plumber = require('gulp-plumber');
//
// //compile less, create sourcemaps and refresh browsers
// gulp.task('less', function() {
//     //less, sourcemaps and refresh
//     return gulp.src('app/less/*.less')
//         .pipe(sourcemaps.init())
//         .pipe(plumber())
//         .pipe(less().on('error', gutil.log))
//         .pipe(autoprefixer())
//         .pipe(sourcemaps.write(''))
//         .pipe(gulp.dest('app/css'))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });
//
// //browserSync settings
// gulp.task('browser-sync', function() {
//     browserSync({
//         browser: "google chrome",
//         server: {
//             baseDir: 'app'
//         },
//         notify: false
//     });
// });
//
// //watch settings
// gulp.task('watch', ['browser-sync', 'less'], function() {
//     gulp.watch('app/less/*.less', ['less']);
//     gulp.watch('app/*.html', browserSync.reload);
//     gulp.watch('app/js/*.js', browserSync.reload);
// });
//
// //set default task
// gulp.task('default', ['watch']);

gulp.task('jade', function() {
	return gulp.src('dev/jade/pages/*.jade')
	.pipe(jade({
      pretty: true
    }))
	.pipe(gulp.dest('app'));
});

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./dev/sprite/*.*')
            .pipe(spritesmith({
                imgName: '../img/sprite.png',
                cssName: '_sprite.sass',
                cssFormat: 'sass',
                algorithm: 'binary-tree',
                padding: 10
            }));

    spriteData.img.pipe(gulp.dest('./app/assets/img/'));
    spriteData.css.pipe(gulp.dest('./dev/sass/'));
});

gulp.task('libs', function() {
	return gulp.src([
			'./app/assets/vendor/jquery/dist/jquery.min.js',
			'./app/assets/vendor/wnumb/wNumb.js',
			'./app/assets/vendor/slick-carousel/slick/slick.js',
			'./app/assets/vendor/nanoscroller/bin/javascripts/jquery.nanoscroller.min.js',
			'./app/assets/vendor/nouislider/distribute/nouislider.min.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/assets/js/'));
});

gulp.task('scripts', function() {
	return gulp.src('dev/script/**/*.js')
		.pipe(concat('common.js'))
		// .pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/assets/js/'));
});

gulp.task('watch', function () {
	gulp.watch('dev/jade/**/*.jade', ['jade']);
	gulp.watch('dev/sass/**/*\.+(sass|scss|css)', ['styles']);
	gulp.watch('dev/sprite/**/*.*', ['sprite']);
	gulp.watch('dev/script/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/images/sprite.png').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['jade', 'sprite', 'styles', 'libs', 'scripts', 'browser-sync', 'watch']);
