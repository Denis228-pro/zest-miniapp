// Core Application Logic and Routing
class ZeStApp {
  constructor() {
    this.tg = new TelegramManager();
    this.auth = new AuthManager();
    this.cart = new ShoppingCart(this.tg);
    this.catalog = new ProductCatalog(this.tg);
    this.payment = new PaymentManager(this.tg);
    this.order = new OrderManager(this.tg, this.cart, this.payment);
    this.profile = new UserProfile(this.tg);
    this.gestures = null;
    this.currentPage = 'catalog';
    this.init();
  }

  init() {
    // Initialize Telegram WebApp
    if (this.tg.tg) {
      this.tg.tg.ready();
      
      // Listen for payment events
      this.tg.tg.onEvent('invoiceClosed', (payload) => {
        this.handleInvoiceClosed(payload);
      });
    }

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeApp();
    });

    // Listen for Telegram back button
    window.addEventListener('telegramBackButtonClicked', () => {
      this.handleBackButton();
    });
  }

  initializeApp() {
    // Check age confirmation
    const ageConfirmed = this.auth.checkAgeConfirmation();
    
    if (!ageConfirmed) {
      this.showAgeGate();
    } else {
      this.showMainApp();
    }

    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize modules
    this.initializeModules();
    
    // Initialize gesture recognition
    this.gestures = new GestureManager(this);
  }

  showAgeGate() {
    const ageGate = document.getElementById('age-gate');
    const app = document.getElementById('app');
    
    if (ageGate) ageGate.style.display = 'flex';
    if (app) app.classList.add('hidden');
  }

  showMainApp() {
    const ageGate = document.getElementById('age-gate');
    const app = document.getElementById('app');
    
    if (ageGate) ageGate.style.display = 'none';
    if (app) app.classList.remove('hidden');
    
    // Update main button for catalog
    this.updateMainButton();
  }

  setupEventListeners() {
    // Age gate confirmation
    const ageGateConfirm = document.getElementById('age-gate-confirm');
    if (ageGateConfirm) {
      ageGateConfirm.addEventListener('click', () => {
        this.auth.confirmAge();
        this.showMainApp();
      });
    }

    // Age gate denial
    const ageGateDeny = document.getElementById('age-gate-deny');
    if (ageGateDeny) {
      ageGateDeny.addEventListener('click', () => {
        this.denyAge();
      });
    }

    // Navigation - bottom menu
    const bottomNavButtons = document.querySelectorAll('.nav-button');
    bottomNavButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const page = button.getAttribute('data-page');
        this.navigateTo(page);
        
        // Update active state for bottom nav
        bottomNavButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // Subscribe button
    const subscribeButton = document.getElementById('subscribe-button');
    if (subscribeButton) {
      subscribeButton.addEventListener('click', () => {
        this.subscribeToClub();
      });
    }

    // Toggle subscription button
    const toggleSubscriptionButton = document.getElementById('toggle-subscription');
    if (toggleSubscriptionButton) {
      toggleSubscriptionButton.addEventListener('click', () => {
        this.toggleSubscription();
      });
    }
    
    // Checkout button
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        this.initiateCheckout();
      });
    }
    
    // Profile settings
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => {
        this.profile.updateSettings({ theme: e.target.value });
        this.tg.hapticFeedback('selection');
      });
    }
    
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
      notificationsToggle.addEventListener('change', (e) => {
        this.profile.updateSettings({ notifications: e.target.checked });
        this.tg.hapticFeedback('selection');
      });
    }
    
    const clearDataButton = document.getElementById('clear-data-button');
    if (clearDataButton) {
      clearDataButton.addEventListener('click', () => {
        this.clearUserData();
      });
    }
    
    const refreshOrdersButton = document.getElementById('refresh-orders');
    if (refreshOrdersButton) {
      refreshOrdersButton.addEventListener('click', () => {
        this.loadOrderHistory();
      });
    }
    
    // Popup button handlers
    if (this.tg.tg) {
      this.tg.tg.onEvent('popupClosed', (data) => {
        this.handlePopupClosed(data);
      });
    }
  }

  handlePopupClosed(data) {
    if (!data || !data.button_id) return;
    
    // Handle delivery option selection
    if (data.button_id.startsWith('delivery-')) {
      const optionId = data.button_id.replace('delivery-', '');
      this.selectDeliveryOption(optionId);
      return;
    }
    
    // Handle additional service selection
    if (data.button_id.startsWith('service-')) {
      const serviceId = data.button_id.replace('service-', '');
      this.toggleAdditionalService(serviceId);
      return;
    }
    
    // Handle checkout button
    if (data.button_id === 'checkout') {
      this.processPayment();
      return;
    }
    
    // Handle clear data confirmation
    if (data.button_id === 'confirm') {
      this.confirmClearUserData();
      return;
    }
  }

  initializeModules() {
    // Initialize catalog
    this.catalog.init();
    this.initializeCatalog();
    
    // Initialize profile settings
    this.initializeProfile();
  }

  initializeProfile() {
    // Apply saved theme
    const settings = this.profile.getSettings();
    if (settings.theme) {
      const themeSelector = document.getElementById('theme-selector');
      if (themeSelector) {
        themeSelector.value = settings.theme;
      }
      this.profile.applyTheme(settings.theme);
    }
    
    // Apply notification settings
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
      notificationsToggle.checked = settings.notifications;
    }
    
    // Check membership status
    this.updateMembershipStatus();
  }

  updateMembershipStatus() {
    const membership = this.profile.getMembershipStatus();
    const statusText = document.getElementById('subscription-status-text');
    if (statusText) {
      statusText.textContent = membership.isMember ? 
        `Активна (${membership.daysLeft} дней осталось)` : 
        'Не активна';
    }
  }

  navigateTo(page) {
    // Update current page
    this.currentPage = page;

    // Hide all pages
    document.querySelectorAll('[id$="-page"]').forEach(pageEl => {
      pageEl.classList.add('hidden');
    });

    // Show selected page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
    }

    // Update active state in bottom navigation
    document.querySelectorAll('.nav-button').forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-page') === page) {
        button.classList.add('active');
      }
    });

    // Load page content
    this.loadPageContent(page);
    
    // Update main button based on current page
    this.updateMainButton();
  }

  updateMainButton() {
    // Hide by default
    this.tg.hideMainButton();
    
    // Show specific button based on current page
    switch(this.currentPage) {
      case 'cart':
        if (this.cart.getItemCount() > 0) {
          this.tg.showMainButton(`Checkout (${this.cart.getTotal()} ₽)`, () => {
            this.initiateCheckout();
          });
        }
        break;
      case 'catalog':
        if (this.cart.getItemCount() > 0) {
          this.tg.showMainButton(`Cart (${this.cart.getItemCount()})`, () => {
            this.navigateTo('cart');
          });
        }
        break;
    }
  }

  handleBackButton() {
    switch(this.currentPage) {
      case 'cart':
      case 'club':
      case 'services':
      case 'profile':
        this.navigateTo('catalog');
        break;
      default:
        // For catalog, close the app with confirmation
        if (this.tg.tg) {
          this.tg.tg.close();
        }
        break;
    }
  }

  handleInvoiceClosed(payload) {
    if (payload.status === 'paid') {
      this.tg.hapticFeedback('success');
      this.tg.showAlert('Payment successful! Your order is being processed.');
      
      // Send confirmation to bot
      this.tg.sendData({
        type: 'payment_success',
        data: payload
      });
    } else if (payload.status === 'failed') {
      this.tg.hapticFeedback('error');
      this.tg.showAlert('Payment failed. Please try again.');
    } else if (payload.status === 'pending') {
      this.tg.hapticFeedback('warning');
      this.tg.showAlert('Payment is pending. We will notify you once it is processed.');
    }
  }

  denyAge() {
    this.auth.isAgeConfirmed = false;
    localStorage.setItem('ageConfirmed', 'false');
    
    if (this.tg.tg) {
      this.tg.showAlert('You must be 18+ to use this app', () => {
        this.tg.tg.close();
      });
    } else {
      alert('You must be 18+ to use this app');
      document.getElementById('app').classList.add('hidden');
      document.getElementById('age-gate').innerHTML = `
        <div class="age-gate-content">
          <h1>Access Denied</h1>
          <p>Sorry, you must be 18+ to use this app.</p>
          <button id="close-app" class="btn age-gate-deny">Close App</button>
        </div>
      `;
      
      document.getElementById('close-app').addEventListener('click', () => {
        window.close();
      });
    }
  }

  // Catalog functionality
  initializeCatalog() {
    const searchInput = document.getElementById('search-input');
    const brandFilter = document.getElementById('brand-filter');
    const priceFilter = document.getElementById('price-filter');
    
    // Populate brand filter
    this.populateBrandFilter();
    
    // Add event listeners for filtering
    searchInput?.addEventListener('input', () => this.filterProducts());
    brandFilter?.addEventListener('change', () => this.filterProducts());
    priceFilter?.addEventListener('change', () => this.filterProducts());
  }

  populateBrandFilter() {
    const brandFilter = document.getElementById('brand-filter');
    if (!brandFilter) return;
    
    // Clear existing options except the first one
    brandFilter.innerHTML = '<option value="">Все бренды</option>';
    
    // Add brand options
    const brands = this.catalog.getBrands();
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandFilter.appendChild(option);
    });
  }

  filterProducts() {
    const searchTerm = document.getElementById('search-input')?.value || '';
    const brandValue = document.getElementById('brand-filter')?.value || '';
    const priceValue = document.getElementById('price-filter')?.value || '';
    
    const filters = {
      search: searchTerm,
      brand: brandValue,
      priceRange: priceValue
    };
    
    const filteredProducts = this.catalog.applyFilters(filters);
    this.renderProducts(filteredProducts);
  }

  renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
      container.innerHTML = '<p class="no-results">Товары не найдены</p>';
      return;
    }
    
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image_url}" alt="${product.name.en}" class="product-image">
        <div class="product-info">
          <h3>${product.name.ru}</h3>
          <p class="product-description">${product.description.ru.substring(0, 100)}...</p>
          <div class="product-meta">
            <span class="product-volume">${product.volume}</span>
            <span class="product-brand">${product.brand}</span>
          </div>
          <div class="product-price">₽${product.retail_price}</div>
          <div class="product-actions">
            <button class="add-to-cart btn" data-id="${product.product_id}">Добавить в корзину</button>
          </div>
        </div>
      `;
      container.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        this.addToCart(productId);
      });
    });
  }

  // Shopping cart functionality
  addToCart(productId) {
    const product = this.catalog.getSampleProducts().find(p => p.product_id === productId);
    if (product) {
      this.cart.addItem(product);
      
      // Show confirmation
      this.tg.showAlert(`Добавлено в корзину: ${product.name.ru}`);
      
      // Update cart display if on cart page
      if (this.currentPage === 'cart') {
        this.loadCart();
      }
      
      // Update main button
      this.updateMainButton();
    }
  }

  loadCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartContainer) return;
    
    const items = this.cart.getItems();
    
    if (items.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста</p>';
      if (cartTotal) cartTotal.textContent = '0 руб';
      return;
    }
    
    cartContainer.innerHTML = '';
    let total = this.cart.getTotal();
    
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.price} руб за единицу</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="decrease-qty btn btn-sm" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="increase-qty btn btn-sm" data-id="${item.id}">+</button>
          </div>
          <div>${itemTotal} руб</div>
        </div>
      `;
      cartContainer.appendChild(cartItem);
    });
    
    if (cartTotal) cartTotal.textContent = `${total} руб`;
    
    // Add event listeners for quantity controls
    document.querySelectorAll('.decrease-qty').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.updateCartQuantity(id, -1);
      });
    });
    
    document.querySelectorAll('.increase-qty').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.updateCartQuantity(id, 1);
      });
    });
  }

  updateCartQuantity(productId, change) {
    const items = this.cart.getItems();
    const item = items.find(item => item.id === productId);
    
    if (item) {
      const newQuantity = item.quantity + change;
      this.cart.updateQuantity(productId, newQuantity);
      this.loadCart();
      this.updateMainButton();
    }
  }

  initiateCheckout() {
    const items = this.cart.getItems();
    if (items.length === 0) {
      this.tg.showAlert('Your cart is empty');
      return;
    }
    
    // Check if user is authenticated
    if (!this.auth.checkAuthStatus()) {
      this.tg.showPopup('Authentication Required', 'You need to login to place an order', [
        {
          id: 'login',
          type: 'default',
          text: 'Login'
        },
        {
          id: 'cancel',
          type: 'cancel'
        }
      ]);
      return;
    }
    
    // Start order process
    const order = this.order.startOrder();
    if (!order) return;
    
    // Show delivery options
    this.showDeliveryOptions();
  }

  showDeliveryOptions() {
    const options = this.order.getDeliveryOptions();
    let message = 'Выберите способ доставки:\n\n';
    
    options.forEach((option, index) => {
      const priceText = option.price > 0 ? `${option.price}₽` : 'Бесплатно';
      message += `${index + 1}. ${option.name} - ${priceText}\n`;
    });
    
    const buttons = options.map((option, index) => ({
      id: `delivery-${option.id}`,
      type: 'default',
      text: option.name
    }));
    
    buttons.push({
      id: 'cancel',
      type: 'cancel'
    });
    
    this.tg.showPopup('Доставка', message, buttons);
  }

  // Handle delivery option selection
  selectDeliveryOption(optionId) {
    const success = this.order.setDelivery(optionId);
    if (success) {
      // Show additional services
      this.showAdditionalServices();
    }
  }

  showAdditionalServices() {
    const services = this.order.getAdditionalServices();
    let message = 'Дополнительные услуги:\n\n';
    
    services.forEach((service, index) => {
      message += `${index + 1}. ${service.name} - ${service.price}₽\n`;
    });
    
    const buttons = services.map((service, index) => ({
      id: `service-${service.id}`,
      type: 'default',
      text: service.name
    }));
    
    buttons.push({
      id: 'checkout',
      type: 'ok',
      text: 'Перейти к оплате'
    });
    
    buttons.push({
      id: 'cancel',
      type: 'cancel',
      text: 'Отмена'
    });
    
    this.tg.showPopup('Дополнительные услуги', message, buttons);
  }

  // Handle additional service selection
  toggleAdditionalService(serviceId) {
    // Implementation would go here
    // For now, we'll just proceed to payment
    this.processPayment();
  }

  processPayment() {
    // Get user data
    const userData = this.auth.user;
    
    // Process payment
    const success = this.order.processPayment(userData);
    
    if (!success) {
      this.tg.showAlert('Failed to process payment. Please try again.');
    }
  }

  // Profile functions
  clearUserData() {
    this.tg.showPopup('Подтверждение', 'Вы уверены, что хотите очистить все данные?', [
      {
        id: 'confirm',
        type: 'destructive',
        text: 'Да, очистить'
      },
      {
        id: 'cancel',
        type: 'cancel',
        text: 'Отмена'
      }
    ]);
  }

  confirmClearUserData() {
    this.profile.clearAllData();
    this.cart.clear();
    
    // Reset UI
    this.initializeProfile();
    if (this.currentPage === 'cart') {
      this.loadCart();
    }
    
    this.tg.showAlert('Все данные успешно очищены');
  }

  loadOrderHistory() {
    const orders = this.profile.getOrderHistory();
    const container = document.getElementById('orders-container');
    const noOrdersMessage = document.getElementById('no-orders-message');
    
    if (!container) return;
    
    if (orders.length === 0) {
      noOrdersMessage.style.display = 'block';
      container.innerHTML = '';
      return;
    }
    
    noOrdersMessage.style.display = 'none';
    container.innerHTML = '';
    
    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.className = 'order-item';
      
      const orderDate = this.profile.formatDate(order.timestamp);
      const statusClass = order.status === 'completed' ? 'completed' : 'pending';
      
      orderElement.innerHTML = `
        <div class="order-header">
          <span class="order-id">#${order.orderId}</span>
          <span class="order-date">${orderDate}</span>
        </div>
        <div class="order-details">
          <span class="order-total">${order.total} ₽</span>
          <span class="order-status ${statusClass}">${order.status === 'completed' ? 'Завершен' : 'В обработке'}</span>
        </div>
      `;
      
      container.appendChild(orderElement);
    });
  }

  // Sample data functions
  getSampleProducts() {
    return this.catalog.getSampleProducts();
  }

  // Placeholder functions for other pages
  loadClubInfo() {
    // In a real app, this would check subscription status
    console.log("Loading club info");
  }

  loadProfile() {
    // Load profile data
    this.updateMembershipStatus();
    this.loadOrderHistory();
  }

  loadPageContent(page) {
    switch(page) {
      case 'catalog':
        this.loadCatalog();
        break;
      case 'club':
        this.loadClubInfo();
        break;
      case 'services':
        // Services info is static
        break;
      case 'cart':
        this.loadCart();
        break;
      case 'profile':
        this.loadProfile();
        break;
    }
  }

  loadCatalog() {
    // In a real app, this would fetch from a backend
    this.renderProducts(this.catalog.getProducts());
  }

  subscribeToClub() {
    this.tg.requestBiometricAuth('Subscribe to ZeSt Club', (isAuthenticated) => {
      if (isAuthenticated) {
        this.tg.showAlert("Подписка на ZeSt Club оформлена!");
        
        // In a real app, this would process payment and update user status
        localStorage.setItem('zestClubMember', JSON.stringify({
          isMember: true,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }));
        
        // Update UI
        this.updateMembershipStatus();
      } else {
        this.tg.showAlert("Subscription cancelled");
      }
    });
  }

  toggleSubscription() {
    const isMember = localStorage.getItem('zestClubMember');
    if (isMember) {
      localStorage.removeItem('zestClubMember');
      this.updateMembershipStatus();
      this.tg.showAlert("Подписка отменена");
    } else {
      this.subscribeToClub();
    }
  }
}

// Initialize the app
const app = new ZeStApp();

// Make it globally accessible for debugging
window.zestApp = app;