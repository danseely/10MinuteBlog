var fs = require('fs');
var gulp = require('gulp');
var markdown = require('gulp-markdown');
var Handlebars = require('handlebars');
var tap = require('gulp-tap');
var rename = require('gulp-rename');

var posts = [];

gulp.task('index',  ['posts'], function(){
  return gulp.src('./templates/index.hbs')
    .pipe(tap(function(file){
      var indexTemplate = Handlebars.compile(file.contents.toString());
      var twoNewestPosts = posts.slice(-2);
      file.contents = new Buffer(indexTemplate({posts: twoNewestPosts.reverse()}, 'utf-8'))
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
})

gulp.task('posts', function(){
  posts = [];
  return gulp.src('./posts/**/*.md')
    .pipe(markdown())
    .pipe(tap(function(file){
      var postTemplate = Handlebars.compile(fs.readFileSync('./templates/post.hbs').toString());
      posts.push({ content: file.contents.toString(), path: file.path.replace(file.base, 'posts/') });
      file.contents = new Buffer(postTemplate(file.contents.toString()), 'utf-8');
    }))
    .pipe(gulp.dest('./posts'))
});

gulp.task('watch', function(){
  gulp.watch('./posts/**/*.md', ['index']);
  gulp.watch('./templates/**/*.hbs', ['index']);
})

gulp.task('default', ['index', 'watch']);
