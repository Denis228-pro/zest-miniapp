// User Profile Module
class UserProfile {
  constructor(telegramManager) {
    this.tg = telegramManager;
    this.userData = null;
    this.orders = [];
    this.settings = {
      theme: 'light',
      notifications: true,
      language: 'ru'
    };
    this.storageKey = 'zest_user_profile';
    this.ordersKey = 'zest_user_orders';
    this.loadFromStorage();
  }

  // Load user data from storage
  loadFromStorage() {
    try {
      // Load settings
      const settingsData = localStorage.getItem(this.storageKey);
      if (settingsData) {
        this.settings = { ...this.settings, ...JSON.parse(settingsData) };
      }

      // Load order history
      const ordersData = localStorage.getItem(this.ordersKey);
      if (ordersData) {
        this.orders = JSON.parse(ordersData);
      }
    } catch (e) {
      console.error('Error loading user profile from storage:', e);
    }
  }

  // Save user data to storage
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
      localStorage.setItem(this.ordersKey, JSON.stringify(this.orders));
    } catch (e) {
      console.error('Error saving user profile to storage:', e);
    }
  }

  // Initialize user data from Telegram
  initialize(userData) {
    this.userData = userData;
    this.loadFromStorage();
  }

  // Get user data
  getUserData() {
    return this.userData;
  }

  // Update user settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();
    
    // Apply theme changes
    if (newSettings.theme) {
      this.applyTheme(newSettings.theme);
    }
    
    return this.settings;
  }

  // Apply theme to the app
  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // Get user settings
  getSettings() {
    return { ...this.settings };
  }

  // Add order to history
  addOrder(order) {
    // Add timestamp
    order.timestamp = Date.now();
    
    // Add to beginning of array (most recent first)
    this.orders.unshift(order);
    
    // Keep only last 50 orders
    if (this.orders.length > 50) {
      this.orders = this.orders.slice(0, 50);
    }
    
    // Save to storage
    this.saveToStorage();
    
    return true;
  }

  // Get order history
  getOrderHistory() {
    // Return a copy of the orders array, sorted by timestamp (newest first)
    return [...this.orders].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get order by ID
  getOrderById(orderId) {
    return this.orders.find(order => order.orderId === orderId);
  }

  // Clear order history
  clearOrderHistory() {
    this.orders = [];
    this.saveToStorage();
    return true;
  }

  // Clear all user data
  clearAllData() {
    this.userData = null;
    this.orders = [];
    this.settings = {
      theme: 'light',
      notifications: true,
      language: 'ru'
    };
    
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.ordersKey);
    } catch (e) {
      console.error('Error clearing user data:', e);
    }
    
    return true;
  }

  // Format date for display
  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get membership status
  getMembershipStatus() {
    const memberData = localStorage.getItem('zestClubMember');
    if (memberData) {
      try {
        const member = JSON.parse(memberData);
        const expiry = new Date(member.expiry);
        const now = new Date();
        
        if (now < expiry) {
          return {
            isMember: true,
            expiry: expiry,
            daysLeft: Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
          };
        }
      } catch (e) {
        console.error('Error parsing membership data:', e);
      }
    }
    
    return {
      isMember: false,
      expiry: null,
      daysLeft: 0
    };
  }
}

// Export as a module
window.UserProfile = UserProfile;