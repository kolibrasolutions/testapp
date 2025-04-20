/**
 * Login System for FarmaLearn
 * Handles user authentication and session management
 */

class LoginSystem {
  constructor() {
    this.storagePrefix = 'farmalearn_';
    this.redirectUrl = 'index.html';
    this.currentUser = null;
    this.isLoggedIn = false;
    
    // Check login status on initialization
    this.checkLoginStatus();
  }
  
  /**
   * Check if user is currently logged in
   * @returns {boolean} Login status
   */
  checkLoginStatus() {
    const loggedIn = localStorage.getItem(`${this.storagePrefix}logged_in`) || 
                     sessionStorage.getItem(`${this.storagePrefix}logged_in`);
    
    if (loggedIn === 'true') {
      const username = localStorage.getItem(`${this.storagePrefix}username`) || 
                       sessionStorage.getItem(`${this.storagePrefix}username`);
      
      this.currentUser = {
        username: username,
        displayName: this.formatDisplayName(username),
        initials: this.getInitials(username),
        role: 'Balconista'
      };
      
      this.isLoggedIn = true;
      return true;
    }
    
    this.isLoggedIn = false;
    return false;
  }
  
  /**
   * Attempt to login with provided credentials
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to remember login between sessions
   * @returns {Object} Login result with success status and message
   */
  login(username, password, rememberMe = false) {
    // In a real application, this would validate against a server
    // For demo purposes, we're using a simple check
    if (username === 'juliano' && password === 'admin123') {
      // Store login information
      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem(`${this.storagePrefix}logged_in`, 'true');
      storage.setItem(`${this.storagePrefix}username`, username);
      
      this.currentUser = {
        username: username,
        displayName: this.formatDisplayName(username),
        initials: this.getInitials(username),
        role: 'Balconista'
      };
      
      this.isLoggedIn = true;
      
      return {
        success: true,
        message: 'Login realizado com sucesso!'
      };
    }
    
    return {
      success: false,
      message: 'Usuário ou senha incorretos. Por favor, tente novamente.'
    };
  }
  
  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem(`${this.storagePrefix}logged_in`);
    localStorage.removeItem(`${this.storagePrefix}username`);
    sessionStorage.removeItem(`${this.storagePrefix}logged_in`);
    sessionStorage.removeItem(`${this.storagePrefix}username`);
    
    this.currentUser = null;
    this.isLoggedIn = false;
    
    // Redirect to login page
    window.location.href = 'login.html';
  }
  
  /**
   * Get current user information
   * @returns {Object|null} User information or null if not logged in
   */
  getCurrentUser() {
    return this.currentUser;
  }
  
  /**
   * Format display name from username
   * @param {string} username - Username
   * @returns {string} Formatted display name
   */
  formatDisplayName(username) {
    if (!username) return '';
    
    // Capitalize first letter of each word
    return username
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Get initials from username
   * @param {string} username - Username
   * @returns {string} Initials (up to 2 characters)
   */
  getInitials(username) {
    if (!username) return '';
    
    const parts = username.split(' ');
    
    if (parts.length === 1) {
      // Single name, use first two letters
      return username.substring(0, 2).toUpperCase();
    }
    
    // Multiple names, use first letter of first and last name
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  
  /**
   * Redirect to login page if not logged in
   */
  requireLogin() {
    if (!this.checkLoginStatus()) {
      window.location.href = 'login.html';
    }
  }
  
  /**
   * Update UI elements with user information
   */
  updateUserInterface() {
    if (!this.currentUser) return;
    
    // Update user avatar and name in sidebar
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    const userNameElements = document.querySelectorAll('.user-name');
    
    userAvatarElements.forEach(element => {
      element.textContent = this.currentUser.initials;
    });
    
    userNameElements.forEach(element => {
      element.textContent = this.currentUser.displayName;
    });
    
    // Set up logout button
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
      button.addEventListener('click', () => this.logout());
    });
  }
}

export default LoginSystem;
