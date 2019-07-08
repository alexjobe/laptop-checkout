// ----------------------------------------------- //
// ----------- Laptop View Functions ------------- //
// ----------------------------------------------- //

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
    var laptopListItem = $('<li class="laptop"><text><strong>Laptop:</strong> ' 
        + laptop.name + ' <strong>Serial Number:</strong> ' 
        + laptop.serialNum + '</text><span>X</span></li>');

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
        showCheckoutView(); // checkouts.js

        // Display current checkout of clicked laptop
        getCurrentLaptop()
        .then(updateCurrentCheckout); // checkouts.js
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