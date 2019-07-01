var mongoose = require("mongoose");

// SCHEMA SETUP
var checkoutSchema = new mongoose.Schema({
    userName: String,
    mgrName: String,
    checkoutDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    laptop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Laptop"
    },
    returnDate: {
        type: Date
    }
});

var Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;