// Telegram WebApp Integration Module
class TelegramManager {
  constructor() {
    this.tg = window.Telegram?.WebApp;
    this.mainButton = this.tg?.MainButton;
    this.backButton = this.tg?.BackButton;
    this.init();
  }

  init() {
    if (this.tg) {
      // Expand the app to fill available space
      this.tg.expand();
      
      // Set app header color to match our theme
      this.tg.setHeaderColor('#e33a1b');
      
      // Enable closing confirmation
      this.tg.enableClosingConfirmation();
      
      // Setup event listeners for Telegram buttons
      this.setupTelegramButtons();
    }
  }

  setupTelegramButtons() {
    if (this.backButton) {
      this.backButton.onClick(() => {
        window.dispatchEvent(new CustomEvent('telegramBackButtonClicked'));
      });
    }
  }

  showMainButton(text, onClick) {
    if (this.mainButton) {
      this.mainButton
        .setParams({
          text: text,
          is_visible: true
        })
        .onClick(onClick)
        .show();
    }
  }

  hideMainButton() {
    if (this.mainButton) {
      this.mainButton.hide();
    }
  }

  showPopup(title, message, buttons) {
    if (this.tg) {
      this.tg.showPopup({
        title: title,
        message: message,
        buttons: buttons
      });
    } else {
      // Fallback for development
      alert(`${title}: ${message}`);
    }
  }

  showAlert(message, callback) {
    if (this.tg) {
      this.tg.showAlert(message, callback);
    } else {
      // Fallback for development
      alert(message);
      if (callback) callback();
    }
  }

  hapticFeedback(type) {
    if (this.tg) {
      switch (type) {
        case 'success':
          this.tg.HapticFeedback.impactOccurred('soft');
          break;
        case 'error':
          this.tg.HapticFeedback.notificationOccurred('error');
          break;
        case 'warning':
          this.tg.HapticFeedback.notificationOccurred('warning');
          break;
        case 'selection':
          this.tg.HapticFeedback.selectionChanged();
          break;
        default:
          this.tg.HapticFeedback.impactOccurred('light');
      }
    }
  }

  sendData(data) {
    if (this.tg) {
      this.tg.sendData(JSON.stringify(data));
    } else {
      // Fallback for development
      console.log('Sending data:', data);
    }
  }

  requestBiometricAuth(reason, callback) {
    if (this.tg && this.tg.isBiometricAvailable) {
      this.tg.requestBiometricAuthentication(
        { 
          reason: reason 
        }, 
        (isAuthenticated, biometricToken, error) => {
          if (callback) callback(isAuthenticated, biometricToken, error);
        }
      );
    } else {
      // Fallback for development or unsupported devices
      const confirmed = confirm(`Authentication required: ${reason}`);
      if (callback) callback(confirmed, null, null);
    }
  }
}

// Export as a module
window.TelegramManager = TelegramManager;