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

// ========== ROUTES ========== //

// CHECKOUT INDEX - Show all checkouts
app.get("/", function(req, res){
    Checkout.find({}, function(err, allCheckouts){
        if(err){
            console.log(err);
        } else {
            res.render("home", {checkouts: allCheckouts});
        }
    });
});

// CHECKOUT CREATE - Add new checkout to database
app.post("/checkouts", function(req, res){
    Checkout.create(req.body.checkout, function(err, addedCheckout){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

// CHECKOUT DELETE - Remove checkout
app.delete("/checkouts/:checkout_id", function(req, res){
    Checkout.findByIdAndRemove(req.params.checkout_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

// START SERVER
app.listen(port, "localhost", function(){
    console.log("Server is listening on port " + port);
});