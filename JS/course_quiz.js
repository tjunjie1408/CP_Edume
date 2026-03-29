class CourseQuizManager {
    constructor(chapterId) {
        this.chapterId = chapterId;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {}; // Format: { questionId: 'A', ... }
        
        // UI Elements
        this.quizWrapper = document.getElementById('quizWrapper');
        this.startQuizBtn = document.getElementById('startQuizBtn');
        this.quizTitle = document.getElementById('quizTitle');
        this.quizContent = document.getElementById('quizContent');
        this.quizResults = document.querySelector('.quiz-results');
        this.questionText = document.getElementById('quizQuestion');
        this.optionsContainer = document.getElementById('quizOptions');
        this.progressFill = document.getElementById('quizProgressFill');
        this.questionNumberLabel = document.getElementById('questionNumber');
        
        // Buttons
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.closeQuizBtn = document.getElementById('closeQuizBtn');
        this.retakeBtn = document.getElementById('retakeBtn');
        this.continueBtn = document.getElementById('continueBtn');
        
        this.initEventListeners();
    }

    initEventListeners() {
        if(this.startQuizBtn) {
            this.startQuizBtn.addEventListener('click', () => this.startQuiz());
        }
        if(this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevQuestion());
        if(this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextQuestion());
        if(this.submitBtn) this.submitBtn.addEventListener('click', () => this.submitQuiz());
        if(this.closeQuizBtn) this.closeQuizBtn.addEventListener('click', () => this.closeQuiz());
        if(this.retakeBtn) this.retakeBtn.addEventListener('click', () => this.startQuiz());
        if(this.continueBtn) this.continueBtn.addEventListener('click', () => this.navigateToNextChapter());
    }

    async startQuiz() {
        try {
            // Hide other content visually, show quiz wrapper
            document.querySelectorAll('.content-section').forEach(sec => {
                if (sec.id !== 'quizWrapper') sec.style.display = 'none';
            });
            this.quizWrapper.style.display = 'block';
            this.quizContent.style.display = 'block';
            this.quizResults.style.display = 'none';
            this.startQuizBtn.innerHTML = '<span class="material-symbols-rounded loading">refresh</span> Loading...';
            this.startQuizBtn.disabled = true;

            const response = await fetch(`${window.AppConfig.baseUrl}/student/course_details/get_quiz_api.php?chapter_id=${this.chapterId}`);
            const data = await response.json();

            if (data.status === 200 && data.data.length > 0) {
                this.questions = data.data;
                this.currentQuestionIndex = 0;
                this.userAnswers = {};
                this.renderQuestion();
            } else {
                alert('No quiz available for this chapter yet.');
                this.closeQuiz();
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
            alert('Failed to load quiz. Please try again later.');
            this.closeQuiz();
        } finally {
            this.startQuizBtn.innerHTML = 'Start Exercises';
            this.startQuizBtn.disabled = false;
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        this.questionNumberLabel.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        const pct = ((this.currentQuestionIndex) / this.questions.length) * 100;
        this.progressFill.style.width = `${pct}%`;
        
        this.questionText.textContent = q.question;
        this.optionsContainer.innerHTML = '';
        
        const optionsList = [
            { id: 'A', text: q.option_a },
            { id: 'B', text: q.option_b },
            { id: 'C', text: q.option_c },
            { id: 'D', text: q.option_d }
        ];

        optionsList.forEach(opt => {
            if (!opt.text) return; // Skip empty options
            const div = document.createElement('div');
            div.className = 'quiz-option';
            
            const isChecked = this.userAnswers[q.id] === opt.id ? 'checked' : '';
            
            const escapedText = opt.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            
            div.innerHTML = `
                <input type="radio" id="opt_${opt.id}" name="quiz_answer" value="${opt.id}" ${isChecked}>
                <label for="opt_${opt.id}">${opt.id}. ${escapedText}</label>
            `;
            
            div.addEventListener('click', () => {
                const radio = div.querySelector('input');
                radio.checked = true;
                this.userAnswers[q.id] = opt.id;
                this.updateNavButtons();
            });
            
            this.optionsContainer.appendChild(div);
        });

        this.updateNavButtons();
    }

    updateNavButtons() {
        const hasAnsweredCurrent = !!this.userAnswers[this.questions[this.currentQuestionIndex].id];
        
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = 'inline-block';
            this.submitBtn.disabled = !hasAnsweredCurrent;
        } else {
            this.nextBtn.style.display = 'inline-block';
            this.submitBtn.style.display = 'none';
            this.nextBtn.disabled = !hasAnsweredCurrent;
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    }

    async submitQuiz() {
        // Double check all answered
        if (Object.keys(this.userAnswers).length !== this.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        const originalText = this.submitBtn.innerHTML;
        this.submitBtn.innerHTML = '<span class="material-symbols-rounded loading">refresh</span> Validating...';
        this.submitBtn.disabled = true;

        try {
            const response = await fetch(`${window.AppConfig.baseUrl}/student/course_details/validate_quiz_api.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chapter_id: this.chapterId,
                    answers: this.userAnswers
                })
            });

            const result = await response.json();

            if (result.status === 200) {
                this.showResults(result);
            } else {
                alert(result.message || 'Validation failed.');
                this.submitBtn.innerHTML = originalText;
                this.submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Validation Error:', error);
            alert('A network error occurred.');
            this.submitBtn.innerHTML = originalText;
            this.submitBtn.disabled = false;
        }
    }

    showResults(result) {
        this.quizContent.style.display = 'none';
        this.quizResults.style.display = 'block';
        this.progressFill.style.width = '100%';

        document.getElementById('finalScore').textContent = `${result.correct_count}/${result.total_questions}`;
        document.getElementById('scorePercentage').textContent = `${result.score_percentage}%`;

        const correctItem = document.querySelector('.result-item.correct .result-text');
        const incorrectItem = document.querySelector('.result-item.incorrect .result-text');
        
        correctItem.textContent = `${result.correct_count} Correct`;
        incorrectItem.textContent = `${result.total_questions - result.correct_count} Incorrect`;

        const perfText = document.getElementById('performanceText');
        if (result.passed) {
            perfText.textContent = '🎉 Excellent work! You passed this chapter!';
            perfText.style.color = '#2ecc71';
            // Update continue button text
            if (this.continueBtn) this.continueBtn.textContent = 'Next Chapter →';
        } else {
            perfText.textContent = '💪 Keep learning! Review the material and try again. You need 50% to pass.';
            perfText.style.color = '#f39c12';
            // Change continue to "Review Material"
            if (this.continueBtn) this.continueBtn.textContent = 'Review Material';
        }
    }

    closeQuiz() {
        this.quizWrapper.style.display = 'none';
        document.querySelectorAll('.content-section').forEach(sec => {
            if (sec.id !== 'quizWrapper') sec.style.display = 'block';
        });
        
        // Reload page to reflect new progress if they completed it
        if(this.quizResults.style.display === 'block') {
             window.location.reload();
        }
    }

    navigateToNextChapter() {
        const chapters = window.AppConfig?.chapters || [];
        const currentId = this.chapterId;
        const courseId = window.AppConfig?.courseId;
        
        // Find the current chapter's order
        const currentChapter = chapters.find(ch => ch.id == currentId);
        if (!currentChapter || !courseId) {
            window.location.reload();
            return;
        }
        
        // Find the next chapter by order
        const nextChapter = chapters
            .filter(ch => ch.order > currentChapter.order)
            .sort((a, b) => a.order - b.order)[0];
        
        if (nextChapter) {
            // Navigate to next chapter
            window.location.href = `${window.AppConfig.baseUrl}/student/course_details/course_details.php?id=${courseId}&chapter=${nextChapter.id}`;
        } else {
            // Last chapter — go back to course page
            alert('🎉 Congratulations! You have completed all chapters!');
            window.location.href = `${window.AppConfig.baseUrl}/student/course/course.php`;
        }
    }
}

// Instantiate on load if we have a chapter ID
document.addEventListener('DOMContentLoaded', () => {
    // Get chapter ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get('chapter');
    
    if (chapterId) {
        window.courseQuiz = new CourseQuizManager(chapterId);
    }
});
