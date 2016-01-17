/**
 * Created by sth on 1/17/16.
 */
module.exports = {
  js: [
    './config/*.js',
    '<%= yeoman.app %>/scripts/**/*.js',
    '<%= yeoman.app %>/scripts/*.js',
    '<%= yeoman.app %>/scripts/controllers/**/*.js'
  ],
  css: [
    '<%= yeoman.app %>/styles/*.css',
    '<%= yeoman.app %>/styles/**/*.css'
  ],
  views: [
    '<%= yeoman.app %>/views/*.html',
    '<%= yeoman.app %>/views/**/*.html'
  ],
  images: [
    '<%= yeoman.app %>/images/*.*',
    '<%= yeoman.app %>/images/**/*.*'
  ]
};
