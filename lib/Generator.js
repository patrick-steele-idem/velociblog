var Blog = require('./Blog');
var logger = require('raptor/logging').logger('raptor-blog');
var raptor = require('raptor');
var util = require('util');

var SiteGenerator = require('raptor-static-site-generator').Generator;


function Generator() {
    SiteGenerator.call(this);
    this._postsDir = null;
    this._blog = new Blog();
}

util.inherits(Generator, SiteGenerator);

Generator.prototype.getBlog = function() {
    return this._blog;
}

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

Generator.prototype.afterPostWritten = function(callback) {
    this.on('afterPostWritten', callback);
    return this;
}

module.exports = Generator;
