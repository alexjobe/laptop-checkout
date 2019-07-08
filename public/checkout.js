class Checkout {

    // ----------------------------------------------- //
    // ----------- Checkout View Functions ----------- //
    // ----------------------------------------------- //

    // Initialize checkout view - displays checkout information for a single laptop
    static initializeCheckoutView() {
        $('#homeButton').on('click', function(e){
            e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
            Helper.showLaptopsView();
        })

        $('#checkoutInput').submit(function (e) {
            e.preventDefault();
            Checkout.createCheckout();
        });

        $('#returnButton').submit(function (e) {
            e.preventDefault();
            Checkout.returnLaptop();
        });

        // Each <li> contains a span with an X in it. When the X is clicked, remove the checkout from the checkout history list
        $('#checkoutList').on('click', 'span', function(e){
            e.stopPropagation(); // If user clicks on span, do not trigger click on li
            Checkout.removeCheckoutFromHistory($(this).parent());
        });

        $('#dueDateInput').on('focus', function(e){
            this.type='date';
        });

        $('#dueDateInput').on('blur', function(e){
            this.type='text';
        })
    }

    static createCheckout() {
        var userNameInput = $('#userNameInput').val();
        var mgrNameInput = $('#mgrNameInput').val();
        var dueDateInput = $('#dueDateInput').val();
        // Clear input
        $('#userNameInput').val('');
        $('#mgrNameInput').val('');
        $('#dueDateInput').val('');

        // Send request to create a new checkout
        $.post('/api/checkouts', {userName: userNameInput, mgrName: mgrNameInput, dueDate: dueDateInput, laptop: laptopId})
        .then(function(newCheckout){
            // Add the checkout to laptop as currentCheckout
            return $.ajax({
                url: Helper.getCurrentLaptopURL(),
                type: 'PUT',
                data: {currentCheckout: newCheckout._id}
            });
        })
        .then(function(updatedLaptop){
            // Update page
            Laptop.updateAllLaptops();
            Checkout.updateCurrentCheckout(updatedLaptop);
        })
        .catch(function(err){
            console.log(err);
        });
    }

    static updateCurrentCheckout(laptop) {

        $('#checkoutView h1').html('Laptop: ' + laptop.name);
        Checkout.updateCheckoutHistory();

        // Add current checkout to the page, if there is one: otherwise, display "Available".
        if(laptop.currentCheckout){
            Checkout.showAsCheckedOut(laptop);
        }
        else{
            Checkout.showAsAvailable();
        }
    }

    static showAsAvailable() {
        $('#checkoutInput').show();
        $('#returnButton').hide();
        $('#currentCheckout').html('<h3 id="available">Available</h3>');
    }

    static showAsCheckedOut(laptop) {
        $('#checkoutInput').hide();
        $('#returnButton').show();

        var dueDate = new Date(laptop.currentCheckout.dueDate);
        var checkoutDate = new Date(laptop.currentCheckout.checkoutDate);
        $('#currentCheckout').html('<h3>Checked out to: </h3><text>Name: ' + laptop.currentCheckout.userName + 
        '<br>Approved By: ' + laptop.currentCheckout.mgrName +
        '<br>Checked Out: ' + checkoutDate.toLocaleDateString('en-US', { timeZone: 'UTC' }) +
        '<br>Due Date: ' + dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' }) + '</text>');
    }

    // Returns the laptop, clearing its current checkout 
    static returnLaptop() {

        Helper.getCurrentLaptop()
        .then(function(laptop) {
            currentCheckoutId = laptop.currentCheckout._id;
            return $.ajax({
                url: Helper.getCurrentLaptopURL(),
                type: 'PUT',
                data: {currentCheckout: {}} // Sets currentCheckout to null
            })
        })
        .then(function(laptop){
            return $.ajax({
                url: Helper.getCurrentCheckoutURL(),
                type: 'PUT',
                data: {returnDate: Date.now()} // Set laptop's returnDate to the day it was returned
            })
            .then(function(){
                // Update page
                Checkout.updateCurrentCheckout(laptop);
                Laptop.updateAllLaptops();
            })
        })
        .catch(function(err){
            console.log(err);
        });
    }

    static updateCheckoutHistory() {
        $('#checkoutList').html('');
        // Add all checkouts to the page
        var historyURL = Helper.getCurrentLaptopURL() + '/history';
        $.get(historyURL)
        .then(function(checkoutHistory){
            // Add each checkout in laptop's checkoutHistory to page
            checkoutHistory.forEach(function(checkout){
                Checkout.addCheckoutToHistory(checkout);
            });

            // If there are checkouts to display, make 'Checkout History' title visible
            if($('#checkoutList li').length > 0){
                $('#checkoutHistoryTitle').html('Checkout History');
            } else {
                $('#checkoutHistoryTitle').html('');
            }
        })
    }

    static addCheckoutToHistory(checkout) {
        // Add a checkout to the page
        if(checkout.returnDate) {

            // Convert mongoDB dates to Date, and format string as M/D/Y
            var returnDate = new Date(checkout.returnDate);
            returnDate = returnDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
            var checkoutDate = new Date(checkout.checkoutDate);
            checkoutDate = checkoutDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
            var dueDate = new Date(checkout.dueDate);
            dueDate = dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' });

            // Create <li> to display checkout
            var newCheckout = $('<li class="checkout"><text><strong>Name: </strong> ' 
                + checkout.userName + ' <strong>Approved By: </strong> ' 
                + checkout.mgrName + '<strong>Checked Out: </strong>' 
                + checkoutDate + '<strong>Due: </strong>' 
                + dueDate + '<strong>Returned: </strong>'
                + returnDate + '</text><span>X</span></li>');

                newCheckout.data('id', checkout._id); // jQuery data attribute, does not show up in html. Used to delete when X is clicked.

            $('#checkoutList').append(newCheckout);
        }
    }

    // When X is clicked, remove checkout from checkoutHistory. It must be removed from both the laptop's checkoutHistory array, and
    // from the checkouts collection
    static removeCheckoutFromHistory(checkout) {
        var clickedId = checkout.data('id');
        var deleteURL = '/api/checkouts/' + clickedId;
        var historyURL = Helper.getCurrentLaptopURL() + '/history';

        $.getJSON(historyURL)
        .then(function(checkoutHistory){
            // Create new checkoutHistory array, excluding the checkout that is being deleted
            var updatedHistory = checkoutHistory.filter(function(checkout) {
                if(checkout._id == clickedId) {
                    return false;
                }
                else { return true; }
            });
            return updatedHistory;
        })
        .then(function(updatedHistory) {
            if(updatedHistory == []){updatedHistory = Array[null]} // if updatedHistory is empty, set to a null array (required for Mongo)
            // Update laptop's checkoutHistory
            return $.ajax({
                url: historyURL,
                type: 'PUT',
                data: {checkoutHistory: updatedHistory}
            });
        })
        .then(function(){
            // Delete checkout from checkouts collection
            return $.ajax({
                url: deleteURL,
                type: 'DELETE'
            })
        })
        .then(function(){
            // Update page
            Checkout.updateCheckoutHistory();
        })
        .catch(function(err){
            console.log(err);
        });
    }
}