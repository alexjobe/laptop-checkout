var laptopId;

$(document).ready(function(){
    laptopId = $('body').attr("data-laptop");
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
        return $.ajax({
            method: 'PUT',
            url: '/api/laptops/' + laptopId,
            data: {currentCheckout: newCheckout._id}
        });
    })
    .then(function(updatedLaptop){
        addCheckout(updatedLaptop);
    })
    .catch(function(err){
        console.log(err);
    });
}

function addCheckout(laptop) {
    console.log(laptop);
    if(laptop.currentCheckout){
        var dueDate = new Date(laptop.currentCheckout.dueDate);
        $('#currentCheckout').html('Name: ' + laptop.currentCheckout.userName + 
        '<br>Manager Who Approved: ' + laptop.currentCheckout.mgrName +
        '<br>Due Date: ' + dueDate.toLocaleDateString('en-US', { timeZone: 'UTC' }));
    }
}