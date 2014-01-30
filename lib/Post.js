function Post() {
    this.layout = null;
    this.dependencies = [];
}

Post.prototype = {
    addDependency: function(dependency) {
        this.dependencies.push(dependency);
    },

    addDependencies: function(dependencies) {
        this.dependencies = this.dependencies.concat(dependencies);
    }
}

module.exports = Post;