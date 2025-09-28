// Telegram Web App initialization
let tg = window.Telegram.WebApp;
tg.expand();

// Global state
let currentUser = {
    id: null,
    name: '',
    isClubMember: false,
    subscriptionActive: false,
    subscriptionExpiry: null,
    totalSavings: 0,
    totalOrders: 0,
    isAdmin: false
};

let cart = [];
let orders = [];
let currentProduct = null;
let modalQuantity = 1;
let checkoutData = {
    deliveryOption: 'standard',
    paymentMethod: 'cash',
    additionalServices: [],
    name: '',
    phone: '',
    address: '',
    comment: ''
};

// Products database - now stored in localStorage
let products = [];

// Initialize products from localStorage or use default products
function initializeProducts() {
    const savedProducts = localStorage.getItem('zestShopProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
        products = [
            // Энергетики
            {
                id: 1,
                name: 'Red Bull',
                category: 'energy',
                volume: '250 мл',
                brand: 'Red Bull',
                regularPrice: 120,
                clubPrice: 85,
                image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&h=300&fit=crop',
                description: 'Классический энергетический напиток с кофеином и таурином',
                featured: true,
                badge: 'Хит'
            },
            {
                id: 2,
                name: 'Monster Energy',
                category: 'energy',
                volume: '500 мл',
                brand: 'Monster',
                regularPrice: 180,
                clubPrice: 125,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Мощный энергетик с интенсивным вкусом',
                featured: true,
                badge: 'Популярный'
            },
            {
                id: 3,
                name: 'Burn Original',
                category: 'energy',
                volume: '330 мл',
                brand: 'Burn',
                regularPrice: 95,
                clubPrice: 68,
                image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop',
                description: 'Энергетический напиток с ярким вкусом',
                featured: false
            },
            {
                id: 4,
                name: 'Adrenaline Rush',
                category: 'energy',
                volume: '449 мл',
                brand: 'PepsiCo',
                regularPrice: 110,
                clubPrice: 78,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Российский энергетик с гуараной',
                featured: false
            },
            
            // Газировка
            {
                id: 5,
                name: 'Coca-Cola',
                category: 'soda',
                volume: '330 мл',
                brand: 'Coca-Cola',
                regularPrice: 65,
                clubPrice: 45,
                image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop',
                description: 'Классическая кола с неповторимым вкусом',
                featured: true,
                badge: 'Лучший выбор'
            },
            {
                id: 6,
                name: 'Pepsi',
                category: 'soda',
                volume: '330 мл',
                brand: 'Pepsi',
                regularPrice: 60,
                clubPrice: 42,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Освежающая газировка с фруктовым вкусом',
                featured: false
            },
            {
                id: 7,
                name: 'Fanta',
                category: 'soda',
                volume: '330 мл',
                brand: 'Coca-Cola',
                regularPrice: 60,
                clubPrice: 42,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Апельсиновая газировка',
                featured: false
            },
            
            // Соки
            {
                id: 8,
                name: 'Добрый Апельсин',
                category: 'juice',
                volume: '500 мл',
                brand: 'Добрый',
                regularPrice: 85,
                clubPrice: 60,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Натуральный апельсиновый сок',
                featured: true,
                badge: 'Натуральный'
            },
            {
                id: 9,
                name: 'Rich Яблоко',
                category: 'juice',
                volume: '1 л',
                brand: 'Rich',
                regularPrice: 120,
                clubPrice: 85,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Сок из свежих яблок',
                featured: false
            },
            
            // Вода
            {
                id: 10,
                name: 'BonAqua',
                category: 'water',
                volume: '500 мл',
                brand: 'BonAqua',
                regularPrice: 45,
                clubPrice: 32,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Питьевая вода высокого качества',
                featured: false
            },
            
            // Кофе
            {
                id: 11,
                name: 'Jacobs Monarch',
                category: 'coffee',
                volume: '100 г',
                brand: 'Jacobs',
                regularPrice: 180,
                clubPrice: 125,
                image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
                description: 'Растворимый кофе премиум класса',
                featured: true,
                badge: 'Премиум'
            }
        ];
        saveProductsToStorage();
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('zestShopProducts', JSON.stringify(products));
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    loadUserData();
    loadCart();
    loadOrders();
    displayProducts(products);
    displayFeaturedProducts();
    updateCartBadge();
    updateLoyaltyStatus();
    checkSubscriptionStatus();
    updateGreeting();
    
    // Check if user is admin
    checkAdminStatus();
    
    // Focus search input when clicking search button
    document.querySelector('.search-btn')?.addEventListener('click', function() {
        document.getElementById('searchInput').focus();
    });
    
    // Add event listener for admin form
    document.getElementById('addProductForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProduct();
    });
    
    // Add phone input mask
    const phoneInput = document.getElementById('checkoutPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            let formattedValue = '+7 ';
            if (value.length > 1) formattedValue += '(' + value.substring(1, 4);
            if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            
            e.target.value = formattedValue;
        });
    }
    
    // Add keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            closeModal();
            closeCheckoutModal();
            closePaymentModal();
            closeSubscriptionModal();
            closeAgreementModal();
            closeSuccessModal();
            closeAdminLoginModal();
        }
        
        // Secret admin access with Ctrl+Shift+A
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            showAdminLogin();
        }
    });
    
    // Initialize delivery option selection
    selectDeliveryOption('standard');
    
    // Initialize agreement checkbox
    document.getElementById('agreeCheckbox')?.addEventListener('change', function() {
        document.getElementById('acceptAgreementBtn').disabled = !this.checked;
    });
});

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked nav tab
    event.currentTarget.classList.add('active');
    event.currentTarget.setAttribute('aria-selected', 'true');
    event.currentTarget.setAttribute('tabindex', '0');
    
    // Special actions for certain tabs
    if (tabName === 'cart') {
        displayCart();
    } else if (tabName === 'orders') {
        displayOrders();
    } else if (tabName === 'admin') {
        displayAdminProducts();
        displayAdminOrders(); // Display orders in admin panel
    }
}

