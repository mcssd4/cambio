// CambioMax Pro - Language Management Module

class LanguageManager {
    constructor() {
        this.translationManager = window.translationManager;
        this.modal = null;
        this.currentLanguageBtn = null;
        this.init();
    }
    
    init() {
        this.setupLanguageButton();
        this.setupLanguageModal();
        this.updateLanguageDisplay();
        
        // Listen for translation changes
        this.translationManager.addObserver(this.handleLanguageChange.bind(this));
    }
    
    setupLanguageButton() {
        this.currentLanguageBtn = document.getElementById('languageBtn');
        if (this.currentLanguageBtn) {
            this.currentLanguageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLanguageModal();
            });
        }
    }
    
    setupLanguageModal() {
        this.modal = document.getElementById('languageModal');
        if (!this.modal) return;
        
        // Setup language options
        const languageOptions = this.modal.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const language = option.getAttribute('data-lang');
                this.selectLanguage(language);
            });
            
            // Keyboard support
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const language = option.getAttribute('data-lang');
                    this.selectLanguage(language);
                }
            });
            
            // Make focusable
            option.setAttribute('tabindex', '0');
        });
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideLanguageModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hideLanguageModal();
            }
        });
    }
    
    showLanguageModal() {
        if (!this.modal) return;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first language option
        const firstOption = this.modal.querySelector('.language-option');
        if (firstOption) {
            firstOption.focus();
        }
        
        // Update selected state
        this.updateSelectedLanguage();
        
        // Add animation class
        setTimeout(() => {
            this.modal.classList.add('animated');
        }, 10);
    }
    
    hideLanguageModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active', 'animated');
        document.body.style.overflow = '';
        
        // Return focus to language button
        if (this.currentLanguageBtn) {
            this.currentLanguageBtn.focus();
        }
    }
    
    selectLanguage(language) {
        this.translationManager.setLanguage(language);
        this.hideLanguageModal();
        
        // Show success feedback
        this.showLanguageChangeSuccess(language);
    }
    
    updateSelectedLanguage() {
        const currentLang = this.translationManager.getCurrentLanguage();
        const options = this.modal?.querySelectorAll('.language-option');
        
        options?.forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === currentLang) {
                option.classList.add('selected');
                option.setAttribute('aria-selected', 'true');
            } else {
                option.classList.remove('selected');
                option.setAttribute('aria-selected', 'false');
            }
        });
    }
    
    updateLanguageDisplay() {
        const currentLang = this.translationManager.getCurrentLanguage();
        const langInfo = this.translationManager.getLanguageInfo(currentLang);
        
        if (this.currentLanguageBtn) {
            const flagImg = this.currentLanguageBtn.querySelector('#currentFlag');
            const langText = this.currentLanguageBtn.querySelector('#currentLanguage');
            
            if (flagImg) {
                flagImg.src = `https://flagcdn.com/w40/${langInfo.flag}.png`;
                flagImg.alt = langInfo.nativeName;
            }
            
            if (langText) {
                langText.textContent = currentLang.split('-')[0].toUpperCase();
            }
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = currentLang;
        
        // Update direction for RTL languages (if needed in future)
        const rtlLanguages = ['ar', 'he', 'fa'];
        const langCode = currentLang.split('-')[0];
        document.documentElement.dir = rtlLanguages.includes(langCode) ? 'rtl' : 'ltr';
    }
    
    handleLanguageChange(language) {
        this.updateLanguageDisplay();
        this.updateSelectedLanguage();
        
        // Update any language-specific content
        this.updateLanguageSpecificContent(language);
        
        // Track language usage
        this.trackLanguageUsage(language);
    }
    
    updateLanguageSpecificContent(language) {
        // Update number formatting
        this.updateNumberFormatting(language);
        
        // Update date formatting
        this.updateDateFormatting(language);
        
        // Update currency formatting
        this.updateCurrencyFormatting(language);
        
        // Update form validation messages
        this.updateFormValidation(language);
    }
    
    updateNumberFormatting(language) {
        const numberElements = document.querySelectorAll('[data-number]');
        numberElements.forEach(element => {
            const number = parseFloat(element.getAttribute('data-number'));
            if (!isNaN(number)) {
                element.textContent = this.formatNumber(number, language);
            }
        });
    }
    
    updateDateFormatting(language) {
        const dateElements = document.querySelectorAll('[data-date]');
        dateElements.forEach(element => {
            const dateStr = element.getAttribute('data-date');
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                element.textContent = this.formatDate(date, language);
            }
        });
    }
    
    updateCurrencyFormatting(language) {
        const currencyElements = document.querySelectorAll('[data-currency]');
        currencyElements.forEach(element => {
            const amount = parseFloat(element.getAttribute('data-currency'));
            const currency = element.getAttribute('data-currency-code') || 'USD';
            if (!isNaN(amount)) {
                element.textContent = this.formatCurrency(amount, currency, language);
            }
        });
    }
    
    updateFormValidation(language) {
        // Update form validation messages based on language
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                this.updateInputValidationMessages(input, language);
            });
        });
    }
    
    updateInputValidationMessages(input, language) {
        // Custom validation messages by language
        const messages = {
            'pt-BR': {
                required: 'Este campo é obrigatório',
                email: 'Por favor, insira um email válido',
                minLength: 'Muito curto',
                maxLength: 'Muito longo',
                pattern: 'Formato inválido'
            },
            'en-US': {
                required: 'This field is required',
                email: 'Please enter a valid email',
                minLength: 'Too short',
                maxLength: 'Too long',
                pattern: 'Invalid format'
            },
            'es-ES': {
                required: 'Este campo es obligatorio',
                email: 'Por favor, ingrese un email válido',
                minLength: 'Demasiado corto',
                maxLength: 'Demasiado largo',
                pattern: 'Formato inválido'
            },
            'zh-CN': {
                required: '此字段为必填项',
                email: '请输入有效的电子邮件',
                minLength: '太短',
                maxLength: '太长',
                pattern: '格式无效'
            },
            'th-TH': {
                required: 'ฟิลด์นี้จำเป็น',
                email: 'กรุณาใส่อีเมลที่ถูกต้อง',
                minLength: 'สั้นเกินไป',
                maxLength: 'ยาวเกินไป',
                pattern: 'รูปแบบไม่ถูกต้อง'
            },
            'fr-FR': {
                required: 'Ce champ est obligatoire',
                email: 'Veuillez saisir un email valide',
                minLength: 'Trop court',
                maxLength: 'Trop long',
                pattern: 'Format invalide'
            }
        };
        
        const langMessages = messages[language] || messages['en-US'];
        
        // Set custom validation messages
        if (input.setCustomValidity) {
            input.addEventListener('invalid', () => {
                if (input.validity.valueMissing) {
                    input.setCustomValidity(langMessages.required);
                } else if (input.validity.typeMismatch && input.type === 'email') {
                    input.setCustomValidity(langMessages.email);
                } else if (input.validity.tooShort) {
                    input.setCustomValidity(langMessages.minLength);
                } else if (input.validity.tooLong) {
                    input.setCustomValidity(langMessages.maxLength);
                } else if (input.validity.patternMismatch) {
                    input.setCustomValidity(langMessages.pattern);
                } else {
                    input.setCustomValidity('');
                }
            });
            
            input.addEventListener('input', () => {
                input.setCustomValidity('');
            });
        }
    }
    
    formatNumber(number, language) {
        try {
            return new Intl.NumberFormat(language).format(number);
        } catch (e) {
            return number.toString();
        }
    }
    
    formatDate(date, language) {
        try {
            return new Intl.DateTimeFormat(language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (e) {
            return date.toLocaleDateString();
        }
    }
    
    formatCurrency(amount, currency, language) {
        try {
            return new Intl.NumberFormat(language, {
                style: 'currency',
                currency: currency
            }).format(amount);
        } catch (e) {
            return `${currency} ${amount.toFixed(2)}`;
        }
    }
    
    showLanguageChangeSuccess(language) {
        const langInfo = this.translationManager.getLanguageInfo(language);
        
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'language-change-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <img src="https://flagcdn.com/w40/${langInfo.flag}.png" alt="${langInfo.nativeName}" class="notification-flag">
                <span>${this.translationManager.translate('language_changed', 'Language changed to')} ${langInfo.nativeName}</span>
                <i class="fas fa-check notification-check"></i>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
        `;
        
        const flag = notification.querySelector('.notification-flag');
        flag.style.cssText = `
            width: 20px;
            height: 15px;
            border-radius: 2px;
            object-fit: cover;
        `;
        
        const check = notification.querySelector('.notification-check');
        check.style.cssText = `
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    trackLanguageUsage(language) {
        const usage = JSON.parse(localStorage.getItem('cambiomax_language_usage') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!usage[today]) {
            usage[today] = {};
        }
        
        usage[today][language] = (usage[today][language] || 0) + 1;
        
        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        Object.keys(usage).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete usage[date];
            }
        });
        
        localStorage.setItem('cambiomax_language_usage', JSON.stringify(usage));
    }
    
    getLanguageUsageStats() {
        const usage = JSON.parse(localStorage.getItem('cambiomax_language_usage') || '{}');
        const stats = {};
        let total = 0;
        
        Object.values(usage).forEach(day => {
            Object.entries(day).forEach(([lang, count]) => {
                stats[lang] = (stats[lang] || 0) + count;
                total += count;
            });
        });
        
        // Convert to percentages
        Object.keys(stats).forEach(lang => {
            stats[lang] = {
                count: stats[lang],
                percentage: total ? (stats[lang] / total * 100).toFixed(1) : 0
            };
        });
        
        return { stats, total };
    }
    
    // Auto-detect language from user behavior
    detectPreferredLanguage() {
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Check geolocation (if available)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                // Could use position to suggest language based on country
                // This would require a geolocation to language mapping service
            });
        }
        
        // Check timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneToLanguage = {
            'America/Sao_Paulo': 'pt-BR',
            'America/New_York': 'en-US',
            'Europe/Madrid': 'es-ES',
            'Asia/Shanghai': 'zh-CN',
            'Asia/Bangkok': 'th-TH',
            'Europe/Paris': 'fr-FR'
        };
        
        return timezoneToLanguage[timezone] || browserLang || 'en-US';
    }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}

