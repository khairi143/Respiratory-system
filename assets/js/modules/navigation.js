/**
 * Navigation module for smooth scrolling and active link management
 */

import { utils } from './utils.js';

export class Navigation {
    constructor() {
        this.navLinks = utils.querySelectorAll('nav a');
        this.sections = [];
        this.activeClass = 'active';
        this.init();
    }

    /**
     * Initialize navigation
     */
    init() {
        this.bindEvents();
        this.cacheSections();
        this.setActiveOnLoad();
        this.observeSections();
    }

    /**
     * Bind navigation events
     */
    bindEvents() {
        this.navLinks.forEach(link => {
            utils.addEventListenerSafe(link, 'click', (e) => {
                this.handleNavClick(e, link);
            });
        });
    }

    /**
     * Handle navigation link click
     * @param {Event} e - Click event
     * @param {Element} link - Clicked link
     */
    handleNavClick(e, link) {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            this.updateActiveLink(link);
            this.scrollToSection(targetSection);
        }
    }

    /**
     * Update active navigation link
     * @param {Element} activeLink - Link to make active
     */
    updateActiveLink(activeLink) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            utils.removeClass(link, this.activeClass);
        });
        
        // Add active class to clicked link
        utils.addClass(activeLink, this.activeClass);
    }

    /**
     * Scroll to section smoothly
     * @param {Element} section - Target section
     */
    scrollToSection(section) {
        const navHeight = document.querySelector('nav').offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }

    /**
     * Cache section elements for intersection observer
     */
    cacheSections() {
        this.navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const section = document.querySelector(targetId);
            if (section) {
                this.sections.push({
                    element: section,
                    link: link,
                    id: targetId
                });
            }
        });
    }

    /**
     * Set active link on page load
     */
    setActiveOnLoad() {
        const hash = window.location.hash;
        if (hash) {
            const activeLink = document.querySelector(`nav a[href="${hash}"]`);
            if (activeLink) {
                this.updateActiveLink(activeLink);
                return;
            }
        }
        
        // Default to first link
        if (this.navLinks.length > 0) {
            utils.addClass(this.navLinks[0], this.activeClass);
        }
    }

    /**
     * Observe sections for automatic active link updates
     */
    observeSections() {
        if (!window.IntersectionObserver) {
            return; // Fallback for older browsers
        }

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeSection = this.sections.find(
                        section => section.element === entry.target
                    );
                    
                    if (activeSection) {
                        this.updateActiveLink(activeSection.link);
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        this.sections.forEach(section => {
            observer.observe(section.element);
        });
    }

    /**
     * Highlight navigation link by section ID
     * @param {string} sectionId - Section ID to highlight
     */
    highlightSection(sectionId) {
        const targetLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        if (targetLink) {
            this.updateActiveLink(targetLink);
        }
    }

    /**
     * Get current active section
     * @returns {string|null} Active section ID
     */
    getCurrentSection() {
        const activeLink = document.querySelector(`nav a.${this.activeClass}`);
        return activeLink ? activeLink.getAttribute('href').substring(1) : null;
    }
}