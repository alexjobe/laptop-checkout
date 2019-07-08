var laptopId; // A variable to hold the currently selected laptopId
var currentCheckoutId; // A variable to hold the currently selected checkoutId

// Initialize app
$(document).ready(function(){
    // Load scripts, then initialize views
    $.when(
        $.getScript( "/helpers.js" ),
        $.getScript( "/checkouts.js" ),
        $.getScript( "/laptops.js" ),
        $.Deferred(function( deferred ){
            $( deferred.resolve );
        })
    ).done(function(){
        disableBackButton(); // helpers.js

        // Show laptops view
        showLaptopsView(); // helpers.js
        
        // Initialize views
        initializeLaptopsView(); // laptops.js
        initializeCheckoutView(); // checkouts.js
    });
});