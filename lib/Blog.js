var Category = require('./Category');
var blogUtil = require('./blog-util');
var File = require('raptor/files/File');

function Blog() {
    this._categories = {};
    this._postsByName = {};
    this._posts = null;
    this._theme = 'default';
    this._includeFilenamesInUrls = true;
    this._outputDir = null;
    this._currentOutputDir = null;
}

Blog.prototype = {
    clone: function() {
        var clone = new Blog();
        require('raptor').extend(clone, this);
        return clone;
    },

    setTheme: function(theme) {
        this._theme = theme || 'default';
    },

    getTheme: function() {
        return this._theme;
    },

    setOutputDir: function(outputDir) {
        if (typeof outputDir === 'string') {
            outputDir = new File(outputDir);
        }
        this._outputDir = outputDir;
    },

    setCurrentOutputDir: function(currentOutputDir) {
        if (typeof currentOutputDir === 'string') {
            currentOutputDir = new File(currentOutputDir);
        }
        this._currentOutputDir = currentOutputDir;
    },

    addPost: function(post) {
        var categories = post.categories;
        categories.forEach(function(categoryName) {
            var category = this._categories[categoryName];
            if (!category) {
                category = new Category();
                this._categories[categoryName] = category;
            }
            category.addPost(post);
            this._postsByName[post.name] = post;
        }, this);
    },

    getPosts: function() {
        if (this._posts == null) {
            var posts = [];
            for (var postName in this._postsByName) {
                if (this._postsByName.hasOwnProperty(postName)) {
                    var post = this._postsByName[postName];
                    posts.push(post);
                }
            }
            this._posts = blogUtil.sortPostsNewestFirst(posts);
        }
        return this._posts;
    },

    getRecentPosts: function(count) {
        if (!count) {
            count = this.recentCount || 5;
        }

        var posts = this.getPosts();
        return posts.slice(0, Math.max(count, posts.length));
    },

    categoryUrl: function(category) {
        return this.url('/categories/' + category);
    },

    postUrl: function(post) {
        return '';
    },

    url: function(url) {

        var isIndexHtml = url.lastIndexOf('.') === -1 || url.charAt(url.length-1) === '/';

        url = require('path').relative(this._currentOutputDir.getAbsolutePath(), this._outputDir.getAbsolutePath()) + url;

        if (isIndexHtml) {
            //The URL is a page
            if (url.charAt(url.length-1) !== '/') {
                url += '/';
            }
            if (this._includeFilenamesInUrls !== false) {
                url += 'index.html';
            }
        }

        if (url.charAt(0) === '/') {
            url = '.' + url;
        }


        return url;           
    }
}

module.exports = Blog;