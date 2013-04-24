var Generator = require('raptor-static-site-generator').Generator;
var Blog = require('./Blog');
var Post = require('./Post');
var blogUtil = require('./blog-util');
var File = require('raptor/files/File');
var templating = require('raptor/templating');
var logger = require('raptor/logging').logger('raptor-blog');
var raptor = require('raptor');

Generator.prototype.postsDir = function(postsDir) {
    this._postsDir = postsDir;
    this.baseDir(postsDir);
    return this;
}

Generator.prototype.properties = function(properties) {
    raptor.extend(this._blog, properties);
    return this;
}

Generator.prototype.theme = function(theme) {
    this._blog.setTheme(theme);
    return this;
}

exports.create = function() {

    var generator = require('raptor-static-site-generator').create();
    var blog = generator._blog = new Blog();
    blog.setTheme('default');

    generator
        .beforeGenerate(function(blogInfo) {
            blog.setOutputDir(generator.outputDir());

            // Build a database based on all of the metadata associated
            // with the posts
            var pages = blogInfo.pages;
            pages.forEach(function(page) {
                var templateFile = page.templateFile;
                var filenameNoExt = templateFile.getNameWithoutExtension();
                var jsonFilename = new File(templateFile.getParent(), filenameNoExt + '.json');
                var post = new Post();

                if (jsonFilename.exists()) {
                    raptor.extend(post, JSON.parse(jsonFilename.readAsString()));
                }

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

                var dependencies = post.dependencies || [];
                dependencies.splice(0, 0, { "module": 'themes/' + blog.getTheme()});
                post.dependencies = dependencies;

                var date = new Date(year, month, day);
                post.date = blogUtil.wrapDate(date);
                page.post = post;
                
                post.path = '/' + post.date.getYear() + '/' + post.date.getMonth() + '/' + post.date.getDay() + '/' + post.name;
                page.outputPath = post.path + '/index.html';
                blog.addPost(post);
            })
        })
        .beforeRenderPage(function(pageInfo) {
            // Update the page view model with the data that it needs
            var templateData = pageInfo.templateData;
            templateData.blog = generator._blog.clone();
            templateData.blog.setCurrentOutputDir(pageInfo.outputFile.getParentFile());
            var page = pageInfo.page;
            templateData.post = page.post;

            var context = pageInfo.context;
            var attributes = context.getAttributes();
            attributes.blog = templateData.blog;
            attributes.post = page.post;
        })
        .pageWriter(function(pageInfo) {
            // Write the post to file based on the post

            // Update the page view model with the data that it needs
            var templateData = pageInfo.templateData;
            var page = pageInfo.page;
            var outputFile = pageInfo.outputFile;
            var post = page.post;
            var layout = post.layout || 'post';
            templateData.post = page.post;

            var body = pageInfo.html;
            templateData.postBody = body;
            templateData.page = page;
            post.body = body;

            var template = 'themes/' + blog.getTheme() + '/layouts/' + layout + '.rhtml';
            var context = templating.createContext();

            var attributes = context.getAttributes();
            attributes.blog = templateData.blog;
            attributes.post = page.post;

            var promise = templating.renderAsync(
                template, 
                templateData, 
                context)
                .then(
                    function() {
                        outputFile.writeAsString(context.getOutput());
                        logger.info('Blog post written to "' + outputFile.getAbsolutePath() + '"');
                    },
                    function(e) {
                        logger.error('Failed to render page "' + post.id + '". Exception: ' + e, e);
                    });
            return promise;
        })
    return generator;
}
