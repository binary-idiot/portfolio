/*
 * TODO: 
 * 		header comments for all files?
 */

// Imports
import gulp       from 'gulp'
import connect    from 'gulp-connect'
import sass       from 'gulp-sass'
import gulpif     from 'gulp-if'
import rename     from 'gulp-rename'
import sourcemaps from 'gulp-sourcemaps'
import resize     from 'gulp-responsive'
import size       from 'gulp-size'

import del        from 'del'
import minimist   from 'minimist'

// Config

const args = minimist(process.argv.slice(2));

const paths = {
	src: {
		pages: 'src/pages/',
		scripts: 'src/scripts/',
		styles: 'src/styles/',
		images: 'src/images/'
	},
	dest: {
		pages: 'docs/',
		scripts: 'docs/scripts/',
		styles: 'docs/styles/',
		images: 'docs/images/',
		sourcemaps: '../maps'
	}
}

const sizeConfig = {showFiles: true}; 

let sassConfig = {};
let resizeConfig = {};
let resizeOptions = {};

if(args.prod){
	sassConfig = {outputStyle: 'compressed'};
	resizeConfig = {
		'*.jpg':{
				width: 1000,
				rename: {suffix: '-large'}
		}
	}
}else{
	resizeOptions = {
		errorOnUnusedImage: false,
		passThroughUnused: true
	}
}


// Compile source
	// Pages 
	const compilePages = () => {
		return gulp.src(`${paths.src.pages}*`)
			.pipe(rename(path => {
				path.dirname = (path.basename == 'index')? ''  : path.basename;
				path.basename = 'index';
				path.extname = '.html';
			}))
			.pipe(gulp.dest(paths.dest.pages))
			.pipe(connect.reload());
	}

	const cleanPages = () => {return del([`${paths.dest.pages}**`, `!${paths.dest.pages.slice(0,-1)}`, `!${paths.dest.pages}CNAME`,`!${paths.dest.scripts}**`, `!${paths.dest.styles}**`, `!${paths.dest.images}**`])}

	const pages = gulp.series(cleanPages, compilePages);
	pages.description = 'Clean and Compile pages';


	// Styles
	const compileStyles = () => {
		return gulp.src(`${paths.src.styles}*`)
			.pipe(sourcemaps.init())
			.pipe(sass(sassConfig).on('error', sass.logError))
			.pipe(sourcemaps.write(paths.dest.sourcemaps))
			.pipe(gulp.dest(paths.dest.styles))
			.pipe(connect.reload())
	}

	const cleanStyles = () => {return del([`${paths.dest.styles}`])}

	const styles = gulp.series(cleanStyles, compileStyles);
	styles.description = 'Clean and compile styles';


	// Images 
	const compileImages = () => {
		return gulp.src(`${paths.src.images}*`)
			.pipe(size(sizeConfig))
			.pipe(resize(resizeConfig, resizeOptions))
			.pipe(size(sizeConfig))
			.pipe(gulp.dest(paths.dest.images))
			.pipe(connect.reload())
	}

	const cleanImages = () => {return del([`${paths.dest.images}`])}

	const images = gulp.series(cleanImages, compileImages);
	images.description = 'Clean and resize images'


const compile = gulp.parallel(pages, styles, images);
compile.description = 'Compile all sources';


// Watch for changes to sources
const watchPages = () => {
	return gulp.watch(`${paths.src.pages}*`)
		.on('all', gulp.series(pages));
}

const watchStyles = () => {
	return gulp.watch(`${paths.src.styles}*`)
		.on('all', gulp.series(styles));
}

const watchImages = () => {
	return gulp.watch(`${paths.src.images}`)
			.on('all', gulp.series(images))
}

const watch = gulp.parallel(watchPages, watchStyles, watchImages);
watch.description = 'Watch for changes to sources';


// Serve compiled sources
const startServer = () => {
	return connect.server({root: 'docs', livereload: true, port: 8000})
}

const serve = gulp.series(compile, startServer);
serve.description = 'Serve compiled source on localhost:8000';


// Default
const defaultTasks = gulp.parallel(serve, watch);

// Exports
export {
	compile,
	styles,
	images,
	pages,
	watch,
	serve,
}

export default defaultTasks