// Update user greeting based on time of day
function updateGreeting() {
    const greetingElement = document.getElementById('greetingText');
    const hours = new Date().getHours();
    
    let greetingText = '';
    if (hours < 6) {
        greetingText = 'Доброй ночи!';
    } else if (hours < 12) {
        greetingText = 'Доброе утро!';
    } else if (hours < 18) {
        greetingText = 'Добрый день!';
    } else {
        greetingText = 'Добрый вечер!';
    }
    
    // If user is logged in, show their name
    if (currentUser.name) {
        greetingText = `${greetingText} ${currentUser.name.split(' ')[0]}!`;
    }
    
    greetingElement.textContent = greetingText;
}

// Display products
function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px;">Товары не найдены</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('tabindex', '0');
        productCard.setAttribute('role', 'button');
        productCard.setAttribute('aria-label', `${product.name}, ${product.volume}, ${currentUser.isClubMember && currentUser.subscriptionActive ? product.clubPrice : product.regularPrice} рублей`);
        
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<div class="product-badge">${product.badge}</div>`;
        }
        
        productCard.innerHTML = `
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="handleImageError(this)">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-meta">
                    <span class="product-volume">${product.volume}</span>
                    <span class="product-price ${currentUser.isClubMember && currentUser.subscriptionActive ? 'club' : ''}">
                        ${currentUser.isClubMember && currentUser.subscriptionActive ? product.clubPrice : product.regularPrice} ₽
                    </span>
                </div>
            </div>
        `;
        productCard.addEventListener('click', () => openProductModal(product));
        productCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProductModal(product);
            }
        });
        grid.appendChild(productCard);
    });
}

// Display featured products
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const featuredProducts = products.filter(product => product.featured);
    
    featuredContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'featured-product-card';
        productCard.setAttribute('tabindex', '0');
        productCard.setAttribute('role', 'button');
        productCard.setAttribute('aria-label', `${product.name}, ${product.volume}, ${currentUser.isClubMember && currentUser.subscriptionActive ? product.clubPrice : product.regularPrice} рублей`);
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="featured-product-image" onerror="handleImageError(this)">
            <div class="featured-product-info">
                <div class="featured-product-name">${product.name}</div>
                <div class="featured-product-meta">
                    <span class="product-volume">${product.volume}</span>
                    <span class="featured-product-price ${currentUser.isClubMember && currentUser.subscriptionActive ? 'club' : ''}">
                        ${currentUser.isClubMember && currentUser.subscriptionActive ? product.clubPrice : product.regularPrice} ₽
                    </span>
                </div>
            </div>
        `;
        productCard.addEventListener('click', () => openProductModal(product));
        productCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProductModal(product);
            }
        });
        featuredContainer.appendChild(productCard);
    });
}

// Filter products by category
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
    });
    event.currentTarget.classList.add('active');
    event.currentTarget.setAttribute('aria-selected', 'true');
    event.currentTarget.setAttribute('tabindex', '0');
    
    // Filter products
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    displayProducts(filteredProducts);
    
    // Scroll to products section
    document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' });
}

// Open product modal
function openProductModal(product) {
    currentProduct = product;
    modalQuantity = 1;
    
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.name;
    document.getElementById('modalProductImage').onerror = function() {
        handleImageError(this);
    };
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductVolume').textContent = product.volume;
    document.getElementById('modalProductBrand').textContent = product.brand;
    document.getElementById('modalRegularPrice').textContent = product.regularPrice + ' ₽';
    document.getElementById('modalQuantity').textContent = modalQuantity;
    
    // Show club price if user is a club member
    if (currentUser.isClubMember && currentUser.subscriptionActive) {
        document.getElementById('modalClubPriceInfo').style.display = 'flex';
        document.getElementById('modalClubPrice').textContent = product.clubPrice + ' ₽';
    } else {
        document.getElementById('modalClubPriceInfo').style.display = 'none';
    }
    
    document.getElementById('productModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Increase modal quantity
function increaseModalQuantity() {
    modalQuantity++;
    document.getElementById('modalQuantity').textContent = modalQuantity;
}

// Decrease modal quantity
function decreaseModalQuantity() {
    if (modalQuantity > 1) {
        modalQuantity--;
        document.getElementById('modalQuantity').textContent = modalQuantity;
    }
}

// Add to cart from modal
function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct, modalQuantity);
    }
}

// Add to cart
function addToCart(product, quantity = 1) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
    } else {
        // Add new item
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Save cart and update UI
    saveCart();
    updateCartBadge();
    updateMainButton();
    
    // Show notification
    showToast(`Добавлено в корзину: ${product.name} (${quantity} шт.)`);
    
    // Close modal if open
    closeModal();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    displayCart();
    updateMainButton();
    showToast('Товар удален из корзины');
}

