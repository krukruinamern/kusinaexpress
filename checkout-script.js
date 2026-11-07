document.addEventListener("DOMContentLoaded", function () {
    const itemsListContainer = document.querySelector(".checkout-items-list");
    const calcValElements = document.querySelectorAll(".calc-val");
    const totalPriceElement = document.querySelector(".total-price");
    const checkoutForm = document.querySelector(".checkout-form");

    // Modal elements
    const checkoutModal = document.getElementById("checkoutConfirmModal");
    const cancelBtn = document.getElementById("checkoutCancelBtn");
    const actionBtn = document.getElementById("checkoutActionBtn");

    // Retrieve cart items from localStorage
    let cart = JSON.parse(localStorage.getItem("kusinaCart")) || [
        { name: "Pork Sisig", price: 70.00, qty: 2, img: "images/sisig.png" },
        { name: "Papaitan", price: 80.00, qty: 1, img: "images/papaitan.jpg" },
        { name: "Royal Tru Orange 500ml", price: 35.00, qty: 1, img: "images/royal.jpg" },
        { name: "Coca-Cola Original 500ml", price: 35.00, qty: 1, img: "images/coca-cola.jpg" },
        { name: "Plain Rice", price: 15.00, qty: 3, img: "images/plainrice.jpg" }
    ];

    function renderCheckoutSummary() {
        if (!itemsListContainer) return;

        let itemsHtml = "";
        let subtotal = 0;

        cart.forEach(item => {
            let itemSub = item.price * item.qty;
            subtotal += itemSub;

            itemsHtml += `
                <div class="summary-item-row">
                    <div class="item-details">
                        <span class="item-qty">${item.qty}x</span>
                        <span class="item-name">${item.name}</span>
                    </div>
                    <span class="item-price">₱${itemSub.toFixed(2)}</span>
                </div>
            `;
        });

        itemsListContainer.innerHTML = itemsHtml;

        let deliveryFee = 40.00;
        let grandTotal = subtotal + deliveryFee;

        if (calcValElements.length >= 2) {
            calcValElements[0].textContent = "₱" + subtotal.toFixed(2);
            calcValElements[1].textContent = "₱" + deliveryFee.toFixed(2);
        }
        if (totalPriceElement) {
            totalPriceElement.textContent = "₱" + grandTotal.toFixed(2);
        }
    }

    renderCheckoutSummary();

    // Order Submission Form Handler using Modal
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Stop default submission

            // Show the custom modal instead of confirm()
            if (checkoutModal) {
                checkoutModal.style.display = "flex";
            }
        });
    }

    // Modal Cancel Button
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            if (checkoutModal) {
                checkoutModal.style.display = "none";
            }
        });
    }

    // Modal Confirm Button
    if (actionBtn) {
        actionBtn.addEventListener("click", function () {
            if (checkoutModal) {
                checkoutModal.style.display = "none";
            }
            localStorage.removeItem("kusinaCart"); // clear cart on success
            window.location.href = "orderdone.html";
        });
    }
});