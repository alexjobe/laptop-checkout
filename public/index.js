$(document).ready(function(){
    $.getJSON("/api/laptops")
    .then(addLaptops);

    $('#laptopInput').submit(function(event){
        createLaptop();
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

function createCheckout() {
    // Send request to create a new checkout
    var userNameInput = $('#userNameInput').val();
    var mgrNameInput = $('#mgrNameInput').val();
    var dueDateInput = $('#dueDateInput').val();
    var laptopId = $('#checkoutInput').attr("data-laptop");

    $.post('/api/checkouts', {userName: userNameInput, mgrName: mgrNameInput, dueDate: dueDateInput, laptop: laptopId})
    .then(function(newCheckout){
        addCheckout(newCheckout);
    }).catch(function(err){
        console.log(err);
    });
}


function addCheckout(checkout) {
    $('#currentCheckout').html('Name: ' + checkout.userName);
}