// ============================================
// PYTHON COURSE - MAIN SCRIPT WITH REPORT
// ============================================

// Python Course Data - Three Chapters: Intro, Syntax, Output

const courseChapters = {
  1: {
    id: 1,
    title: "Intro to Python",
    level: "Beginner",
    overview: "Get started with Python programming! Learn what Python is, why it's popular, and how to set up your development environment.",
    objectives: [
      "What is Python",
      "Why Learn Python",
      "Python Installation",
      "Python Quick Start"
    ],
    content: `
      <h4>What is Python?</h4>
      <p>Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python has become one of the most popular programming languages in the world.</p>
      
      <h4>Why Learn Python?</h4>
      <ul>
        <li><strong>Easy to Learn:</strong> Python's syntax is simple and intuitive, making it perfect for beginners</li>
        <li><strong>Versatile:</strong> Used in web development, data science, AI, automation, and more</li>
        <li><strong>Large Community:</strong> Extensive libraries and active community support</li>
        <li><strong>In-Demand:</strong> One of the most sought-after programming languages in the job market</li>
      </ul>
      
      <h4>Getting Started</h4>
      <p>Python is available for Windows, Mac, and Linux. You can download it from python.org and install it on your computer. Once installed, you can run Python scripts from the command line or use an Integrated Development Environment (IDE) like PyCharm or VS Code.</p>
    `,
    resources: {
      VA: [
        {
          title: "Python Introduction",
          description: "Learn Python basics from scratch - comprehensive video tutorial",
          url: "https://youtu.be/QoIRX37VZpo?si=ftwUEqstmadR2VIL",
          duration: "2 minutes",
          type: "video"
        }
      ],
      R: [],
      K: {
        title: "Interactive Python Playground",
        description: "Write and execute Python code in real-time",
        buttonText: "Have A Try",
        link: "python-interactive.html"
      }
    },
    exercises: [
      {
        question: "Who created Python?",
        options: ["Guido van Rossum", "Bjarne Stroustrup", "Dennis Ritchie", "James Gosling"],
        correct: 0,
        explanation: "Guido van Rossum created Python in 1991."
      },
      {
        question: "What type of programming language is Python?",
        options: ["Compiled only", "Interpreted", "Assembly", "Machine code"],
        correct: 1,
        explanation: "Python is an interpreted programming language, meaning code is executed line by line."
      },
      {
        question: "Which of these is a strength of Python?",
        options: ["Fast execution", "Simple and readable syntax", "Complex learning curve", "Limited applications"],
        correct: 1,
        explanation: "Python is known for its simple and readable syntax, making it beginner-friendly."
      }
    ]
  },

  2: {
    id: 2,
    title: "Python Syntax",
    level: "Beginner",
    overview: "Master the fundamental syntax of Python. Learn about variables, indentation, comments, and basic code structure.",
    objectives: [
      "Python Indentation",
      "Variables",
      "Comments",
      "Data Types",
      "Operators"
    ],
    content: `
      <h4>Python Indentation</h4>
      <p>Indentation in Python is used to define code blocks. It is very important because Python relies on indentation to indicate a block of code.</p>
      <pre><code>if 5 > 2:
  print("Five is greater than two")</code></pre>
      
      <h4>Variables</h4>
      <p>Variables are containers for storing data values. Unlike many other programming languages, Python has no command for declaring a variable.</p>
      <pre><code>x = 5
y = "Hello"
z = 3.14</code></pre>
      
      <h4>Comments</h4>
      <p>Comments start with a # character and are used to explain code. Python ignores comments.</p>
      <pre><code># This is a comment
x = 5  # This is also a comment</code></pre>
      
      <h4>Data Types</h4>
      <p>Python has several built-in data types: str, int, float, bool, list, tuple, dict, and set.</p>
      <pre><code>name = "John"  # str
age = 25       # int
height = 5.9   # float
is_student = True  # bool</code></pre>
    `,
    resources: {
      VA: [
        {
          title: "Python Syntax Explained",
          description: "Visual guide to Python syntax and structure",
          url: "https://youtu.be/PNSIWjWAA7o?si=B2AfcSBtYb_2LAhE",
          duration: "25 minutes",
          type: "video"
        }
      ],
      R: [],
      K: {
        title: "Try Python Syntax",
        description: "Practice writing Python variables and understanding indentation",
        buttonText: "Have A Try",
        link: "python-interactive.html"
      }
    },
    exercises: [
      {
        question: "Which symbol is used to start a comment in Python?",
        options: ["//", "#", "/*", "--"],
        correct: 1,
        explanation: "The # symbol is used to start a comment in Python."
      },
      {
        question: "What is used to define code blocks in Python?",
        options: ["Curly braces {}", "Indentation", "Semicolons", "Parentheses ()"],
        correct: 1,
        explanation: "Python uses indentation to define code blocks."
      },
      {
        question: "Which data type is used for whole numbers in Python?",
        options: ["float", "int", "str", "bool"],
        correct: 1,
        explanation: "The int data type is used for whole numbers."
      }
    ]
  },

  3: {
    id: 3,
    title: "Python Output",
    level: "Beginner",
    overview: "Learn how to output data in Python using the print() function. Understand string formatting and how to display results.",
    objectives: [
      "The print() Function",
      "Multiple Arguments",
      "String Concatenation",
      "String Formatting",
      "Escape Characters"
    ],
    content: `
      <h4>The print() Function</h4>
      <p>The print() function is used to output data to the console. It automatically adds a newline at the end.</p>
      <pre><code>print("Hello, World!")
print(25)
print(3.14)</code></pre>
      
      <h4>Multiple Arguments</h4>
      <p>You can print multiple values by separating them with commas.</p>
      <pre><code>print("Hello", "World")
print("Age:", 25)</code></pre>
      
      <h4>String Concatenation</h4>
      <p>You can combine strings using the + operator.</p>
      <pre><code>print("Hello" + " " + "World")
name = "John"
print("Hello " + name)</code></pre>
      
      <h4>String Formatting</h4>
      <p>Use f-strings for modern Python 3.6+ to format strings easily.</p>
      <pre><code>name = "John"
age = 25
print(f"My name is {name} and I am {age} years old")</code></pre>
      
      <h4>Escape Characters</h4>
      <p>Use escape characters to include special characters in strings.</p>
      <pre><code>print("Hello\\nWorld")  # New line
print("Hello\\tWorld")  # Tab
print("Hello\\"World")  # Quote</code></pre>
    `,
    resources: {
      VA: [
        {
          title: "Python Output & Print Function",
          description: "Learn various ways to output data in Python",
          url: "https://www.youtube.com/embed/EL0v8CvJjzs",
          duration: "15 minutes",
          type: "video"
        }
      ],
      R: [],
      K: {
        title: "Practice Output & Formatting",
        description: "Hands-on practice with print() and string formatting",
        buttonText: "Have A Try",
        link: "python-interactive.html"
      }
    },
    exercises: [
      {
        question: "Which function is used to display output in Python?",
        options: ["output()", "display()", "print()", "show()"],
        correct: 2,
        explanation: "The print() function is used to display output in Python."
      },
      {
        question: "How do you combine two strings in Python?",
        options: ["Using the & operator", "Using the + operator", "Using concat()", "Using the . operator"],
        correct: 1,
        explanation: "You can combine strings using the + operator (concatenation)."
      },
      {
        question: "What does the \\n escape character represent?",
        options: ["Space", "Tab", "Newline", "Backslash"],
        correct: 2,
        explanation: "The \\n escape character represents a newline."
      }
    ]
  }
};

