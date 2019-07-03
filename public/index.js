var laptopId; // A variable to hold the currently selected laptopId
var currentCheckoutId; // A variable to hold the currently selected checkoutId

// Initialize app
$(document).ready(function(){

    disableBackButton();

    // Show laptops view
    showLaptopsView();
    
    // Initialize views
    initializeLaptopsView();
    initializeCheckoutView();

});

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

// Initialize laptops view - displays a list of all laptops
function initializeLaptopsView() {
    updateAllLaptops();

    $('#laptopInput').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
    });

    $('#laptopInput').submit(function (e) {
        createLaptop();
    });

    // Each <li> contains a span with an X in it. When the X is clicked, remove the laptop
    $('#laptopList').on('click', 'span', function(e){
        e.stopPropagation(); // If user clicks on span, do not trigger click on li
        removeLaptop($(this).parent());
    });

    addLaptopClickHandlers();
}

// Initialize checkout view - displays checkout information for a single laptop
function initializeCheckoutView() {
    $('#homeButton').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
        showLaptopsView();
    });

    $('#checkoutInput').submit(function (e) {
        e.preventDefault();
        createCheckout();
    });

    $('#returnButton').submit(function (e) {
        e.preventDefault();
        returnLaptop();
    });

    // Each <li> contains a span with an X in it. When the X is clicked, remove the checkout from the checkout history list
    $('#checkoutList').on('click', 'span', function(e){
        e.stopPropagation(); // If user clicks on span, do not trigger click on li
        removeCheckoutFromHistory($(this).parent());
    });
}


// ----------------------------------------------- //
// ----------- Laptop View Functions ------------- //
// ----------------------------------------------- //

function updateAllLaptops() {
    $('#laptopList').html('');
    // Add all laptops to the page
    getAllLaptops()
    .then(function(laptops){
        laptops.forEach(function(laptop){
            addLaptop(laptop);
        });
    });
}

function addLaptop(laptop) {
    // Add a laptop to the page
    var laptopListItem = $('<li class="laptop"><strong>Laptop:</strong> ' 
        + laptop.name + ' <strong>Serial Number:</strong> ' 
        + laptop.serialNum + '<span>X</span></li>');

    // If the laptop's current checkout is overdue, assign it the class 'overdue'
    if(laptop.currentCheckout){
        var dueDate = new Date(laptop.currentCheckout.dueDate);
        if(dueDate < Date.now()){
            laptopListItem.addClass('overdue');
        }
    }

    laptopListItem.data('id', laptop._id); // jQuery data attribute, does not show up in html. Used to delete when X is clicked.

    $('#laptopList').append(laptopListItem);
}

function createLaptop() {
    // Send request to create a new laptop
    var laptopNameInput = $('#laptopNameInput').val();
    var laptopNumInput = $('#laptopNumInput').val();
    // Clear input
    $('#laptopNameInput').val('');
    $('#laptopNumInput').val('');

    $.post('/api/laptops', {name: laptopNameInput, serialNum: laptopNumInput})
    .then(function(newLaptop){
        addLaptop(newLaptop);
    }).catch(function(err){
        console.log(err);
    });
}

// Add click handlers to each laptop
function addLaptopClickHandlers() {
    $('#laptopList').on('click', 'li', function () {
        laptopId = $(this).data('id'); // Set laptopId to the selected laptop's id

        // When a laptop is clicked, load checkout view
        showCheckoutView();

        // Display current checkout of clicked laptop
        getCurrentLaptop()
        .then(updateCurrentCheckout);
    });
}

// Called when the user clicks the X on the laptop <li>
function removeLaptop(laptop) {
    var clickedId = laptop.data('id');
    var deleteURL = '/api/laptops/' + clickedId;
    $.ajax({
        url: deleteURL,
        type: 'DELETE'
    })
    .then(function(){
        updateAllLaptops();
    });
}
// ----------------------------------------------- //
// ----------- Checkout View Functions ----------- //
// ----------------------------------------------- //

