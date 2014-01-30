$rset("rhtml", "/posts/2013-06-29-first-post/post.rhtml", function(helpers) {
  var empty = helpers.e,
      notEmpty = helpers.ne;

  return function(data, context) {
    context.w('This is your first post!');
  }
});