var express = require('express'),
    router = express.Router();
    var db = require('../models');

//======================================================//
//                     INDEX ROUTES                     //
//                           /                          //
//======================================================//

// INDEX
router.get("/", function(req, res){
    res.render('index.ejs');
});

// LAPTOP PAGE
router.get("/:laptopId", function(req, res){
    db.Laptop.findById(req.params.laptopId, function(err, laptop){
        if(err || !laptop){
            res.redirect("back");
        } else {
            res.render("laptop.ejs", {laptop: laptop});
        }
    });
});


module.exports = router;