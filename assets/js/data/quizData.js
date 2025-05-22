/**
 * Quiz questions and answers for the respiratory system
 */

export const quizQuestions = [
    {
        id: 1,
        question: "What is the primary function of the respiratory system?",
        options: [
            "To pump blood throughout the body",
            "To break down food for energy",
            "To exchange gases between the body and environment",
            "To provide structure and support"
        ],
        correctAnswer: 2,
        explanation: "The respiratory system's main job is to bring oxygen into the body and remove carbon dioxide through gas exchange.",
        difficulty: "easy",
        category: "function"
    },
    {
        id: 2,
        question: "Which structure is known as the voice box?",
        options: [
            "Pharynx",
            "Trachea",
            "Larynx",
            "Bronchus"
        ],
        correctAnswer: 2,
        explanation: "The larynx contains the vocal cords and is responsible for sound production, earning it the nickname 'voice box'.",
        difficulty: "easy",
        category: "anatomy"
    },
    {
        id: 3,
        question: "Where does gas exchange actually occur in the lungs?",
        options: [
            "Bronchi",
            "Bronchioles",
            "Alveoli",
            "Trachea"
        ],
        correctAnswer: 2,
        explanation: "Alveoli are tiny air sacs surrounded by capillaries where oxygen and carbon dioxide are exchanged between air and blood.",
        difficulty: "medium",
        category: "physiology"
    },
    {
        id: 4,
        question: "What happens to the diaphragm during inhalation?",
        options: [
            "It relaxes and moves up",
            "It contracts and moves down",
            "It doesn't move during breathing",
            "It expands sideways"
        ],
        correctAnswer: 1,
        explanation: "During inhalation, the diaphragm contracts and flattens, moving downward to increase chest cavity volume.",
        difficulty: "medium",
        category: "physiology"
    },
    {
        id: 5,
        question: "Which of these is NOT part of the respiratory system?",
        options: [
            "Nasal cavity",
            "Esophagus",
            "Trachea",
            "Bronchioles"
        ],
        correctAnswer: 1,
        explanation: "The esophagus is part of the digestive system, carrying food from the throat to the stomach.",
        difficulty: "easy",
        category: "anatomy"
    },
    {
        id: 6,
        question: "How many lobes does the right lung have?",
        options: [
            "1",
            "2", 
            "3",
            "4"
        ],
        correctAnswer: 2,
        explanation: "The right lung has three lobes (upper, middle, lower), while the left lung has only two to make room for the heart.",
        difficulty: "medium",
        category: "anatomy"
    },
    {
        id: 7,
        question: "What is the approximate number of alveoli in adult lungs?",
        options: [
            "480 thousand",
            "48 million",
            "480 million",
            "4.8 billion"
        ],
        correctAnswer: 2,
        explanation: "There are approximately 480 million alveoli in adult lungs, providing an enormous surface area for gas exchange.",
        difficulty: "hard",
        category: "anatomy"
    },
    {
        id: 8,
        question: "Which gas is primarily removed from the blood in the lungs?",
        options: [
            "Oxygen",
            "Carbon dioxide",
            "Nitrogen",
            "Carbon monoxide"
        ],
        correctAnswer: 1,
        explanation: "Carbon dioxide, a waste product of cellular metabolism, is removed from the blood and exhaled through the lungs.",
        difficulty: "easy",
        category: "physiology"
    },
    {
        id: 9,
        question: "What prevents food from entering the respiratory tract during swallowing?",
        options: [
            "Uvula",
            "Epiglottis",
            "Soft palate",
            "Vocal cords"
        ],
        correctAnswer: 1,
        explanation: "The epiglottis is a flap of tissue that covers the larynx opening during swallowing to prevent aspiration.",
        difficulty: "medium",
        category: "anatomy"
    },
    {
        id: 10,
        question: "What is the normal breathing rate for adults at rest?",
        options: [
            "8-10 breaths per minute",
            "12-20 breaths per minute",
            "25-30 breaths per minute",
            "35-40 breaths per minute"
        ],
        correctAnswer: 1,
        explanation: "The normal respiratory rate for adults at rest is 12-20 breaths per minute.",
        difficulty: "medium",
        category: "physiology"
    }
];

/**
 * Get questions by difficulty level
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Array} Filtered questions
 */
export function getQuestionsByDifficulty(difficulty) {
    return quizQuestions.filter(q => q.difficulty === difficulty);
}

/**
 * Get questions by category
 * @param {string} category - 'anatomy', 'physiology', or 'function'
 * @returns {Array} Filtered questions
 */
export function getQuestionsByCategory(category) {
    return quizQuestions.filter(q => q.category === category);
}

/**
 * Get random questions
 * @param {number} count - Number of questions to return
 * @param {string} difficulty - Optional difficulty filter
 * @returns {Array} Random questions
 */
export function getRandomQuestions(count = 5, difficulty = null) {
    let questionPool = difficulty ? 
        getQuestionsByDifficulty(difficulty) : 
        [...quizQuestions];
    
    // Shuffle questions
    for (let i = questionPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionPool[i], questionPool[j]] = [questionPool[j], questionPool[i]];
    }
    
    return questionPool.slice(0, Math.min(count, questionPool.length));
}

/**
 * Quiz scoring configuration
 */
export const quizConfig = {
    passingScore: 70,
    timeLimit: 300, // 5 minutes in seconds
    pointsPerQuestion: 10,
    bonusPoints: {
        easy: 0,
        medium: 2,
        hard: 5
    },
    feedback: {
        excellent: { threshold: 90, message: "Excellent! You really know your respiratory system!" },
        good: { threshold: 70, message: "Good job! You have a solid understanding of the respiratory system." },
        needsWork: { threshold: 50, message: "You're getting there! Review the material and try again." },
        poor: { threshold: 0, message: "Consider reviewing the material more thoroughly before trying again." }
    }
};

/**
 * Get feedback based on score percentage
 * @param {number} percentage - Score percentage
 * @returns {Object} Feedback object
 */
export function getFeedback(percentage) {
    const { feedback } = quizConfig;
    
    if (percentage >= feedback.excellent.threshold) {
        return { level: 'excellent', ...feedback.excellent };
    } else if (percentage >= feedback.good.threshold) {
        return { level: 'good', ...feedback.good };
    } else if (percentage >= feedback.needsWork.threshold) {
        return { level: 'needs-work', ...feedback.needsWork };
    } else {
        return { level: 'poor', ...feedback.poor };
    }
}