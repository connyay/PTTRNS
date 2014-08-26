'use strict';
var Pattern = require('mongoose').model('Pattern');

exports.index = function(req, res, next) {
    Pattern.find()
        .exec(function(err, patterns) {
            if (err) {
                return next(err);
            }
            res.json(patterns);
        });
};
