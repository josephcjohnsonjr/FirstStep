var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Project = require('../models/Projects');
var secrets = require('../config/secrets');

exports.postProject = function(req, res) {

//        // create a todo, information comes from AJAX request from Angular
//        Project.create({
//            name : "Panafold Extension",
//            description: "A powerful tool that will allow users to highligh, I am just typing a random description.",
//        }, function(err, todo) {
//            if (err)
//                res.send(err);
//        });

}

exports.findProject = function(req, res) {

        // use mongoose to get all todos in the database
        console.log('in')
        Project.findOne({_id:'55a253396533cb2f3325f636'},function(err, todos) {
            if (err){
                res.send(err)
                console.log("error")
            }
            console.log("no error")
            console.log(todos)
            res.json(todos); // return all todos in JSON format
            
        });
}

