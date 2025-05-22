/**
 * Interactive quiz module for testing respiratory system knowledge
 */

import { utils } from './utils.js';
import { getRandomQuestions, quizConfig, getFeedback } from '../data/quizData.js';

export class Quiz {
    constructor(options = {}) {
        this.container = utils.getElementById('quiz');
        this.progressElement = utils.getElementById('quizProgress');
        this.questionElement = utils.getElementById('quizQuestion');
        this.optionsContainer = utils.getElementById('quizOptions');
        this.nextButton = utils.getElementById('nextQuestionBtn');
        this.resultElement = utils.getElementById('quizResult');
        
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedOption = null;
        this.answers = [];
        this.startTime = null;
        this.endTime = null;
        this.isComplete = false;
        
        this.config = {
            questionCount: options.questionCount || 5,
            difficulty: options.difficulty || null,
            showExplanations: options.showExplanations !== false,
            timeLimit: options.timeLimit || null,
            randomizeOptions: options.randomizeOptions !== false
        };
        
        this.init();
    }

    /**
     * Initialize the quiz
     */
    init() {
        if (!this.container) {
            utils.logError('Quiz', new Error('Quiz container not found'));
            return;
        }

        this.loadQuestions();
        this.bindEvents();
        this.startQuiz();
    }

    /**
     * Load quiz questions
     */
    loadQuestions() {
        this.questions = getRandomQuestions(
            this.config.questionCount, 
            this.config.difficulty
        );
        
        if (this.questions.length === 0) {
            utils.logError('Quiz', new Error('No questions available'));
            return;
        }

        // Randomize option order if enabled
        if (this.config.randomizeOptions) {
            this.questions.forEach(question => {
                this.randomizeQuestionOptions(question);
            });
        }
    }

    /**
     * Randomize the order of options for a question
     * @param {Object} question - Question object
     */
    randomizeQuestionOptions(question) {
        const correctAnswer = question.options[question.correctAnswer];
        const shuffledOptions = [...question.options];
        
        // Fisher-Yates shuffle
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        // Update correct answer index
        question.options = shuffledOptions;
        question.correctAnswer = shuffledOptions.indexOf(correctAnswer);
    }

    /**
     * Bind quiz events
     */
    bindEvents() {
        if (this.nextButton) {
            utils.addEventListenerSafe(this.nextButton, 'click', () => {
                this.handleNextQuestion();
            });
        }
    }

    /**
     * Start the quiz
     */
    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.selectedOption = null;
        this.isComplete = false;
        this.startTime = new Date();
        
