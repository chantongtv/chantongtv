/*
|--------------------------------------------------------------------------
| Gulpfile
|--------------------------------------------------------------------------
*/

var gulp = require('gulp');

// Plugins
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var fileinclude = require('gulp-file-include')
var usemin = require('gulp-usemin');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var htmlReplace = require('gulp-html-replace');
var sass = require('gulp-sass');
var cssComb = require('gulp-csscomb');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var cache = require('gulp-cache');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var csslint = require('gulp-csslint');
var header = require('gulp-header');
var babel = require('gulp-babel');
var notify = require('gulp-notify');
var connect = require('gulp-connect');

var path = require('path');
var browserSync = require('browser-sync').create();
var msbuild = require("gulp-msbuild");
var iisexpress = require('gulp-serve-iis-express');
var minify = require('gulp-minifier');

var PORT = '52425';

/*
|--------------------------------------------------------------------------
| Paths
|--------------------------------------------------------------------------
*/

var paths = {

    sass : [ 
		'assets/sass/**/*.scss',
		'assets/sass/style.scss'
    ],   
    js_lint : [ 
		'assets/js/vendor/*.js' ,
		'assets/js/core/*.js',
		'assets/js/model/*.js',
		'assets/js/components/*.js',
		'assets/js/controller/*.js'
    ],
    css_lint : [ 
		'assets/css/**/*.css'
    ],
    js : [
		//Vendor
		'assets/js/vendor/jquery-3.3.1.min.js',

		'assets/js/vendor/slick.js',
		'assets/js/vendor/jquery.mask.js',
		'assets/js/vendor/isotope.pkgd.min.js',
		'assets/js/vendor/jquery.stellar.min.js',

		//'assets/js/vendor/jquery.mCustomScrollbar.js',
		//'assets/js/vendor/jquery.center.js',
		//'assets/js/vendor/tinysort.min.js',
		//'assets/js/vendor/nouislider.js',
		//'assets/js/vendor/formatCases.js',
		//'assets/js/vendor/isMobile.js',
		//'assets/js/vendor/html2canvas.js',

		//System
		'assets/js/core/_nameSpace.js',
		'assets/js/core/_core.js',
		'assets/js/model/*.js',
		'assets/js/components/*.js',
		'assets/js/controller/*.js' 
	],
	jsMin : [
		'dist/js/scripts.js',
	],
	jsCopy : [
		//Vendor
		'assets/js/vendor/jquery-3.3.1.min.js',

		'assets/js/vendor/slick.js',
		'assets/js/vendor/jquery.mask.js',
		'assets/js/vendor/isotope.pkgd.min.js',
		'assets/js/vendor/jquery.stellar.min.js',

		//System
		'assets/js/core/_nameSpace.js',
		'assets/js/core/_core.js',
		'assets/js/model/*.js',
		'assets/js/components/*.js',
		'assets/js/controller/*.js' 
	],
    css : [
		'assets/css/*.css'
	],
	html : [
		'html/*.html',
	],
	view : [
		'html/*.html',
		'html/include/*.html',
	],

}

var outputDist = 'dist';
var outputJs = 'dist/assets/js';
var outputCss = 'dist/assets/css';
var outputImages = 'dist/assets/img';
var outputFonts = 'dist/assets/fonts';

/*
|--------------------------------------------------------------------------
| Sources CS
|--------------------------------------------------------------------------
*/
var sources = [
    'Controllers/*.cs',
    'Helpers/*.cs',
    'ViewModel/**/*.cs'
];
var views = [
    'Views/**/*.cshtml',
];


/*
|--------------------------------------------------------------------------
| Tarefas Gerais
|--------------------------------------------------------------------------
*/

//Default
gulp.task('default', function () {
	runSequence('watch');
});

//Build
gulp.task('build', function () {
	runSequence('clean:dist', 'clear:cache',
	//['usemin', 'fonts', 'images'], 'html-copy');
	['concat-js', 'concat-css', 'html-replace', 'fonts', 'images'], 'html-copy');
});

//Start CS
gulp.task('startcs', ['server', 'buildVS'], function() {
    browserSync.init({
        baseDir: 'content',
        proxy: 'http://localhost:' + PORT,
        notify: false,
        ui: false
    });
    gulp.watch(sources, ['buildVS']);
    return gulp.watch(views, ['reload']);
});

/*
|--------------------------------------------------------------------------
| Tarefas
|--------------------------------------------------------------------------
*/

//Task de Watch (browserSync / Watch)
gulp.task('watch', function() {
	browserSync.init({
		server: {
			baseDir: './'
			//proxy: "localhost:3000"
		}
	});

	gulp.watch('assets/sass/**/*.scss').on('change', browserSync.reload);
	gulp.watch('assets/js/*.js').on('change', browserSync.reload);
	//gulp.watch('*.html').on('change', browserSync.reload);
	gulp.watch(paths.view, ['fileinclude']).on('change', browserSync.reload);

	//Lint JS
	gulp.watch(paths.js_lint, ['js-copy']).on('change', function(event) {
		console.log('Compilando JS - ' + event.path);
        gulp.src(event.path)
            .pipe(jshint())
			//.pipe(jshint.reporter(jshintStylish))
    });

	//Lint CSS
    // gulp.watch(paths.css_lint, ['sass']).on('change', function(event) {
    //     console.log("Linting CSS - " + event.path);
    //     gulp.src(event.path)
    //         .pipe(csslint())
	// 		.pipe(csslint.formatter());
    // });

	//Compila SASS
    gulp.watch(paths.sass).on('change', function(event) {
    	console.log('Compilando SASS - ' + event.path);
		gulp.src(paths.sass)
			.pipe(plumber())
			.pipe(sass())
			.pipe(autoprefixer())
			.pipe(cssComb())
			.pipe(gulp.dest('assets/css'))
			.pipe(notify('SASS Compilado'));
    });

});

