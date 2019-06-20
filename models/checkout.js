var mongoose = require("mongoose");

// SCHEMA SETUP
var checkoutSchema = new mongoose.Schema({
    userName: String,
    mgrName: String,
    checkoutDate: Date,
    etaDate: Date,
    serialNum: String,
    wasReturned: {type: Boolean, default: false}
});

module.exports = mongoose.model("Checkout", checkoutSchema);