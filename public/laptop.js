var laptopId;

$(document).ready(function(){
    laptopId = $('#checkoutInput').attr("data-laptop");
    $.getJSON("/api/laptops/" + laptopId)
    .then(addCheckouts);
    
    $('#checkoutInput').submit(function(event){
        createCheckout();
    });
});

function createCheckout() {
    // Send request to create a new checkout
    var userNameInput = $('#userNameInput').val();
    var mgrNameInput = $('#mgrNameInput').val();
    var dueDateInput = $('#dueDateInput').val();

    $.post('/api/checkouts', {userName: userNameInput, mgrName: mgrNameInput, dueDate: dueDateInput, laptop: laptopId})
    .then(function(newCheckout){
        addCheckout(newCheckout);
    }).catch(function(err){
        console.log(err);
    });
}

function addCheckouts(laptop) {
    $.getJSON("/api/checkouts/" + laptop.currentCheckout)
    .then(addCheckout)
}

function addCheckout(checkout) {
    $('#currentCheckout').html('Name: ' + checkout.userName);
}