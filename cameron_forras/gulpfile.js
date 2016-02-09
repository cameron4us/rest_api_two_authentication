'use strict';
const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      mocha = require('gulp-mocha'),
      files = ['test/*.js', '!node_modules//**'];

gulp.task('lint', function() {
  return gulp.src(files)
    .pipe(eslint({
      extends: 'eslint:recommended', // imports general rules
      ecmaFeatures: {
        'modules': true,       // allows modules
        'blockBindings': true,  // allows const
        'arrowFunctions': true  // allows arrow functions
      },
      'rules': {
        'no-console': 0,       // allows console.logs without throwing err
        'semi': 2,             // requires semi-colons
        'no-unused-vars': 0
      },
      envs: [
        'node',
        'mocha'
      ]
    }))
    .pipe(eslint.format());
});

gulp.task('mocha', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha());
});

gulp.task('watch', function() {
  gulp.watch(files, ['lint']);
});

gulp.task('default', ['mocha', 'lint', 'watch']);
