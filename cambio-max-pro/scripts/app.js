// CambioMax Pro - Main Application Script

class CambioMaxApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('Failed to initialize CambioMax Pro:', error);
            this.showInitializationError();
        }
    }
    
    async initializeApp() {
        console.log('🚀 Initializing CambioMax Pro...');
        
        // Initialize core modules
        await this.initializeModules();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup error handling
        this.setupErrorHandling();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        // Setup analytics (if enabled)
        this.setupAnalytics();
        
        // Show first-time user modal if needed
        this.checkFirstTimeUser();
        
        // Setup service worker for offline support
        this.setupServiceWorker();
        
        this.isInitialized = true;
        console.log('✅ CambioMax Pro initialized successfully');
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('cambioMaxReady', {
            detail: { timestamp: new Date().toISOString() }
        }));
    }
    
    async initializeModules() {
        // Modules are already initialized by their respective scripts
        // We just need to store references and ensure they're ready
        
        this.modules = {
            translation: window.translationManager,
            theme: window.themeManager,
            language: window.languageManager,
            exchange: window.exchangeCalculator
        };
        
        // Wait for all modules to be ready
        const modulePromises = Object.entries(this.modules).map(([name, module]) => {
            return new Promise((resolve) => {
                if (module && module.isInitialized !== false) {
                    resolve();
                } else {
                    // Wait for module to initialize
                    const checkInterval = setInterval(() => {
                        if (window[name + 'Manager'] || window[name + 'Calculator']) {
                            this.modules[name] = window[name + 'Manager'] || window[name + 'Calculator'];
                            clearInterval(checkInterval);
                            resolve();
                        }
                    }, 100);
                    
                    // Timeout after 5 seconds
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        console.warn(`Module ${name} failed to initialize within timeout`);
                        resolve();
                    }, 5000);
                }
            });
        });
        
        await Promise.all(modulePromises);
    }
    
    setupGlobalEventListeners() {
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('ajax-form')) {
                e.preventDefault();
                this.handleAjaxForm(form);
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleWindowResize();
            }, 250);
        });
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }
    
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with a real performance monitoring service
            this.monitorWebVitals();
        }
        
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.logPerformanceMetrics(perfData);
                }
            }, 0);
        });
        
        // Monitor resource loading
        this.monitorResourceLoading();
    }
    
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e.error, e.filename, e.lineno, e.colno);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.handleUnhandledRejection(e.reason);
        });
        
        // Custom error reporting
        window.reportError = (error, context = {}) => {
            this.reportError(error, context);
        };
    }
    
    setupAccessibility() {
        // Skip to main content link
        this.createSkipLink();
        
        // Focus management
        this.setupFocusManagement();
        
        // Keyboard trap for modals
        this.setupModalKeyboardTrap();
        
        // Announce dynamic content changes
        this.setupAriaLiveRegions();
        
        // High contrast mode detection
        this.detectHighContrastMode();
    }
    
    setupAnalytics() {
        // Only setup analytics if user has consented
        const hasConsent = localStorage.getItem('cambiomax_analytics_consent');
        
        if (hasConsent === 'true') {
            this.initializeAnalytics();
        } else if (hasConsent === null) {
            this.showAnalyticsConsent();
        }
    }
    
    checkFirstTimeUser() {
        const isFirstTime = !localStorage.getItem('cambiomax_visited');
        
        if (isFirstTime) {
            localStorage.setItem('cambiomax_visited', 'true');
            localStorage.setItem('cambiomax_first_visit', new Date().toISOString());
            
            // Show welcome tour or language selection
            setTimeout(() => {
                this.showWelcomeTour();
            }, 1000);
        }
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
    
    // Event Handlers
    handleAjaxForm(form) {
        const formData = new FormData(form);
        const action = form.action || window.location.href;
        const method = form.method || 'POST';
        
        // Show loading state
        this.showFormLoading(form);
        
        fetch(action, {
            method: method,
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.handleFormResponse(form, data);
        })
        .catch(error => {
            this.handleFormError(form, error);
        })
        .finally(() => {
            this.hideFormLoading(form);
        });
    }
    
    handleKeyboardNavigation(e) {
        // Escape key handling
        if (e.key === 'Escape') {
            this.handleEscapeKey();
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
        
        // Arrow key navigation for custom components
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            this.handleArrowNavigation(e);
        }
    }
    
    handleWindowResize() {
        // Update mobile menu state
        this.updateMobileMenuState();
        
        // Update any size-dependent components
        this.updateResponsiveComponents();
        
        // Dispatch resize event for modules
        document.dispatchEvent(new CustomEvent('appResize', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }));
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations, stop timers
            this.pauseBackgroundActivities();
        } else {
            // Page is visible - resume activities
            this.resumeBackgroundActivities();
        }
    }
    
    handleOnlineStatus(isOnline) {
        const statusIndicator = this.getOrCreateStatusIndicator();
        
        if (isOnline) {
            statusIndicator.textContent = 'Conectado';
            statusIndicator.className = 'status-indicator online';
            
            // Sync any pending data
            this.syncPendingData();
        } else {
            statusIndicator.textContent = 'Offline';
            statusIndicator.className = 'status-indicator offline';
        }
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusIndicator.style.opacity = '0';
        }, 3000);
    }
    
    // Utility Methods
    showInitializationError() {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="text-align: center; max-width: 400px; padding: 2rem;">
                    <h1 style="color: #dc3545; margin-bottom: 1rem;">Erro de Inicialização</h1>
                    <p style="color: #6c757d; margin-bottom: 2rem;">
                        Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.375rem;
                        cursor: pointer;
                        font-size: 1rem;
                    ">
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
    
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 100000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupFocusManagement() {
        // Store last focused element before modal opens
        document.addEventListener('focusin', (e) => {
            if (!e.target.closest('.modal')) {
                this.lastFocusedElement = e.target;
            }
        });
    }
    
    setupModalKeyboardTrap() {
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal.active');
            if (modal && e.key === 'Tab') {
                this.trapFocusInModal(e, modal);
            }
        });
    }
    
    trapFocusInModal(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    setupAriaLiveRegions() {
        // Create live regions for announcements
        const politeRegion = document.createElement('div');
        politeRegion.setAttribute('aria-live', 'polite');
        politeRegion.setAttribute('aria-atomic', 'true');
        politeRegion.className = 'sr-only';
        politeRegion.id = 'aria-live-polite';
        
        const assertiveRegion = document.createElement('div');
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.className = 'sr-only';
        assertiveRegion.id = 'aria-live-assertive';
        
        document.body.appendChild(politeRegion);
        document.body.appendChild(assertiveRegion);
    }
    
    announce(message, priority = 'polite') {
        const region = document.getElementById(`aria-live-${priority}`);
        if (region) {
            region.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }
    
    detectHighContrastMode() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.classList.add('high-contrast');
        }
    }
    
    showWelcomeTour() {
        // Implementation for welcome tour
        console.log('Welcome tour would be shown here');
    }
    
    getOrCreateStatusIndicator() {
        let indicator = document.getElementById('network-status');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'network-status';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        
        return indicator;
    }
    
    // Performance monitoring methods
    monitorWebVitals() {
        // Implementation for Core Web Vitals monitoring
    }
    
    logPerformanceMetrics(perfData) {
        const metrics = {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstByte: perfData.responseStart - perfData.requestStart,
            timestamp: new Date().toISOString()
        };
        
        console.log('Performance metrics:', metrics);
        
        // Store metrics for analysis
        const storedMetrics = JSON.parse(localStorage.getItem('cambiomax_performance') || '[]');
        storedMetrics.push(metrics);
        
        // Keep only last 10 measurements
        if (storedMetrics.length > 10) {
            storedMetrics.splice(0, storedMetrics.length - 10);
        }
        
        localStorage.setItem('cambiomax_performance', JSON.stringify(storedMetrics));
    }
    
    monitorResourceLoading() {
        // Monitor failed resource loads
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                console.warn('Resource failed to load:', e.target.src || e.target.href);
            }
        }, true);
    }
    
    // Error handling methods
    handleGlobalError(error, filename, lineno, colno) {
        console.error('Global error:', error, filename, lineno, colno);
        this.reportError(error, { filename, lineno, colno, type: 'javascript' });
    }
    
    handleUnhandledRejection(reason) {
        console.error('Unhandled promise rejection:', reason);
        this.reportError(reason, { type: 'promise' });
    }
    
    reportError(error, context = {}) {
        const errorReport = {
            message: error.message || error.toString(),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            context
        };
        
        // Store error locally
        const errors = JSON.parse(localStorage.getItem('cambiomax_errors') || '[]');
        errors.push(errorReport);
        
        // Keep only last 20 errors
        if (errors.length > 20) {
            errors.splice(0, errors.length - 20);
        }
        
        localStorage.setItem('cambiomax_errors', JSON.stringify(errors));
        
        // In production, send to error reporting service
        // this.sendErrorToService(errorReport);
    }
    
    // Module communication
    getModule(name) {
        return this.modules[name];
    }
    
    isModuleReady(name) {
        return this.modules[name] && this.modules[name].isInitialized !== false;
    }
    
    // Public API
    ready(callback) {
        if (this.isInitialized) {
            callback();
        } else {
            document.addEventListener('cambioMaxReady', callback);
        }
    }
}

// Initialize the application
window.CambioMaxApp = new CambioMaxApp();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CambioMaxApp;
}

