// CambioMax Pro - Exchange Calculator Module

class ExchangeCalculator {
    constructor() {
        this.rates = {};
        this.baseCurrency = 'USD';
        this.fee = 0.004; // 0.4%
        this.lastUpdate = null;
        this.updateInterval = 60000; // 1 minute
        this.form = null;
        this.fromAmount = null;
        this.toAmount = null;
        this.fromCurrency = null;
        this.toCurrency = null;
        this.swapButton = null;
        this.rateDisplay = null;
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadExchangeRates();
        this.startAutoUpdate();
    }
    
    setupElements() {
        this.form = document.getElementById('exchangeForm');
        this.fromAmount = document.getElementById('fromAmount');
        this.toAmount = document.getElementById('toAmount');
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.swapButton = document.getElementById('swapButton');
        this.rateDisplay = document.getElementById('exchangeRate');
    }
    
    setupEventListeners() {
        if (this.fromAmount) {
            this.fromAmount.addEventListener('input', this.handleAmountChange.bind(this));
            this.fromAmount.addEventListener('focus', this.handleAmountFocus.bind(this));
            this.fromAmount.addEventListener('blur', this.handleAmountBlur.bind(this));
        }
        
        if (this.swapButton) {
            this.swapButton.addEventListener('click', this.swapCurrencies.bind(this));
        }
        
        if (this.fromCurrency) {
            this.fromCurrency.addEventListener('click', () => this.showCurrencySelector('from'));
        }
        
        if (this.toCurrency) {
            this.toCurrency.addEventListener('click', () => this.showCurrencySelector('to'));
        }
        
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Listen for theme changes to update chart colors
        document.addEventListener('themeChanged', this.handleThemeChange.bind(this));
    }
    
    async loadExchangeRates() {
        try {
            // In a real application, this would fetch from a live API
            // For demo purposes, we'll use mock data
            this.rates = await this.fetchExchangeRates();
            this.lastUpdate = new Date();
            this.updateRateDisplay();
            this.calculateExchange();
        } catch (error) {
            console.error('Failed to load exchange rates:', error);
            this.showRateError();
        }
    }
    
