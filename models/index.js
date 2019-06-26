var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/laptop-checkout-api');

mongoose.Promise = Promise;

module.exports.Laptop = require('./laptop');
module.exports.Checkout = require('./checkout');