// Display cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const priceBreakdown = document.getElementById('priceBreakdown');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>Ваша корзина пуста</p>
            </div>
        `;
        priceBreakdown.innerHTML = '';
        return;
    }
    
    // Display cart items
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="handleImageError(this)">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.volume}</p>
                <div class="item-price">${currentUser.isClubMember && currentUser.subscriptionActive ? item.clubPrice : item.regularPrice} ₽ за шт.</div>
            </div>
            <div class="item-controls">
                <div class="quantity-selector">
                    <button onclick="updateCartItemQuantity(${item.id}, -1)" aria-label="Уменьшить количество">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, 1)" aria-label="Увеличить количество">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Удалить из корзины">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Display price breakdown
    let regularTotal = 0;
    let clubTotal = 0;
    
    cart.forEach(item => {
        regularTotal += item.regularPrice * item.quantity;
        if (currentUser.isClubMember && currentUser.subscriptionActive) {
            clubTotal += item.clubPrice * item.quantity;
        }
    });
    
    const total = currentUser.isClubMember && currentUser.subscriptionActive ? clubTotal : regularTotal;
    const savings = regularTotal - clubTotal;
    
    priceBreakdown.innerHTML = `
        <div class="price-row">
            <span>Стоимость товаров:</span>
            <span>${regularTotal} ₽</span>
        </div>
        ${currentUser.isClubMember && currentUser.subscriptionActive ? `
            <div class="price-row club-price">
                <span>Цена для клуба:</span>
                <span>${clubTotal} ₽</span>
            </div>
            <div class="price-row savings">
                <span>Ваша экономия:</span>
                <span>${savings} ₽</span>
            </div>
        ` : ''}
        <div class="price-row total">
            <span>Итого:</span>
            <span>${total} ₽</span>
        </div>
    `;
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartBadge();
            displayCart();
            updateMainButton();
        }
    }
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart = [];
        saveCart();
        updateCartBadge();
        displayCart();
        updateMainButton();
        showToast('Корзина очищена');
    }
}

// Update cart badge
function updateCartBadge() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
}

// Initiate checkout
function initiateCheckout() {
    if (cart.length === 0) {
        showToast('Корзина пуста');
        return;
    }
    
    // Show agreement modal first
    document.getElementById('agreementModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close agreement modal
function closeAgreementModal() {
    document.getElementById('agreementModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Accept agreement
function acceptAgreement() {
    if (!document.getElementById('agreeCheckbox').checked) {
        showToast('Пожалуйста, примите пользовательское соглашение');
        return;
    }
    
    closeAgreementModal();
    openCheckoutModal();
}

// Open checkout modal
function openCheckoutModal() {
    // Reset checkout steps
    showCheckoutStep(1);
    
    // Display order summary
    displayOrderSummary();
    
    // Show modal
    document.getElementById('checkoutModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Display order summary
function displayOrderSummary() {
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    const totalSummary = document.getElementById('totalSummary');
    const deliveryCostSummary = document.getElementById('deliveryCostSummary');
    
    // Display items
    orderSummaryItems.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>${item.volume} × ${item.quantity} шт.</p>
            </div>
            <div class="order-item-price">
                ${(currentUser.isClubMember && currentUser.subscriptionActive ? item.clubPrice : item.regularPrice) * item.quantity} ₽
            </div>
        `;
        orderSummaryItems.appendChild(orderItem);
    });
    
    // Calculate totals
    let itemTotal = 0;
    cart.forEach(item => {
        itemTotal += (currentUser.isClubMember && currentUser.subscriptionActive ? item.clubPrice : item.regularPrice) * item.quantity;
    });
    
    let deliveryCost = 0;
    if (!(currentUser.isClubMember && currentUser.subscriptionActive)) {
        switch (checkoutData.deliveryOption) {
            case 'standard':
                deliveryCost = 50;
                break;
            case 'remote':
                deliveryCost = 15;
                break;
            case 'express':
                deliveryCost = 60; // 50 + 10
                break;
            case 'pickup':
                deliveryCost = 0;
                break;
        }
    }
    
    let additionalServicesCost = 0;
    checkoutData.additionalServices.forEach(service => {
        switch (service) {
            case 'bag':
                additionalServicesCost += 8;
                break;
            case 'card':
                additionalServicesCost += 35;
                break;
            case 'special':
                additionalServicesCost += 15;
                break;
        }
    });
    
    const total = itemTotal + deliveryCost + additionalServicesCost;
    
    // Update UI
    deliveryCostSummary.textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost + ' ₽';
    totalSummary.textContent = total + ' ₽';
    
    // Update services summary
    updateServicesSummary();
}

// Update services summary
function updateServicesSummary() {
    const servicesList = document.getElementById('servicesList');
    const servicesSummary = document.getElementById('servicesSummary');
    
    if (checkoutData.additionalServices.length === 0) {
        servicesSummary.style.display = 'none';
        return;
    }
    
    servicesSummary.style.display = 'block';
    servicesList.innerHTML = '';
    
    checkoutData.additionalServices.forEach(service => {
        const listItem = document.createElement('li');
        switch (service) {
            case 'bag':
                listItem.textContent = 'Пакет: 8 ₽';
                break;
            case 'card':
                listItem.textContent = 'Открытка: 35 ₽';
                break;
            case 'special':
                listItem.textContent = 'Специальная упаковка: 15 ₽';
                break;
        }
        servicesList.appendChild(listItem);
    });
}

// Show checkout step
function showCheckoutStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Remove active class from all steps
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show selected step
    document.getElementById(`checkoutStep${step}`).classList.add('active');
    
    // Add active class to step indicator
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
}

// Proceed to checkout step
function proceedToStep(step) {
    // Validate current step before proceeding
    if (step === 2) {
        // No validation needed for step 1
    } else if (step === 3) {
        // Validate step 2 (delivery options and contact info)
        const name = document.getElementById('checkoutName').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim();
        
        if (!name || !phone) {
            showToast('Пожалуйста, заполните обязательные поля (Имя и Телефон)');
            return;
        }
        
        // Check address if needed
        const addressField = document.getElementById('addressField');
        const address = document.getElementById('checkoutAddress').value.trim();
        
        if (addressField.style.display !== 'none' && !address) {
            showToast('Пожалуйста, укажите адрес доставки');
            return;
        }
        
        // Save data
        checkoutData.name = name;
        checkoutData.phone = phone;
        checkoutData.address = address;
        checkoutData.comment = document.getElementById('checkoutComment').value.trim();
        
        // Update services summary for step 3
        updateFinalServicesSummary();
    }
    
    showCheckoutStep(step);
}

// Select delivery option
function selectDeliveryOption(option) {
    checkoutData.deliveryOption = option;
    
    // Update UI
    document.querySelectorAll('.delivery-option').forEach(el => {
        el.classList.remove('selected');
        const radio = el.querySelector('input[type="radio"]');
        radio.checked = false;
    });
    
    const selectedOption = document.getElementById(`delivery${option.charAt(0).toUpperCase() + option.slice(1)}`);
    selectedOption.checked = true;
    selectedOption.closest('.delivery-option').classList.add('selected');
    
    // Show/hide address field based on delivery option
    const addressField = document.getElementById('addressField');
    if (option === 'pickup') {
        addressField.style.display = 'none';
    } else {
        addressField.style.display = 'block';
    }
    
    // Update delivery cost display
    displayOrderSummary();
}

