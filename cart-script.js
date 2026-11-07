document.addEventListener("DOMContentLoaded", function () {
    const cartContentWrapper = document.getElementById("cartContentWrapper");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const clearAllBtn = document.getElementById("clearAllBtn");

    // Modal elements from cart.html
    const confirmModal = document.getElementById("cartConfirmModal");
    const confirmText = document.getElementById("confirmModalText");
    const cancelBtn = document.getElementById("confirmCancelBtn");
    const actionBtn = document.getElementById("confirmActionBtn");

    let currentActionCallback = null;

    // Retrieve or initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem("kusinaCart"));
    if (!cart) {
        cart = [
            { name: "Pork Sisig", price: 70.00, qty: 2, img: "images/sisig.png" },
            { name: "Papaitan", price: 80.00, qty: 1, img: "images/papaitan.jpg" },
            { name: "Royal Tru Orange 500ml", price: 35.00, qty: 1, img: "images/royal.jpg" },
            { name: "Coca-Cola Original 500ml", price: 35.00, qty: 1, img: "images/coca-cola.jpg" },
            { name: "Plain Rice", price: 15.00, qty: 3, img: "images/plainrice.jpg" }
        ];
        localStorage.setItem("kusinaCart", JSON.stringify(cart));
    }

    // Trigger the HTML-based modal
    function showConfirmModal(message, onConfirm) {
        if (confirmText) confirmText.textContent = message;
        if (confirmModal) confirmModal.style.display = "flex";
        currentActionCallback = onConfirm;
    }

    // Modal button handlers
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            if (confirmModal) confirmModal.style.display = "none";
            currentActionCallback = null;
        });
    }

    if (actionBtn) {
        actionBtn.addEventListener("click", function() {
            if (confirmModal) confirmModal.style.display = "none";
            if (currentActionCallback) {
                currentActionCallback();
                currentActionCallback = null;
            }
        });
    }

    function renderCart() {
        if (!cart || cart.length === 0) {
            cartContentWrapper.innerHTML = `
                <div class="empty-cart-container" style="text-align: center; padding: 40px;">
                    <p style="font-size: 1.1rem; font-weight: 600; color: #FF9D00;">No added cart items.</p>
                </div>
            `;
            if (cartSubtotal) cartSubtotal.textContent = "₱0.00";
            if (cartTotal) cartTotal.textContent = "₱0.00";
            localStorage.setItem("kusinaCart", JSON.stringify(cart));
            return;
        }

        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th class="th-remove"></th>
                        <th class="th-product">PRODUCT</th>
                        <th class="th-price">PRICE</th>
                        <th class="th-qty">QUANTITY</th>
                        <th class="th-subtotal">SUBTOTAL</th>
                    </tr>
                </thead>
                <tbody id="cartTableBody">
        `;

        cart.forEach((item, index) => {
            let subtotal = item.price * item.qty;
            html += `
                <tr>
                    <td class="cell-remove"><button type="button" class="remove-btn" data-index="${index}">✕</button></td>
                    <td class="cell-product">
                        <div class="product-info">
                            <img src="${item.img}" alt="${item.name}" class="dish-thumb">
                            <span class="product-name">${item.name}</span>
                        </div>
                    </td>
                    <td class="cell-price">₱${item.price.toFixed(2)}</td>
                    <td class="cell-qty"><input type="number" name="quantity" value="${item.qty}" min="1" max="99" class="qty-input" data-index="${index}"></td>
                    <td class="cell-subtotal">₱${subtotal.toFixed(2)}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        cartContentWrapper.innerHTML = html;

        attachEventListeners();
        calculateTotals();
    }

    function calculateTotals() {
        let total = 0;
        document.querySelectorAll(".cell-subtotal").forEach(cell => {
            let val = parseFloat(cell.textContent.replace("₱", "").trim());
            if (!isNaN(val)) total += val;
        });
        if (cartSubtotal) cartSubtotal.textContent = "₱" + total.toFixed(2);
        if (cartTotal) cartTotal.textContent = "₱" + total.toFixed(2);

        localStorage.setItem("kusinaCart", JSON.stringify(cart));
    }

    function attachEventListeners() {
        // Quantity change listener
        document.querySelectorAll(".qty-input").forEach(input => {
            input.addEventListener("change", function () {
                let index = parseInt(this.getAttribute("data-index"));
                let newQty = parseInt(this.value);
                if (newQty < 1 || isNaN(newQty)) newQty = 1;

                cart[index].qty = newQty;

                let row = this.closest("tr");
                let subtotalCell = row.querySelector(".cell-subtotal");
                let itemSubtotal = cart[index].price * newQty;
                subtotalCell.textContent = "₱" + itemSubtotal.toFixed(2);

                calculateTotals();
            });
        });

        // Individual item removal using HTML modal
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = parseInt(this.getAttribute("data-index"));
                let itemName = cart[index] ? cart[index].name : "this item";

                showConfirmModal(`Are you sure you want to remove "${itemName}" from your cart?`, function() {
                    cart.splice(index, 1);
                    renderCart();
                });
            });
        });
    }

    // Clear All button using HTML modal
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", function () {
            showConfirmModal("Are you sure you want to clear all items from your cart?", function() {
                cart = [];
                renderCart();
            });
        });
    }

    renderCart();
});