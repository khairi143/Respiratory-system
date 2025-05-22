/**
 * Simple breathing animation module for the overview section
 */

import { utils } from './utils.js';

export class BreathingAnimation {
    constructor() {
        this.breathBtn = utils.getElementById('breathBtn');
        this.animationElement = utils.getElementById('breathAnimation');
        this.isAnimating = false;
        
        this.init();
    }

    /**
     * Initialize the breathing animation
     */
    init() {
        if (!this.breathBtn || !this.animationElement) {
            utils.logError('BreathingAnimation', new Error('Required elements not found'));
            return;
        }

        this.bindEvents();
        this.setupAnimation();
    }

    /**
     * Bind animation events
     */
    bindEvents() {
        utils.addEventListenerSafe(this.breathBtn, 'click', () => {
            this.triggerAnimation();
        });
    }

    /**
     * Setup initial animation state
     */
    setupAnimation() {
        // Set initial state
        this.animationElement.style.opacity = '0';
        this.animationElement.style.transform = 'scale(1)';
        this.animationElement.style.transition = 'all 2s ease-in-out';
    }

    /**
     * Trigger the breathing animation
     */
    triggerAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.updateButtonState(true);
        
        // Start animation sequence
        this.playBreathingSequence();
    }

    /**
     * Play the complete breathing animation sequence
     */
    async playBreathingSequence() {
        try {
            // Phase 1: Inhale (expand and fade in)
            await this.inhaleAnimation();
            
            // Phase 2: Hold breath
            await this.holdAnimation(1000);
            
            // Phase 3: Exhale (contract and fade out)
            await this.exhaleAnimation();
            
            // Phase 4: Reset
            await this.resetAnimation();
            
        } catch (error) {
            utils.logError('BreathingAnimation', error);
        } finally {
            this.isAnimating = false;
            this.updateButtonState(false);
        }
    }

    /**
     * Inhale animation phase
     * @returns {Promise} Animation promise
     */
    inhaleAnimation() {
        return new Promise((resolve) => {
            this.animationElement.style.opacity = '1';
            this.animationElement.style.transform = 'scale(1.5)';
            this.animationElement.style.backgroundColor = '#3498db';
            
            // Add breathing effect to button
            utils.addClass(this.breathBtn, 'breathing-in');
            
            setTimeout(resolve, 2000);
        });
    }

    /**
     * Hold breath animation phase
     * @param {number} duration - Hold duration in milliseconds
     * @returns {Promise} Animation promise
     */
    holdAnimation(duration) {
        return new Promise((resolve) => {
            // Slight pulsing effect during hold
            this.animationElement.style.transform = 'scale(1.4)';
            setTimeout(resolve, duration);
        });
    }

    /**
     * Exhale animation phase
     * @returns {Promise} Animation promise
     */
    exhaleAnimation() {
        return new Promise((resolve) => {
            this.animationElement.style.opacity = '0.3';
            this.animationElement.style.transform = 'scale(0.8)';
            this.animationElement.style.backgroundColor = '#2ecc71';
            
            // Update button state
            utils.removeClass(this.breathBtn, 'breathing-in');
            utils.addClass(this.breathBtn, 'breathing-out');
            
            setTimeout(resolve, 2000);
        });
    }

    /**
     * Reset animation to initial state
     * @returns {Promise} Animation promise
     */
    resetAnimation() {
        return new Promise((resolve) => {
            this.animationElement.style.opacity = '0';
            this.animationElement.style.transform = 'scale(1)';
            this.animationElement.style.backgroundColor = '#3498db';
            
            // Reset button classes
            utils.removeClass(this.breathBtn, 'breathing-out');
            
            setTimeout(resolve, 1000);
        });
    }

    /**
     * Update button state during animation
     * @param {boolean} isAnimating - Whether animation is running
     */
    updateButtonState(isAnimating) {
        if (!this.breathBtn) return;
        
        if (isAnimating) {
            this.breathBtn.disabled = true;
            utils.setText(this.breathBtn, 'Breathing...');
            utils.addClass(this.breathBtn, 'animating');
        } else {
            this.breathBtn.disabled = false;
            utils.setText(this.breathBtn, 'Take a Deep Breath With Me');
            utils.removeClass(this.breathBtn, 'animating');
        }
    }

    /**
     * Create guided breathing exercise
     * @param {number} cycles - Number of breathing cycles
     * @param {Object} timing - Timing configuration
     */
    async startGuidedBreathing(cycles = 5, timing = { inhale: 4000, hold: 2000, exhale: 4000 }) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        utils.setText(this.breathBtn, `Guided Breathing (${cycles} cycles)`);
        this.breathBtn.disabled = true;
        
        try {
            for (let i = 0; i < cycles; i++) {
                // Show cycle counter
                this.showCycleCounter(i + 1, cycles);
                
                // Inhale
                await this.guidedInhale(timing.inhale);
                
                // Hold
                if (timing.hold > 0) {
                    await this.guidedHold(timing.hold);
                }
                
                // Exhale
                await this.guidedExhale(timing.exhale);
                
                // Brief pause between cycles
                if (i < cycles - 1) {
                    await this.holdAnimation(1000);
                }
            }
            
            // Final reset
            await this.resetAnimation();
            
        } catch (error) {
            utils.logError('BreathingAnimation', error);
        } finally {
            this.isAnimating = false;
            this.updateButtonState(false);
            this.hideCycleCounter();
        }
    }

    /**
     * Guided inhale with instruction
     * @param {number} duration - Inhale duration
     * @returns {Promise} Animation promise
     */
    guidedInhale(duration) {
        this.showBreathingInstruction('Breathe in slowly...');
        return this.inhaleAnimation();
    }

    /**
     * Guided hold with instruction
     * @param {number} duration - Hold duration
     * @returns {Promise} Animation promise
     */
    guidedHold(duration) {
        this.showBreathingInstruction('Hold...');
        return this.holdAnimation(duration);
    }

    /**
     * Guided exhale with instruction
     * @param {number} duration - Exhale duration
     * @returns {Promise} Animation promise
     */
    guidedExhale(duration) {
        this.showBreathingInstruction('Breathe out slowly...');
        return this.exhaleAnimation();
    }

    /**
     * Show breathing instruction
     * @param {string} instruction - Instruction text
     */
    showBreathingInstruction(instruction) {
        let instructionElement = utils.getElementById('breathingInstruction');
        
        if (!instructionElement) {
            instructionElement = utils.createElement('div', {
                id: 'breathingInstruction',
                className: 'breathing-instruction'
            });
            
            this.animationElement.parentNode.appendChild(instructionElement);
        }
        
        utils.setText(instructionElement, instruction);
        instructionElement.style.opacity = '1';
    }

    /**
     * Show cycle counter
     * @param {number} current - Current cycle
     * @param {number} total - Total cycles
     */
    showCycleCounter(current, total) {
        let counterElement = utils.getElementById('cycleCounter');
        
        if (!counterElement) {
            counterElement = utils.createElement('div', {
                id: 'cycleCounter',
                className: 'cycle-counter'
            });
            
            this.animationElement.parentNode.appendChild(counterElement);
        }
        
        utils.setText(counterElement, `Cycle ${current} of ${total}`);
        counterElement.style.opacity = '1';
    }

    /**
     * Hide cycle counter
     */
    hideCycleCounter() {
        const counterElement = utils.getElementById('cycleCounter');
        if (counterElement) {
            counterElement.style.opacity = '0';
        }
        
        const instructionElement = utils.getElementById('breathingInstruction');
        if (instructionElement) {
            instructionElement.style.opacity = '0';
        }
    }

    /**
     * Check if animation is currently running
     * @returns {boolean} Animation state
     */
    isRunning() {
        return this.isAnimating;
    }

    /**
     * Stop current animation
     */
    stop() {
        this.isAnimating = false;
        this.resetAnimation();
        this.updateButtonState(false);
        this.hideCycleCounter();
    }
}