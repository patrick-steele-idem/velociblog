$rset("rhtml", "ui/Section", function(helpers) {
  var empty = helpers.e,
      notEmpty = helpers.ne,
      forEach = helpers.f;

  return function(data, context) {
    var contentArray = data.contentArray,
        renderer = data.renderer;

    forEach(contentArray, function(content) {
      if (content.visible !== false) {
        context.invokeHandler(renderer(content), content.input);

      }
    });
  }
});