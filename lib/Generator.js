var Blog = require('./Blog');
var PostFinder = require('./PostFinder');
var logger = require('raptor/logging').logger('velociblog');
var raptor = require('raptor');
var util = require('util');
var events = require('events');
var promises = require('raptor/promises');
var templating = require('raptor/templating');
var File = require('raptor/files/File');
var LinkManager = require('./LinkManager');
var resources = require('raptor/resources');

function Generator() {
    this._postsDir = null;
    this._blog = new Blog();
    this._postFinder = new PostFinder(this._blog);
    this._deferred = promises.defer();
    this._outputDir = null;
    events.EventEmitter.call(this);
}

util.inherits(Generator, events.EventEmitter);

raptor.extend(Generator.prototype, {
    getBlog: function() {
        return this._blog;
    },

    postsDir: function(postsDir) {

        this._postsDir = postsDir;
        this._postFinder.baseDir(postsDir);
        return this;
    },

    includeFilenamesInUrls: function(includeFilenamesInUrls) {
        this._blog._includeFilenamesInUrls = includeFilenamesInUrls;
        return this;
    },

    properties: function(properties) {
        raptor.extend(this._blog, properties);
        return this;
    },

    theme: function(theme) {
        this._blog.setTheme(theme);
        return this;
    },

    afterPostWritten: function(callback) {
        this.on('afterPostWritten', callback);
        return this;
    },

    outputDir: function(outputDir) {
        if (arguments.length === 0) {
            return this._outputDir;
        }

        this._outputDir = new File(outputDir);
        return this;
    },

    generate: function(outputDir) {
        if (outputDir) {
            this.outputDir(outputDir);
        }

        function onError(e) {
            this._deferred.reject(e);
        }


        var _this = this;
        var deferred = this._deferred;
        var blog = this._blog;

        var completedCount = 0;

        function createContext(linkManager) {
            if (!linkManager) {
                throw new Error("link manager is required");
            }
            var renderContext = templating.createContext();
            renderContext.getAttributes().blog = blog;
            renderContext.getAttributes().linkManager = linkManager;
            return renderContext;
        }
        

        function renderPostPage(post) {
            var outputFile = post.outputFile;
            var layout = post.layout || 'post';
            var postTemplate = 'themes/' + blog.getTheme() + '/layouts/' + layout + '/' + layout + '-layout.rhtml';

            post.addDependency({ "module": 'themes/' + blog.getTheme()});
            post.addDependency({ "module": 'themes/' + blog.getTheme() + '/layouts/' + layout});

            return templating.renderToFile(
                postTemplate,
                {
                    post: post,
                    blog: post.blog,
                    linkManager: post.linkManager
                },
                outputFile,
                createContext(post.linkManager));
        }

        function renderPostBody(post) {
            var searchPath = require('raptor/resources').getSearchPath();
            var templatePath = post.templateFile.getAbsolutePath();
            var resourcePath = null;

            searchPath.forEachEntry(function(entry) {
                if (resourcePath) {
                    return;
                }

                if (entry.getDir) {
                    var searchPathDir = '' + entry.getDir();
                    if (templatePath.startsWith(searchPathDir)) {
                        resourcePath = templatePath.substring(searchPathDir.length);
                    }
                }
            });

            return templating.renderToStringAsync(
                resourcePath || templatePath,
                {
                    post: post,
                    blog: post.blog,
                    linkManager: post.linkManager
                },
                createContext(post.linkManager));
        }

        function renderPosts() {
            var deferred = promises.defer();

            if (blog.getPostCount() === 0) {
                deferred.resolve();
                return deferred.promise;
            }

            function handleRenderPostComplete() {
                if (++completedCount === blog.getPostCount()) {
                    deferred.resolve();
                }
            }

            blog.forEachPost(function(post) {
                post.outputFile = new File(_this._outputDir, post.outputPath);
                post.outputDir = post.outputFile.getParentFile();
                post.blog = blog;

                post.linkManager = new LinkManager({
                    outputDir: _this._outputDir,
                    currentDir: post.outputDir,
                    includeFilenamesInUrls: _this._includeFilenamesInUrls
                });

                var templateFile = post.templateFile;
                renderPostBody(post).then(
                    function(postBody) {
                        post.body = postBody;
                        renderPostPage(post)
                            .then(
                                handleRenderPostComplete,
                                onError);
                    },
                    onError);

            });

            function onError(e) {
                deferred.reject(e);
            }

            return deferred.promise;
        }

        this._postFinder.findPosts()
            .then(
                function() {
                    _this.emit('beforeGenerate', {
                        blog: blog
                    });

                    renderPosts()
                        .then(
                            function() {
                                _this._deferred.resolve();
                            },
                            onError);
                    
                },
                onError);

        return this._deferred.promise;
    }
});

module.exports = Generator;
