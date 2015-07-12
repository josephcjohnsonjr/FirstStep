var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Project = require('../models/project');
var secrets = require('../config/secrets');

/**
*post project tags to database
*/
exports.postTags = function(_tags, callback) {
    Project.update({
            tags: _tags
        },
           function(err, result) {
            return callback(err, result)
        })
}