function createCheckout() {
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
            url: getCurrentLaptopURL(),
            type: 'PUT',
            data: {currentCheckout: newCheckout._id}
        });
    })
    .then(function(updatedLaptop){
        // Update page
        updateAllLaptops();
        updateCurrentCheckout(updatedLaptop);
    })
    .catch(function(err){
        console.log(err);
    });
}

function updateCurrentCheckout(laptop) {

    $('#checkoutView h1').html('Laptop: ' + laptop.name);
    updateCheckoutHistory();

    // Add current checkout to the page, if there is one: otherwise, display "Available".
    if(laptop.currentCheckout){
        showAsCheckedOut(laptop);
    }
    else{
        showAsAvailable();
    }
}

function showAsAvailable() {
    $('#checkoutInput').show();
    $('#returnButton').hide();
    $('#currentCheckout').html('Available');
}

function showAsCheckedOut(laptop) {
    $('#checkoutInput').hide();
    $('#returnButton').show();

    var dueDate = new Date(laptop.currentCheckout.dueDate);
    var checkoutDate = new Date(laptop.currentCheckout.checkoutDate);
    $('#currentCheckout').html('Name: ' + laptop.currentCheckout.userName + 
    '<br>Approved By: ' + laptop.currentCheckout.mgrName +
    '<br>Checked Out: ' + checkoutDate.toLocaleDateString('en-US', { timeZone: 'UTC' }) +
    '<br>Due Date: ' + dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' }));
}

// Returns the laptop, clearing its current checkout 
function returnLaptop() {

    getCurrentLaptop()
    .then(function(laptop) {
        currentCheckoutId = laptop.currentCheckout._id;
        return $.ajax({
            url: getCurrentLaptopURL(),
            type: 'PUT',
            data: {currentCheckout: {}} // Sets currentCheckout to null
        })
    })
    .then(function(laptop){
        return $.ajax({
            url: getCurrentCheckoutURL(),
            type: 'PUT',
            data: {returnDate: Date.now()} // Set laptop's returnDate to the day it was returned
        })
        .then(function(){
            // Update page
            updateCurrentCheckout(laptop);
            updateAllLaptops();
        })
    })
    .catch(function(err){
        console.log(err);
    });
}

function updateCheckoutHistory() {
    $('#checkoutList').html('');
    // Add all checkouts to the page
    var historyURL = getCurrentLaptopURL() + '/history';
    $.get(historyURL)
    .then(function(checkoutHistory){
        // Add each checkout in laptop's checkoutHistory to page
        checkoutHistory.forEach(function(checkout){
            addCheckoutToHistory(checkout);
        });

        // If there are checkouts to display, make 'Checkout History' title visible
        if($('#checkoutList li').length > 0){
            $('#checkoutHistoryTitle').html('Checkout History');
        } else {
            $('#checkoutHistoryTitle').html('');
        }
    })
}

function addCheckoutToHistory(checkout) {
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
        var newCheckout = $('<li class="checkout"><strong>Name: </strong> ' 
            + checkout.userName + ' <strong>Approved By: </strong> ' 
            + checkout.mgrName + '<strong>Checked Out: </strong>' 
            + checkoutDate + '<strong>Due: </strong>' 
            + dueDate + '<strong>Returned: </strong>'
            + returnDate + '<span>X</span></li>');

            newCheckout.data('id', checkout._id); // jQuery data attribute, does not show up in html. Used to delete when X is clicked.

        $('#checkoutList').append(newCheckout);
    }
}

// When X is clicked, remove checkout from checkoutHistory. It must be removed from both the laptop's checkoutHistory array, and
// from the checkouts collection
function removeCheckoutFromHistory(checkout) {
    var clickedId = checkout.data('id');
    var deleteURL = '/api/checkouts/' + clickedId;
    var historyURL = getCurrentLaptopURL() + '/history';

    $.getJSON(historyURL)
    .then(function(checkoutHistory){
        // Create new checkoutHistory array, excluding the checkout that is being deleted
        updatedHistory = checkoutHistory.filter(function(checkout) {
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
        updateCheckoutHistory();
    })
    .catch(function(err){
        console.log(err);
    });
    
}