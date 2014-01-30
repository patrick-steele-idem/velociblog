define(
    'ui/RecentPosts/RecentPostsRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render('ui/RecentPosts', {
                    count: input.count
                }, context);
            }
        };
    });