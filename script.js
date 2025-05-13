document.addEventListener('DOMContentLoaded', function() {
    // Initialize image map
    $('img[usemap]').rwdImageMaps();
    
    // Navigation smooth scrolling
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Breath button animation
    const breathBtn = document.getElementById('breathBtn');
    const breathAnimation = document.getElementById('breathAnimation');
    
    if (breathBtn && breathAnimation) {
        breathBtn.addEventListener('click', function() {
            breathAnimation.style.opacity = '1';
            breathAnimation.style.transform = 'scale(1.5)';
            
            setTimeout(() => {
                breathAnimation.style.opacity = '0';
                breathAnimation.style.transform = 'scale(0.5)';
            }, 2000);
            
            setTimeout(() => {
                breathAnimation.style.opacity = '0';
                breathAnimation.style.transform = 'scale(1)';
            }, 4000);
        });
    }
    
    // Anatomy diagram interactivity
    const anatomyInfo = {
        nose: {
            title: "Nose",
            description: "The nose is the primary entrance for air into the respiratory system. The hairs inside the nose help filter out large particles from the air we breathe.",
            funFact: "Your nose can remember 50,000 different scents!"
        },
        pharynx: {
            title: "Pharynx (Throat)",
            description: "The pharynx is a muscular tube that serves as a passageway for both air and food. It connects the nasal cavity and mouth to the larynx and esophagus.",
            funFact: "The pharynx plays a role in both respiration and digestion."
        },
        larynx: {
            title: "Larynx (Voice Box)",
            description: "The larynx contains the vocal cords and is responsible for sound production. It also prevents food from entering the lower respiratory tract.",
            funFact: "Men typically have larger larynxes, which is why they usually have deeper voices."
        },
        trachea: {
            title: "Trachea (Windpipe)",
            description: "The trachea is a tube about 4-5 inches long and 1 inch in diameter that carries air to the bronchi. It's reinforced with C-shaped cartilage rings to keep it open.",
            funFact: "The trachea can expand up to 3 times its normal size when you take a deep breath!"
        },
        lungs: {
            title: "Lungs",
            description: "The lungs are paired, cone-shaped organs that take up most of the space in the chest. The right lung has 3 lobes while the left has 2 to make room for the heart.",
            funFact: "If you stretched out all the airways in your lungs, they would cover about 70 square meters - about the size of a tennis court!"
        },
        bronchi: {
            title: "Bronchi",
            description: "The bronchi are the two main branches of the trachea that lead to the lungs. They further divide into smaller bronchioles.",
            funFact: "The right bronchus is wider, shorter, and more vertical than the left, which is why foreign objects are more likely to enter the right lung."
        },
        bronchioles: {
            title: "Bronchioles",
            description: "Bronchioles are small airways that branch off from the bronchi and lead to the alveoli. They can constrict or dilate to control airflow.",
            funFact: "There are about 30,000 bronchioles in each lung!"
        },
        alveoli: {
            title: "Alveoli",
            description: "Alveoli are tiny air sacs where gas exchange occurs. Oxygen diffuses into the blood while carbon dioxide diffuses out.",
            funFact: "There are about 480 million alveoli in adult lungs - that's about the same number as stars in the Milky Way galaxy!"
        },
        diaphragm: {
            title: "Diaphragm",
            description: "The diaphragm is a dome-shaped muscle that separates the chest from the abdomen. Its contraction and relaxation drive the breathing process.",
            funFact: "The diaphragm is the primary muscle used in breathing and accounts for 75% of the air movement in normal breathing."
        }
    };
    
    document.querySelectorAll('area').forEach(area => {
        area.addEventListener('click', function(e) {
            e.preventDefault();
            const part = this.getAttribute('data-info');
            const info = anatomyInfo[part];
            
            document.getElementById('partTitle').textContent = info.title;
            document.getElementById('partDescription').textContent = info.description;
            document.getElementById('partFunFact').innerHTML = `<strong>Fun Fact:</strong> ${info.funFact}`;
        });
    });
    
    // Breathing simulation
    const breatheSimBtn = document.getElementById('breatheSimBtn');
    const lungsSim = document.getElementById('lungsSim');
    const diaphragmSim = document.getElementById('diaphragmSim');
    const oxygenMeter = document.getElementById('oxygenMeter');
    const oxygenValue = document.getElementById('oxygenValue');
    
    if (breatheSimBtn && lungsSim && diaphragmSim && oxygenMeter && oxygenValue) {
        let isBreathing = false;
        let simInterval;
        let oxygenLevel = 50;
        
        breatheSimBtn.addEventListener('click', function() {
            if (!isBreathing) {
                isBreathing = true;
                this.textContent = 'Stop Simulation';
                
                // Start breathing animation
                simInterval = setInterval(() => {
                    // Inhale
                    lungsSim.style.height = '200px';
                    diaphragmSim.style.height = '10px';
                    
                    // Increase oxygen level
                    oxygenLevel = Math.min(100, oxygenLevel + 10);
                    oxygenMeter.value = oxygenLevel;
                    oxygenValue.textContent = `${oxygenLevel}%`;
                    
                    setTimeout(() => {
                        // Exhale
                        lungsSim.style.height = '150px';
                        diaphragmSim.style.height = '30px';
                        
                        // Decrease oxygen level
                        oxygenLevel = Math.max(50, oxygenLevel - 5);
                        oxygenMeter.value = oxygenLevel;
                        oxygenValue.textContent = `${oxygenLevel}%`;
                    }, 2000);
                }, 4000);
            } else {
                isBreathing = false;
                this.textContent = 'Start Breathing Simulation';
                clearInterval(simInterval);
                
                // Reset positions
                lungsSim.style.height = '150px';
                diaphragmSim.style.height = '30px';
            }
        });
    }
    
    // Quiz functionality
    const quizQuestions = [
        {
            question: "What is the primary function of the respiratory system?",
            options: [
                "To pump blood throughout the body",
                "To break down food for energy",
                "To exchange gases between the body and environment",
                "To provide structure and support"
            ],
            answer: 2
        },
        {
            question: "Which structure is known as the voice box?",
            options: [
                "Pharynx",
                "Trachea",
                "Larynx",
                "Bronchus"
            ],
            answer: 2
        },
        {
            question: "Where does gas exchange actually occur in the lungs?",
            options: [
                "Bronchi",
                "Bronchioles",
                "Alveoli",
                "Trachea"
            ],
            answer: 2
        },
        {
            question: "What happens to the diaphragm during inhalation?",
            options: [
                "It relaxes and moves up",
                "It contracts and moves down",
                "It doesn't move during breathing",
                "It expands sideways"
            ],
            answer: 1
        },
        {
            question: "Which of these is NOT part of the respiratory system?",
            options: [
                "Nasal cavity",
                "Esophagus",
                "Trachea",
                "Bronchioles"
            ],
            answer: 1
        }
    ];
    
    const quizProgress = document.getElementById('quizProgress');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const quizResult = document.getElementById('quizResult');
    
    if (quizProgress && quizQuestion && quizOptions && nextQuestionBtn && quizResult) {
        let currentQuestion = 0;
        let score = 0;
        let selectedOption = null;
        
        function loadQuestion() {
            if (currentQuestion >= quizQuestions.length) {
                showResults();
                return;
            }
            
            const question = quizQuestions[currentQuestion];
            quizProgress.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
            quizQuestion.textContent = question.question;
            
            quizOptions.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('quiz-option');
                optionElement.textContent = option;
                optionElement.addEventListener('click', () => selectOption(index));
                quizOptions.appendChild(optionElement);
            });
            
            nextQuestionBtn.disabled = true;
            quizResult.textContent = '';
        }
        
        function selectOption(index) {
            // Remove selected class from all options
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            const options = document.querySelectorAll('.quiz-option');
            options[index].classList.add('selected');
            selectedOption = index;
            
            nextQuestionBtn.disabled = false;
        }
        
        nextQuestionBtn.addEventListener('click', function() {
            const question = quizQuestions[currentQuestion];
            
            // Check if answer is correct
            if (selectedOption === question.answer) {
                score++;
                quizResult.textContent = 'Correct!';
                quizResult.style.color = 'green';
            } else {
                quizResult.textContent = `Incorrect. The correct answer is: ${question.options[question.answer]}`;
                quizResult.style.color = 'red';
            }
            
            // Highlight correct answer
            const options = document.querySelectorAll('.quiz-option');
            options.forEach((option, index) => {
                if (index === question.answer) {
                    option.classList.add('correct');
                } else if (index === selectedOption && index !== question.answer) {
                    option.classList.add('incorrect');
                }
            });
            
            // Disable further selection
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.style.pointerEvents = 'none';
            });
            
            // Prepare for next question
            nextQuestionBtn.textContent = currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next Question';
            nextQuestionBtn.disabled = true;
            
            currentQuestion++;
        });
        
        function showResults() {
            quizQuestion.textContent = `Quiz Completed!`;
            quizOptions.innerHTML = '';
            quizProgress.textContent = '';
            nextQuestionBtn.style.display = 'none';
            
            const percentage = Math.round((score / quizQuestions.length) * 100);
            let message = '';
            
            if (percentage >= 80) {
                message = `Excellent! You scored ${score} out of ${quizQuestions.length} (${percentage}%). You really know your respiratory system!`;
            } else if (percentage >= 60) {
                message = `Good job! You scored ${score} out of ${quizQuestions.length} (${percentage}%). You have a decent understanding of the respiratory system.`;
            } else {
                message = `You scored ${score} out of ${quizQuestions.length} (${percentage}%). Consider reviewing the material and trying again.`;
            }
            
            quizResult.textContent = message;
            quizResult.style.color = '#2c3e50';
            
            // Add restart button
            const restartBtn = document.createElement('button');
            restartBtn.textContent = 'Restart Quiz';
            restartBtn.classList.add('interactive-btn');
            restartBtn.addEventListener('click', restartQuiz);
            quizResult.appendChild(document.createElement('br'));
            quizResult.appendChild(restartBtn);
        }
        
        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            selectedOption = null;
            nextQuestionBtn.style.display = 'inline-block';
            nextQuestionBtn.textContent = 'Next Question';
            loadQuestion();
        }
        
        // Initialize quiz
        loadQuestion();
    }
    
    // Set first nav link as active on page load
    const firstNavLink = document.querySelector('nav a');
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }
});