// Toggle additional service
function toggleAdditionalService(service) {
    const index = checkoutData.additionalServices.indexOf(service);
    const checkbox = document.getElementById(`service${service.charAt(0).toUpperCase() + service.slice(1)}`);
    
    if (index === -1) {
        // Add service
        checkoutData.additionalServices.push(service);
        checkbox.checked = true;
    } else {
        // Remove service
        checkoutData.additionalServices.splice(index, 1);
        checkbox.checked = false;
    }
    
    // Update UI
    const serviceOption = checkbox.closest('.service-option');
    if (checkbox.checked) {
        serviceOption.classList.add('selected');
    } else {
        serviceOption.classList.remove('selected');
    }
    
    // Update delivery cost display
    displayOrderSummary();
}

// Update final services summary
function updateFinalServicesSummary() {
    const servicesList = document.getElementById('finalServicesList');
    const servicesSummary = document.getElementById('finalServicesSummary');
    const finalDeliveryCost = document.getElementById('finalDeliveryCost');
    const finalTotal = document.getElementById('finalTotal');
    
    // Calculate costs
    let itemTotal = 0;
    cart.forEach(item => {
        itemTotal += (currentUser.isClubMember && currentUser.subscriptionActive ? item.clubPrice : item.regularPrice) * item.quantity;
    });
    
    let deliveryCost = 0;
    if (!(currentUser.isClubMember && currentUser.subscriptionActive)) {
        switch (checkoutData.deliveryOption) {
            case 'standard':
                deliveryCost = 50;
                break;
            case 'remote':
                deliveryCost = 15;
                break;
            case 'express':
                deliveryCost = 60; // 50 + 10
                break;
            case 'pickup':
                deliveryCost = 0;
                break;
        }
    }
    
    let additionalServicesCost = 0;
    checkoutData.additionalServices.forEach(service => {
        switch (service) {
            case 'bag':
                additionalServicesCost += 8;
                break;
            case 'card':
                additionalServicesCost += 35;
                break;
            case 'special':
                additionalServicesCost += 15;
                break;
        }
    });
    
    const total = itemTotal + deliveryCost + additionalServicesCost;
    
    // Update delivery cost
    finalDeliveryCost.textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost + ' ₽';
    
    // Update services list
    if (checkoutData.additionalServices.length === 0) {
        servicesSummary.style.display = 'none';
    } else {
        servicesSummary.style.display = 'block';
        servicesList.innerHTML = '';
        
        checkoutData.additionalServices.forEach(service => {
            const listItem = document.createElement('li');
            switch (service) {
                case 'bag':
                    listItem.textContent = 'Пакет: 8 ₽';
                    break;
                case 'card':
                    listItem.textContent = 'Открытка: 35 ₽';
                    break;
                case 'special':
                    listItem.textContent = 'Специальная упаковка: 15 ₽';
                    break;
            }
            servicesList.appendChild(listItem);
        });
    }
    
    // Update total
    finalTotal.textContent = total + ' ₽';
}

// Select payment method
function selectPaymentMethod(method) {
    checkoutData.paymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
        const radio = el.querySelector('input[type="radio"]');
        radio.checked = false;
    });
    
    const selectedMethod = document.getElementById(`payment${method.charAt(0).toUpperCase() + method.slice(1)}`);
    selectedMethod.checked = true;
    selectedMethod.closest('.payment-method').classList.add('selected');
}

