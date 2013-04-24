function Category() {
    this.posts = [];
}

Category.prototype = {
    addPost: function(post) {
        this.posts.push(post);
    },

    getPosts: function() {
        return this.posts;
    }
}

module.exports = Category;