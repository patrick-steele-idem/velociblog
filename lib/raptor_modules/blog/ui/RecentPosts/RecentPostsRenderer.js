define(
    'blog/ui/RecentPosts/RecentPostsRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render('blog/ui/RecentPosts', {
                    count: input.count
                }, context);
            }
        };
    });