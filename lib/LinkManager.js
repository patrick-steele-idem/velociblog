function LinkManager(options) {
    this.currentDirPath = options.currentDir.getAbsolutePath();
    this.outputDirPath = options.outputDir.getAbsolutePath();
    this.includeFilenamesInUrls = options.includeFilenamesInUrls === true;
}

LinkManager.prototype = {

    categoryUrl: function(category) {
        return this.url('/categories/' + category);
    },

    postUrl: function(post) {
        return '';
    },

    url: function(url) {

        var isIndexHtml = url.lastIndexOf('.') === -1 || url.charAt(url.length-1) === '/';

        url = require('path').relative(this.currentDirPath, this.outputDirPath) + url;

        if (isIndexHtml) {
            //The URL is a page
            if (url.charAt(url.length-1) !== '/') {
                url += '/';
            }
            if (this.includeFilenamesInUrls !== false) {
                url += 'index.html';
            }
        }

        if (url.charAt(0) === '/') {
            url = '.' + url;
        }


        return url;           
    }
};

module.exports = LinkManager;