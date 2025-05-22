/**
 * Utility functions for the Respiratory System application
 */

export const utils = {
    /**
     * Smooth scroll to element
     * @param {string} selector - CSS selector for target element
     * @param {number} offset - Offset from top in pixels
     */
    smoothScrollTo(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute on leading edge
     * @returns {Function} Debounced function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    /**
     * Add event listener with error handling
     * @param {Element} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListenerSafe(element, event, handler, options = {}) {
        if (element && typeof handler === 'function') {
            try {
                element.addEventListener(event, handler, options);
            } catch (error) {
                console.error(`Error adding event listener for ${event}:`, error);
            }
        }
    },

    /**
     * Get element by ID with null check
     * @param {string} id - Element ID
     * @returns {Element|null} Element or null
     */
    getElementById(id) {
        return document.getElementById(id);
    },

    /**
     * Get elements by selector with null check
     * @param {string} selector - CSS selector
     * @returns {NodeList} NodeList of elements
     */
    querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Add class to element safely
     * @param {Element} element - Target element
     * @param {string} className - Class name to add
     */
    addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    },

    /**
     * Remove class from element safely
     * @param {Element} element - Target element
     * @param {string} className - Class name to remove
     */
    removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle class on element safely
     * @param {Element} element - Target element
     * @param {string} className - Class name to toggle
     */
    toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    },

    /**
     * Set text content safely
     * @param {Element} element - Target element
     * @param {string} text - Text content
     */
    setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    },

    /**
     * Set HTML content safely
     * @param {Element} element - Target element
     * @param {string} html - HTML content
     */
    setHTML(element, html) {
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Create element with attributes
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string} content - Element content
     * @returns {Element} Created element
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    },

    /**
     * Format percentage
     * @param {number} value - Numeric value
     * @param {number} max - Maximum value
     * @returns {string} Formatted percentage
     */
    formatPercentage(value, max = 100) {
        return `${Math.round((value / max) * 100)}%`;
    },

    /**
     * Animate element property
     * @param {Element} element - Target element
     * @param {Object} properties - CSS properties to animate
     * @param {number} duration - Animation duration in ms
     * @param {string} easing - CSS easing function
     * @returns {Promise} Animation promise
     */
    animate(element, properties, duration = 300, easing = 'ease') {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }

            const originalTransition = element.style.transition;
            element.style.transition = `all ${duration}ms ${easing}`;

            Object.entries(properties).forEach(([property, value]) => {
                element.style[property] = value;
            });

            setTimeout(() => {
                element.style.transition = originalTransition;
                resolve();
            }, duration);
        });
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Target element
     * @returns {boolean} True if element is visible
     */
    isInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Log error with context
     * @param {string} context - Error context
     * @param {Error} error - Error object
     */
    logError(context, error) {
        console.error(`[${context}]`, error);
    }
};