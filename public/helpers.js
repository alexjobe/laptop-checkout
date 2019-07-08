// ----------------------------------------------- //
// ----------- API Helper Functions -------------- //
// ----------------------------------------------- //

function getCurrentLaptopURL() {
    var laptopURL = "/api/laptops/" + laptopId;
    return laptopURL;
}

function getCurrentCheckoutURL() {
    var checkoutURL = '/api/checkouts/' + currentCheckoutId;
    return checkoutURL;
}

function getCurrentLaptop() {
    return $.getJSON(getCurrentLaptopURL());
}

function getAllLaptops() {
    return $.getJSON("/api/laptops");
}

function getCurrentCheckout() {
    return $.getJSON(getCurrentCheckoutURL());
}

// ----------------------------------------------- //
// -------------- General Functions -------------- //
// ----------------------------------------------- //

// Shows html elements that are used in laptops view, and hides elements that are used in checkout view
function showLaptopsView() {
    $('#laptopView').show();
    $('#checkoutView').hide();
}

// Shows html elements that are used in checkout view, and hides elements that are used in laptops view
function showCheckoutView() {
    $('#laptopView').hide();
    $('#checkoutView').show();
}

// Disables browser back button, because this is a single-page app
function disableBackButton() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };
}