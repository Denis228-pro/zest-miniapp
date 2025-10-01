// Payment Module for Telegram Mini App
class PaymentManager {
  constructor(telegramManager) {
    this.tg = telegramManager;
    this.providerToken = ''; // In a real app, this would be set from environment variables
  }

  // Create an invoice using Telegram's payment API
  createInvoice(order, userData) {
    if (!this.tg.tg || !this.tg.tg.createInvoice) {
      // Fallback for development or unsupported environments
      this.tg.showAlert('Payment system is not available in this environment');
      return false;
    }

    // Prepare invoice items
    const prices = [];
    
    // Add product items
    order.items.forEach(item => {
      prices.push({
        label: `${item.name} x${item.quantity}`,
        amount: item.price * item.quantity * 100 // Convert to cents/minimal units
      });
    });
    
    // Add delivery cost
    if (order.delivery && order.delivery.price > 0) {
      prices.push({
        label: order.delivery.name,
        amount: order.delivery.price * 100
      });
    }
    
    // Add additional services
    order.additionalServices.forEach(service => {
      prices.push({
        label: service.name,
        amount: service.price * 100
      });
    });

    // Create invoice parameters
    const invoiceParams = {
      title: `Order #${order.orderId}`,
      description: `Energy drinks order from ZeSt Shop`,
      payload: JSON.stringify({
        orderId: order.orderId,
        userId: userData.id,
        timestamp: Date.now()
      }),
      provider_token: this.providerToken,
      currency: 'RUB',
      prices: prices
    };

    try {
      // Create the invoice
      this.tg.tg.createInvoice(invoiceParams);
      return true;
    } catch (error) {
      console.error('Error creating invoice:', error);
      this.tg.showAlert('Failed to create invoice. Please try again.');
      return false;
    }
  }

  // Process successful payment
  processPaymentSuccess(paymentData) {
    // In a real app, this would send data to your backend
    this.tg.hapticFeedback('success');
    this.tg.showAlert('Payment successful! Your order is being processed.');
    
    // Send confirmation to bot
    this.tg.sendData({
      type: 'payment_success',
      data: paymentData
    });
    
    return true;
  }

  // Process failed payment
  processPaymentFailed(error) {
    this.tg.hapticFeedback('error');
    this.tg.showAlert('Payment failed. Please try again.');
    
    // Send error info to bot
    this.tg.sendData({
      type: 'payment_failed',
      data: error
    });
    
    return false;
  }

  // Format price for display
  formatPrice(amount) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  }

  // Calculate total amount in minimal units (cents)
  calculateTotalAmount(order) {
    let total = 0;
    
    // Add product costs
    order.items.forEach(item => {
      total += item.price * item.quantity;
    });
    
    // Add delivery cost
    if (order.delivery) {
      total += order.delivery.price;
    }
    
    // Add additional services
    order.additionalServices.forEach(service => {
      total += service.price;
    });
    
    return Math.round(total * 100); // Convert to cents
  }
}

// Export as a module
window.PaymentManager = PaymentManager;