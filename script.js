// Telegram Web App initialization
let tg = window.Telegram.WebApp;
tg.expand();

// Global state
let currentUser = {
    id: null,
    name: '',
    isClubMember: false,
    totalSavings: 0,
    totalOrders: 0
};

let cart = [];
let orders = [];
let currentProduct = null;
let modalQuantity = 1;

// Products database
const products = [
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
        description: 'Классический энергетический напиток с кофеином и таурином'
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
        description: 'Мощный энергетик с интенсивным вкусом'
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
        description: 'Энергетический напиток с ярким вкусом'
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
        description: 'Российский энергетик с гуараной'
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
        description: 'Классическая кола с неповторимым вкусом'
    },
    {
        id: 6,
        name: 'Pepsi',
        category: 'soda',
        volume: '330 мл',
        brand: 'PepsiCo',
        regularPrice: 60,
        clubPrice: 42,
        image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop',
        description: 'Освежающая кола с ярким вкусом'
    },
    {
        id: 7,
        name: 'Sprite',
        category: 'soda',
        volume: '330 мл',
        brand: 'Coca-Cola',
        regularPrice: 65,
        clubPrice: 45,
        image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop',
        description: 'Лимонно-лаймовый напиток'
    },
    {
        id: 8,
        name: 'Fanta Orange',
        category: 'soda',
        volume: '330 мл',
        brand: 'Coca-Cola',
        regularPrice: 65,
        clubPrice: 45,
        image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=300&h=300&fit=crop',
        description: 'Апельсиновая газировка'
    },
    
    // Соки
    {
        id: 9,
        name: 'Rich Апельсин',
        category: 'juice',
        volume: '1 л',
        brand: 'Rich',
        regularPrice: 140,
        clubPrice: 98,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop',
        description: '100% апельсиновый сок'
    },
    {
        id: 10,
        name: 'Добрый Яблоко',
        category: 'juice',
        volume: '1 л',
        brand: 'Добрый',
        regularPrice: 120,
        clubPrice: 85,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
        description: 'Яблочный нектар'
    },
    {
        id: 11,
        name: 'J7 Томат',
        category: 'juice',
        volume: '450 мл',
        brand: 'J7',
        regularPrice: 85,
        clubPrice: 60,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
        description: 'Томатный сок с солью'
    },
    
    // Вода
    {
        id: 12,
        name: 'Aqua Minerale',
        category: 'water',
        volume: '500 мл',
        brand: 'PepsiCo',
        regularPrice: 35,
        clubPrice: 25,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
        description: 'Питьевая вода'
    },
    {
        id: 13,
        name: 'Боржоми',
        category: 'water',
        volume: '500 мл',
        brand: 'Боржоми',
        regularPrice: 95,
        clubPrice: 68,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop',
        description: 'Минеральная вода'
    },
    {
        id: 14,
        name: 'Святой Источник',
        category: 'water',
        volume: '1.5 л',
        brand: 'Святой Источник',
        regularPrice: 45,
        clubPrice: 32,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
        description: 'Питьевая вода'
    },
    
    // Кофе
    {
        id: 15,
        name: 'Nescafe 3в1',
        category: 'coffee',
        volume: '16г',
        brand: 'Nescafe',
        regularPrice: 25,
        clubPrice: 18,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
        description: 'Растворимый кофе с молоком и сахаром'
    },
    {
        id: 16,
        name: 'Jacobs Monarch',
        category: 'coffee',
        volume: '95г',
        brand: 'Jacobs',
        regularPrice: 320,
        clubPrice: 225,
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&h=300&fit=crop',
        description: 'Растворимый кофе премиум класса'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    loadProducts();
    loadCart();
    loadOrders();
    updateUI();
});

// User initialization
function initializeUser() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        currentUser.id = tg.initDataUnsafe.user.id;
        currentUser.name = tg.initDataUnsafe.user.first_name || 'Пользователь';
    } else {
        currentUser.id = 'demo_user';
        currentUser.name = 'Demo User';
    }
    
    // Load user data from localStorage
    const savedUser = localStorage.getItem('zest_user_' + currentUser.id);
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        currentUser.isClubMember = userData.isClubMember || false;
        currentUser.totalSavings = userData.totalSavings || 0;
        currentUser.totalOrders = userData.totalOrders || 0;
    }
}

