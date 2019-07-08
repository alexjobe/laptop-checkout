var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/laptop-checkout-api'); // Connect to local MongoDB server

mongoose.Promise = Promise;

module.exports.Laptop = require('./laptop');
module.exports.Checkout = require('./checkout');