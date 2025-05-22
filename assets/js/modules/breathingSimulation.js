/**
 * Breathing simulation module for interactive lung visualization
 */

import { utils } from './utils.js';

export class BreathingSimulation {
    constructor() {
        this.breatheBtn = utils.getElementById('breatheSimBtn');
        this.lungsElement = utils.getElementById('lungsSim');
        this.diaphragmElement = utils.getElementById('diaphragmSim');
        this.oxygenMeter = utils.getElementById('oxygenMeter');
        this.oxygenValue = utils.getElementById('oxygenValue');
        
        this.isRunning = false;
        this.animationInterval = null;
        this.oxygenLevel = 50;
        this.breathingRate = 4000; // 4 seconds per breath cycle
        this.inhaleTime = 2000; // 2 seconds inhale
        this.exhaleTime = 2000; // 2 seconds exhale
        
        this.config = {
            minOxygen: 40,
            maxOxygen: 100,
            oxygenIncrease: 10,
            oxygenDecrease: 5,
            lungExpandedHeight: '200px',
            lungRestingHeight: '150px',
            diaphragmContractedHeight: '10px',
            diaphragmRelaxedHeight: '30px'
        };
        
        this.init();
    }

    /**
     * Initialize the breathing simulation
     */
    init() {
        if (!this.breatheBtn || !this.lungsElement || !this.diaphragmElement) {
            utils.logError('BreathingSimulation', new Error('Required elements not found'));
            return;
        }

        this.bindEvents();
        this.initializeDisplay();
    }

    /**
     * Bind simulation events
     */
    bindEvents() {
        utils.addEventListenerSafe(this.breatheBtn, 'click', () => {
            this.toggleSimulation();
        });
    }

    /**
     * Initialize the display elements
     */
    initializeDisplay() {
        this.resetLungPosition();
        this.updateOxygenDisplay();
    }

    /**
     * Toggle breathing simulation on/off
     */
    toggleSimulation() {
        if (this.isRunning) {
            this.stopSimulation();
        } else {
            this.startSimulation();
        }
    }

    /**
     * Start the breathing simulation
     */
    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        utils.setText(this.breatheBtn, 'Stop Simulation');
        utils.addClass(this.breatheBtn, 'active');
        
