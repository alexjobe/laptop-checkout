var checkouts = document.getElementsByClassName("checkout");

Array.from(checkouts).forEach(function(checkout){
    checkout.addEventListener("click", function(){
        editCheckout(checkout.dataset.checkid)
    });
    if(new Date(checkout.dataset.etadate) < new Date()) {
        checkout.classList.add("overdue");
    }
    if(Boolean(checkout.dataset.returned)){
        console.log("yes");
    }
});

function editCheckout(id) {
    window.location.replace("/checkouts/" + id + "/edit");
}