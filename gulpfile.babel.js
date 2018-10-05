/*
 * TODO: 
 * 		header comments for all files?
 */

// Imports
import gulp     from 'gulp'
import connect  from 'gulp-connect'
import sass     from 'gulp-sass'
import gulpif   from 'gulp-if'
import rename   from 'gulp-rename'

import del      from 'del'
import minimist from 'minimist'

// Config

const args = minimist(process.argv.slice(2));

const paths = {
	src: {
		pages: 'src/pages/',
		scripts: 'src/scripts/',
		styles: 'src/styles/'
	},
	dest: {
		pages: 'docs/',
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

	const cleanPages = () => {return del([`${paths.dest.pages}**`, `!${paths.dest.pages.slice(0,-1)}`, `!${paths.dest.pages}CNAME`,`!${paths.dest.scripts}**`, `!${paths.dest.styles}**`])}

	const pages = gulp.series(cleanPages, compilePages);
	pages.description = 'Clean and Compile pages';


	// Styles
	const compileStyles = () => {
		return gulp.src(`${paths.src.styles}*`)
			.pipe(sass(sassConfig).on('error', sass.logError))
			.pipe(gulp.dest(paths.dest.styles))
			.pipe(connect.reload())
	}

	const cleanStyles = () => {return del([`${paths.dest.styles}`])}

	const styles = gulp.series(cleanStyles, compileStyles);
	styles.description = 'Clean and compile styles';


const compile = gulp.parallel(pages, styles);
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

const watch = gulp.parallel(watchPages, watchStyles);
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
	pages,
	watch,
	serve,
}

export default defaultTasks