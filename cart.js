const products = [
    { id: 1, name: 'Apple', price: 200, category: 'fruit', image: 'https://gourmetgarden.in/cdn/shop/products/Shimla_Apples_284b27ca-016e-4534-aa01-e6dfefc19ee6_375x.jpg?v=1707325786' },
    { id: 2, name: 'Banana', price: 150, category: 'fruit', image: 'https://gourmetgarden.in/cdn/shop/products/Pachbale_c70715f9-c45b-45df-a0c4-135208cbe3ce_1280x.png?v=1707325743' },
    { id: 3, name: 'Carrot', price: 100, category: 'vegetable', image: 'https://gourmetgarden.in/cdn/shop/products/BabyCarrot_1e11584a-3a11-48a8-8cdd-bef279b3db40_375x.jpg?v=1707326236' },
    { id: 4, name: 'Tomato', price: 80, category: 'vegetable', image: 'https://gourmetgarden.in/cdn/shop/files/GG_Tomato_5edb37f7-b498-4b29-884b-6da80756cf15_375x.jpg?v=1721720196' },
    { id: 5, name: 'Grapes', price: 90, category: 'fruit', image: 'https://gourmetgarden.in/cdn/shop/files/PaneerGrapes_1280x.png?v=1710348192' },
    { id: 6, name: 'Orange', price: 120, category: 'fruit', image: 'https://diz7l2x0sn587.cloudfront.net/kisankonnect/Images/ProductImage/20240308185742WhatsApp%20Image%202024-03-08%20at%2017.13.39_6719cd86.jpg' }
];

let cart = [];

function displayProducts(filterCategory = [], searchQuery = '') {
    const shopContainer = document.getElementById('shop');
    shopContainer.innerHTML = '';

    let filteredProducts = products;

    if (filterCategory.length > 0 && !filterCategory.includes('all')) {
        filteredProducts = filteredProducts.filter(product =>
            filterCategory.includes(product.category)
        );
    }

    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    filteredProducts.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('shop-item');
        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        shopContainer.appendChild(itemDiv);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    if (filteredProducts.length === 0) {
        shopContainer.innerHTML += '<p>No products found.</p>';
    }
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-submit');

    searchButton.addEventListener('click', () => {
        displayProducts(getSelectedFilters(), searchInput.value.trim());
        searchInput.value = '';
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            displayProducts(getSelectedFilters(), searchInput.value.trim());
            searchInput.value = '';
        }
    });
}

function handleFilters() {
    const fruitsCheckbox = document.getElementById('fruits-checkbox');
    const vegetablesCheckbox = document.getElementById('vegetables-checkbox');
    const allCheckbox = document.getElementById('all-checkbox');

    function applyFilters() {
        const filterCategory = getSelectedFilters();
        const searchQuery = document.getElementById('search-input').value.trim();
        displayProducts(filterCategory, searchQuery);
    }

    function getSelectedFilters() {
        const filterCategory = [];
        if (allCheckbox.checked) {
            filterCategory.push('all');
        } else {
            if (fruitsCheckbox.checked) filterCategory.push('fruit');
            if (vegetablesCheckbox.checked) filterCategory.push('vegetable');
        }
        return filterCategory;
    }

    allCheckbox.addEventListener('change', () => {
        if (allCheckbox.checked) {
            fruitsCheckbox.checked = false;
            vegetablesCheckbox.checked = false;
        }
        applyFilters();
    });

    fruitsCheckbox.addEventListener('change', () => {
        allCheckbox.checked = false;
        applyFilters();
    });

    vegetablesCheckbox.addEventListener('change', () => {
        allCheckbox.checked = false;
        applyFilters();
    });
}

function addToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    alert('Product added to cart!');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;

    if (count === 0) {
        displayEmptyCartMessage();
    }
}

function displayEmptyCartMessage() {
    const shopContainer = document.getElementById('shop');
    if (shopContainer && !shopContainer.querySelector('p')) {
        shopContainer.innerHTML += '<p>Your cart is empty.</p>';
    }
}

function displayCart() {
    const cartModalContent = document.querySelector('.cart-modal-content');
    cartModalContent.innerHTML = '<h2>Your Cart</h2>';

    if (cart.length === 0) {
        cartModalContent.innerHTML += '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <div class="quantity-container">
                        <button class="quantity-button decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-button increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartModalContent.appendChild(itemDiv);
        });

        cartModalContent.innerHTML += '<button id="proceed-button">Proceed</button>';
    }

    document.querySelectorAll('.quantity-button').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });

    document.getElementById('proceed-button').addEventListener('click', proceedToCheckout);

    document.getElementById('cart-modal').style.display = 'block';
}

function updateQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const action = event.target.classList.contains('increase') ? 'increase' : 'decrease';

    const item = cart.find(item => item.id === productId);
    if (action === 'increase') {
        item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity--;
    }

    if (item.quantity === 0) {
        removeFromCart({ target: { dataset: { id: productId } } });
    } else {
        displayCart(); 
    }
}

function removeFromCart(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    displayCart();
    updateCartCount();
}

function proceedToCheckout() {
    cart = [];
    alert('Your purchase is successfully completed.');
    updateCartCount();

    const cartModalContent = document.querySelector('.cart-modal-content');
    cartModalContent.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-modal').style.display = 'block';

    setTimeout(() => {
        document.getElementById('cart-modal').style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    handleSearch();
    handleFilters();
    displayProducts(['all']);
    updateCartCount();

    document.querySelector('.cart-icon').addEventListener('click', displayCart);

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('cart-modal')) {
            document.getElementById('cart-modal').style.display = 'none';
        }
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });
});