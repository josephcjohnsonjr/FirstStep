/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {

  res.render('index', {
    title: 'Home'

  });
};

exports.teampage = function(req, res) {

  res.render('teampage', {
    title: 'teampage'

  });
};

exports.realteampage = function(req, res) {

  res.render('realteampage', {
    title: 'realteampage'

  });
};