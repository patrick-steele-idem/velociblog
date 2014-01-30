define(
    'ui/Header/HeaderRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                var blog = context.getAttributes().blog;
                var linkManager = context.getAttributes().linkManager;

                templating.render('ui/Header', {
                    blog: blog,
                    linkManager: linkManager
                }, context);
            }
        };
    });