window.addEventListener("DOMContentLoaded", function() {
    createNotificationModal();
    showNotificationModal("Welcome to Kusina Express! Tip: Hover over any food image to view details.");
    
    setTimeout(function() {
        const notifyModal = document.getElementById("cartNotificationModal");
        if (notifyModal) {
            notifyModal.style.display = "none";
        }
    }, 5000);
});

const foodDetails = {
    
};

// Get popup elements
const foodModal = document.getElementById("foodModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalAvailability = document.getElementById("modalAvailability");
const modalIngredients = document.getElementById("modalIngredients");
const modalAllergens = document.getElementById("modalAllergens");

function showFoodDetails(row) {
    const name = row.querySelector(".cell-name").textContent.trim();
    const image = row.querySelector(".dish-thumb").src;
    const description = row.querySelector(".cell-desc").textContent.trim();
    const price = row.querySelector(".cell-price").textContent.trim();
    const availability = row.querySelector(".badge").textContent.trim();

    const details = foodDetails[name];

    modalImage.src = image;
    modalImage.alt = name;
    modalName.textContent = name;
    modalDescription.textContent = description;
    modalPrice.textContent = "Price: " + price;
    modalAvailability.textContent = "Availability: " + availability;

    modalIngredients.textContent = details ? details.ingredients : "Ingredients not yet provided.";
    modalAllergens.textContent = details ? details.allergens : "Allergen information not yet provided.";

    foodModal.style.display = "flex";
}

// Hover event listeners for details popup
document.querySelectorAll(".cell-name, .dish-thumb").forEach(function(item) {
    item.style.cursor = "pointer";
    item.addEventListener("mouseenter", function() {
        const row = item.closest("tr");
        if (row) showFoodDetails(row);
    });
});

if (foodModal) {
    foodModal.addEventListener("mouseleave", function() {
        foodModal.style.display = "none";
    });
}

const closeBtn = document.getElementById("modalCloseButton");
if (closeBtn) {
    closeBtn.addEventListener("click", function() {
        foodModal.style.display = "none";
    });
}


// Create the notification modal dynamically if it doesn't exist in HTML
function createNotificationModal() {
    if (document.getElementById("cartNotificationModal")) return;
    
    const modalHTML = `
        <div id="cartNotificationModal" class="food-modal" style="display: none; position: fixed; z-index: 2000; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
            <div class="food-modal-content" style="text-align: center; max-width: 300px; padding: 20px;">
                <p id="notificationText" style="font-weight: 600; font-size: 1.05rem; margin-bottom: 15px; color: #ffe1ff;"></p>
                <button id="notificationOkBtn" class="btn-action" style="padding: 8px 20px; background: #d9534f; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

createNotificationModal();

function showNotificationModal(message, callback) {
    const notifyModal = document.getElementById("cartNotificationModal");
    const notifyText = document.getElementById("notificationText");
    const okBtn = document.getElementById("notificationOkBtn");

    notifyText.textContent = message;
    notifyModal.style.display = "flex";

    okBtn.onclick = function() {
        notifyModal.style.display = "none";
        if (callback) callback();
    };
}

// Handle Add Buttons
document.querySelectorAll(".add-btn:not([disabled])").forEach(function(button) {
    button.addEventListener("click", function() {
        const row = button.closest("tr");
        const name = row.querySelector(".cell-name").textContent.trim();
        const priceStr = row.querySelector(".cell-price").textContent.trim();
        const price = parseFloat(priceStr.replace("₱", "").trim());
        const img = row.querySelector(".dish-thumb").src;

        // Retrieve existing cart from localStorage or start default array
        let cart = JSON.parse(localStorage.getItem("kusinaCart")) || [
            { name: "Pork Sisig", price: 70.00, qty: 2, img: "images/sisig.png" },
            { name: "Papaitan", price: 80.00, qty: 1, img: "images/papaitan.jpg" },
            { name: "Royal Tru Orange 500ml", price: 35.00, qty: 1, img: "images/royal.jpg" },
            { name: "Coca-Cola Original 500ml", price: 35.00, qty: 1, img: "images/coca-cola.jpg" },
            { name: "Plain Rice", price: 15.00, qty: 3, img: "images/plainrice.jpg" }
        ];

        // Check if item already exists in cart
        let existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name: name, price: price, qty: 1, img: img });
        }

        // Save back to localStorage
        localStorage.setItem("kusinaCart", JSON.stringify(cart));

        // Show custom modal notification and stay on the menu page when OK is clicked
        showNotificationModal(`"${name}" has been added to cart!`);
    });
});
