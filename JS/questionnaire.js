const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const questionText = document.getElementById('question-text');
const questionCount = document.getElementById('question-count');
const optionsList = document.getElementById('options-list');
const progressBar = document.getElementById('progress');

let currentQuestionIndex = 0;
let scores = { V: 0, A: 0, R: 0, K: 0 };

// 8 Questions related to Programming Habits adapted from VARK
const questions = [
    {
        question: "1. You are debugging a complex error in your code. You would prefer to:",
        options: [
            { text: "Draw a diagram of the data flow to see where it breaks.", type: "V" },
            { text: "Explain the code logic out loud to a colleague (or rubber duck).", type: "A" },
            { text: "Read the error logs and stack trace lines carefully.", type: "R" },
            { text: "Comment out code blocks and run it repeatedly to test changes.", type: "K" }
        ]
    },
    {
        question: "2. You want to learn a new web framework (e.g., React or Vue). You would:",
        options: [
            { text: "Look at architecture diagrams and component trees.", type: "V" },
            { text: "Listen to a podcast or watch a lecture explaining the concepts.", type: "A" },
            { text: "Read the official documentation and API references.", type: "R" },
            { text: "Download a starter project and start coding immediately.", type: "K" }
        ]
    },
    {
        question: "3. You are buying a new mechanical keyboard for coding. What influences you most?",
        options: [
            { text: "It looks cool and has great RGB lighting.", type: "V" },
            { text: "The sound of the switches (clicky vs silent).", type: "A" },
            { text: "Reading the technical specs and reviews online.", type: "R" },
            { text: "Testing how the keys feel under your fingers.", type: "K" }
        ]
    },
    {
        question: "4. A senior developer is explaining a new system feature to you. You prefer if they:",
        options: [
            { text: "Show you a whiteboard sketch or graph.", type: "V" },
            { text: "Talk through the logic and answer your questions.", type: "A" },
            { text: "Send you a written specification or wiki page.", type: "R" },
            { text: "Let you play with the prototype or demo.", type: "K" }
        ]
    },
    {
        question: "5. You need to remember a complex Git command. You usually:",
        options: [
            { text: "Visualize where it is in your Git GUI client.", type: "V" },
            { text: "Repeat the command name in your head.", type: "A" },
            { text: "Look it up in your personal cheat sheet/notes.", type: "R" },
            { text: "Type it from muscle memory without thinking.", type: "K" }
        ]
    },
    {
        question: "6. You are reviewing a friend's code. Your feedback usually focuses on:",
        options: [
            { text: "Indentation, formatting, and how the code looks.", type: "V" },
            { text: "Discussing why they chose that approach.", type: "A" },
            { text: "Writing detailed comments on their Pull Request.", type: "R" },
            { text: "Pulling their branch and running it to see how it behaves.", type: "K" }
        ]
    },
    {
        question: "7. You encounter a new API. To understand it, you first:",
        options: [
            { text: "Look for a sequence diagram or visual flowchart.", type: "V" },
            { text: "Ask a teammate who has used it before.", type: "A" },
            { text: "Read the README file and text descriptions.", type: "R" },
            { text: "Use Postman or Curl to send requests and see what happens.", type: "K" }
        ]
    },
    {
        question: "8. You are planning the database structure for a project. You start by:",
        options: [
            { text: "Drawing an ERD (Entity Relationship Diagram).", type: "V" },
            { text: "Discussing the data relationships with your team.", type: "A" },
            { text: "Writing out the SQL schemas or list of tables.", type: "R" },
            { text: "Creating tables in the database admin tool directly.", type: "K" }
        ]
    }
];

// Start questionnaire
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    currentQuestionIndex = 0;
    scores = { V: 0, A: 0, R: 0, K: 0 };
    loadQuestion();
});

// Load Question
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;
    questionCount.innerText = `${currentQuestionIndex + 1} / ${questions.length}`;
    
    // Update Progress Bar
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    optionsList.innerHTML = ''; // Clear old options

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(option.type));
        optionsList.appendChild(button);
    });
}

// Handle Selection
function selectOption(type) {
    scores[type]++; // Increment score for chosen type
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    questionScreen.classList.add('hide');
    resultScreen.classList.remove('hide');

    // Calculate Winner
    // Sort keys by value descending
    const sortedScores = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const winnerType = sortedScores[0];
    
    // Update UI text
    const titles = {
        'V': 'Visual (Graphics)',
        'A': 'Aural (Audio)',
        'R': 'Read/Write (Text)',
        'K': 'Kinesthetic (Hands-on)'
    };

    const descriptions = {
        'V': 'You learn code best by seeing flowcharts, diagrams, and color-coded syntax.',
        'A': 'You learn code best by listening to lectures, podcasts, and discussing logic with peers.',
        'R': 'You learn code best by reading documentation, tutorials, and writing your own notes.',
        'K': 'You learn code best by doing—writing code, breaking it, and fixing it manually.'
    };

    document.getElementById('result-title').innerText = titles[winnerType];
    document.getElementById('result-desc').innerText = descriptions[winnerType];

    // Show breakdown numbers
    document.getElementById('score-v').innerText = scores['V'];
    document.getElementById('score-a').innerText = scores['A'];
    document.getElementById('score-r').innerText = scores['R'];
    document.getElementById('score-k').innerText = scores['K'];
    
    // Fill progress bar to 100%
    progressBar.style.width = '100%';
}

// Restart questionnaire
restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('hide');
    startScreen.classList.remove('hide');
});