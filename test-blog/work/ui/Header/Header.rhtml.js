$rset("rhtml", "ui/Header", function(helpers) {
  var empty = helpers.e,
      notEmpty = helpers.ne,
      escapeXml = helpers.x;

  return function(data, context) {
    var blog = data.blog,
        linkManager = data.linkManager;

    context.w('<header role="banner"><hgroup><h1><a')
      .a("href", linkManager.url('/'))
      .w('>')
      .w(escapeXml(blog.title))
      .w('</a></h1><h2>')
      .w(escapeXml(blog.subtitle))
      .w('</h2></hgroup></header>');
  }
});