// State management
let currentChapter = 1;
let currentQuestion = 0;
let exerciseAnswers = [];
let quizStarted = false;
let correctAnswersCount = 0;
let answerReviewed = false;
let userLearningStyle = 'V';
let chapterProgress = {
  1: { completed: false, score: 0 },
  2: { completed: false, score: 0 },
  3: { completed: false, score: 0 }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  loadUserLearningStyle();
  console.log('User learning style:', userLearningStyle);
  setupPythonPageEventListeners();
  setupReportForm();
  loadChapter(1);
  loadStoredProgress();
});

// ============================================
// PYTHON COURSE FUNCTIONS
// ============================================

function loadUserLearningStyle() {
  const userData = sessionStorage.getItem('userData');
  console.log('userData from sessionStorage:', userData);
  
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      console.log('Parsed userData:', parsedData);
      userLearningStyle = parsedData.learningStyle || 'V';
    } catch (e) {
      console.error('Error parsing userData:', e);
      userLearningStyle = 'V';
    }
  } else {
    userLearningStyle = 'V';
    console.log('No userData found, using default:', userLearningStyle);
  }
  
  console.log('Final learning style:', userLearningStyle);
}

function setupPythonPageEventListeners() {
  console.log('Setting up event listeners');
  
  document.querySelectorAll('.subject-item').forEach(item => {
    item.addEventListener('click', function() {
      const chapterId = parseInt(this.dataset.subject);
      console.log('Chapter selected:', chapterId);
      selectChapter(chapterId);
    });
  });

  const startQuizBtn = document.getElementById('startQuizBtn');
  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
      console.log('Start quiz clicked');
      startExercises(currentChapter);
    });
  }

  document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  document.getElementById('prevBtn').addEventListener('click', previousQuestion);
  document.getElementById('submitBtn').addEventListener('click', submitExercises);
  document.getElementById('closeQuizBtn').addEventListener('click', closeQuiz);
  document.getElementById('retakeBtn').addEventListener('click', retakeExercises);
  document.getElementById('continueBtn').addEventListener('click', closeQuiz);
}

