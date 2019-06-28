var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    port = 3000

// APP CONFIG
app.use(bodyParser.json()); // Required for POST routes
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

// ========== REQUIRE ROUTES ========== //

var indexRoutes = require("./routes/index");
var laptopRoutes = require("./routes/laptops");
var checkoutRoutes = require("./routes/checkouts");

// USE ROUTES
app.use('/', indexRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/checkouts', checkoutRoutes);

// START SERVER
app.listen(port, "localhost", function(){
    console.log("Server is listening on port " + port);
});