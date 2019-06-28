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

module.exports = router;