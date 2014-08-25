'use strict';
var StockPoint = require('mongoose').model('StockPoint');

exports.index = function(req, res, next) {
    StockPoint.find()
        .sort({
            '_id': 1
        })
        .exec(function(err, stocks) {
            if (err) {
                return next(err);
            }
            res.json(stocks);
        });
};
