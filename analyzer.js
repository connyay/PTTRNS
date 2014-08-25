'use strict';

var util = require('util');

var request = require('request');
var moment = require('moment');
require('./db');
var StockPoint = require('mongoose').model('StockPoint');


var start = moment();

var companies = require('./companies');
companies = '"' + companies.join('", "') + '"';

var baseURL = 'http://query.yahooapis.com/v1/public/yql?q=';
var query = 'select * from yahoo.finance.historicaldata where symbol in ({symbols}) and startDate = "{startDate}" and endDate = "{endDate}"';
var suffix = '&env=store://datatables.org/alltableswithkeys&format=json';

var dateFormat = 'YYYY-MM-DD';

query = query
    .replace('{symbols}', companies)
    .replace('{startDate}', moment().subtract(30, 'days').format(dateFormat))
    .replace('{endDate}', moment().format(dateFormat));

var url = baseURL + query + suffix;
request(url, function(error, response, body) {
    var stockPoints = [];
    var data = JSON.parse(body);
    data.query.results.quote.forEach(function(stock) {
        stockPoints.push({
            'symbol': stock.Symbol,
            'date': stock['Date'],
            'open': stock.Open,
            'close': stock.Close,
            'high': stock.High,
            'low': stock.Low,
            'volume': stock.Volume,
            'adj-close': stock['Adj_Close']
        });
    });

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