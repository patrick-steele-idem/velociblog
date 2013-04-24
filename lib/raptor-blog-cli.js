

exports.run = function() {
    require('raptor');
    require('raptor/logging').configure({
        loggers: {
            'raptor-static-website': {level: "INFO"},
            'raptor-blog': {level: "INFO"}
        }
    });

    function onError(e) {
        logger.error(e);
    }

    try
    {
        var cwd = process.cwd();
        var path = require('path');
        var logger = require('raptor/logging') .logger('raptor-blog');
        var templating = require('raptor/templating');
        var files = require('raptor/files');
        var File = require('raptor/files/File');
        var resources = require('raptor/resources');
        var path = require('path');

        var isDev;
        var post;

        var argv = require('optimist')(process.argv.slice(2))
            .usage('Usage: $0 \n[options]\n')
            .boolean('dev')
            .describe('dev', 'Enable the development profile for the optimizer')
            .check(function(argv) {
                if (argv._.length) {
                    post = argv._[0];
                }
                isDev = argv['dev'] === true;
            })
            .argv; 

        var blogJsonFile = new File(cwd, 'blog.json');
        if (!blogJsonFile.exists()) {
            throw new Error('Blog JSON file not found at path "' + blogJsonFile.getAbsolutePath() + '"');
        }
        var blogProperties = JSON.parse(blogJsonFile.readAsString());
        var postsDir = path.resolve(cwd, blogProperties['postsDir'] || 'posts');
        var optimizerConfigPath = path.resolve(cwd, blogProperties['optimizer-config.file'] || "optimizer-config.xml");

        if (files.exists(optimizerConfigPath)) {
            require('raptor/optimizer').configure(
                optimizerConfigPath, 
                {
                    profile: isDev ? 'development' : 'production'
                });
        }

        function addSearchPathDir(path) {
            if (files.exists(path)) {
                resources.addSearchPathDir(path);
            }
        }

        addSearchPathDir(path.join(__dirname, 'raptor_modules'));
        addSearchPathDir(cwd);
        addSearchPathDir(path.join(cwd, 'modules'));
        addSearchPathDir(path.join(cwd, 'raptor_modules'));

        require('raptor/templating/compiler').setWorkDir(path.join(cwd, "work"));

        
        var outputDir = blogProperties['outputDdir'] || 'build';
        outputDir = path.resolve(cwd, outputDir);

        require('./raptor-blog').create()
            .postsDir(postsDir)
            .theme(blogProperties.theme || 'default')
            .properties(blogProperties)
            .includeFilenamesInUrls(isDev)
            .generate(outputDir)
            .then(
                function() {
                    logger.info("Blog generated");
                },
                function(e) {
                    onError(e);
                });
    }
    catch(e) {
        onError(e);
    }
}