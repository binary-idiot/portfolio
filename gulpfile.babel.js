/*
 * TODO: 
 * 		Add sass config, gulp-if for production vs development modes, header comments for all files?
 * 		Change html files to have separate dir in src
 */

// Imports
import gulp     from 'gulp'
import connect  from 'gulp-connect'
import sass     from 'gulp-sass'
import gulpif   from 'gulp-if'

import del      from 'del'
import minimist from 'minimist'

// Config

const args = minimist(process.argv.slice(2));

const paths = {
	src: {
		markup: 'src/',
		scripts: 'src/scripts/',
		styles: 'src/styles/'
	},
	dest: {
		markup: 'docs/',
		scripts: 'docs/scripts/',
		styles: 'docs/styles/'
	}
}

let sassConfig;

if(args.prod){
	sassConfig = {outputStyle: 'compressed'};
}else{
	sassConfig = {};
}


// Compile source
	// Markup 
	const compileMarkup = () => {
		return gulp.src(`${paths.src.markup}*.html`)
			.pipe(gulp.dest(paths.dest.markup))
			.pipe(connect.reload());
	}

	const cleanMarkup = () => {return del([`${paths.dest.markup}*.html`])}

	const markup = gulp.series(cleanMarkup, compileMarkup);
	markup.description = 'Clean and Compile markup';


	// Styles
	const compileStyles = () => {
		return gulp.src(`${paths.src.styles}*`)
			.pipe(sass(sassConfig).on('error', sass.logError))
			.pipe(gulp.dest(paths.dest.styles))
			.pipe(connect.reload())
	}

	const cleanStyles = () => {return del([`${paths.dest.styles}*`])}

	const styles = gulp.series(cleanStyles, compileStyles);
	styles.description = 'Clean and compile styles';


const compile = gulp.parallel(markup, styles);
compile.description = 'Compile all sources';


// Watch for changes to sources
const watchMarkup = () => {
	return gulp.watch(`${paths.src.markup}*.html`)
		.on('all', gulp.series(markup));
}

const watchStyles = () => {
	return gulp.watch(`${paths.src.styles}*`)
		.on('all', gulp.series(styles));
}

const watch = gulp.parallel(watchMarkup, watchStyles);
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
	markup,
	watch,
	serve,
}

export default defaultTasks