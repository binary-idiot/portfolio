const gulp = require('gulp');
const connect = require('gulp-connect');

gulp.task('default', gulp.series(html, serve));

function serve() {return connect.server({root: 'docs', port: 8000})}

function html(){
	return gulp.src('src/*.html')
		.pipe(gulp.dest('docs/'))
}