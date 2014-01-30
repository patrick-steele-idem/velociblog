var promises = require('raptor/promises');
var fs = require('fs');
var directoryWalker = require('directory-walker');
var File = require('raptor/files/File');
var Post = require('./Post');
var raptor = require('raptor');
var blogUtil = require('./blog-util');

function PostFinder(blog) {
    this._baseDir = null;
    this._blog = blog;
}

PostFinder.prototype = {
    baseDir: function(baseDir) {
        this._baseDir = baseDir;
    },

    findPosts: function() {
        var deferred = promises.defer();
        
        // One post per directory
        var postsByDir = {};
        var posts = [];
        var blog = this._blog;

        function onError(e) {
            deferred.reject(e);
        }

        function getPostForFile(file) {
            var parentDirPath = file.getParent();
            var post = postsByDir[parentDirPath];
            
            if (!post) {
                post = postsByDir[parentDirPath] = new Post();
                posts.push(post);
            }


            return post;
        }

        function handlePostFile(file) {
            var post = getPostForFile(file);

            if (file.getName() === 'post.json') {
                var postMeta = JSON.parse(file.readAsString());
                var dependencies = postMeta.dependencies;
                if (dependencies) {
                    post.addDependencies(dependencies);
                }
                delete postMeta.dependencies;
                raptor.extend(post, postMeta);
            }
            else if (file.getName() === 'post.rhtml') {
                post.templateFile = file;
            }
        }

        directoryWalker.create()
            .recursive(true)
            .onFile(function(path, eventArgs) {
                var file = new File(path);
                if (file.isFile()) {
                    handlePostFile(file);
                }                
            })
            .onError(onError)
            .onComplete(function() {

                posts.forEach(function(post) {


                    var templateFile = post.templateFile;

                    post.author = post.author || blog.author;
                    post.id = templateFile.getParentFile().getName();

                    var matches = /^(\d+)-(\d+)-(\d+)-(.+)$/.exec(post.id);
                    if (!matches) {
                        throw new Error("Invalid blog post directory name: " + templateFile.getParent());
                    }

                    var year = parseInt(matches[1], 10);
                    var month = parseInt(matches[2], 10);
                    var day = parseInt(matches[3], 10);
                    post.name = matches[4];
                    var date = new Date(year, month, day);
                    post.date = blogUtil.wrapDate(date);
                    
                    post.path = '/' + post.date.getYear() + '/' + post.date.getMonth() + '/' + post.date.getDay() + '/' + post.name;
                    post.outputPath = post.path + '/index.html';

                    blog.addPost(post);
                });

                deferred.resolve();
            })
            .walk(this._baseDir);

        return deferred.promise;
    }
};

module.exports = PostFinder;