        this.loadCurrentQuestion();
    }

    /**
     * Load and display the current question
     */
    loadCurrentQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.completeQuiz();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.selectedOption = null;
        
        this.updateProgress();
        this.displayQuestion(question);
        this.createOptions(question);
        this.updateNextButton();
        this.clearResult();
    }

    /**
     * Update progress display
     */
    updateProgress() {
        if (this.progressElement) {
            const progress = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
            utils.setText(this.progressElement, progress);
        }
    }

    /**
     * Display the current question
     * @param {Object} question - Question object
     */
    displayQuestion(question) {
        if (this.questionElement) {
            utils.setText(this.questionElement, question.question);
        }
    }

    /**
     * Create option buttons for the current question
     * @param {Object} question - Question object
     */
    createOptions(question) {
        if (!this.optionsContainer) return;

        utils.setHTML(this.optionsContainer, '');

        question.options.forEach((option, index) => {
            const optionElement = utils.createElement('div', {
                className: 'quiz-option',
                'data-index': index,
                'tabindex': '0',
                'role': 'button',
                'aria-label': `Option ${index + 1}: ${option}`
            }, option);

            // Click event
            utils.addEventListenerSafe(optionElement, 'click', () => {
                this.selectOption(index);
            });

            // Keyboard support
            utils.addEventListenerSafe(optionElement, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectOption(index);
                }
            });

            this.optionsContainer.appendChild(optionElement);
        });
    }

    /**
     * Handle option selection
     * @param {number} index - Selected option index
     */
    selectOption(index) {
        // Remove selection from all options
        const options = utils.querySelectorAll('.quiz-option');
        options.forEach(option => {
            utils.removeClass(option, 'selected');
        });

        // Select current option
        const selectedElement = options[index];
        if (selectedElement) {
            utils.addClass(selectedElement, 'selected');
            this.selectedOption = index;
            this.updateNextButton();
        }
    }

    /**
     * Update next button state
     */
    updateNextButton() {
        if (this.nextButton) {
            this.nextButton.disabled = this.selectedOption === null;
        }
    }

    /**
     * Handle next question button click
     */
    handleNextQuestion() {
        if (this.selectedOption === null) return;

        const question = this.questions[this.currentQuestion];
        const isCorrect = this.selectedOption === question.correctAnswer;
        
        // Record answer
        this.answers.push({
            questionId: question.id,
            selectedOption: this.selectedOption,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            timeSpent: this.getQuestionTime()
        });

        // Update score
        if (isCorrect) {
            this.score += this.calculateQuestionScore(question);
        }

        // Show feedback
        this.showQuestionFeedback(question, isCorrect);
        
        // Update button text
        const isLastQuestion = this.currentQuestion === this.questions.length - 1;
        utils.setText(this.nextButton, isLastQuestion ? 'See Results' : 'Next Question');
        
        // Move to next question
        this.currentQuestion++;
    }

    /**
     * Calculate score for a question
     * @param {Object} question - Question object
     * @returns {number} Points earned
     */
    calculateQuestionScore(question) {
        let points = quizConfig.pointsPerQuestion;
        
        // Add bonus points based on difficulty
        if (quizConfig.bonusPoints[question.difficulty]) {
            points += quizConfig.bonusPoints[question.difficulty];
        }
        
        return points;
    }

    /**
     * Get time spent on current question
     * @returns {number} Time in seconds
     */
    getQuestionTime() {
        // This would need to be implemented with question start time tracking
        return 0;
    }

    /**
     * Show feedback for the current question
     * @param {Object} question - Question object
     * @param {boolean} isCorrect - Whether answer was correct
     */
    showQuestionFeedback(question, isCorrect) {
        const options = utils.querySelectorAll('.quiz-option');
        
        // Highlight correct and incorrect answers
        options.forEach((option, index) => {
            if (index === question.correctAnswer) {
                utils.addClass(option, 'correct');
            } else if (index === this.selectedOption && !isCorrect) {
                utils.addClass(option, 'incorrect');
            }
            
            // Disable further interaction
            option.style.pointerEvents = 'none';
        });

        // Show result message
        this.showQuestionResult(question, isCorrect);
    }

    /**
     * Show result message for current question
     * @param {Object} question - Question object
     * @param {boolean} isCorrect - Whether answer was correct
     */
    showQuestionResult(question, isCorrect) {
        if (!this.resultElement) return;

        let message = isCorrect ? 'Correct!' : 'Incorrect.';
        
        if (!isCorrect) {
            const correctOption = question.options[question.correctAnswer];
            message += ` The correct answer is: ${correctOption}`;
        }

        // Add explanation if available and enabled
        if (this.config.showExplanations && question.explanation) {
            message += `\n\nExplanation: ${question.explanation}`;
        }

        utils.setText(this.resultElement, message);
        utils.addClass(this.resultElement, isCorrect ? 'correct' : 'incorrect');
        
        // Auto-advance after a delay
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length) {
                this.loadCurrentQuestion();
            } else {
                this.completeQuiz();
            }
        }, 3000);
    }

    /**
     * Clear result display
     */
    clearResult() {
        if (this.resultElement) {
            utils.setText(this.resultElement, '');
            utils.removeClass(this.resultElement, 'correct');
            utils.removeClass(this.resultElement, 'incorrect');
        }
    }

    /**
     * Complete the quiz and show final results
     */
    completeQuiz() {
        this.isComplete = true;
        this.endTime = new Date();
        
        const results = this.calculateResults();
        this.displayResults(results);
    }

    /**
     * Calculate final quiz results
     * @returns {Object} Results object
     */
    calculateResults() {
        const totalQuestions = this.questions.length;
        const correctAnswers = this.answers.filter(a => a.isCorrect).length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const timeTaken = this.endTime - this.startTime;
        const feedback = getFeedback(percentage);
        
        return {
            totalQuestions,
            correctAnswers,
            incorrectAnswers: totalQuestions - correctAnswers,
            score: this.score,
            percentage,
            timeTaken: Math.round(timeTaken / 1000), // in seconds
            feedback,
            passed: percentage >= quizConfig.passingScore
        };
    }

    /**
     * Display final results
     * @param {Object} results - Results object
     */
    displayResults(results) {
        // Update display elements
        if (this.questionElement) {
            utils.setText(this.questionElement, 'Quiz Completed!');
        }
        
        if (this.optionsContainer) {
            utils.setHTML(this.optionsContainer, '');
        }
        
        if (this.progressElement) {
            utils.setText(this.progressElement, '');
        }
        
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }

        // Create results display
        this.createResultsDisplay(results);
    }

    /**
     * Create detailed results display
     * @param {Object} results - Results object
     */
    createResultsDisplay(results) {
        if (!this.resultElement) return;

        const resultsHTML = `
            <div class="quiz-results">
                <h3>Your Results</h3>
                <div class="score-summary">
                    <div class="score-circle ${results.feedback.level}">
                        <span class="percentage">${results.percentage}%</span>
                        <span class="score">${results.correctAnswers}/${results.totalQuestions}</span>
                    </div>
                </div>
                <div class="feedback-message">
                    <p>${results.feedback.message}</p>
                </div>
                <div class="stats">
                    <div class="stat">
                        <label>Time Taken:</label>
                        <span>${this.formatTime(results.timeTaken)}</span>
                    </div>
                    <div class="stat">
                        <label>Correct Answers:</label>
                        <span>${results.correctAnswers}</span>
                    </div>
                    <div class="stat">
                        <label>Score:</label>
                        <span>${results.score} points</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="interactive-btn" id="restartQuiz">Take Quiz Again</button>
                    <button class="interactive-btn secondary" id="reviewAnswers">Review Answers</button>
                </div>
            </div>
        `;

        utils.setHTML(this.resultElement, resultsHTML);
        
        // Bind result actions
        this.bindResultActions();
    }

    /**
     * Bind actions for results display
     */
    bindResultActions() {
        const restartBtn = utils.getElementById('restartQuiz');
        const reviewBtn = utils.getElementById('reviewAnswers');
        
        if (restartBtn) {
            utils.addEventListenerSafe(restartBtn, 'click', () => {
                this.restart();
            });
        }
        
        if (reviewBtn) {
            utils.addEventListenerSafe(reviewBtn, 'click', () => {
                this.showReview();
            });
        }
    }

    /**
     * Format time in MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Restart the quiz
     */
    restart() {
        // Reset button display
        if (this.nextButton) {
            this.nextButton.style.display = 'inline-block';
            utils.setText(this.nextButton, 'Next Question');
        }
        
        // Reload questions and restart
        this.loadQuestions();
        this.startQuiz();
    }

    /**
     * Show answer review
     */
    showReview() {
        if (!this.resultElement) return;

        let reviewHTML = '<div class="answer-review"><h3>Answer Review</h3>';
        
        this.questions.forEach((question, index) => {
            const answer = this.answers[index];
            const isCorrect = answer && answer.isCorrect;
            
            reviewHTML += `
                <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <h4>Question ${index + 1}</h4>
                    <p class="question-text">${question.question}</p>
                    <p class="your-answer">
                        Your answer: ${question.options[answer.selectedOption]}
                        <span class="result">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                    </p>
                    ${!isCorrect ? `<p class="correct-answer">Correct answer: ${question.options[question.correctAnswer]}</p>` : ''}
                    ${question.explanation ? `<p class="explanation">${question.explanation}</p>` : ''}
                </div>
            `;
        });
        
        reviewHTML += `
            <div class="review-actions">
                <button class="interactive-btn" id="backToResults">Back to Results</button>
            </div>
        </div>`;
        
        utils.setHTML(this.resultElement, reviewHTML);
        
        // Bind back button
        const backBtn = utils.getElementById('backToResults');
        if (backBtn) {
            utils.addEventListenerSafe(backBtn, 'click', () => {
                const results = this.calculateResults();
                this.displayResults(results);
            });
        }
    }

    /**
     * Get quiz statistics
     * @returns {Object} Quiz statistics
     */
    getStats() {
        return {
            isComplete: this.isComplete,
            currentQuestion: this.currentQuestion,
            totalQuestions: this.questions.length,
            score: this.score,
            answers: this.answers
        };
    }
}