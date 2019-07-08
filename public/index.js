var laptopId; // A variable to hold the currently selected laptopId
var currentCheckoutId; // A variable to hold the currently selected checkoutId

// Initialize app
$(document).ready(function(){
    // Load scripts, then initialize views
    $.when(
        $.getScript( "/helper.js" ),
        $.getScript( "/checkout.js" ),
        $.getScript( "/laptop.js" ),
        $.Deferred(function( deferred ){
            $( deferred.resolve );
        })
    ).done(function(){

        Helper.disableBackButton();

        // Show laptops view
        Helper.showLaptopsView();
        
        // Initialize views
        Laptop.initializeLaptopsView();
        Checkout.initializeCheckoutView();
    });
});