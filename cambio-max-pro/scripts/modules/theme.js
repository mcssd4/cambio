// CambioMax Pro - Theme Management System

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme() || 'light';
        this.observers = [];
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
        this.setupThemeToggle();
    }
    
    getStoredTheme() {
        return localStorage.getItem('cambiomax_theme');
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            localStorage.setItem('cambiomax_theme', theme);
            this.applyTheme(theme);
            this.notifyObservers(theme);
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('theme-light', 'theme-dark');
        html.removeAttribute('data-theme');
        
        // Apply new theme
        html.classList.add(`theme-${theme}`);
        html.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        this.updateThemeToggleIcon(theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Trigger custom event
        const event = new CustomEvent('themeChanged', { 
            detail: { theme, previousTheme: this.previousTheme } 
        });
        document.dispatchEvent(event);
        
        this.previousTheme = theme;
    }
    
    updateThemeToggleIcon(theme) {
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            const icon = toggleButton.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            // Update tooltip
            const tooltip = theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro';
            toggleButton.setAttribute('title', tooltip);
            toggleButton.setAttribute('aria-label', tooltip);
        }
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#FFFFFF',
            dark: '#0F172A'
        };
        
        metaThemeColor.content = colors[theme];
    }
    
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleSystemThemeChange = (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(systemTheme);
                    this.currentTheme = systemTheme;
                    this.notifyObservers(systemTheme);
                }
            };
            
            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleSystemThemeChange);
            } else {
                // Legacy browsers
                mediaQuery.addListener(handleSystemThemeChange);
            }
        }
    }
    
    setupThemeToggle() {
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleTheme();
                
                // Add click animation
                toggleButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    toggleButton.style.transform = '';
                }, 150);
            });
            
            // Keyboard support
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }
    
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    notifyObservers(theme) {
        this.observers.forEach(callback => callback(theme));
    }
    
    // Utility methods for components
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
    
    isLightTheme() {
        return this.currentTheme === 'light';
    }
    
    // Get theme-specific values
    getThemeValue(lightValue, darkValue) {
        return this.currentTheme === 'dark' ? darkValue : lightValue;
    }
    
    // CSS custom property helpers
    getCSSVariable(property) {
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    }
    
    setCSSVariable(property, value) {
        document.documentElement.style.setProperty(property, value);
    }
    
    // Animation helpers for theme transitions
    enableThemeTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                transition: background-color 0.3s ease, 
                           border-color 0.3s ease, 
                           color 0.3s ease, 
                           box-shadow 0.3s ease !important;
            }
        `;
        style.id = 'theme-transitions';
        document.head.appendChild(style);
        
        // Remove after transition completes
        setTimeout(() => {
            const transitionStyle = document.getElementById('theme-transitions');
            if (transitionStyle) {
                transitionStyle.remove();
            }
        }, 300);
    }
    
    // Save user preference for analytics
    trackThemeUsage() {
        const usage = JSON.parse(localStorage.getItem('cambiomax_theme_usage') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!usage[today]) {
            usage[today] = { light: 0, dark: 0 };
        }
        
        usage[today][this.currentTheme]++;
        
        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        Object.keys(usage).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete usage[date];
            }
        });
        
        localStorage.setItem('cambiomax_theme_usage', JSON.stringify(usage));
    }
    
    // Get theme usage statistics
    getThemeUsageStats() {
        const usage = JSON.parse(localStorage.getItem('cambiomax_theme_usage') || '{}');
        let totalLight = 0;
        let totalDark = 0;
        
        Object.values(usage).forEach(day => {
            totalLight += day.light || 0;
            totalDark += day.dark || 0;
        });
        
        const total = totalLight + totalDark;
        return {
            light: { count: totalLight, percentage: total ? (totalLight / total * 100).toFixed(1) : 0 },
            dark: { count: totalDark, percentage: total ? (totalDark / total * 100).toFixed(1) : 0 },
            total
        };
    }
}

// Theme-aware component helpers
class ThemeAwareComponent {
    constructor(element) {
        this.element = element;
        this.themeManager = window.themeManager;
        this.init();
    }
    
    init() {
        this.updateForTheme(this.themeManager.getCurrentTheme());
        this.themeManager.addObserver(this.handleThemeChange.bind(this));
    }
    
    handleThemeChange(theme) {
        this.updateForTheme(theme);
    }
    
    updateForTheme(theme) {
        // Override in subclasses
    }
    
    destroy() {
        this.themeManager.removeObserver(this.handleThemeChange.bind(this));
    }
}

// Specific theme-aware components
class ThemeAwareChart extends ThemeAwareComponent {
    updateForTheme(theme) {
        if (this.chart) {
            const colors = {
                light: {
                    background: '#FFFFFF',
                    text: '#1A202C',
                    grid: '#E2E8F0',
                    primary: '#0066FF'
                },
                dark: {
                    background: '#0F172A',
                    text: '#F1F5F9',
                    grid: '#334155',
                    primary: '#3B82F6'
                }
            };
            
            this.chart.updateOptions({
                theme: {
                    mode: theme,
                    palette: 'palette1',
                    monochrome: {
                        enabled: false,
                        color: colors[theme].primary,
                        shadeTo: theme,
                        shadeIntensity: 0.65
                    }
                },
                chart: {
                    background: colors[theme].background
                },
                xaxis: {
                    labels: {
                        style: {
                            colors: colors[theme].text
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: colors[theme].text
                        }
                    }
                },
                grid: {
                    borderColor: colors[theme].grid
                }
            });
        }
    }
}

class ThemeAwareMap extends ThemeAwareComponent {
    updateForTheme(theme) {
        if (this.map) {
            const styles = {
                light: [
                    // Light theme map styles
                ],
                dark: [
                    // Dark theme map styles
                    {
                        "elementType": "geometry",
                        "stylers": [{"color": "#1e293b"}]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#f1f5f9"}]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{"color": "#0f172a"}]
                    }
                ]
            };
            
            this.map.setOptions({ styles: styles[theme] });
        }
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Track theme changes
    window.themeManager.addObserver((theme) => {
        window.themeManager.trackThemeUsage();
        
        // Enable smooth transitions
        window.themeManager.enableThemeTransitions();
        
        // Update any theme-aware components
        document.dispatchEvent(new CustomEvent('themeUpdate', { detail: { theme } }));
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ThemeAwareComponent, ThemeAwareChart, ThemeAwareMap };
}