    async fetchExchangeRates() {
        // Mock exchange rates - in production, use a real API like:
        // https://api.exchangerate-api.com/v4/latest/USD
        // https://api.fixer.io/latest
        // https://openexchangerates.org/api/latest.json
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    'USD': 1.0000,
                    'BRL': 5.0000,
                    'EUR': 0.8500,
                    'GBP': 0.7300,
                    'JPY': 110.0000,
                    'CNY': 6.4500,
                    'THB': 33.5000,
                    'CAD': 1.2500,
                    'AUD': 1.3500,
                    'CHF': 0.9200,
                    'MXN': 20.0000,
                    'ARS': 350.0000
                });
            }, 500);
        });
    }
    
    getCurrentFromCurrency() {
        const currencyCode = this.fromCurrency?.querySelector('.currency-code');
        return currencyCode?.textContent || 'BRL';
    }
    
    getCurrentToCurrency() {
        const currencyCode = this.toCurrency?.querySelector('.currency-code');
        return currencyCode?.textContent || 'USD';
    }
    
    getExchangeRate(fromCurrency, toCurrency) {
        if (!this.rates[fromCurrency] || !this.rates[toCurrency]) {
            return 0;
        }
        
        // Convert to USD first, then to target currency
        const fromRate = this.rates[fromCurrency];
        const toRate = this.rates[toCurrency];
        
        return toRate / fromRate;
    }
    
    calculateExchange() {
        const fromCurrency = this.getCurrentFromCurrency();
        const toCurrency = this.getCurrentToCurrency();
        const amount = parseFloat(this.fromAmount?.value || 0);
        
        if (amount <= 0) {
            this.toAmount.value = '';
            return;
        }
        
        const rate = this.getExchangeRate(fromCurrency, toCurrency);
        const feeAmount = amount * this.fee;
        const netAmount = amount - feeAmount;
        const convertedAmount = netAmount * rate;
        
        this.toAmount.value = this.formatAmount(convertedAmount);
        this.updateRateDisplay();
    }
    
    updateRateDisplay() {
        if (!this.rateDisplay) return;
        
        const fromCurrency = this.getCurrentFromCurrency();
        const toCurrency = this.getCurrentToCurrency();
        const rate = this.getExchangeRate(fromCurrency, toCurrency);
        
        const rateLabel = this.rateDisplay.querySelector('[data-translate="exchange_rate_label"]');
        const rateValue = this.rateDisplay.querySelector('.rate-value');
        
        if (rateLabel && rateValue) {
            rateLabel.textContent = `1 ${fromCurrency} = `;
            rateValue.textContent = `${this.formatAmount(rate)} ${toCurrency}`;
        }
        
        // Add rate change indicator
        this.addRateChangeIndicator(rate);
    }
    
    addRateChangeIndicator(currentRate) {
        const fromCurrency = this.getCurrentFromCurrency();
        const toCurrency = this.getCurrentToCurrency();
        const rateKey = `${fromCurrency}_${toCurrency}`;
        
        const previousRate = this.getPreviousRate(rateKey);
        if (previousRate && previousRate !== currentRate) {
            const change = ((currentRate - previousRate) / previousRate) * 100;
            const indicator = this.createRateChangeIndicator(change);
            
            // Add indicator to rate display
            const existingIndicator = this.rateDisplay.querySelector('.rate-change');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            this.rateDisplay.appendChild(indicator);
        }
        
        // Store current rate for next comparison
        this.storePreviousRate(rateKey, currentRate);
    }
    
    createRateChangeIndicator(changePercent) {
        const indicator = document.createElement('span');
        indicator.className = `rate-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
        indicator.innerHTML = `
            <i class="fas fa-arrow-${changePercent >= 0 ? 'up' : 'down'}"></i>
            ${Math.abs(changePercent).toFixed(2)}%
        `;
        
        indicator.style.cssText = `
            margin-left: 8px;
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 4px;
            background: ${changePercent >= 0 ? 'var(--color-success)' : 'var(--color-error)'};
            color: white;
        `;
        
        return indicator;
    }
    
    getPreviousRate(rateKey) {
        const rates = JSON.parse(localStorage.getItem('cambiomax_previous_rates') || '{}');
        return rates[rateKey];
    }
    
    storePreviousRate(rateKey, rate) {
        const rates = JSON.parse(localStorage.getItem('cambiomax_previous_rates') || '{}');
        rates[rateKey] = rate;
        localStorage.setItem('cambiomax_previous_rates', JSON.stringify(rates));
    }
    
    formatAmount(amount) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }).format(amount);
    }
    
    handleAmountChange(event) {
        // Format input as user types
        let value = event.target.value.replace(/[^0-9.,]/g, '');
        
        // Handle different decimal separators
        value = value.replace(',', '.');
        
        // Prevent multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        event.target.value = value;
        
        // Debounce calculation
        clearTimeout(this.calculationTimeout);
        this.calculationTimeout = setTimeout(() => {
            this.calculateExchange();
        }, 300);
    }
    
    handleAmountFocus(event) {
        event.target.select();
    }
    
    handleAmountBlur(event) {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            event.target.value = this.formatAmount(value);
        }
    }
    
    swapCurrencies() {
        const fromCurrencyData = this.getCurrencyData(this.fromCurrency);
        const toCurrencyData = this.getCurrencyData(this.toCurrency);
        
        // Swap currency displays
        this.setCurrencyData(this.fromCurrency, toCurrencyData);
        this.setCurrencyData(this.toCurrency, fromCurrencyData);
        
        // Swap amounts
        const fromValue = this.fromAmount.value;
        const toValue = this.toAmount.value;
        
        this.fromAmount.value = toValue;
        this.toAmount.value = fromValue;
        
        // Add animation
        this.swapButton.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.swapButton.style.transform = '';
        }, 300);
        
        // Recalculate
        this.calculateExchange();
    }
    
    getCurrencyData(currencyElement) {
        const flag = currencyElement.querySelector('.currency-flag');
        const code = currencyElement.querySelector('.currency-code');
        
        return {
            flag: flag.src,
            alt: flag.alt,
            code: code.textContent
        };
    }
    
    setCurrencyData(currencyElement, data) {
        const flag = currencyElement.querySelector('.currency-flag');
        const code = currencyElement.querySelector('.currency-code');
        
        flag.src = data.flag;
        flag.alt = data.alt;
        code.textContent = data.code;
    }
    
    showCurrencySelector(type) {
        // Create currency selector modal
        const modal = this.createCurrencyModal(type);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    createCurrencyModal(type) {
        const currencies = [
            { code: 'BRL', name: 'Real Brasileiro', flag: 'br' },
            { code: 'USD', name: 'Dólar Americano', flag: 'us' },
            { code: 'EUR', name: 'Euro', flag: 'eu' },
            { code: 'GBP', name: 'Libra Esterlina', flag: 'gb' },
            { code: 'JPY', name: 'Iene Japonês', flag: 'jp' },
            { code: 'CNY', name: 'Yuan Chinês', flag: 'cn' },
            { code: 'THB', name: 'Baht Tailandês', flag: 'th' },
            { code: 'CAD', name: 'Dólar Canadense', flag: 'ca' },
            { code: 'AUD', name: 'Dólar Australiano', flag: 'au' },
            { code: 'CHF', name: 'Franco Suíço', flag: 'ch' },
            { code: 'MXN', name: 'Peso Mexicano', flag: 'mx' },
            { code: 'ARS', name: 'Peso Argentino', flag: 'ar' }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'currency-modal';
        modal.innerHTML = `
            <div class="currency-modal-content">
                <div class="currency-modal-header">
                    <h3>Selecionar Moeda</h3>
                    <button class="currency-modal-close">&times;</button>
                </div>
                <div class="currency-list">
                    ${currencies.map(currency => `
                        <div class="currency-item" data-currency="${currency.code}">
                            <img src="https://flagcdn.com/w40/${currency.flag}.png" alt="${currency.name}" class="currency-item-flag">
                            <div class="currency-item-info">
                                <div class="currency-item-code">${currency.code}</div>
                                <div class="currency-item-name">${currency.name}</div>
                            </div>
                            <div class="currency-item-rate">
                                ${this.formatAmount(this.rates[currency.code] || 0)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add styles
        this.addCurrencyModalStyles(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.currency-modal-close');
        closeBtn.addEventListener('click', () => this.closeCurrencyModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCurrencyModal(modal);
            }
        });
        
        const currencyItems = modal.querySelectorAll('.currency-item');
        currencyItems.forEach(item => {
            item.addEventListener('click', () => {
                const currencyCode = item.getAttribute('data-currency');
                this.selectCurrency(type, currencyCode);
                this.closeCurrencyModal(modal);
            });
        });
        
        return modal;
    }
    
    addCurrencyModalStyles(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        const content = modal.querySelector('.currency-modal-content');
        content.style.cssText = `
            background: var(--color-background);
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: var(--shadow-2xl);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        const header = modal.querySelector('.currency-modal-header');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--color-border);
        `;
        
        const list = modal.querySelector('.currency-list');
        list.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
        `;
        
        const items = modal.querySelectorAll('.currency-item');
        items.forEach(item => {
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s ease;
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--color-surface)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = '';
            });
        });
        
        // Add active class styles
        const style = document.createElement('style');
        style.textContent = `
            .currency-modal.active {
                opacity: 1 !important;
                visibility: visible !important;
            }
            .currency-modal.active .currency-modal-content {
                transform: scale(1) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    selectCurrency(type, currencyCode) {
        const currencies = {
            'BRL': { name: 'Real Brasileiro', flag: 'br' },
            'USD': { name: 'Dólar Americano', flag: 'us' },
            'EUR': { name: 'Euro', flag: 'eu' },
            'GBP': { name: 'Libra Esterlina', flag: 'gb' },
            'JPY': { name: 'Iene Japonês', flag: 'jp' },
            'CNY': { name: 'Yuan Chinês', flag: 'cn' },
            'THB': { name: 'Baht Tailandês', flag: 'th' },
            'CAD': { name: 'Dólar Canadense', flag: 'ca' },
            'AUD': { name: 'Dólar Australiano', flag: 'au' },
            'CHF': { name: 'Franco Suíço', flag: 'ch' },
            'MXN': { name: 'Peso Mexicano', flag: 'mx' },
            'ARS': { name: 'Peso Argentino', flag: 'ar' }
        };
        
        const currency = currencies[currencyCode];
        const targetElement = type === 'from' ? this.fromCurrency : this.toCurrency;
        
        if (targetElement && currency) {
            this.setCurrencyData(targetElement, {
                flag: `https://flagcdn.com/w40/${currency.flag}.png`,
                alt: currency.name,
                code: currencyCode
            });
            
            this.calculateExchange();
        }
    }
    
    closeCurrencyModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    handleFormSubmit(event) {
        event.preventDefault();
        
        const fromCurrency = this.getCurrentFromCurrency();
        const toCurrency = this.getCurrentToCurrency();
        const amount = parseFloat(this.fromAmount.value || 0);
        
        if (amount <= 0) {
            this.showError('Por favor, insira um valor válido');
            return;
        }
        
        // Store exchange data for next page
        const exchangeData = {
            fromCurrency,
            toCurrency,
            amount,
            convertedAmount: parseFloat(this.toAmount.value || 0),
            rate: this.getExchangeRate(fromCurrency, toCurrency),
            fee: this.fee,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('cambiomax_exchange_data', JSON.stringify(exchangeData));
        
        // Navigate to registration page
        window.location.href = 'pages/register.html';
    }
    
    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'exchange-error-notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showRateError() {
        if (this.rateDisplay) {
            this.rateDisplay.innerHTML = `
                <span style="color: var(--color-error);">
                    <i class="fas fa-exclamation-triangle"></i>
                    Erro ao carregar taxas
                </span>
            `;
        }
    }
    
    startAutoUpdate() {
        setInterval(() => {
            this.loadExchangeRates();
        }, this.updateInterval);
    }
    
    handleThemeChange(event) {
        // Update any theme-dependent elements
        const theme = event.detail.theme;
        
        // Update chart colors if any charts are present
        if (this.chart) {
            this.updateChartTheme(theme);
        }
    }
    
    updateChartTheme(theme) {
        // Implementation for updating chart theme
        // This would be used if we add rate history charts
    }
    
    // Utility methods
    getCurrencySymbol(currencyCode) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'BRL': 'R$',
            'CNY': '¥',
            'THB': '฿',
            'CAD': 'C$',
            'AUD': 'A$',
            'CHF': 'CHF',
            'MXN': '$',
            'ARS': '$'
        };
        
        return symbols[currencyCode] || currencyCode;
    }
    
    getExchangeHistory() {
        return JSON.parse(localStorage.getItem('cambiomax_exchange_history') || '[]');
    }
    
    saveExchangeToHistory(exchangeData) {
        const history = this.getExchangeHistory();
        history.unshift(exchangeData);
        
        // Keep only last 50 exchanges
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem('cambiomax_exchange_history', JSON.stringify(history));
    }
}

// Initialize exchange calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.exchangeCalculator = new ExchangeCalculator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExchangeCalculator;
}

