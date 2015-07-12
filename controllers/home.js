/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {

  res.render('teampage.html', {
    title: 'Home'

  });
};