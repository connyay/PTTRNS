'use strict';

var _ = require('lodash');
require('./db');
var StockPoint = require('mongoose').model('StockPoint');

function bullish(symbol, today, yesterday) {
    if (+today.close > +today.open && +yesterday.open > +yesterday.close && +today.open < +yesterday.close && +today.close > +yesterday.open) {
        console.log('Found Bullish Engulfing! ' + symbol + ' on: ' + today.date);
    }
}

function scan(symbol, data) {
    bullish(symbol, data[0], data[1]);
}

StockPoint.find({}, function(err, points) {
    var companies = _.groupBy(points, function(point) {
        return point.symbol;
    });
    for (var company in companies) {
        scan(company, companies[company]);
    }
    process.exit(0);
});
