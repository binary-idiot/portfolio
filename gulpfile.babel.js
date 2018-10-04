// Imports
import gulp    from 'gulp'
import connect from 'gulp-connect'

// Compile source
	// Markup 
	const compileMarkup = () => {
		return gulp.src('src/*.html')
			.pipe(gulp.dest('docs/'))
			.pipe(connect.reload());
	}

	const markup = gulp.series(compileMarkup);
	markup.description = 'Compile html';


const compile = gulp.parallel(markup);
compile.description = 'Compile all sources';


// Watch for changes to sources
const watchMarkup = () => {
	return gulp.watch('src/*.html')
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