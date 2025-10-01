// Gesture Recognition Module for Mobile Navigation
class GestureManager {
  constructor(app) {
    this.app = app;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 60;
    
    this.init();
  }
  
  init() {
    // Add touch event listeners for swipe gestures
    document.addEventListener('touchstart', (event) => {
      this.handleTouchStart(event);
    }, false);
    
    document.addEventListener('touchend', (event) => {
      this.handleTouchEnd(event);
    }, false);
  }
  
  handleTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }
  
  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }
  
  handleSwipeGesture() {
    const swipeX = this.touchStartX - this.touchEndX;
    const swipeY = this.touchStartY - this.touchEndY;
    const absSwipeX = Math.abs(swipeX);
    const absSwipeY = Math.abs(swipeY);
    
    // Check if horizontal swipe is more significant than vertical
    if (absSwipeX > absSwipeY && absSwipeX > this.minSwipeDistance) {
      if (swipeX > 0) {
        // Swipe left - go to next page
        this.swipeLeft();
      } else {
        // Swipe right - go to previous page
        this.swipeRight();
      }
    }
  }
  
  swipeLeft() {
    // Navigate to the next page in sequence
    const pages = ['catalog', 'club', 'services', 'profile'];
    const currentIndex = pages.indexOf(this.app.currentPage);
    
    if (currentIndex < pages.length - 1) {
      const nextPage = pages[currentIndex + 1];
      this.app.navigateTo(nextPage);
      this.app.tg.hapticFeedback('selection');
    }
  }
  
  swipeRight() {
    // Navigate to the previous page in sequence
    const pages = ['catalog', 'club', 'services', 'profile'];
    const currentIndex = pages.indexOf(this.app.currentPage);
    
    if (currentIndex > 0) {
      const prevPage = pages[currentIndex - 1];
      this.app.navigateTo(prevPage);
      this.app.tg.hapticFeedback('selection');
    }
  }
}

// Export as a module
window.GestureManager = GestureManager;