exports.setup = function(req, res) {
  res.render('setup', {
    title: 'Setup'

  });
};

exports.project  = function(req,res){
	res.render('project', {
		title: 'Project'
	});
};

exports.teampage = function(req,rest){
	res.render('teampage', {
		title: 'Team'
	});
};