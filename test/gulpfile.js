const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const pug = require("gulp-pug");
const nunjucksRender = require("gulp-nunjucks-render");
const htmlbeautify = require("gulp-html-beautify");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify-es").default;
const urlAdjuster = require('gulp-css-url-adjuster');

// PostCSS
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const cssnext = require("postcss-cssnext");
const cssnano = require("cssnano");

gulp.task("browserSync", function () {
	browserSync.init({
		server: {
			baseDir: "./dist",
		},
		notify: false,
		open: false,
	});

	// gulp.watch('app/**/*.html', gulp.series('html'));
	// gulp.watch('app/**/*.+(html|pug)', gulp.series('pug'));
	gulp.watch("app/**/*.+(html|njk)", gulp.series("nunjucks"));
	gulp.watch("app/**/*.+(scss|sass|css)", gulp.series("sass"));
	gulp.watch("app/js/**/*.js", gulp.series("js"));
	gulp.watch(
		"app/images/**/*.+(jpg|png|svg|gif|jpeg)",
		gulp.series("images")
	);
	gulp.watch("app/fonts/**/*.+(eot|woff|ttf|woff2)", gulp.series("fonts"));
});

gulp.task("sass", function () {
	var postcssPlugins = [cssnext(), cssnano()];

	var sassSettings = {
		outputStyle: "compressed",
	};

	return gulp
		.src("app/scss/style.+(scss|sass)")
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass(sassSettings))
		.pipe(postcss(postcssPlugins))
		// .pipe(sourcemaps.write("."))
		.pipe(urlAdjuster({
			prepend: '../images/',
		}))
		.pipe(gulp.dest("dist/css"))
		.on("end", browserSync.reload);
});

gulp.task("nunjucks", function () {
	var htmlBeautifySettings = {
		indent_size: 1,
		indent_char: "\t",
	};

	return gulp
		.src("app/*.+(html|njk)")
		.pipe(
			nunjucksRender({
				path: ["app/components/"], // String or Array
				data: {
					src: "images/",
				},
			})
		)
		.pipe(htmlbeautify(htmlBeautifySettings))
		.pipe(gulp.dest("dist"))
		.on("end", browserSync.reload);
});

gulp.task("html", function () {
	return gulp
		.src("app/*.html")
		.pipe(gulp.dest("dist/"))
		.on("end", browserSync.reload);
});

gulp.task("pug", function () {
	return gulp
		.src("app/*.+(html|pug)")
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(gulp.dest("dist/"))
		.on("end", browserSync.reload);
});

gulp.task("js", function () {
	var bundler = browserify("./app/js/script.js", { debug: true }).transform(
		babelify.configure({
			presets: ["@babel/preset-env"],
			sourceMaps: true,
		})
	);

	return bundler
		.bundle()
		.pipe(source("script.min.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("dist/js"))
		.on("end", browserSync.reload);
});

gulp.task("images", function () {
	return gulp
		.src("app/images/**/*.+(jpg|png|svg|gif|jpeg)")
		.pipe(gulp.dest("dist/images"))
		.on("end", browserSync.reload);
});

gulp.task("fonts", function () {
	return gulp
		.src("app/fonts/**/*.+(eot|woff|ttf|woff2)")
		.pipe(gulp.dest("dist/fonts"))
		.on("end", browserSync.reload);
});

gulp.task(
	"watch",
	gulp.parallel(
		"browserSync",
		gulp.series("nunjucks", "sass", "js", "images", "fonts")
	)
);

gulp.task("default", gulp.series("watch"));
