var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var request = require('request');
var graph = require('fbgraph');
var Linkedin = require('node-linkedin')(secrets.linkedin.clientID, secrets.linkedin.clientSecret, secrets.linkedin.callbackURL);
var clockwork = require('clockwork')({ key: secrets.clockwork.apiKey });
var paypal = require('paypal-rest-sdk');
var lob = require('lob')(secrets.lob.apiKey);
var ig = require('instagram-node').instagram();
var Y = require('yui/yql');
var _ = require('lodash');
var Projects = require('./../models/Projects');
/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = function(req, res, next) {
  request.get('https://news.ycombinator.com/', function(err, request, body) {
    if (err) return next(err);
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function() {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'github' });
  var github = new Github({ token: token.accessToken });
  
    res.render('setup')

};

exports.postGithubWebhook = function(req, res) { //set up github webhook => https://developer.github.com/v3/repos/hooks/#create-a-hook
  
  var type = req.headers['x-github-event'];
  var doc = {};
  doc.type = type;
  switch(type){
    case 'deployment':
      var repo = req.body.repository;
      var repo_url = repo.html_url;

      var deployment = req.body.deployment;
      var deployment_url = deployment.url;

      doc.repo = repo;
      doc.repo_url = repo_url;
      doc.deployment = deployment;
      doc.deployment_url = deployment_url;
    break;
    case 'pull_request':
      var repo = req.body.repository;
      var repo_url = repo.html_url;

      var action = req.body.action;

      var pull_request = req.body.pull_request;
      var pull_request_link = pull_request.url;
      var pull_request_title = pull_request.title;

      var user = pull_request.user;
      var user_link = user.link;
      var user_username = user.login;

      doc.repo = rep;
      doc.repo_url = repo_url;
      doc.action = action;
      doc.pull_request = pull_request;
      doc.pull_request_link = pull_request_link;
      doc.pull_request_title = pull_request_title;
      doc.user = user;
      doc.user_link = user_link;
      doc.user_username = user_username;

    break;
    case 'issues':
      var repo = req.body.repository;
      var repo_url = repo.html_url;

      var action = req.body.action;
      var issue = req.body.issue;
      var link = issue.url;

      var sender = req.body.sender;

      var user = pull_request.user;
      var user_link = user.link;
      var user_username = user.login;
      doc.repo = repo;
      doc.repo_url = repo_url;
      doc.action = action;
      doc.issue = issue;
      doc.link = link;
      doc.sender = sender;
      doc.user = user;
      doc.user_link = user_link;
      doc.user_username = user_username;
    break;
    case 'push':
      var repo = req.body.repository;
      var repo_url = repo.html_url;

      var commits = req.body.commits;
      
      var sender = req.body.sender;
      var sender_link = sender.url;
      var sender_username = sender.login;

      doc.repo = repo;
      doc.repo_url = repo_url;
      doc.commits = commits;
      doc.sender = sender;
      doc.sender_link = sender_link;
      doc.sender_username = sender_username;
    break;
  }

  Projects.findOne({_id: '55a268cee4b0b251e7140e20'}, function(err, documen){
    if(err) res.send({ok: false});
    documen.updates[documen.updates.length] = doc;
    Projects.save();
    res.send({url: doc.repo_url, authed: true, err: err, doc: documen});
  });
};

/**
 * GET /api/aviary
 * Aviary image processing example.
 */
exports.getAviary = function(req, res) {
  res.render('api/aviary', {
    title: 'Aviary API'
  });
};


/**
 * GET /api/twitter
 * Twiter API example.
 */
exports.getTwitter = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('search/tweets', { q: 'nodejs since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 10 }, function(err, reply) {
    if (err) return next(err);
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets: reply.statuses
    });
  });
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = function(req, res, next) {
  req.assert('tweet', 'Tweet cannot be empty.').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twitter');
  }
  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
    if (err) return next(err);
    req.flash('success', { msg: 'Tweet has been posted.'});
    res.redirect('/api/twitter');
  });
};

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */
exports.getClockwork = function(req, res) {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */
exports.postClockwork = function(req, res, next) {
  var message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter'
  };
  clockwork.sendSms(message, function(err, responseData) {
    if (err) return next(err.errDesc);
    req.flash('success', { msg: 'Text sent to ' + responseData.responses[0].to });
    res.redirect('/api/clockwork');
  });
};


/**
 * GET /api/linkedin
 * LinkedIn API example.
 */
exports.getLinkedin = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);
  linkedin.people.me(function(err, $in) {
    if (err) return next(err);
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};


/**
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = function(req, res, next) {
  lob.routes.list({
    zip_codes: ['10007'] 
  }, function(err, routes) {
    if(err) return next(err); 
    res.render('api/lob', {
      title: 'Lob API',
      routes: routes.data[0].routes
    });
  });
};

