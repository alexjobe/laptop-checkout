var express = require('express'),
    router = express.Router();
    Checkout = require("../models/checkout");

//======================================================//
//                    CHECKOUT ROUTES                   //
//                      /checkouts                      //
//======================================================//

// CHECKOUT INDEX - Show all checkouts
router.get("/", function(req, res){
    Checkout.find({}, function(err, allCheckouts){
        if(err){
            console.log(err);
        } else {
            res.render("home", {checkouts: allCheckouts});
        }
    });
});

// CHECKOUT CREATE - Add new checkout to database
router.post("/checkouts", function(req, res){
    Checkout.create(req.body.checkout, function(err, addedCheckout){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

// CHECKOUT DELETE - Remove checkout
router.delete("/checkouts/:checkout_id", function(req, res){
    Checkout.findByIdAndRemove(req.params.checkout_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;