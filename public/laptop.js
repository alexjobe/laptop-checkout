var laptopId; // The laptop Mongo ObjectID is stored in a data attribute on <body>

$(document).ready(function(){
    laptopId = $('body').attr("data-laptop"); // laptopId is stored in a data attribute on <body>
    $('#checkoutInput').submit(function (e) {
        e.preventDefault(); // Prevent form from reloading the page on submit, so ajax calls work correctly
    });
    $.getJSON("/api/laptops/" + laptopId)
    .then(addCheckout);
    
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