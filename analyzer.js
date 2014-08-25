'use strict';

var request = require('request');
var moment = require('moment');
var Q = require('q');

require('./db');
var StockPoint = require('mongoose').model('StockPoint');


var start = moment();

var companies = require('./companies');

var baseURL = 'http://query.yahooapis.com/v1/public/yql?q=';
var baseQuery = 'select * from yahoo.finance.historicaldata where symbol in ({symbols}) and startDate = "{startDate}" and endDate = "{endDate}"';
var suffix = '&env=store://datatables.org/alltableswithkeys&format=json';

var dateFormat = 'YYYY-MM-DD';
var stockPoints = [];


function fetchSymbolGroup(group) {
    var deferred = Q.defer();
    var symbols = '"' + companies[group].join('", "') + '"';
    var query = baseQuery
        .replace('{symbols}', symbols)
        .replace('{startDate}', moment().subtract(30, 'days').format(dateFormat))
        .replace('{endDate}', moment().format(dateFormat));

    var url = baseURL + query + suffix;
    request(url, function(error, response, body) {
        var data = JSON.parse(body);
        data.query.results.quote.forEach(function(stock) {
            stockPoints.push({
                'symbol': stock.Symbol,
                'date': stock.Date,
                'open': stock.Open,
                'close': stock.Close,
                'high': stock.High,
                'low': stock.Low,
                'volume': stock.Volume,
                'adj-close': stock.Adj_Close
            });
        });
        deferred.resolve();

    });
    return deferred.promise;
}

var deferredList = [];

for (var group in companies) {
    deferredList.push(fetchSymbolGroup(group));
}

Q.all(deferredList).then(function() {
    StockPoint.collection.remove({}, function(err) {
        if (!err) {
            console.log('Collection dropped.');
            StockPoint.collection.insert(stockPoints, function(err, docs) {
                if (!err) {
                    console.log('Collection saved! Stored ' + docs.length + ' posts in the DB.');
                    console.log('Took: ' + moment().diff(start) + 'ms');
                    process.exit(0);
                } else {
                    console.log('Error saving docs?');
                    process.exit(1);
                }
            });

        } else {
            console.log('Error dropping collection?');
        }
    });
});