function selectChapter(chapterId) {
  console.log('Selecting chapter:', chapterId);
  
  document.querySelectorAll('.subject-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-subject="${chapterId}"]`).classList.add('active');

  loadChapter(chapterId);
}

function loadChapter(chapterId) {
  console.log('Loading chapter:', chapterId);
  
  const chapter = courseChapters[chapterId];
  if (!chapter) {
    console.error('Chapter not found:', chapterId);
    return;
  }

  currentChapter = chapterId;

  document.getElementById('contentTitle').textContent = chapter.title;
  document.querySelector('.level-badge').textContent = chapter.level;
  document.getElementById('contentOverview').textContent = chapter.overview;

  const objectivesList = document.getElementById('learningObjectives');
  objectivesList.innerHTML = chapter.objectives.map(obj => `<li>${obj}</li>`).join('');

  document.getElementById('lessonContent').innerHTML = chapter.content;

  console.log('Setting up resources section');
  setupResourcesSection(chapter);

  resetQuiz();
  
  document.getElementById('quizWrapper').style.display = 'none';
  document.getElementById('startQuizSection').style.display = 'block';

  // Update report location
  const reportLocation = document.getElementById('reportLocation');
  if (reportLocation) {
    reportLocation.value = chapter.title;
  }
}

function setupResourcesSection(chapter) {
  console.log('Setting up resources for learning style:', userLearningStyle);
  
  const resourcesContainer = document.getElementById('resourcesContainer');
  const learningResourcesSection = document.getElementById('learningResourcesSection');
  
  if (!resourcesContainer) {
    console.error('Resources container not found!');
    return;
  }

  if (!chapter.resources) {
    console.error('No resources in chapter:', chapter.title);
    resourcesContainer.innerHTML = '<p>No resources available</p>';
    return;
  }

  resourcesContainer.innerHTML = '';

  console.log('Resources data:', chapter.resources);

  if (userLearningStyle === 'V' || userLearningStyle === 'A') {
    console.log('Showing video resources');
    const videoResources = chapter.resources.VA || [];
    console.log('Video resources:', videoResources);
    
    if (learningResourcesSection) {
      learningResourcesSection.style.display = 'block';
    }
    
    if (videoResources.length === 0) {
      resourcesContainer.innerHTML = '<p style="color: #999; grid-column: 1/-1;">No video resources available for this chapter.</p>';
    } else {
      renderVideoResources(videoResources, resourcesContainer);
    }
  } 
  else if (userLearningStyle === 'R') {
    console.log('Hiding resources for R learner');
    if (learningResourcesSection) {
      learningResourcesSection.style.display = 'none';
    }
  } 
  else if (userLearningStyle === 'K') {
    console.log('Showing kinesthetic resources');
    const kinestheticResource = chapter.resources.K;
    console.log('Kinesthetic resource:', kinestheticResource);
    
    if (learningResourcesSection) {
      learningResourcesSection.style.display = 'block';
    }
    
    if (kinestheticResource) {
      renderKinestheticResource(kinestheticResource, resourcesContainer);
    }
  }
}

function renderVideoResources(resources, container) {
  console.log('Rendering', resources.length, 'video resources');
  
  resources.forEach((resource, index) => {
    console.log('Creating video resource:', resource.title);
    
    const resourceCard = document.createElement('div');
    resourceCard.className = 'resource-card video-resource';
    resourceCard.innerHTML = `
      <div class="video-thumbnail">
        <iframe 
          width="100%" 
          height="200" 
          src="${resource.url}" 
          title="${resource.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen 
          style="border-radius: 8px;">
        </iframe>
        <span class="video-duration">${resource.duration}</span>
      </div>
      <div class="resource-info">
        <h4>${resource.title}</h4>
        <p>${resource.description}</p>
        <button class="resource-btn watch-btn" onclick="alert('Playing: ${resource.title}')">Watch Now</button>
      </div>
    `;
    
    container.appendChild(resourceCard);
  });
  
  console.log('Video resources rendered');
}

function renderKinestheticResource(resource, container) {
  console.log('Rendering kinesthetic resource:', resource.title);
  
  const resourceCard = document.createElement('div');
  resourceCard.className = 'resource-card kinesthetic-resource';
  resourceCard.innerHTML = `
    <div class="kinesthetic-content">
      <div class="kinesthetic-icon">
        💻
      </div>
      <h4>${resource.title}</h4>
      <p>${resource.description}</p>
      <button class="btn-kinesthetic" onclick="window.location.href='${resource.link}'">
        ${resource.buttonText}
      </button>
    </div>
  `;
  
  container.appendChild(resourceCard);
  console.log('Kinesthetic resource rendered');
}

function startExercises(chapterId) {
  const chapter = courseChapters[chapterId];
  if (!chapter) return;

  quizStarted = true;
  currentQuestion = 0;
  correctAnswersCount = 0;
  answerReviewed = false;
  exerciseAnswers = new Array(chapter.exercises.length).fill(null);

  document.getElementById('quizWrapper').style.display = 'block';
  document.getElementById('startQuizSection').style.display = 'none';

  document.getElementById('quizTitle').textContent = `Exercises: ${chapter.title}`;
  document.querySelector('.quiz-results').style.display = 'none';
  document.querySelector('.quiz-content').style.display = 'flex';
  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'inline-block';

  loadQuestion(0, chapter);

  document.getElementById('quizWrapper').scrollIntoView({ behavior: 'smooth' });
}

function loadQuestion(questionIndex, chapter) {
  const exercise = chapter.exercises[questionIndex];
  
  document.getElementById('quizQuestion').textContent = exercise.question;
  document.getElementById('questionNumber').textContent = `Question ${questionIndex + 1} of ${chapter.exercises.length}`;

  const progressPercent = ((questionIndex + 1) / chapter.exercises.length) * 100;
  document.getElementById('quizProgressFill').style.width = progressPercent + '%';

  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';

  const feedbackElement = document.getElementById('quizFeedback');
  feedbackElement.classList.remove('show', 'correct', 'incorrect');
  feedbackElement.textContent = '';

  answerReviewed = false;

  exercise.options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'quiz-option';
    const inputId = `option${index + 1}`;
    
    div.innerHTML = `
      <input type="radio" id="${inputId}" name="answer" value="${index}">
      <label for="${inputId}">${option}</label>
    `;

    if (exerciseAnswers[questionIndex] === index) {
      div.querySelector('input').checked = true;
    }

    div.addEventListener('change', (e) => {
      if (e.target.checked) {
        exerciseAnswers[questionIndex] = index;
        showFeedback(index, exercise, questionIndex, chapter);
      }
    });

    optionsContainer.appendChild(div);
  });

  document.getElementById('prevBtn').disabled = questionIndex === 0;
  updateNextButtonState();
}

