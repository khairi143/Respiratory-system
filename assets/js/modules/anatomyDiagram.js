/**
 * Interactive anatomy diagram module
 */

import { utils } from './utils.js';
import { getAnatomyInfo } from '../data/anatomyData.js';

export class AnatomyDiagram {
    constructor() {
        this.diagramContainer = utils.getElementById('anatomy');
        this.infoContainer = utils.getElementById('anatomyInfo');
        this.titleElement = utils.getElementById('partTitle');
        this.descriptionElement = utils.getElementById('partDescription');
        this.funFactElement = utils.getElementById('partFunFact');
        this.clickableAreas = [];
        this.currentPart = null;
        
        this.init();
    }

    /**
     * Initialize the anatomy diagram
     */
    init() {
        if (!this.diagramContainer) {
            utils.logError('AnatomyDiagram', new Error('Diagram container not found'));
            return;
        }

        this.initializeImageMap();
        this.bindAreaEvents();
        this.showDefaultInfo();
    }

    /**
     * Initialize responsive image map
     */
    initializeImageMap() {
        try {
            // Initialize responsive image maps if jQuery is available
            if (window.jQuery && window.jQuery.fn.rwdImageMaps) {
                window.jQuery('img[usemap]').rwdImageMaps();
            }
        } catch (error) {
            utils.logError('AnatomyDiagram', error);
        }
    }

    /**
     * Bind events to clickable areas
     */
    bindAreaEvents() {
        const areas = utils.querySelectorAll('area[data-info]');
        
        areas.forEach(area => {
            const partName = area.getAttribute('data-info');
            
            // Click event
            utils.addEventListenerSafe(area, 'click', (e) => {
                e.preventDefault();
                this.showPartInfo(partName);
            });

            // Hover events for better UX
            utils.addEventListenerSafe(area, 'mouseenter', () => {
                this.highlightPart(partName);
            });

            utils.addEventListenerSafe(area, 'mouseleave', () => {
                this.unhighlightPart(partName);
            });

            this.clickableAreas.push({
                element: area,
                partName: partName
            });
        });
    }

    /**
     * Show information for a specific part
     * @param {string} partName - Name of the anatomical part
     */
    showPartInfo(partName) {
        const anatomyInfo = getAnatomyInfo(partName);
        
        if (!anatomyInfo) {
            utils.logError('AnatomyDiagram', new Error(`No data found for part: ${partName}`));
            return;
        }

        this.currentPart = partName;
        this.updateInfoDisplay(anatomyInfo);
        this.highlightActivePart(partName);
    }

    /**
     * Update the information display
     * @param {Object} anatomyInfo - Anatomy information object
     */
    updateInfoDisplay(anatomyInfo) {
        if (this.titleElement) {
            utils.setText(this.titleElement, anatomyInfo.title);
        }

        if (this.descriptionElement) {
            utils.setText(this.descriptionElement, anatomyInfo.description);
        }

        if (this.funFactElement) {
            utils.setHTML(this.funFactElement, `<strong>Fun Fact:</strong> ${anatomyInfo.funFact}`);
        }

        // Add functions list if container exists
        this.showFunctionsList(anatomyInfo.functions);
        
        // Add medical note if available
        this.showMedicalNote(anatomyInfo.medicalNote);
    }

    /**
     * Show functions list for the current part
     * @param {Array} functions - Array of functions
     */
    showFunctionsList(functions) {
        const functionsContainer = utils.getElementById('partFunctions');
        
        if (!functionsContainer || !functions) return;

        const functionsList = utils.createElement('ul', { className: 'functions-list' });
        
        functions.forEach(func => {
            const listItem = utils.createElement('li', {}, func);
            functionsList.appendChild(listItem);
        });

        utils.setHTML(functionsContainer, '');
        functionsContainer.appendChild(functionsList);
    }

    /**
     * Show medical note
     * @param {string} medicalNote - Medical note text
     */
    showMedicalNote(medicalNote) {
        const medicalContainer = utils.getElementById('partMedical');
        
        if (!medicalContainer || !medicalNote) return;

        const noteElement = utils.createElement('div', 
            { className: 'medical-note' },
            `<strong>Medical Note:</strong> ${medicalNote}`
        );

        utils.setHTML(medicalContainer, '');
        medicalContainer.appendChild(noteElement);
    }

    /**
     * Highlight a part on hover
     * @param {string} partName - Name of the part to highlight
     */
    highlightPart(partName) {
        const area = this.getAreaByPartName(partName);
        if (area) {
            utils.addClass(area.element, 'hovered');
        }
    }

    /**
     * Remove highlight from a part
     * @param {string} partName - Name of the part to unhighlight
     */
    unhighlightPart(partName) {
        const area = this.getAreaByPartName(partName);
        if (area) {
            utils.removeClass(area.element, 'hovered');
        }
    }

    /**
     * Highlight the currently active part
     * @param {string} partName - Name of the active part
     */
    highlightActivePart(partName) {
        // Remove active class from all areas
        this.clickableAreas.forEach(area => {
            utils.removeClass(area.element, 'active');
        });

        // Add active class to current part
        const activeArea = this.getAreaByPartName(partName);
        if (activeArea) {
            utils.addClass(activeArea.element, 'active');
        }
    }

    /**
     * Get area element by part name
     * @param {string} partName - Name of the part
     * @returns {Object|null} Area object or null
     */
    getAreaByPartName(partName) {
        return this.clickableAreas.find(area => area.partName === partName) || null;
    }

    /**
     * Show default information
     */
    showDefaultInfo() {
        if (this.titleElement) {
            utils.setText(this.titleElement, 'Click on a part to learn more');
        }

        if (this.descriptionElement) {
            utils.setText(this.descriptionElement, 
                'Select any highlighted area in the diagram to see detailed information about that part of the respiratory system.'
            );
        }

        if (this.funFactElement) {
            utils.setHTML(this.funFactElement, '');
        }
    }

    /**
     * Reset diagram to default state
     */
    reset() {
        this.currentPart = null;
        this.showDefaultInfo();
        
        // Remove all highlights
        this.clickableAreas.forEach(area => {
            utils.removeClass(area.element, 'active');
            utils.removeClass(area.element, 'hovered');
        });
    }

    /**
     * Show information for a random part (for educational games)
     */
    showRandomPart() {
        const randomIndex = Math.floor(Math.random() * this.clickableAreas.length);
        const randomArea = this.clickableAreas[randomIndex];
        
        if (randomArea) {
            this.showPartInfo(randomArea.partName);
        }
    }

    /**
     * Get current part name
     * @returns {string|null} Current part name or null
     */
    getCurrentPart() {
        return this.currentPart;
    }
}