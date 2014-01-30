$rset("rhtml", "ui/RecentPosts", function(helpers) {
  var empty = helpers.e,
      notEmpty = helpers.ne;

  return function(data, context) {
    var count = data.count;

    context.w('<div class="recent-posts">RECENT POSTS</div>');
  }
});