function showFeedback(selectedIndex, exercise, questionIndex, chapter) {
  const feedbackElement = document.getElementById('quizFeedback');
  const isCorrect = selectedIndex === exercise.correct;
  
  answerReviewed = true;
  
  if (isCorrect) {
    correctAnswersCount++;
    feedbackElement.classList.add('show', 'correct');
    feedbackElement.classList.remove('incorrect');
    feedbackElement.innerHTML = `<strong>✓ Correct!</strong> ${exercise.explanation}`;
  } else {
    feedbackElement.classList.add('show', 'incorrect');
    feedbackElement.classList.remove('correct');
    feedbackElement.innerHTML = `<strong>✗ Incorrect.</strong> ${exercise.explanation}`;
  }

  updateNextButtonState();
}

function updateNextButtonState() {
  const hasAnswered = exerciseAnswers[currentQuestion] !== null;
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const chapter = courseChapters[currentChapter];

  if (!hasAnswered) {
    nextBtn.disabled = true;
    submitBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    submitBtn.style.opacity = '0.5';
    nextBtn.title = 'Please answer the question first';
  } else {
    nextBtn.disabled = false;
    submitBtn.disabled = false;
    nextBtn.style.opacity = '1';
    submitBtn.style.opacity = '1';
    nextBtn.title = '';

    if (currentQuestion === chapter.exercises.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
    } else {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
    }
  }
}

