'use strict';

var _ = require('lodash');
require('./db');
var StockPoint = require('mongoose').model('StockPoint');
var Pattern = require('mongoose').model('Pattern');

var patterns = [];

function bullish(symbol, today, yesterday) {
    if (+today.close > +today.open && +yesterday.open > +yesterday.close && +today.open < +yesterday.close && +today.close > +yesterday.open) {
        console.log('Found Bullish Engulfing! ' + symbol + ' on: ' + today.date);
        patterns.push({
            symbol: symbol,
            date: today.date,
            pattern: 'Bullish Engulfing'
        });
    }
}

function scan(symbol, data) {
    bullish(symbol, data[0], data[1]);
}

function storePatterns() {
    Pattern.collection.insert(patterns, function(err, docs) {
        if (!err) {
            console.log('Collection saved! Stored ' + docs.length + ' posts in the DB.');
            process.exit(0);
        } else {
            console.log('Error saving docs?');
            process.exit(1);
        }
    });
}

StockPoint.find({}, function(err, points) {
    var companies = _.groupBy(points, function(point) {
        return point.symbol;
    });
    for (var company in companies) {
        scan(company, companies[company]);
    }
    storePatterns();
    process.exit(0);
});
