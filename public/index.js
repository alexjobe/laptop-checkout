var laptopId;

$(document).ready(function(){
    $.getJSON("/api/laptops")
    .then(addLaptops);

    $('#checkout-view').hide();

    $('#laptopInput').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
    });

    $('#laptopInput').submit(function(event){
        createLaptop();
    });

    $('.laptop-list').on('click', 'li', function(){ // Event listener added to ul, which exists on page load
        laptopId = $(this).data('id');
        $('#laptop-view').hide();
        $('#checkout-view').show();
        UpdateCheckout();
    });

    // Checkout View
    $('#checkoutInput').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
    });
    
    $('#checkoutInput').submit(function(event){
        createCheckout();
    });

});

function addLaptops(laptops) {
    // Add all laptops to the page
    laptops.forEach(function(laptop){
        addLaptop(laptop);
    });
}

function addLaptop(laptop) {
    // Add a laptop to the page
    var newLaptop = $('<li class="laptop"><strong>Laptop:</strong> ' 
        + laptop.name + ' <strong>Serial Number:</strong> ' 
        + laptop.serialNum + '</li>');

    newLaptop.data('id', laptop._id); // jQuery data attribute, does not show up in html

    $('.laptop-list').append(newLaptop);
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

// Checkout Functions
function UpdateCheckout() {
    $.getJSON("/api/laptops/" + laptopId)
        .then(addCheckout);
}

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
        addCheckout(updatedLaptop);
    })
    .catch(function(err){
        console.log(err);
    });
}

function addCheckout(laptop) {

    $('h1').html('Laptop: ' + laptop.name);
    // Add current checkout to the page, if there is one
    if(laptop.currentCheckout){
        var dueDate = new Date(laptop.currentCheckout.dueDate);
        $('#currentCheckout').html('Name: ' + laptop.currentCheckout.userName + 
        '<br>Manager Who Approved: ' + laptop.currentCheckout.mgrName +
        '<br>Due Date: ' + dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' }));
    }
    else{
        $('#currentCheckout').html('Available');
    }
}