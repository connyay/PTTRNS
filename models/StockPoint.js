'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('StockPoint', new Schema({
    'symbol': String,
    'date': String,
    'open': String,
    'close': String,
    'high': Number,
    'low': String,
    'volume': String,
    'adj-close': String
}));
