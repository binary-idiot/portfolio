// Imports
import gulp    from 'gulp'
import connect from 'gulp-connect'
import del     from 'del'

// Config
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

// Compile source
	// Markup 
	const compileMarkup = () => {
		return gulp.src(`${paths.src.markup}*.html`)
			.pipe(gulp.dest(paths.dest.markup))
			.pipe(connect.reload());
	}

	const cleanMarkup = () => {return del([`${paths.dest.markup}*.html`])}

	const markup = gulp.series(cleanMarkup, compileMarkup);
	markup.description = 'Clean and Compile html';


const compile = gulp.parallel(markup);
compile.description = 'Compile all sources';


// Watch for changes to sources
const watchMarkup = () => {
	return gulp.watch(`${paths.src.markup}*.html`)
		.on('all', gulp.series(markup));
}

const watch = gulp.parallel(watchMarkup);
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