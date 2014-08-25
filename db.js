'use strict';

var mongoose = require('mongoose');
require('./models/StockPoint');

var mongoDbURL = 'mongodb://localhost/pttnrs';
if (process.env.MONGOHQ_URL) {
    mongoDbURL = process.env.MONGOHQ_URL;
}

mongoose.connect(mongoDbURL);
