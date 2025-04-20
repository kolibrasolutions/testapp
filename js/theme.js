/**
 * Theme Manager for FarmaLearn
 * Handles dark/light theme switching and UI preferences
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'farmalearn_theme';
    this.defaultTheme = 'dark';
    this.currentTheme = this.loadThemePreference();
    
    // Apply theme on initialization
    this.applyTheme(this.currentTheme);
  }
  
  /**
   * Load theme preference from localStorage
   * @returns {string} Current theme ('dark' or 'light')
   */
  loadThemePreference() {
    return localStorage.getItem(this.storageKey) || this.defaultTheme;
  }
  
  /**
   * Save theme preference to localStorage
   * @param {string} theme - Theme to save ('dark' or 'light')
   */
  saveThemePreference(theme) {
    localStorage.setItem(this.storageKey, theme);
  }
  
  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.saveThemePreference(newTheme);
    this.currentTheme = newTheme;
  }
  
  /**
   * Apply specified theme to document
   * @param {string} theme - Theme to apply ('dark' or 'light')
   */
  applyTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    
    // Update theme toggle icon
    const themeToggleIcons = document.querySelectorAll('.theme-toggle i');
    themeToggleIcons.forEach(icon => {
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
  
  /**
   * Initialize theme toggle buttons
   */
  initThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });
    
    // Set initial icon state
    const themeToggleIcons = document.querySelectorAll('.theme-toggle i');
    themeToggleIcons.forEach(icon => {
      if (this.currentTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
}

export default ThemeManager;
