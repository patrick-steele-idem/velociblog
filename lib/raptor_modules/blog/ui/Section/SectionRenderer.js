define(
    'blog/ui/Section/SectionRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {

                var blog = context.getAttributes().blog;
                var layouts = blog.layouts;
                if (!layouts) {
                    return;
                }

                var layoutName = input.layout;

                var layout = layouts[layoutName];
                if (!layout) {
                    layout = layouts['default'];
                }

                if (!layout) {
                    return;
                }

                var sections = layout.sections;
                if (!sections) {
                    return;
                }

                var sectionName = input.name;
                var section = sections[sectionName];
                if (!section || !section.length) {
                    return;
                }

                templating.render('blog/ui/Section', {
                    contentArray: section,
                    renderer: function(content) {
                        if (content.renderer) {
                            return require(content.renderer);
                        }
                        else if (content.component) {
                            var lastSlash = content.component.lastIndexOf('/');
                            var shortName = lastSlash === -1 ? content.component : content.component.substring(lastSlash+1);
                            return require(content.component + '/' + shortName + 'Renderer');
                        }
                    }
                }, context);
            }
        };
    });