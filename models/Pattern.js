'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('Pattern', new Schema({
    'symbol': String,
    'date': String,
    'pattern': String
}));
