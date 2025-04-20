/**
 * Gerenciador de tema (claro/escuro) para o sistema de treinamento
 */

class ThemeManager {
  constructor() {
    this.themeKey = 'preferred_theme';
    this.defaultTheme = 'light';
    this.initTheme();
  }

  /**
   * Inicializa o tema com base na preferência salva ou configuração do sistema
   */
  initTheme() {
    // Verifica se há uma preferência salva
    const savedTheme = localStorage.getItem(this.themeKey);
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Verifica preferência do sistema
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      
      if (prefersDarkScheme.matches) {
        this.setTheme('dark');
      } else {
        this.setTheme(this.defaultTheme);
      }
    }
    
    // Adiciona listener para mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.themeKey)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Define o tema atual
   * @param {string} theme - 'light' ou 'dark'
   */
  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    localStorage.setItem(this.themeKey, theme);
    this.updateThemeToggleIcon(theme);
  }

  /**
   * Alterna entre os temas claro e escuro
   */
  toggleTheme() {
    const currentTheme = localStorage.getItem(this.themeKey) || this.defaultTheme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    this.setTheme(newTheme);
  }

  /**
   * Atualiza o ícone do botão de alternância de tema
   * @param {string} theme - Tema atual
   */
  updateThemeToggleIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
      if (theme === 'dark') {
        themeToggle.className = 'fas fa-sun';
      } else {
        themeToggle.className = 'fas fa-moon';
      }
    }
  }

  /**
   * Inicializa o botão de alternância de tema
   */
  initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
      
      // Atualiza o ícone inicial
      const currentTheme = localStorage.getItem(this.themeKey) || this.defaultTheme;
      this.updateThemeToggleIcon(currentTheme);
    }
  }
}

export default ThemeManager;
