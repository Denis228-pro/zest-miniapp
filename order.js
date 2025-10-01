// Order Management Module
class OrderManager {
  constructor(telegramManager, cart, paymentManager) {
    this.tg = telegramManager;
    this.cart = cart;
    this.payment = paymentManager;
    this.currentOrder = null;
    this.deliveryOptions = [
      { id: 'narjan-mar', name: 'Доставка в Нарьян-Мар', price: 50 },
      { id: 'iskateli', name: 'Доставка в рп. Искатели', price: 15 },
      { id: 'pickup', name: 'Самовывоз', price: 0 }
    ];
    
    this.additionalServices = [
      { id: 'exact-time', name: 'Точное время доставки', price: 10 },
      { id: 'bag', name: 'Пакет', price: 8 },
      { id: 'gift-wrap', name: 'Подарочная упаковка', price: 35 },
      { id: 'card', name: 'Открытка', price: 50 }
    ];
  }

  // Start a new order process
  startOrder() {
    const items = this.cart.getItems();
    if (items.length === 0) {
      this.tg.showAlert('Ваша корзина пуста');
      return null;
    }

    this.currentOrder = {
      orderId: this.generateOrderId(),
      items: items,
      subtotal: this.cart.getTotal(),
      delivery: null,
      additionalServices: [],
      total: this.cart.getTotal()
    };

    return this.currentOrder;
  }

  // Set delivery option
  setDelivery(optionId) {
    if (!this.currentOrder) return false;

    const option = this.deliveryOptions.find(opt => opt.id === optionId);
    if (!option) return false;

    this.currentOrder.delivery = option;
    this.calculateTotal();
    return true;
  }

  // Add additional service
  addAdditionalService(serviceId) {
    if (!this.currentOrder) return false;

    const service = this.additionalServices.find(svc => svc.id === serviceId);
    if (!service) return false;

    // Check if service is already added
    const existing = this.currentOrder.additionalServices.find(svc => svc.id === serviceId);
    if (existing) return true; // Already added

    this.currentOrder.additionalServices.push(service);
    this.calculateTotal();
    return true;
  }

  // Remove additional service
  removeAdditionalService(serviceId) {
    if (!this.currentOrder) return false;

    this.currentOrder.additionalServices = this.currentOrder.additionalServices.filter(
      svc => svc.id !== serviceId
    );
    this.calculateTotal();
    return true;
  }

  // Calculate total order amount
  calculateTotal() {
    if (!this.currentOrder) return 0;

    let total = this.currentOrder.subtotal;

    if (this.currentOrder.delivery) {
      total += this.currentOrder.delivery.price;
    }

    this.currentOrder.additionalServices.forEach(service => {
      total += service.price;
    });

    this.currentOrder.total = total;
    return total;
  }

  // Get order summary
  getOrderSummary() {
    if (!this.currentOrder) return null;

    return {
      orderId: this.currentOrder.orderId,
      items: this.currentOrder.items,
      subtotal: this.currentOrder.subtotal,
      delivery: this.currentOrder.delivery,
      additionalServices: this.currentOrder.additionalServices,
      total: this.currentOrder.total
    };
  }

  // Complete order
  completeOrder(userData) {
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      this.tg.showAlert('Невозможно оформить пустой заказ');
      return false;
    }

    // Create order object
    const order = {
      orderId: this.currentOrder.orderId,
      date: new Date().toISOString(),
      items: this.currentOrder.items,
      subtotal: this.currentOrder.subtotal,
      delivery: this.currentOrder.delivery,
      additionalServices: this.currentOrder.additionalServices,
      total: this.currentOrder.total,
      user: userData,
      status: 'pending'
    };

    // Send order to Telegram bot
    this.tg.sendData({
      type: 'order',
      data: order
    });

    // Haptic feedback for success
    this.tg.hapticFeedback('success');

    // Show confirmation
    this.tg.showAlert(`Заказ #${order.orderId} успешно оформлен!`, () => {
      // Clear cart after successful order
      this.cart.clear();
    });

    // Clear current order
    this.currentOrder = null;

    return order;
  }

  // Process payment for the order
  processPayment(userData) {
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      this.tg.showAlert('Невозможно оформить пустой заказ');
      return false;
    }

    // Create order object
    const order = {
      orderId: this.currentOrder.orderId,
      date: new Date().toISOString(),
      items: this.currentOrder.items,
      subtotal: this.currentOrder.subtotal,
      delivery: this.currentOrder.delivery,
      additionalServices: this.currentOrder.additionalServices,
      total: this.currentOrder.total,
      user: userData,
      status: 'pending'
    };

    // Create invoice
    const success = this.payment.createInvoice(order, userData);
    
    if (success) {
      // Clear cart after successful invoice creation
      this.cart.clear();
    }

    return success;
  }

  // Generate order ID
  generateOrderId() {
    return 'ZEST' + Date.now().toString().slice(-6);
  }

  // Get delivery options
  getDeliveryOptions() {
    return [...this.deliveryOptions];
  }

  // Get additional services
  getAdditionalServices() {
    return [...this.additionalServices];
  }
}

// Export as a module
window.OrderManager = OrderManager;