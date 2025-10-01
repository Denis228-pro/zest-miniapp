// Shopping Cart Module
class ShoppingCart {
  constructor(telegramManager) {
    this.items = [];
    this.tg = telegramManager;
    this.storageKey = 'zest_cart_items';
    this.loadFromStorage();
  }

  // Load cart from CloudStorage or localStorage
  loadFromStorage() {
    try {
      if (window.Telegram?.WebApp?.CloudStorage) {
        window.Telegram.WebApp.CloudStorage.getItem(this.storageKey, (error, value) => {
          if (!error && value) {
            this.items = JSON.parse(value);
          } else {
            // Fallback to localStorage
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
              this.items = JSON.parse(stored);
            }
          }
        });
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.items = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    }
  }

  // Save cart to CloudStorage or localStorage
  saveToStorage() {
    try {
      const cartData = JSON.stringify(this.items);
      
      if (window.Telegram?.WebApp?.CloudStorage) {
        window.Telegram.WebApp.CloudStorage.setItem(this.storageKey, cartData, (error) => {
          if (error) {
            // Fallback to localStorage on error
            localStorage.setItem(this.storageKey, cartData);
          }
        });
      } else {
        // Fallback to localStorage
        localStorage.setItem(this.storageKey, cartData);
      }
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }

  // Add item to cart
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.product_id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.product_id,
        name: product.name.ru,
        price: product.retail_price,
        quantity: quantity,
        image: product.image_url
      });
    }
    
    this.saveToStorage();
    this.tg.hapticFeedback('selection');
    
    return true;
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    return true;
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clear() {
    this.items = [];
    this.saveToStorage();
    return true;
  }

  // Get cart items
  getItems() {
    return [...this.items]; // Return a copy
  }
}

// Export as a module
window.ShoppingCart = ShoppingCart;