// Save user data
function saveUserData() {
    localStorage.setItem('zest_user_' + currentUser.id, JSON.stringify({
        isClubMember: currentUser.isClubMember,
        totalSavings: currentUser.totalSavings,
        totalOrders: currentUser.totalOrders
    }));
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected nav tab
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // Update content based on tab
    if (tabName === 'cart') {
        updateCartDisplay();
    } else if (tabName === 'orders') {
        updateOrdersDisplay();
    } else if (tabName === 'club') {
        updateClubDisplay();
    }
}

// Product filtering
function filterProducts(category) {
    // Update filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter and display products
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    displayProducts(filteredProducts);
}

// Load and display products
function loadProducts() {
    displayProducts(products);
}

function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const savings = product.regularPrice - product.clubPrice;
        const savingsPercent = Math.round((savings / product.regularPrice) * 100);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => openProductModal(product);
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-name">${product.name}</div>
            <div class="product-volume">${product.volume}</div>
            <div class="product-prices">
                <div class="regular-price">${product.regularPrice} ₽</div>
                ${currentUser.isClubMember ? `
                    <div class="club-price">${product.clubPrice} ₽</div>
                    <div class="savings-badge">-${savingsPercent}%</div>
                ` : ''}
            </div>
            <button class="add-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                Добавить
            </button>
        `;
        
        grid.appendChild(productCard);
    });
}

// Product modal
function openProductModal(product) {
    currentProduct = product;
    modalQuantity = 1;
    
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductVolume').textContent = product.volume;
    document.getElementById('modalProductBrand').textContent = product.brand;
    document.getElementById('modalRegularPrice').textContent = product.regularPrice + ' ₽';
    document.getElementById('modalQuantity').textContent = modalQuantity;
    
    if (currentUser.isClubMember) {
        document.getElementById('modalClubPriceInfo').style.display = 'block';
        document.getElementById('modalClubPrice').textContent = product.clubPrice + ' ₽';
    } else {
        document.getElementById('modalClubPriceInfo').style.display = 'none';
    }
    
    document.getElementById('productModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function changeQuantity(delta) {
    modalQuantity = Math.max(1, modalQuantity + delta);
    document.getElementById('modalQuantity').textContent = modalQuantity;
}

function addToCartFromModal() {
    addToCart(currentProduct.id, modalQuantity);
    closeModal();
}

// Cart functionality
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartBadge();
    showToast(`${product.name} добавлен в корзину`);
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    updateCartDisplay();
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartBadge();
    updateCartDisplay();
    showToast('Корзина очищена');
}

function saveCart() {
    localStorage.setItem('zest_cart_' + currentUser.id, JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('zest_cart_' + currentUser.id);
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartBadge();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
    document.getElementById('cartCount').textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>Корзина пуста</p>
                <button onclick="showTab('catalog')">Перейти к покупкам</button>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = '';
    let regularTotal = 0;
    let clubTotal = 0;
    
    cart.forEach(item => {
        const itemRegularPrice = item.regularPrice * item.quantity;
        const itemClubPrice = item.clubPrice * item.quantity;
        
        regularTotal += itemRegularPrice;
        clubTotal += itemClubPrice;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                    ${currentUser.isClubMember ? item.clubPrice : item.regularPrice} ₽
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update price breakdown
    document.getElementById('regularPrice').textContent = regularTotal + ' ₽';
    
    if (currentUser.isClubMember) {
        document.getElementById('clubPriceRow').style.display = 'flex';
        document.getElementById('savingsRow').style.display = 'flex';
        document.getElementById('clubPrice').textContent = clubTotal + ' ₽';
        document.getElementById('savings').textContent = (regularTotal - clubTotal) + ' ₽';
        document.getElementById('totalPrice').textContent = clubTotal + ' ₽';
    } else {
        document.getElementById('clubPriceRow').style.display = 'none';
        document.getElementById('savingsRow').style.display = 'none';
        document.getElementById('totalPrice').textContent = regularTotal + ' ₽';
    }
    
    cartFooter.style.display = 'block';
}

// Checkout
function checkout() {
    if (cart.length === 0) return;
    
    showLoading();
    
    setTimeout(() => {
        const order = {
            id: Date.now(),
            date: new Date().toLocaleDateString('ru-RU'),
            items: [...cart],
            regularTotal: cart.reduce((sum, item) => sum + (item.regularPrice * item.quantity), 0),
            clubTotal: cart.reduce((sum, item) => sum + (item.clubPrice * item.quantity), 0),
            finalTotal: currentUser.isClubMember 
                ? cart.reduce((sum, item) => sum + (item.clubPrice * item.quantity), 0)
                : cart.reduce((sum, item) => sum + (item.regularPrice * item.quantity), 0),
            savings: currentUser.isClubMember 
                ? cart.reduce((sum, item) => sum + ((item.regularPrice - item.clubPrice) * item.quantity), 0)
                : 0,
            status: 'pending'
        };
        
        orders.unshift(order);
        saveOrders();
        
        // Update user stats
        currentUser.totalOrders++;
        if (currentUser.isClubMember) {
            currentUser.totalSavings += order.savings;
        }
        saveUserData();
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartBadge();
        
        hideLoading();
        showToast('Заказ оформлен успешно!');
        showTab('orders');
        
        // Haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }, 1500);
}

// Orders
function saveOrders() {
    localStorage.setItem('zest_orders_' + currentUser.id, JSON.stringify(orders));
}

function loadOrders() {
    const savedOrders = localStorage.getItem('zest_orders_' + currentUser.id);
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

function updateOrdersDisplay() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <div class="empty-icon">📦</div>
                <p>У вас пока нет заказов</p>
                <button onclick="showTab('catalog')">Сделать первый заказ</button>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-header">
                <div class="order-number">Заказ #${order.id}</div>
                <div class="order-status ${order.status}">
                    ${order.status === 'pending' ? 'В обработке' : 'Выполнен'}
                </div>
            </div>
            <div class="order-date">${order.date}</div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-row">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${(currentUser.isClubMember ? item.clubPrice : item.regularPrice) * item.quantity} ₽</span>
                    </div>
                `).join('')}
            </div>
            ${order.savings > 0 ? `
                <div class="order-savings">Сэкономлено: ${order.savings} ₽</div>
            ` : ''}
            <div class="order-total">Итого: ${order.finalTotal} ₽</div>
        `;
        ordersList.appendChild(orderItem);
    });
}

// Club functionality
function joinClub() {
    showLoading();
    
    setTimeout(() => {
        currentUser.isClubMember = true;
        saveUserData();
        updateUI();
        hideLoading();
        showToast('Добро пожаловать в ZeSt Club!');
        
        // Haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }, 1000);
}

function updateClubDisplay() {
    const statusCard = document.getElementById('clubStatusCard');
    const membershipInfo = document.getElementById('membershipInfo');
    
    if (currentUser.isClubMember) {
        statusCard.innerHTML = `
            <div class="status-info">
                <h3>Участник ZeSt Club</h3>
                <p>Вы покупаете по себестоимости!</p>
            </div>
            <div class="status-action">
                <div class="club-badge">Активен</div>
            </div>
        `;
        
        membershipInfo.style.display = 'block';
        document.getElementById('totalSavings').textContent = currentUser.totalSavings + ' ₽';
        document.getElementById('totalOrders').textContent = currentUser.totalOrders;
    } else {
        statusCard.innerHTML = `
            <div class="status-info">
                <h3>Стать участником</h3>
                <p>Покупайте по себестоимости!</p>
            </div>
            <div class="status-action">
                <button class="join-btn" onclick="joinClub()">
                    Вступить в клуб
                </button>
            </div>
        `;
        
        membershipInfo.style.display = 'none';
    }
}

// UI Updates
function updateUI() {
    // Update header
    document.getElementById('userStatus').textContent = 
        currentUser.isClubMember ? 'Участник' : 'Гость';
    
    // Update club display
    updateClubDisplay();
    
    // Reload products to show club prices
    loadProducts();
}

// Utility functions
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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
        } else {
            tg.close();
        }
    });
}

// Handle main button
function updateMainButton() {
    if (cart.length > 0) {
        const total = currentUser.isClubMember 
            ? cart.reduce((sum, item) => sum + (item.clubPrice * item.quantity), 0)
            : cart.reduce((sum, item) => sum + (item.regularPrice * item.quantity), 0);
        
        tg.MainButton.setText(`Заказать за ${total} ₽`);
        tg.MainButton.show();
        tg.MainButton.onClick(checkout);
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