        this.runBreathingCycle();
    }

    /**
     * Stop the breathing simulation
     */
    stopSimulation() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        utils.setText(this.breatheBtn, 'Start Breathing Simulation');
        utils.removeClass(this.breatheBtn, 'active');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        this.resetLungPosition();
    }

    /**
     * Run continuous breathing cycles
     */
    runBreathingCycle() {
        if (!this.isRunning) return;
        
        this.inhale().then(() => {
            if (this.isRunning) {
                return this.exhale();
            }
        }).then(() => {
            if (this.isRunning) {
                // Continue the cycle
                setTimeout(() => this.runBreathingCycle(), 500);
            }
        });
    }

    /**
     * Simulate inhalation
     * @returns {Promise} Animation promise
     */
    async inhale() {
        // Expand lungs and contract diaphragm
        await Promise.all([
            utils.animate(this.lungsElement, {
                height: this.config.lungExpandedHeight
            }, this.inhaleTime),
            utils.animate(this.diaphragmElement, {
                height: this.config.diaphragmContractedHeight
            }, this.inhaleTime)
        ]);

        // Increase oxygen level
        this.oxygenLevel = Math.min(
            this.config.maxOxygen, 
            this.oxygenLevel + this.config.oxygenIncrease
        );
        this.updateOxygenDisplay();
        
        // Add visual feedback
        this.addBreathingEffect('inhale');
    }

    /**
     * Simulate exhalation
     * @returns {Promise} Animation promise
     */
    async exhale() {
        // Contract lungs and relax diaphragm
        await Promise.all([
            utils.animate(this.lungsElement, {
                height: this.config.lungRestingHeight
            }, this.exhaleTime),
            utils.animate(this.diaphragmElement, {
                height: this.config.diaphragmRelaxedHeight
            }, this.exhaleTime)
        ]);

        // Decrease oxygen level slightly
        this.oxygenLevel = Math.max(
            this.config.minOxygen, 
            this.oxygenLevel - this.config.oxygenDecrease
        );
        this.updateOxygenDisplay();
        
        // Add visual feedback
        this.addBreathingEffect('exhale');
    }

    /**
     * Add visual breathing effects
     * @param {string} phase - 'inhale' or 'exhale'
     */
    addBreathingEffect(phase) {
        const alveoli = utils.querySelectorAll('.alveoli-cluster');
        
        alveoli.forEach((alveolus, index) => {
            setTimeout(() => {
                if (phase === 'inhale') {
                    utils.addClass(alveolus, 'expanded');
                } else {
                    utils.removeClass(alveolus, 'expanded');
                }
            }, index * 200);
        });
    }

    /**
     * Update oxygen level display
     */
    updateOxygenDisplay() {
        if (this.oxygenMeter) {
            this.oxygenMeter.value = this.oxygenLevel;
        }
        
        if (this.oxygenValue) {
            utils.setText(this.oxygenValue, `${this.oxygenLevel}%`);
        }
        
        // Update color based on oxygen level
        this.updateOxygenMeterColor();
    }

    /**
     * Update oxygen meter color based on level
     */
    updateOxygenMeterColor() {
        if (!this.oxygenMeter) return;
        
        const level = this.oxygenLevel;
        let colorClass = 'normal';
        
        if (level < 60) {
            colorClass = 'low';
        } else if (level > 85) {
            colorClass = 'high';
        }
        
        // Remove all color classes
        utils.removeClass(this.oxygenMeter, 'low');
        utils.removeClass(this.oxygenMeter, 'normal');
        utils.removeClass(this.oxygenMeter, 'high');
        
        // Add current color class
        utils.addClass(this.oxygenMeter, colorClass);
    }

    /**
     * Reset lung positions to default
     */
    resetLungPosition() {
        if (this.lungsElement) {
            this.lungsElement.style.height = this.config.lungRestingHeight;
        }
        
        if (this.diaphragmElement) {
            this.diaphragmElement.style.height = this.config.diaphragmRelaxedHeight;
        }
        
        // Reset alveoli
        const alveoli = utils.querySelectorAll('.alveoli-cluster');
        alveoli.forEach(alveolus => {
            utils.removeClass(alveolus, 'expanded');
        });
    }

    /**
     * Set breathing rate
     * @param {number} rate - Breathing rate in milliseconds per cycle
     */
    setBreathingRate(rate) {
        this.breathingRate = Math.max(2000, Math.min(8000, rate));
        this.inhaleTime = this.breathingRate / 2;
        this.exhaleTime = this.breathingRate / 2;
    }

    /**
     * Simulate different breathing conditions
     * @param {string} condition - 'normal', 'exercise', 'sleep', 'anxiety'
     */
    simulateCondition(condition) {
        const conditions = {
            normal: {
                rate: 4000,
                oxygenIncrease: 10,
                oxygenDecrease: 5
            },
            exercise: {
                rate: 2000,
                oxygenIncrease: 15,
                oxygenDecrease: 8
            },
            sleep: {
                rate: 6000,
                oxygenIncrease: 8,
                oxygenDecrease: 3
            },
            anxiety: {
                rate: 1500,
                oxygenIncrease: 12,
                oxygenDecrease: 10
            }
        };
        
        const config = conditions[condition] || conditions.normal;
        
        this.setBreathingRate(config.rate);
        this.config.oxygenIncrease = config.oxygenIncrease;
        this.config.oxygenDecrease = config.oxygenDecrease;
    }

    /**
     * Get current simulation state
     * @returns {Object} Current state information
     */
    getState() {
        return {
            isRunning: this.isRunning,
            oxygenLevel: this.oxygenLevel,
            breathingRate: this.breathingRate
        };
    }

    /**
     * Reset simulation to initial state
     */
    reset() {
        this.stopSimulation();
        this.oxygenLevel = 50;
        this.simulateCondition('normal');
        this.updateOxygenDisplay();
    }
}