function nextQuestion() {
  const chapter = courseChapters[currentChapter];
  
  if (exerciseAnswers[currentQuestion] === null) {
    alert('Please answer the question before moving to the next one.');
    return;
  }

  if (currentQuestion < chapter.exercises.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion, chapter);
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    const chapter = courseChapters[currentChapter];
    loadQuestion(currentQuestion, chapter);
  }
}

function submitExercises() {
  const chapter = courseChapters[currentChapter];
  
  if (exerciseAnswers.includes(null)) {
    alert('Please answer all questions before submitting.');
    return;
  }

  let correctCount = 0;
  chapter.exercises.forEach((exercise, index) => {
    if (exerciseAnswers[index] === exercise.correct) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / chapter.exercises.length) * 100);

  chapterProgress[currentChapter] = {
    completed: true,
    score: percentage
  };

  saveProgress();
  updateChapterProgress(currentChapter, percentage);

  document.querySelector('.quiz-content').style.display = 'none';
  document.querySelector('.quiz-results').style.display = 'block';

  document.getElementById('finalScore').textContent = `${correctCount} / ${chapter.exercises.length}`;
  document.getElementById('scorePercentage').textContent = `${percentage}%`;

  const incorrectCount = chapter.exercises.length - correctCount;
  const correctItem = document.querySelector('.result-item.correct');
  const incorrectItem = document.querySelector('.result-item.incorrect');

  correctItem.innerHTML = `
    <span class="result-icon">✓</span>
    <span class="result-text">${correctCount} Correct Answer${correctCount !== 1 ? 's' : ''}</span>
  `;

  incorrectItem.innerHTML = `
    <span class="result-icon">✕</span>
    <span class="result-text">${incorrectCount} Incorrect Answer${incorrectCount !== 1 ? 's' : ''}</span>
  `;

  setPerformanceMessage(percentage);
}

function setPerformanceMessage(percentage) {
  const messageElement = document.getElementById('performanceText');
  if (!messageElement) return;

  if (percentage === 100) {
    messageElement.textContent = '🌟 Perfect Score! You\'ve mastered this chapter!';
  } else if (percentage >= 80) {
    messageElement.textContent = '🎉 Excellent work! You\'re doing great!';
  } else if (percentage >= 60) {
    messageElement.textContent = '👍 Good effort! Keep practicing to improve!';
  } else {
    messageElement.textContent = '💪 Keep learning! Review the material and try again!';
  }
}

function updateChapterProgress(chapterId, score) {
  const subjectItem = document.querySelector(`[data-subject="${chapterId}"]`);
  if (!subjectItem) return;

  const progressFill = subjectItem.querySelector('.progress-fill');
  progressFill.style.width = score + '%';

  const progressText = subjectItem.querySelector('.progress-text');
  progressText.textContent = score + '%';

  const statusBadge = subjectItem.querySelector('.status-badge');
  if (score === 100) {
    statusBadge.className = 'status-badge completed';
    statusBadge.textContent = '✓ Completed';
  } else if (score >= 50) {
    statusBadge.className = 'status-badge in-progress';
    statusBadge.textContent = '⏳ In Progress';
  } else {
    statusBadge.className = 'status-badge not-started';
    statusBadge.textContent = '○ Not Started';
  }
}

function retakeExercises() {
  startExercises(currentChapter);
}

