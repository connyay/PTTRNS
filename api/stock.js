'use strict';
var StockPoint = require('mongoose').model('StockPoint');

exports.index = function(req, res, next) {
    StockPoint.find()
        .exec(function(err, stocks) {
            if (err) {
                return next(err);
            }
            res.json(stocks);
        });
};

exports.findBySymbol = function(req, res, next) {
    StockPoint.find({symbol: req.params.symbol})
        .exec(function(err, stocks) {
            if (err) {
                return next(err);
            }
            res.json(stocks);
        });
};