// Process payment
function processPayment() {
    // Validate payment method
    if (!checkoutData.paymentMethod) {
        showToast('Пожалуйста, выберите способ оплаты');
        return;
    }
    
    // Show loading spinner
    showLoading();
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoading();
        
        // Create order object
        let regularTotal = 0;
        let clubTotal = 0;
        
        cart.forEach(item => {
            regularTotal += item.regularPrice * item.quantity;
            if (currentUser.isClubMember && currentUser.subscriptionActive) {
                clubTotal += item.clubPrice * item.quantity;
            }
        });
        
        const itemTotal = currentUser.isClubMember && currentUser.subscriptionActive ? clubTotal : regularTotal;
        
        // Calculate delivery cost
        let deliveryCost = 0;
        if (!(currentUser.isClubMember && currentUser.subscriptionActive)) {
            switch (checkoutData.deliveryOption) {
                case 'standard': // Доставка по Нарьян-Мару
                    deliveryCost = 50;
                    break;
                case 'remote': // Доставка по Искателям
                    deliveryCost = 15;
                    break;
                case 'express': // Доставка точно ко времени
                    deliveryCost = 60; // 50 (standard) + 10 (express)
                    break;
                case 'pickup':
                    deliveryCost = 0;
                    break;
                default:
                    deliveryCost = 50;
            }
        }
        
        // Calculate additional services costs
        let additionalServicesCost = 0;
        const additionalServices = [];
        if (checkoutData.additionalServices.includes('bag')) {
            additionalServicesCost += 8;
            additionalServices.push({name: 'Пакет', price: 8});
        }
        if (checkoutData.additionalServices.includes('card')) {
            additionalServicesCost += 35;
            additionalServices.push({name: 'Открытка', price: 35});
        }
        if (checkoutData.additionalServices.includes('special')) {
            additionalServicesCost += 15;
            additionalServices.push({name: 'Специальная упаковка', price: 15});
        }
        
        const total = itemTotal + deliveryCost + additionalServicesCost;
        const savings = regularTotal - clubTotal;
        
        const order = {
            id: Date.now(),
            date: new Date().toLocaleString('ru-RU'),
            items: [...cart],
            deliveryOption: checkoutData.deliveryOption,
            paymentMethod: checkoutData.paymentMethod,
            additionalServices: additionalServices,
            name: checkoutData.name,
            phone: checkoutData.phone,
            address: checkoutData.address,
            comment: checkoutData.comment,
            itemTotal: itemTotal,
            deliveryCost: deliveryCost,
            additionalServicesCost: additionalServicesCost,
            total: total,
            savings: savings
        };
        
        // Add order to orders array
        orders.unshift(order);
        saveOrders();
        
        // Update user stats
        if (currentUser.isClubMember && currentUser.subscriptionActive) {
            currentUser.totalSavings += savings;
        }
        currentUser.totalOrders += 1;
        saveUserData();
        updateLoyaltyStatus();
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartBadge();
        
        // Close checkout modal
        document.getElementById('checkoutModal').style.display = 'none';
        
        // Show success modal
        document.getElementById('successOrderNumber').textContent = '#' + order.id;
        document.getElementById('successModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Update UI
        displayOrders();
        updateMainButton();
    }, 1500);
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Display orders
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <div class="empty-icon">📦</div>
                <p>У вас пока нет заказов</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Format delivery option text
        let deliveryText = '';
        switch (order.deliveryOption) {
            case 'standard':
                deliveryText = 'Доставка по Нарьян-Мару';
                break;
            case 'remote':
                deliveryText = 'Доставка по Искателям';
                break;
            case 'express':
                deliveryText = 'Доставка точно ко времени';
                break;
            case 'pickup':
                deliveryText = 'Самовывоз';
                break;
        }
        
        // Format payment method text
        let paymentText = '';
        switch (order.paymentMethod) {
            case 'cash':
                paymentText = 'Наличными';
                break;
            case 'card':
                paymentText = 'Банковской картой';
                break;
            case 'online':
                paymentText = 'Онлайн оплата';
                break;
        }
        
        // Build additional services HTML
        let servicesHtml = '';
        if (order.additionalServices && order.additionalServices.length > 0) {
            servicesHtml = `
                <div class="order-services">
                    <h4>Дополнительные услуги</h4>
                    <ul>
                        ${order.additionalServices.map(service => `<li><span>${service.name}</span><span>${service.price} ₽</span></li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-id">Заказ #${order.id}</div>
                <div class="order-date">${order.date}</div>
                <button class="delete-btn" onclick="deleteOrder(${order.id})" title="Удалить заказ" style="margin-left: auto;">🗑️</button>
            </div>
            <div class="order-details">
                <h4>Состав заказа</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.volume}) × ${item.quantity} шт.</span>
                        <span>${(currentUser.isClubMember && currentUser.subscriptionActive ? item.clubPrice : item.regularPrice) * item.quantity} ₽</span>
                    </div>
                `).join('')}
            </div>
            ${servicesHtml}
            <div class="order-summary">
                <div class="summary-row">
                    <span>Стоимость товаров:</span>
                    <span>${order.itemTotal} ₽</span>
                </div>
                <div class="summary-row">
                    <span>Доставка (${deliveryText}):</span>
                    <span>${order.deliveryCost === 0 ? 'Бесплатно' : order.deliveryCost + ' ₽'}</span>
                </div>
                ${order.additionalServicesCost > 0 ? `
                    <div class="summary-row">
                        <span>Дополнительные услуги:</span>
                        <span>${order.additionalServicesCost} ₽</span>
                    </div>
                ` : ''}
                ${order.savings > 0 ? `
                    <div class="summary-row savings">
                        <span>Экономия по клубу:</span>
                        <span>${order.savings} ₽</span>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>Итого:</span>
                    <span>${order.total} ₽</span>
                </div>
                <div class="summary-row">
                    <span>Способ оплаты:</span>
                    <span>${paymentText}</span>
                </div>
                <div class="customer-info">
                    <h4>Информация о клиенте</h4>
                    <p><strong>Имя:</strong> ${order.name}</p>
                    <p><strong>Телефон:</strong> ${order.phone}</p>
                    ${order.address ? `<p><strong>Адрес:</strong> ${order.address}</p>` : ''}
                    ${order.comment ? `<p><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
                </div>
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
}

// Display orders in admin panel
function displayAdminOrders() {
    if (!currentUser.isAdmin) return;
    
    // Reset sort select to default
    document.getElementById('sortOrders').value = 'id';
    
    // Reset search input
    document.getElementById('searchAdminOrders').value = '';
    
    // Call sort function to display orders
    sortAdminOrders();
}

// Sort orders in admin panel
function sortAdminOrders() {
    if (!currentUser.isAdmin) return;
    
    // Call search function which will apply sorting
    searchAdminOrders();
}

// Search orders in admin panel
function searchAdminOrders() {
    const searchTerm = document.getElementById('searchAdminOrders').value.toLowerCase();
    const sortValue = document.getElementById('sortOrders').value;
    
    let filteredOrders = orders;
    
    if (searchTerm) {
        filteredOrders = orders.filter(order => 
            order.id.toString().includes(searchTerm) ||
            order.name.toLowerCase().includes(searchTerm) ||
            order.phone.includes(searchTerm) ||
            order.address.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort filtered orders
    switch (sortValue) {
        case 'id':
            filteredOrders.sort((a, b) => b.id - a.id);
            break;
        case 'date':
            filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'total':
            filteredOrders.sort((a, b) => a.total - b.total);
            break;
        case 'totalDesc':
            filteredOrders.sort((a, b) => b.total - a.total);
            break;
    }
    
    // Display filtered and sorted orders
    const ordersList = document.getElementById('adminOrdersList');
    ordersList.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p>Заказы не найдены</p>';
        return;
    }
    
    filteredOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Format delivery option text
        let deliveryText = '';
        switch (order.deliveryOption) {
            case 'standard':
                deliveryText = 'Доставка по Нарьян-Мару';
                break;
            case 'remote':
                deliveryText = 'Доставка по Искателям';
                break;
            case 'express':
                deliveryText = 'Доставка точно ко времени';
                break;
            case 'pickup':
                deliveryText = 'Самовывоз';
                break;
        }
        
        // Format payment method text
        let paymentText = '';
        switch (order.paymentMethod) {
            case 'cash':
                paymentText = 'Наличными';
                break;
            case 'card':
                paymentText = 'Банковской картой';
                break;
            case 'online':
                paymentText = 'Онлайн оплата';
                break;
        }
        
        // Build additional services HTML
        let servicesHtml = '';
        if (order.additionalServices && order.additionalServices.length > 0) {
            servicesHtml = `
                <div class="order-services">
                    <h4>Дополнительные услуги</h4>
                    <ul>
                        ${order.additionalServices.map(service => `<li><span>${service.name}</span><span>${service.price} ₽</span></li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-id">Заказ #${order.id}</div>
                <div class="order-date">${order.date}</div>
                <button class="delete-btn" onclick="deleteOrder(${order.id})" title="Удалить заказ" style="margin-left: auto;">🗑️</button>
            </div>
            <div class="order-details">
                <h4>Состав заказа</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.volume}) × ${item.quantity} шт.</span>
                        <span>${(currentUser.isClubMember && currentUser.subscriptionActive ? item.clubPrice : item.regularPrice) * item.quantity} ₽</span>
                    </div>
                `).join('')}
            </div>
            ${servicesHtml}
            <div class="order-summary">
                <div class="summary-row">
                    <span>Стоимость товаров:</span>
                    <span>${order.itemTotal} ₽</span>
                </div>
                <div class="summary-row">
                    <span>Доставка (${deliveryText}):</span>
                    <span>${order.deliveryCost === 0 ? 'Бесплатно' : order.deliveryCost + ' ₽'}</span>
                </div>
                ${order.additionalServicesCost > 0 ? `
                    <div class="summary-row">
                        <span>Дополнительные услуги:</span>
                        <span>${order.additionalServicesCost} ₽</span>
                    </div>
                ` : ''}
                ${order.savings > 0 ? `
                    <div class="summary-row savings">
                        <span>Экономия по клубу:</span>
                        <span>${order.savings} ₽</span>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>Итого:</span>
                    <span>${order.total} ₽</span>
                </div>
                <div class="summary-row">
                    <span>Способ оплаты:</span>
                    <span>${paymentText}</span>
                </div>
                <div class="customer-info">
                    <h4>Информация о клиенте</h4>
                    <p><strong>Имя:</strong> ${order.name}</p>
                    <p><strong>Телефон:</strong> ${order.phone}</p>
                    ${order.address ? `<p><strong>Адрес:</strong> ${order.address}</p>` : ''}
                    ${order.comment ? `<p><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
                </div>
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
}

// Join club
function joinClub() {
    document.getElementById('subscriptionModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close subscription modal
function closeSubscriptionModal() {
    document.getElementById('subscriptionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Confirm subscription
function confirmSubscription() {
    // In a real app, this would involve payment processing
    currentUser.isClubMember = true;
    currentUser.subscriptionActive = true;
    currentUser.subscriptionExpiry = new Date();
    currentUser.subscriptionExpiry.setMonth(currentUser.subscriptionExpiry.getMonth() + 1);
    
    saveUserData();
    updateLoyaltyStatus();
    displayProducts(products);
    displayFeaturedProducts();
    displayCart();
    
    closeSubscriptionModal();
    showToast('Поздравляем! Вы стали участником ZeSt Club!');
}

// Manage subscription
function manageSubscription() {
    // In a real app, this would open subscription management
    showToast('Управление подпиской (демо)');
}

// Update loyalty status
function updateLoyaltyStatus() {
    const userStatus = document.getElementById('userStatus');
    const clubStatusTitle = document.getElementById('clubStatusTitle');
    const clubStatusText = document.getElementById('clubStatusText');
    const clubActionButton = document.getElementById('clubActionButton');
    const subscriptionStatus = document.getElementById('subscriptionStatus');
    const totalSavings = document.getElementById('totalSavings');
    const totalOrders = document.getElementById('totalOrders');
    const subscriptionButton = document.getElementById('subscriptionButton');
    
    if (currentUser.isClubMember && currentUser.subscriptionActive) {
        userStatus.textContent = 'Участник клуба';
        userStatus.style.color = '#27AE60';
        clubStatusTitle.textContent = 'Вы участник ZeSt Club!';
        clubStatusText.textContent = 'Спасибо за ваше участие';
        clubActionButton.textContent = 'Продлить подписку';
        clubActionButton.onclick = manageSubscription;
        subscriptionStatus.textContent = 'Активна';
        subscriptionStatus.style.color = '#27AE60';
        subscriptionButton.style.display = 'block';
    } else {
        userStatus.textContent = 'Гость';
        userStatus.style.color = '';
        clubStatusTitle.textContent = 'Вы не участник клуба';
        clubStatusText.textContent = 'Присоединяйтесь к ZeSt Club и получите выгоды';
        clubActionButton.textContent = 'Присоединиться';
        clubActionButton.onclick = joinClub;
        subscriptionStatus.textContent = 'Не активна';
        subscriptionStatus.style.color = '';
        subscriptionButton.style.display = 'none';
    }
    
    totalSavings.textContent = currentUser.totalSavings + ' ₽';
    totalOrders.textContent = currentUser.totalOrders;
}

// Check subscription status
function checkSubscriptionStatus() {
    if (currentUser.isClubMember && currentUser.subscriptionExpiry) {
        const now = new Date();
        const expiry = new Date(currentUser.subscriptionExpiry);
        if (now > expiry) {
            currentUser.subscriptionActive = false;
            saveUserData();
            updateLoyaltyStatus();
            displayProducts(products);
            displayFeaturedProducts();
            displayCart();
        }
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    if (query.length === 0) {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    displayProducts(filteredProducts);
});

// Telegram Web App specific functions
if (tg.BackButton) {
    tg.BackButton.onClick(() => {
        if (document.getElementById('productModal').style.display === 'block') {
            closeModal();
        } else if (document.getElementById('paymentModal').style.display === 'block') {
            closePaymentModal();
        } else if (document.getElementById('successModal').style.display === 'block') {
            closeSuccessModal();
        } else if (document.getElementById('subscriptionModal').style.display === 'block') {
            closeSubscriptionModal();
        } else if (document.getElementById('agreementModal').style.display === 'block') {
            closeAgreementModal();
        } else if (document.getElementById('checkoutModal').style.display === 'block') {
            closeCheckoutModal();
        } else if (document.getElementById('adminLoginModal').style.display === 'block') {
            closeAdminLoginModal();
        } else {
            tg.close();
        }
    });
}

// Handle main button
function updateMainButton() {
    if (cart.length > 0) {
        const total = currentUser.isClubMember && currentUser.subscriptionActive
            ? cart.reduce((sum, item) => sum + (item.clubPrice * item.quantity), 0)
            : cart.reduce((sum, item) => sum + (item.regularPrice * item.quantity), 0);
        
        tg.MainButton.setText(`Заказать за ${total} ₽`);
        tg.MainButton.show();
        tg.MainButton.onClick(() => showTab('cart'));
    } else {
        tg.MainButton.hide();
    }
}

// Update main button when cart changes
const originalAddToCart = addToCart;
addToCart = function(...args) {
    originalAddToCart.apply(this, args);
    updateMainButton();
};

const originalRemoveFromCart = removeFromCart;
removeFromCart = function(...args) {
    originalRemoveFromCart.apply(this, args);
    updateMainButton();
};

// Initialize main button
updateMainButton();

// Local storage functions
function saveUserData() {
    localStorage.setItem('zestUser', JSON.stringify(currentUser));
}

function loadUserData() {
    const userData = localStorage.getItem('zestUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function saveCart() {
    localStorage.setItem('zestCart', JSON.stringify(cart));
}

function loadCart() {
    const cartData = localStorage.getItem('zestCart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

function saveOrders() {
    localStorage.setItem('zestOrders', JSON.stringify(orders));
}

function loadOrders() {
    const ordersData = localStorage.getItem('zestOrders');
    if (ordersData) {
        orders = JSON.parse(ordersData);
    }
}

// Admin functions
function showAdminLogin() {
    if (!currentUser.isAdmin) {
        // Show login modal
        document.getElementById('adminLoginModal').style.display = 'flex';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
        
        // Clear any previous error messages
        const errorMsg = document.getElementById('adminLoginError');
        if (errorMsg) errorMsg.style.display = 'none';
        
        // Add event listener for Enter key
        document.getElementById('adminPassword').onkeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                authenticateAdmin();
            }
        };
        
        document.body.style.overflow = 'hidden';
    } else {
        // If already admin, go directly to admin panel
        showTab('admin');
    }
}

function closeAdminLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Clear password field and error message when closing
    const passwordField = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('adminLoginError');
    if (passwordField) passwordField.value = '';
    if (errorMsg) errorMsg.style.display = 'none';
}

function authenticateAdmin() {
    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput.value.trim();
    const errorMsg = document.getElementById('adminLoginError');
    
    // Validate input
    if (!password) {
        showError('Введите пароль');
        passwordInput.focus();
        return;
    }
    
    // Check password length
    if (password.length < 6) {
        showError('Пароль слишком короткий');
        passwordInput.focus();
        return;
    }
    
    // In a real application, this should be done server-side
    // For demo purposes, we're using a simple hash comparison
    // The password is "zestadmin" (in real app, use proper server-side authentication)
    const hashedPassword = btoa(password); // Simple base64 encoding for demo
    const validPassword = 'emVzdGFkbWlu'; // "zestadmin" base64 encoded
    
    if (hashedPassword === validPassword) {
        // Successful authentication
        currentUser.isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        document.getElementById('adminTab').style.display = 'flex';
        closeAdminLoginModal();
        showToast('Добро пожаловать в панель администратора');
        
        // Show the admin tab
        showTab('admin');
    } else {
        showError('Неверный пароль');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Helper function to show login error
function showError(message) {
    const errorMsg = document.getElementById('adminLoginError');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    } else {
        showToast(message);
    }
}

// Function to logout admin
function logoutAdmin() {
    // Confirm logout action
    if (!confirm('Вы действительно хотите выйти из панели администратора?')) {
        return;
    }
    
    currentUser.isAdmin = false;
    localStorage.removeItem('isAdmin');
    document.getElementById('adminTab').style.display = 'none';
    showTab('catalog');
    showToast('Вы вышли из панели администратора');
}

// Admin functions
function addNewProduct() {
    // Get form values
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const brand = document.getElementById('productBrand').value;
    const category = document.getElementById('productCategory').value;
    const volume = document.getElementById('productVolume').value;
    const regularPrice = parseInt(document.getElementById('regularPrice').value);
    const clubPrice = parseInt(document.getElementById('clubPrice').value);
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;
    const isFeatured = document.getElementById('isFeatured').checked;
    const badge = document.getElementById('productBadge').value;
    
    // Validate inputs
    if (!name || !brand || !category || !volume || !regularPrice || !clubPrice || !image) {
        showToast('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Validate prices
    if (regularPrice <= 0 || clubPrice <= 0) {
        showToast('Цены должны быть больше нуля');
        return;
    }
    
    if (clubPrice > regularPrice) {
        showToast('Цена для клуба не может быть выше обычной цены');
        return;
    }
    
    // Validate image URL
    try {
        new URL(image);
    } catch (e) {
        showToast('Пожалуйста, введите корректный URL изображения');
        return;
    }
    
    if (productId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id == productId);
        if (productIndex !== -1) {
            products[productIndex] = {
                id: parseInt(productId),
                name: name,
                category: category,
                volume: volume,
                brand: brand,
                regularPrice: regularPrice,
                clubPrice: clubPrice,
                image: image,
                description: description || `Описание товара ${name}`,
                featured: isFeatured,
                badge: badge || null
            };
            
            showToast(`Товар "${name}" успешно обновлен`);
        }
    } else {
        // Create new product object
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: name,
            category: category,
            volume: volume,
            brand: brand,
            regularPrice: regularPrice,
            clubPrice: clubPrice,
            image: image,
            description: description || `Описание товара ${name}`,
            featured: isFeatured,
            badge: badge || null
        };
        
        // Add to products array
        products.push(newProduct);
        
        showToast(`Товар "${name}" успешно добавлен`);
    }
    
    // Save to localStorage
    saveProductsToStorage();
    
    // Reset form
    resetProductForm();
    
    // Update product displays
    displayProducts(products);
    displayFeaturedProducts();
    displayAdminProducts();
    
    // Scroll to the new product
    setTimeout(() => {
        const productCards = document.querySelectorAll('.admin-product-card');
        if (productCards.length > 0) {
            productCards[0].scrollIntoView({ behavior: 'smooth' });
        }
    }, 500);
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Товар не найден');
        return;
    }
    
    // Fill the form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productBrand').value = product.brand;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productVolume').value = product.volume;
    document.getElementById('regularPrice').value = product.regularPrice;
    document.getElementById('clubPrice').value = product.clubPrice;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('isFeatured').checked = product.featured;
    document.getElementById('productBadge').value = product.badge || '';
    
    // Change button text
    document.getElementById('productFormButton').textContent = 'Обновить товар';
    
    // Scroll to the form
    document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' });
    
    showToast(`Товар "${product.name}" загружен для редактирования`);
}

// Reset product form
function resetProductForm() {
    document.getElementById('addProductForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productFormButton').textContent = 'Добавить товар';
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Товар не найден');
        return;
    }
    
    // Remove the product from the list
    products = products.filter(p => p.id !== productId);
    
    // Save to localStorage
    saveProductsToStorage();
    
    // Update product displays
    displayProducts(products);
    displayFeaturedProducts();
    displayAdminProducts();
    
    showToast(`Товар "${product.name}" удален`);
}

// Display products in admin panel
function displayAdminProducts() {
    if (!currentUser.isAdmin) return;
    
    // Display store statistics
    displayStoreStats();
    
    // Reset sort select to default
    document.getElementById('sortProducts').value = 'id';
    
    // Reset search input
    document.getElementById('searchAdminProducts').value = '';
    
    // Call sort function to display products
    sortAdminProducts();
}

// Get category name by code
function getCategoryName(categoryCode) {
    const categories = {
        'energy': 'Энергетики',
        'soda': 'Газировка',
        'juice': 'Соки',
        'water': 'Вода',
        'coffee': 'Кофе'
    };
    return categories[categoryCode] || categoryCode;
}

// Search products in admin panel
function searchAdminProducts() {
    const searchTerm = document.getElementById('searchAdminProducts').value.toLowerCase();
    const sortValue = document.getElementById('sortProducts').value;
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort filtered products
    switch (sortValue) {
        case 'id':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price':
            filteredProducts.sort((a, b) => a.regularPrice - b.regularPrice);
            break;
        case 'priceDesc':
            filteredProducts.sort((a, b) => b.regularPrice - a.regularPrice);
            break;
        case 'brand':
            filteredProducts.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
    }
    
    // Display filtered and sorted products
    const productsList = document.getElementById('adminProductsList');
    productsList.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsList.innerHTML = '<p>Товары не найдены</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'admin-product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="admin-product-image" onerror="handleImageError(this)">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <div class="admin-product-meta">
                    <span>${product.brand}</span>
                    <span>${product.volume}</span>
                    <span>${getCategoryName(product.category)}</span>
                </div>
                <div class="admin-product-prices">
                    <span>Обычная: ${product.regularPrice} ₽</span>
                    <span>Club: ${product.clubPrice} ₽</span>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})" title="Редактировать">✏️</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})" title="Удалить">🗑️</button>
            </div>
        `;
        
        productsList.appendChild(productCard);
    });
}

// Sort products in admin panel
function sortAdminProducts() {
    if (!currentUser.isAdmin) return;
    
    // Call search function which will apply sorting
    searchAdminProducts();
}

// Display store statistics in admin panel
function displayStoreStats() {
    if (!currentUser.isAdmin) return;
    
    const statsContainer = document.getElementById('storeStats');
    
    // Calculate statistics
    const totalProducts = products.length;
    const totalOrdersCount = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const featuredProducts = products.filter(product => product.featured).length;
    const clubMembers = currentUser.isClubMember ? 1 : 0; // Simplified for demo
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h4>Всего товаров</h4>
            <div class="stat-value">${totalProducts}</div>
            <div class="stat-description">Активных позиций</div>
        </div>
        <div class="stat-card">
            <h4>Заказов</h4>
            <div class="stat-value">${totalOrdersCount}</div>
            <div class="stat-description">Всего оформлено</div>
        </div>
        <div class="stat-card">
            <h4>Выручка</h4>
            <div class="stat-value">${totalRevenue} ₽</div>
            <div class="stat-description">Общая прибыль</div>
        </div>
        <div class="stat-card">
            <h4>Хиты продаж</h4>
            <div class="stat-value">${featuredProducts}</div>
            <div class="stat-description">Популярных товаров</div>
        </div>
    `;
}

// Check if user is admin (in a real app, this would be more secure)
function checkAdminStatus() {
    // For demo purposes, we'll check for a specific user ID or a flag in localStorage
    // In a real application, this would be handled server-side
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    currentUser.isAdmin = adminStatus;
    
    // Show admin tab if user is admin
    const adminTab = document.getElementById('adminTab');
    if (currentUser.isAdmin) {
        adminTab.style.display = 'flex';
    } else {
        adminTab.style.display = 'none';
    }
}

// Helper function to handle image loading errors
function handleImageError(imgElement) {
    imgElement.src = 'https://via.placeholder.com/300x300?text=No+Image';
    imgElement.onerror = null; // Prevent infinite loop
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
        return;
    }
    
    // Remove the order from the list
    orders = orders.filter(order => order.id !== orderId);
    
    // Save to localStorage
    saveOrders();
    
    // Update order displays
    displayOrders();
    displayAdminOrders();
    displayStoreStats(); // Update stats as revenue might have changed
    
    showToast(`Заказ #${orderId} удален`);
}