function closeQuiz() {
  quizStarted = false;
  document.querySelector('.quiz-content').style.display = 'flex';
  document.querySelector('.quiz-results').style.display = 'none';
  document.getElementById('quizWrapper').style.display = 'none';
  document.getElementById('startQuizSection').style.display = 'block';
  resetQuiz();
}

function resetQuiz() {
  currentQuestion = 0;
  exerciseAnswers = [];
  correctAnswersCount = 0;
  answerReviewed = false;
  quizStarted = false;
}

function saveProgress() {
  localStorage.setItem('pythonProgress', JSON.stringify(chapterProgress));
  console.log('Progress saved:', chapterProgress);
}

function loadStoredProgress() {
  const stored = localStorage.getItem('pythonProgress');
  if (stored) {
    chapterProgress = JSON.parse(stored);
    Object.keys(chapterProgress).forEach(key => {
      const score = chapterProgress[key].score;
      updateChapterProgress(parseInt(key), score);
    });
  }
}

// ============================================
// REPORT FORM FUNCTIONS
// ============================================

function setupReportForm() {
  const reportForm = document.getElementById('reportForm');
  const reportContent = document.getElementById('reportContent');
  const charCount = document.getElementById('charCount');
  const reportLocation = document.getElementById('reportLocation');

  if (!reportForm) return;

  // Set initial chapter
  const contentTitle = document.getElementById('contentTitle');
  if (contentTitle && !reportLocation.value) {
    reportLocation.value = contentTitle.textContent;
  }

  // Character counter
  if (reportContent) {
    reportContent.addEventListener('input', function() {
      charCount.textContent = this.value.length;
      
      if (this.value.length > 300) {
        this.value = this.value.substring(0, 300);
        charCount.textContent = '300';
      }
    });
  }

  // Form submission
  reportForm.addEventListener('submit', handleReportSubmit);
}

async function handleReportSubmit(e) {
  e.preventDefault();

  const reportType = document.getElementById('reportType').value;
  const reportContent = document.getElementById('reportContent').value.trim();
  const reportLocation = document.getElementById('reportLocation').value.trim();
  const courseName = document.getElementById('contentTitle')?.textContent || 'Python Course';
  
  if (!reportType) {
    showReportStatus('Please select a report type', 'error');
    return;
  }

  if (!reportContent || reportContent.length < 5) {
    showReportStatus('Please provide at least 5 characters', 'error');
    return;
  }

  try {
    const submitBtn = e.target.querySelector('.btn-report-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-symbols-rounded" style="animation: spin 1s linear infinite;">hourglass_empty</span>Submitting...';

    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

    const reportData = {
      id: Date.now(),
      userName: userData.name || 'Anonymous User',
      userEmail: userData.email || 'user@example.com',
      course: courseName,
      reportType: reportType,
      content: reportContent,
      location: reportLocation,
      submitDate: new Date().toISOString(),
      status: 'pending',
      notes: ''
    };

    saveReportToStorage(reportData);

    showReportStatus('✓ Report submitted successfully!', 'success');

    document.getElementById('reportForm').reset();
    document.getElementById('charCount').textContent = '0';

    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      hideReportStatus();
    }, 2000);

    console.log('Report submitted:', reportData);

  } catch (error) {
    console.error('Error submitting report:', error);
    showReportStatus('Failed to submit report', 'error');
    
    const submitBtn = e.target.querySelector('.btn-report-submit');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="material-symbols-rounded">send</span>Submit';
  }
}

function showReportStatus(message, type) {
  const statusElement = document.getElementById('reportStatus');
  
  statusElement.innerHTML = message;
  statusElement.className = `report-status ${type}`;
  statusElement.style.display = 'flex';

  if (type === 'success') {
    setTimeout(() => {
      hideReportStatus();
    }, 3000);
  }
}

function hideReportStatus() {
  const statusElement = document.getElementById('reportStatus');
  statusElement.style.display = 'none';
}

function saveReportToStorage(reportData) {
  try {
    let reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    reports.push(reportData);
    localStorage.setItem('userReports', JSON.stringify(reports));
    console.log('Report saved to localStorage:', reports);
  } catch (error) {
    console.error('Error saving report to storage:', error);
  }
}

// Add spinning animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);