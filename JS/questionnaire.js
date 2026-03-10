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
// Updated scores object to match database enums
let scores = { visual: 0, read: 0, kinesthetic: 0 };

// 8 Questions adapted for VA (Visual-Audio), R (Read/Write), K (Kinesthetic)
const questions = [
    {
        question: "1. You are debugging a complex error. You prefer to:",
        options: [
            { text: "Draw a diagram while talking through the logic with a colleague.", type: "visual" },
            { text: "Read the error logs, stack trace, and documentation.", type: "read" },
            { text: "Comment out code blocks and run the program repeatedly.", type: "kinesthetic" }
        ]
    },
    {
        question: "2. You want to learn a new web framework (e.g., React). You would:",
        options: [
            { text: "Watch a video tutorial or live coding stream explaining the architecture.", type: "visual" },
            { text: "Read the official documentation and API references.", type: "read" },
            { text: "Download a starter project and start experimenting immediately.", type: "kinesthetic" }
        ]
    },
    {
        question: "3. You are buying a new keyboard. What convinces you to buy?",
        options: [
            { text: "Watching a video review to hear the sound and see the lighting effects.", type: "visual" },
            { text: "Reading the technical specifications and written reviews.", type: "read" },
            { text: "Testing how the keys feel under your fingers in a store.", type: "kinesthetic" }
        ]
    },
    {
        question: "4. A senior developer is explaining a feature. You prefer if they:",
        options: [
            { text: "Use a whiteboard to sketch the flow while explaining it verbally.", type: "visual" },
            { text: "Send you a written specification or a detailed wiki page.", type: "read" },
            { text: "Let you play with the prototype or demo while they watch.", type: "kinesthetic" }
        ]
    },
    {
        question: "5. You need to remember a complex Git command. You usually:",
        options: [
            { text: "Visualize the command's effect or say the command name aloud.", type: "visual" },
            { text: "Look it up in your personal notes or cheat sheet.", type: "read" },
            { text: "Type it from muscle memory without consciously thinking.", type: "kinesthetic" }
        ]
    },
    {
        question: "6. You are reviewing a friend's code. You prefer:",
        options: [
            { text: "Getting on a call to discuss the logic while looking at the screen.", type: "visual" },
            { text: "Writing detailed comments on their Pull Request.", type: "read" },
            { text: "Pulling their branch to your machine and running it.", type: "kinesthetic" }
        ]
    },
    {
        question: "7. You encounter a new API. To understand it, you first:",
        options: [
            { text: "Ask a teammate to demonstrate it or look for a diagram.", type: "visual" },
            { text: "Read the README file and text descriptions.", type: "read" },
            { text: "Use Postman or Curl to send requests and see the response.", type: "kinesthetic" }
        ]
    },
    {
        question: "8. You are planning a database structure. You start by:",
        options: [
            { text: "Brainstorming with the team using a whiteboard or chart.", type: "visual" },
            { text: "Writing out the SQL schemas or list of tables.", type: "read" },
            { text: "Creating tables in the database admin tool directly.", type: "kinesthetic" }
        ]
    }
];

// Start questionnaire
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    currentQuestionIndex = 0;
    scores = { visual: 0, read: 0, kinesthetic: 0 };
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
        // Pass the new type (VA, R, or K)
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
    const sortedScores = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const winnerType = sortedScores[0];
    
    // Update UI text for 3 types
    const titles = {
        'visual': 'Visual-Audio',
        'read': 'Read/Write (Text based)',
        'kinesthetic': 'Kinesthetic (Hands-on)'
    };

    const descriptions = {
        'visual': 'You learn best by combining sight and sound—watching video tutorials, looking at diagrams while listening to explanations, and discussing code logic with others.',
        'read': 'You learn code best by reading documentation, tutorials, books, and writing your own detailed notes.',
        'kinesthetic': 'You learn code best by doing—writing code immediately, breaking it, debugging it, and learning through trial and error.'
    };

    document.getElementById('result-title').innerText = titles[winnerType];
    document.getElementById('result-desc').innerText = descriptions[winnerType];

    // Show breakdown numbers (Updated IDs)
    document.getElementById('score-VA').innerText = scores['visual'];
    document.getElementById('score-r').innerText = scores['read'];
    document.getElementById('score-k').innerText = scores['kinesthetic'];
    
    // Fill progress bar to 100%
    progressBar.style.width = '100%';

    sendAjax("/Edume/student/questionnaire/save_style_api.php", {
        learnerType: winnerType
    }, function(response){
        if (response.status === 200){
            console.log("Learning style saved successfully");
        } else {
            console.error("Error saving learning style:", response.message);
        }
    });
}

// Restart questionnaire
restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('hide');
    startScreen.classList.remove('hide');
});

function sendAjax(url,data,callback){
    var xhr=new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onreadystatechange=function(){
        if(xhr.readyState===4){
            console.log(xhr.responseText);
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}


