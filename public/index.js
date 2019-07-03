var laptopId; // A variable to hold the currently selected laptopId
var currentLaptop;

$(document).ready(function(){

    disableBackButton();

    // Show laptops view
    showLaptopsView();
    
    // Initialize views
    initializeLaptopsView();
    initializeCheckoutView();

});

// Disables browser back button
function disableBackButton() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };
}

// Main view - Displays a list of all laptops
function initializeLaptopsView() {
    updateAllLaptops();

    $('#laptopInput').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
    });

    $('#laptopInput').submit(function (event) {
        createLaptop();
    });

    addLaptopClickHandlers();
}

// Checkout view - Displays checkout information for a single laptop
function initializeCheckoutView() {
    $('#homeButton').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
        showLaptopsView();
    });
    $('#checkoutInput').submit(function (e) {
        e.preventDefault();
        createCheckout();
    });
    $('#deleteButton').submit(function (e) {
        e.preventDefault();
        var deleteURL = '/api/laptops/' + laptopId;
        $.ajax({
            url: deleteURL,
            type: 'DELETE'
        })
        .then(function(){
            updateAllLaptops();
            showLaptopsView();
        });
    });
    $('#returnButton').submit(function (e) {
        e.preventDefault();
        returnLaptop();
    });
}

function showLaptopsView() {
    $('#laptopView').show();
    $('#checkoutView').hide();
}

function showCheckoutView() {
    $('#laptopView').hide();
    $('#checkoutView').show();
}

// ----------------------------------------------- //
// ----------- Laptop View Functions ------------- //
// ----------------------------------------------- //

function updateAllLaptops() {
    $('#laptopList').html('');
    // Add all laptops to the page
    $.getJSON("/api/laptops")
    .then(function(laptops){
        laptops.forEach(function(laptop){
            addLaptop(laptop);
        });
    });
}

function addLaptop(laptop) {
    // Add a laptop to the page
    var newLaptop = $('<li class="laptop"><strong>Laptop:</strong> ' 
        + laptop.name + ' <strong>Serial Number:</strong> ' 
        + laptop.serialNum + '</li>');

    if(laptop.currentCheckout){
        var dueDate = new Date(laptop.currentCheckout.dueDate);
        if(dueDate < Date.now()){
            newLaptop.addClass('overdue');
        }
    }

    newLaptop.data('id', laptop._id); // jQuery data attribute, does not show up in html

    $('#laptopList').append(newLaptop);
}

function createLaptop() {
    // Send request to create a new laptop
    var laptopNameInput = $('#laptopNameInput').val();
    var laptopNumInput = $('#laptopNumInput').val();

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
        $.getJSON("/api/laptops/" + laptopId)
        .then(updateCurrentCheckout);
    });
}
// ----------------------------------------------- //
// ----------- Checkout View Functions ----------- //
// ----------------------------------------------- //

function createCheckout() {
    // Send request to create a new checkout
    var userNameInput = $('#userNameInput').val();
    var mgrNameInput = $('#mgrNameInput').val();
    var dueDateInput = $('#dueDateInput').val();

    $.post('/api/checkouts', {userName: userNameInput, mgrName: mgrNameInput, dueDate: dueDateInput, laptop: laptopId})
    .then(function(newCheckout){
        // Add the checkout to laptop as currentCheckout
        var updateURL = '/api/laptops/' + laptopId;
        return $.ajax({
            url: updateURL,
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

function returnLaptop() {
    var updateURL = '/api/laptops/' + laptopId;
    var currentCheckout;

    $.getJSON(updateURL)
    .then(function(laptop) {
        currentCheckout = laptop.currentCheckout._id;
        return $.ajax({
            url: updateURL,
            type: 'PUT',
            data: {currentCheckout: {}}
        })
    })
    .then(function(laptop){
        updateURL = '/api/checkouts/' + currentCheckout;
        return $.ajax({
            url: updateURL,
            type: 'PUT',
            data: {returnDate: Date.now()}
        })
        .then(function(){
            updateCurrentCheckout(laptop);
        })
    })
    .catch(function(err){
        console.log(err);
    });
}

function updateCheckoutHistory() {
    $('#checkoutList').html('');
    // Add all checkouts to the page
    var getURL = '/api/laptops/' + laptopId + '/history';
    $.get(getURL)
    .then(function(checkoutHistory){
        checkoutHistory.forEach(function(checkout){
            addCheckout(checkout);
        });
    })
}

function addCheckout(checkout) {
    // Add a checkout to the page
    if(checkout.returnDate) {
        var returnDate = new Date(checkout.returnDate);
        returnDate = returnDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
        var checkoutDate = new Date(checkout.checkoutDate);
        checkoutDate = checkoutDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
        var dueDate = new Date(checkout.dueDate);
        dueDate = dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' });

        var newCheckout = $('<li class="checkout"><strong>Name: </strong> ' 
            + checkout.userName + ' <strong>Approved By: </strong> ' 
            + checkout.mgrName + '<strong>Checked Out: </strong>' 
            + checkoutDate + '<strong>Due: </strong>' 
            + dueDate + '<strong>Returned: </strong>'
            + returnDate + '</li>');

        $('#checkoutList').append(newCheckout);
    }
}