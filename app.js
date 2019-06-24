var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'),
    port = 3000,
    Checkout = require("./models/checkout");

// APP CONFIG
mongoose.connect('mongodb://localhost/laptop-checkout-api');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

// INDEX
app.get("/", function(req, res){
    res.redirect("/checkouts");
});

// ========== REQUIRE ROUTES ========== //

var checkoutRoutes = require("./routes/checkout");

// USE ROUTES
app.use("/checkouts", checkoutRoutes);

// START SERVER
app.listen(port, "localhost", function(){
    console.log("Server is listening on port " + port);
});