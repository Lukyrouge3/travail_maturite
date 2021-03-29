let gulp = require('gulp');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('tsconfig.json');
let spawn = require('child_process').spawn;
let node;
let plumber = require('gulp-plumber');
let babel = require('gulp-babel');
let babel_ops = {};

function run(cb) {
    if (node) node.kill();
    gulp.src("src/**/*.ts").pipe(tsProject()).js.pipe(plumber()).pipe(babel(babel_ops)).pipe(gulp.dest("./dist"));
    gulp.src("src/**/*.js").pipe(plumber()).pipe(babel(babel_ops)).pipe(gulp.dest("./dist"));
    node = spawn('node', ['dist/main.js'], {stdio: 'inherit'});
    node.on("close", function (code) {});
    cb();
}

gulp.task('run', run);


gulp.task("default", function () {
    run(() => {});
    gulp.watch(['src/**/*.ts', 'src/**/*.js'], run);
});

process.on('exit', function () {
    if (node) node.kill()
});