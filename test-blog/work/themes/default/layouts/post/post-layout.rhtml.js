$rset("rhtml", "themes/default/layouts/post/post-layout.rhtml", function(helpers) {
  var empty = helpers.e,
      notEmpty = helpers.ne,
      getTagHandler = helpers.t,
      raptor_templating_taglibs_optimizer_PageTag = getTagHandler("raptor/templating/taglibs/optimizer/PageTag"),
      escapeXml = helpers.x,
      raptor_templating_taglibs_optimizer_SlotTag = getTagHandler("raptor/templating/taglibs/optimizer/SlotTag"),
      ui_Header_HeaderRenderer = getTagHandler("ui/Header/HeaderRenderer"),
      forEachWithStatusVar = helpers.fv,
      escapeXmlAttr = helpers.xa,
      ui_Section_SectionRenderer = getTagHandler("ui/Section/SectionRenderer"),
      raptor_templating_taglibs_widgets_InitWidgetsTag = getTagHandler("raptor/templating/taglibs/widgets/InitWidgetsTag");

  return function(data, context) {
    var post = data.post,
        blog = data.blog,
        linkManager = data.linkManager;

    context.t(
      raptor_templating_taglibs_optimizer_PageTag,
      {
        "templatePath": "/themes/default/layouts/post/post-layout.rhtml",
        "name": "index",
        "basePath": data.pageOutputDir,
        "dependencies": post.dependencies
      },
      function(_dependenciesParent) {
      });

    function formattedDate() {
      return context.c(function() {
        context.w(escapeXml(post.date.getShortMonthName()))
          .w(' ')
          .w(escapeXml(post.date.getDay()))
          .w('<span>')
          .w(escapeXml(post.date.getDaySuffix()))
          .w('</span>, ')
          .w(escapeXml(post.date.getYear()));
      });
    }

    context.w('<!DOCTYPE html><html')
      .a("itemscope", null)
      .w(' itemtype="http://schema.org/BlogPosting"><head><meta content="text/html; charset=UTF-8" http-equiv="content-type"><meta content="width=device-width, initial-scale=1.0" name="viewport"><meta content="True" name="HandheldFriendly"><meta content="320" name="MobileOptimized">');

    if (post.description) {
      context.w('<meta')
        .a("content", post.description)
        .w(' name="Description">');
    }

    context.w('<title>')
      .w(escapeXml(post.title))
      .w('</title>')
      .t(
        raptor_templating_taglibs_optimizer_SlotTag,
        {
          "name": "head"
        })
      .w('</head><body>')
      .t(
        ui_Header_HeaderRenderer,
        {})
      .w('<div id="main"><div id="content"><div><article class="hentry" role="article"><header><h1 class="entry-title">')
      .w(escapeXml(post.title))
      .w('</h1><p class="meta"><time data-updated="true" pubdate="" datetime="2013-04-12T03:33:00-05:00">')
      .w(escapeXml(formattedDate()))
      .w('</time> | <a href="#disqus_thread">Comments</a></p></header><div class="entry-content">')
      .w(escapeXml(post.body))
      .w('</div><footer><p class="meta"><span class="byline author vcard">Posted by <span class="fn">')
      .w(escapeXml(post.author))
      .w('</span></span><time data-updated="true" pubdate="" datetime="2013-04-12T03:33:00-05:00">')
      .w(escapeXml(formattedDate()))
      .w('</time>');

    if (notEmpty(post.categories)) {
      context.w('<span class="categories">');

      forEachWithStatusVar(post.categories, function(category,__loop) {
        context.w('<a')
          .a("href", linkManager.categoryUrl(category))
          .w(' class="category">')
          .w(escapeXml(category))
          .w('</a>');

        if (!__loop.isLast()) {
          context.w(', ');
        }
      });

      context.w('</span>');
    }

    context.w('</p><div class="sharing"></div><p class="meta">');

    if (post.previousPost) {
      context.w('<a title="Previous Post: ')
        .w(escapeXmlAttr(post.previousPost.title))
        .w('"')
        .a("href", linkManager.postUrl(post.previousPost))
        .w(' class="basic-alignment left">\u00ab ')
        .w(escapeXml(post.previousPost.title))
        .w('</a>');
    }

    if (post.nextPost) {
      context.w('<a title="Next Post: ')
        .w(escapeXmlAttr(post.nextPost.title))
        .w('"')
        .a("href", linkManager.postUrl(post.nextPost))
        .w(' class="basic-alignment right">')
        .w(escapeXml(post.nextPost.titles))
        .w(' \u00bb</a>');
    }

    context.w('</p></footer></article><section><h1>Comments</h1></section></div><aside class="sidebar">')
      .t(
        ui_Section_SectionRenderer,
        {
          "layout": "post",
          "name": "aside"
        })
      .w('</aside></div></div>')
      .t(
        raptor_templating_taglibs_optimizer_SlotTag,
        {
          "name": "body"
        })
      .t(
        raptor_templating_taglibs_widgets_InitWidgetsTag,
        {})
      .w('</body></html>');
  }
});