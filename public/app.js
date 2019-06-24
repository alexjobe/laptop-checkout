var checkouts = document.getElementsByClassName("checkout");

Array.from(checkouts).forEach(function(checkout){
    checkout.addEventListener("click", function(){
        editCheckout(checkout.dataset.checkid)
    });
    if(new Date(checkout.dataset.etadate) < new Date() && checkout.dataset.returned === "false") {
        checkout.classList.add("overdue");
    }
});

function editCheckout(id) {
    window.location.replace("/checkouts/" + id + "/edit");
}