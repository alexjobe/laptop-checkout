var laptopId; // A variable to hold the currently selected laptopId

$(document).ready(function(){

    disableBackButton();
    
    // Create views
    loadLaptopsView();
    loadCheckoutView();

    // Show laptops view
    showLaptopsView();
});

// Disables browser back button
function disableBackButton() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };
}

// Main view - Displays a list of all laptops
function loadLaptopsView() {
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
function loadCheckoutView() {
    $('#home-button').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
        showLaptopsView();
    });
    $('#checkoutInput').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
        createCheckout();
    });
}

function showLaptopsView() {
    $('#laptop-view').show();
    $('#checkout-view').hide();
}

function showCheckoutView() {
    $('#laptop-view').hide();
    $('#checkout-view').show();
}

// ----------------------------------------------- //
// ----------- Laptop View Functions ------------- //
// ----------------------------------------------- //

function updateAllLaptops() {
    $('#laptop-list').html('');
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

    $('#laptop-list').append(newLaptop);
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
    $('#laptop-list').on('click', 'li', function () {
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

    $('#checkout-view h1').html('Laptop: ' + laptop.name);

    // Add current checkout to the page, if there is one: otherwise, display "Available".
    if(laptop.currentCheckout){
        var dueDate = new Date(laptop.currentCheckout.dueDate);
        var checkoutDate = new Date(laptop.currentCheckout.checkoutDate);
        $('#currentCheckout').html('Name: ' + laptop.currentCheckout.userName + 
        '<br>Manager Who Approved: ' + laptop.currentCheckout.mgrName +
        '<br>Checkout Date: ' + checkoutDate.toLocaleDateString('en-US', { timeZone: 'UTC' }) +
        '<br>Due Date: ' + dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' }));
    }
    else{
        $('#currentCheckout').html('Available');
    }
}