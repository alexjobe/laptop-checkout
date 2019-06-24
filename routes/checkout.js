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
router.post("/", function(req, res){
    Checkout.create(req.body.checkout, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("back");
        }
    });
});

// CHECKOUT EDIT - Show form to edit an existing checkout
router.get("/:checkout_id/edit", function(req, res){
    Checkout.findById(req.params.checkout_id, function(err, checkout){
        if(err || !checkout){
            res.redirect("back");
        } else {
            res.render("edit", {checkout: checkout});
        }
    });
});

// CHECKOUT UPDATE - Update an existing checkout
router.put("/:checkout_id", function(req, res){
    Checkout.findByIdAndUpdate(req.params.checkout_id, req.body.checkout, function(err, updatedCheckout){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

// CHECKOUT DELETE - Remove checkout
router.delete("/:checkout_id", function(req, res){
    Checkout.findByIdAndRemove(req.params.checkout_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;