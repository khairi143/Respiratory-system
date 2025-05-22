/**
 * Main application entry point for Respiratory System Explorer
 */

import { utils } from './modules/utils.js';
import { Navigation } from './modules/navigation.js';
import { AnatomyDiagram } from './modules/anatomyDiagram.js';
import { BreathingAnimation } from './modules/breathingAnimation.js';
import { BreathingSimulation } from './modules/breathingSimulation.js';
import { Quiz } from './modules/quiz.js';

class RespiratorySystemApp {
    constructor() {
        this.modules = {};
        this.isLoaded = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            utils.logError('RespiratorySystemApp', error);
        }
    }

    /**
     * Initialize application modules
     */
    async initializeApp() {
        try {
            console.log('Initializing Respiratory System Explorer...');
            
            // Initialize responsive image maps (jQuery dependency)
            this.initializeImageMaps();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Mark as loaded
            this.isLoaded = true;
            
            console.log('Respiratory System Explorer initialized successfully!');
            
            // Trigger custom event for other scripts
            this.dispatchReadyEvent();
            
        } catch (error) {
            utils.logError('RespiratorySystemApp', error);
            this.handleInitError(error);
        }
    }

    /**
     * Initialize responsive image maps
     */
    initializeImageMaps() {
        try {
            // Check if jQuery and rwdImageMaps are available
            if (window.jQuery && window.jQuery.fn.rwdImageMaps) {
                window.jQuery('img[usemap]').rwdImageMaps();
                console.log('Image maps initialized');
            } else {
                console.warn('jQuery or rwdImageMaps not available - image maps may not be responsive');
            }
        } catch (error) {
            utils.logError('ImageMaps', error);
        }
    }

    /**
     * Initialize all application modules
     */
    async initializeModules() {
        const moduleConfig = {
            navigation: () => new Navigation(),
            anatomyDiagram: () => new AnatomyDiagram(),
            breathingAnimation: () => new BreathingAnimation(),
            breathingSimulation: () => new BreathingSimulation(),
            quiz: () => new Quiz({
                questionCount: 5,
                showExplanations: true,
                randomizeOptions: true
            })
        };

        // Initialize modules with error handling
        for (const [name, factory] of Object.entries(moduleConfig)) {
            try {
                console.log(`Initializing ${name}...`);
                this.modules[name] = factory();
                console.log(`${name} initialized successfully`);
            } catch (error) {
                utils.logError(`Module:${name}`, error);
                console.warn(`Failed to initialize ${name}, continuing with other modules`);
            }
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEvents() {
        // Smooth scrolling for all internal links
        this.setupSmoothScrolling();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize handling
        this.setupResizeHandling();
        
        // Intersection observer for animations
        this.setupIntersectionObserver();
        
        console.log('Global events setup complete');
    }

    /**
     * Setup smooth scrolling for internal links
     */
    setupSmoothScrolling() {
        const internalLinks = utils.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            utils.addEventListenerSafe(link, 'click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's handled by navigation module
                if (link.closest('nav')) return;
                
                e.preventDefault();
                utils.smoothScrollTo(href);
            });
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        utils.addEventListenerSafe(document, 'keydown', (e) => {
            // Escape key to close modals or reset states
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Arrow keys for quiz navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.handleQuizNavigation(e);
            }
        });
    }

    /**
     * Handle escape key press
     */
    handleEscapeKey() {
        // Stop breathing animation if running
        if (this.modules.breathingAnimation && this.modules.breathingAnimation.isRunning()) {
            this.modules.breathingAnimation.stop();
        }
        
        // Stop breathing simulation if running
        if (this.modules.breathingSimulation) {
            const state = this.modules.breathingSimulation.getState();
            if (state.isRunning) {
                this.modules.breathingSimulation.stopSimulation();
            }
        }
    }

    /**
     * Handle quiz navigation with arrow keys
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleQuizNavigation(e) {
        if (!this.modules.quiz) return;
        
        const quizSection = utils.getElementById('quiz');
        if (!utils.isInViewport(quizSection)) return;
        
        // This would need to be implemented in the Quiz module
        // Left arrow: previous question, Right arrow: next question
    }

    /**
     * Setup window resize handling
     */
    setupResizeHandling() {
        const resizeHandler = utils.debounce(() => {
            // Reinitialize image maps on resize
            this.initializeImageMaps();
            
            // Trigger resize event for modules that need it
            this.handleModuleResize();
        }, 250);
        
        utils.addEventListenerSafe(window, 'resize', resizeHandler);
    }

    /**
     * Handle module resize events
     */
    handleModuleResize() {
        Object.values(this.modules).forEach(module => {
            if (typeof module.handleResize === 'function') {
                try {
                    module.handleResize();
                } catch (error) {
                    utils.logError('ModuleResize', error);
                }
            }
        });
    }

    /**
     * Setup intersection observer for animations
     */
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    utils.addClass(entry.target, 'animate-in');
                } else {
                    utils.removeClass(entry.target, 'animate-in');
                }
            });
        }, observerOptions);
        
        // Observe content sections
        const sections = utils.querySelectorAll('.content-section');
        sections.forEach(section => observer.observe(section));
    }

    /**
     * Dispatch ready event
     */
    dispatchReadyEvent() {
        const event = new CustomEvent('respiratoryAppReady', {
            detail: {
                app: this,
                modules: this.modules
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Initialization error
     */
    handleInitError(error) {
        console.error('Failed to initialize application:', error);
        
        // Show error message to user
        const errorMessage = utils.createElement('div', {
            className: 'init-error',
            role: 'alert'
        }, `
            <h3>Application Error</h3>
            <p>Sorry, there was an error initializing the application. Please refresh the page and try again.</p>
            <details>
                <summary>Error Details</summary>
                <pre>${error.stack}</pre>
            </details>
        `);
        
        document.body.insertBefore(errorMessage, document.body.firstChild);
    }

    /**
     * Get module by name
     * @param {string} name - Module name
     * @returns {Object|null} Module instance or null
     */
    getModule(name) {
        return this.modules[name] || null;
    }

    /**
     * Check if app is loaded
     * @returns {boolean} Load state
     */
    isReady() {
        return this.isLoaded;
    }

    /**
     * Restart all modules
     */
    restart() {
        Object.values(this.modules).forEach(module => {
            if (typeof module.restart === 'function') {
                try {
                    module.restart();
                } catch (error) {
                    utils.logError('ModuleRestart', error);
                }
            }
        });
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        // Clean up modules
        Object.values(this.modules).forEach(module => {
            if (typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (error) {
                    utils.logError('ModuleDestroy', error);
                }
            }
        });
        
        this.modules = {};
        this.isLoaded = false;
    }
}

// Initialize the application
const app = new RespiratorySystemApp();

// Make app available globally for debugging
window.RespiratorySystemApp = app;

// Export for module usage
export default app;