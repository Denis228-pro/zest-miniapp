// Authentication and Age Gate Management
class AuthManager {
  constructor() {
    this.user = null;
    this.isAgeConfirmed = false;
  }

  // Check if user has confirmed age
  checkAgeConfirmation() {
    this.isAgeConfirmed = localStorage.getItem('ageConfirmed') === 'true';
    return this.isAgeConfirmed;
  }

  // Confirm user age
  confirmAge() {
    localStorage.setItem('ageConfirmed', 'true');
    this.isAgeConfirmed = true;
    
    // Send event to Telegram if available
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.postEvent('confirm_age', { confirmed: true });
    }
    
    return true;
  }

  // Check if user is logged in (via Telegram)
  checkAuthStatus() {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        const initData = window.Telegram.WebApp.initData;
        if (initData) {
          // Parse user data from Telegram
          const userData = this.parseInitData(initData);
          this.user = userData.user;
          return true;
        }
      }
      
      // Fallback for development
      this.user = {
        id: 'dev_user',
        first_name: 'Developer',
        username: 'dev'
      };
      
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  // Parse Telegram init data
  parseInitData(initData) {
    const params = new URLSearchParams(initData);
    const user = JSON.parse(decodeURIComponent(params.get('user') || '{}'));
    const chat = JSON.parse(decodeURIComponent(params.get('chat') || '{}'));
    
    return {
      user,
      chat,
      query_id: params.get('query_id'),
      auth_date: params.get('auth_date'),
      hash: params.get('hash')
    };
  }

  // Check if user is a ZeSt Club member
  isClubMember() {
    // In a real app, this would check against the database
    // For now, we'll use localStorage for demo purposes
    const memberData = localStorage.getItem('zestClubMember');
    if (memberData) {
      const member = JSON.parse(memberData);
      const now = new Date();
      const expiry = new Date(member.expiry);
      
      if (now < expiry) {
        return true;
      } else {
        // Membership expired
        localStorage.removeItem('zestClubMember');
        return false;
      }
    }
    
    return false;
  }

  // Subscribe user to ZeSt Club
  subscribeToClub() {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1); // 1 month from now
    
    const memberData = {
      isMember: true,
      expiry: expiry.toISOString(),
      subscribedAt: new Date().toISOString()
    };
    
    localStorage.setItem('zestClubMember', JSON.stringify(memberData));
    return memberData;
  }

  // Unsubscribe user from ZeSt Club
  unsubscribeFromClub() {
    localStorage.removeItem('zestClubMember');
    return true;
  }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other modules
window.AuthManager = AuthManager;
window.authManager = authManager;