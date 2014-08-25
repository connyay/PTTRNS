'use strict';
var express = require('express');
// mongoose setup
require('./db');

var api = {
    stock: require('./api/stock')
};

var app = express();
app.set('port', (process.env.PORT || 5000));

app.get('/stocks', api.stock.index);

app.get('/stocks/:symbol', api.stock.findBySymbol);

// Start it up
app.listen(app.get('port'), function() {
    console.log('Node app is listening on port: ' + app.get('port'));
});