gulp.task('html-copy', function () {
	return gulp
		.src('./*.html')
		.pipe(gulp.dest('dist'))
});

/*
|--------------------------------------------------------------------------
| Tarefas para Desenvolvimento
|--------------------------------------------------------------------------
*/

// Sass
gulp.task('sass', function () {
	return gulp
		.src(paths.sass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cssComb())
		.pipe(gulp.dest('assets/css'))
		.pipe(notify('SASS Compilado'));
});

//Copy JS
gulp.task('js-copy', function () {
	return gulp
		.src(paths.jsCopy)
		.pipe(plumber())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('assets/js'))
		.pipe(notify('JavaScript Compilado'));
});

gulp.task('js-copy-build', function () {
	return gulp
		.src(paths.js)
		.pipe(plumber())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('assets/js'))
		.pipe(notify('JavaScript Compilado'));
});

gulp.task('fileinclude', function() {
	gulp.src(paths.html)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: './html/include'
		}))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.reload({stream: true}));
});

/*
|--------------------------------------------------------------------------
| Tarefas de Otimização (USEMIN)
|--------------------------------------------------------------------------
*/

//Concatena, Minifica, Replace HTML e coloca os prefixers dos arquivos JS e CSS
/* - Envolver os scripts nas TAGs utilizadas pelo usemin
<!-- build:css css/style.min.css -->
<!-- endbuild -->
<!-- build:js js/scripts.min.js -->
<!-- endbuild -->
*/
gulp.task('usemin', ['sass', 'js-copy-build'], function(){
	return gulp
		.src(paths.html)
		.pipe(plumber())
		.pipe(header('\ufeff'))
		.pipe(usemin({
			'html' : [fileinclude],
			//'html' : [ htmlmin({ collapseWhitespace: true }) ],
			'js' : [minify({
						minify: true,
						minifyJS : true,
					})],
			'css' : [autoprefixer, cssmin]
		}))
		.pipe(gulp.dest(outputDist));
});

/*
|--------------------------------------------------------------------------
| Tarefas de Otimização (SEM USEMIN)
|--------------------------------------------------------------------------
*/
//Concatena e Minifica os arquivos JS
gulp.task('concat-js', function () {
	runSequence('concat-js-full', 'concat-js-others');
});

gulp.task('concat-js-full', function(){
	return gulp
		.src(paths.js)
		.pipe(plumber())
		.pipe(concat('scripts.js'))
		.pipe(babel({
            presets: ['env']
        }))
		.pipe(uglify())
		.pipe(gulp.dest(outputJs));
});

gulp.task('concat-js-others', function(){
	return gulp
		.src(paths.jsMin)
		.pipe(plumber())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(outputJs));
});

//Concatena e Minifica os arquivos CSS
gulp.task('concat-css', function(){
	return gulp
		.src(paths.css)
		.pipe(plumber())
		.pipe(concat('style.css'))
		.pipe(cssmin())
		.pipe(gulp.dest(outputCss));
});

//Replace no HTML dos arquivos concatenados
gulp.task('html-replace', function(){
	return gulp
		.src('./*.html')
		.pipe(header('\ufeff'))
		.pipe(htmlReplace({
			js: 'js/scripts.js',
			css: 'css/style.css'
		}))
		.pipe(gulp.dest(outputDist));
});

// Otimiza as Imagens
gulp.task('optimize-img', function(){
	return gulp
		.src('assets/img/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest(outputImages));
});

// Copia as Fonts
gulp.task('fonts', function () {
	return gulp
		.src('assets/fonts/**/*')
		.pipe(gulp.dest(outputFonts))
});

// Copia as Imagens
gulp.task('images', function () {
	return gulp
		.src('assets/img/**/*')
		.pipe(gulp.dest(outputImages))
});

/*
|--------------------------------------------------------------------------
| Tarefas de Limpeza
|--------------------------------------------------------------------------
*/

// Clean dist folder
gulp.task('clean:dist', function(){
	return gulp.src('dist')
		.pipe(clean());
});

// Clear Cache
gulp.task('clear:cache', function () {
	return cache.clearAll();
});

/*
|--------------------------------------------------------------------------
| Start Servidor CS
|--------------------------------------------------------------------------
*/
gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('buildVS', function() {
    return gulp.src("../AppPadrao.sln")
        .pipe(plumber())
        .pipe(msbuild({
            toolsVersion: 'auto',
            logCommand: true
        }));
});

gulp.task('server', function() {
    var configPath = path.join(__dirname, '..\\.vs\\config\\applicationhost.config');
    iisexpress({
        siteNames: ['AppPadrao.Web'],
        configFile: configPath,
        port: PORT
    });
});
