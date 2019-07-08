class Helper {

    // ----------------------------------------------- //
    // ----------- API Helper Functions -------------- //
    // ----------------------------------------------- //

    static getCurrentLaptopURL() {
        var laptopURL = "/api/laptops/" + laptopId;
        return laptopURL;
    }

    static getCurrentCheckoutURL() {
        var checkoutURL = '/api/checkouts/' + currentCheckoutId;
        return checkoutURL;
    }

    static getCurrentLaptop() {
        return $.getJSON(Helper.getCurrentLaptopURL());
    }

    static getAllLaptops() {
        return $.getJSON("/api/laptops");
    }

    static getCurrentCheckout() {
        return $.getJSON(Helper.getCurrentCheckoutURL());
    }

    // ----------------------------------------------- //
    // -------------- General Functions -------------- //
    // ----------------------------------------------- //

    // Shows html elements that are used in laptops view, and hides elements that are used in checkout view
    static showLaptopsView() {
        $('#laptopView').show();
        $('#checkoutView').hide();
    }

    // Shows html elements that are used in checkout view, and hides elements that are used in laptops view
    static showCheckoutView() {
        $('#laptopView').hide();
        $('#checkoutView').show();
    }

    // Disables browser back button, because this is a single-page app
    static disableBackButton() {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };
    }
}