<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
$page = new StudentPage();
$page->requireAuth();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Python Course - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/python.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <nav class="sidebar-header">
      <a href="<?= BASE_URL ?>/student/dashboard/dashboard.php" class="header-logo">
        <img src="<?= BASE_URL ?>/image/Edume.png" alt="EduMe Logo" class="logo-image">
        <span class="logo-text">EduMe</span>
      </a>
      <button class="sidebar-toggler">
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
    </nav>

    <nav class="sidebar-nav">
      <ul class="nav-list primary-nav">
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/student/dashboard/dashboard.php" class="nav-link">
            <span class="material-symbols-rounded">dashboard</span>
            <span class="nav-label">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/student/course/course.php" class="nav-link">
            <span class="material-symbols-rounded">school</span>
            <span class="nav-label">Courses</span>
          </a>
        </li>
      </ul>

      <ul class="nav-list secondary-nav">
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/public/registration/login.php" class="nav-link">
            <span class="material-symbols-rounded">logout</span>
            <span class="nav-label">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Header -->
  <header class="top-header">
    <button class="sidebar-menu-button">
      <span class="material-symbols-rounded">menu</span>
    </button>

    <div class="header-left">
      <h1>Python Programming Course</h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name">John Doe</span></p>
      </div>
      <a href="<?= BASE_URL ?>/student/profile/profile.php" class="user-avatar-link">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main Content -->
  <main class="python-content">
    <div class="python-container">
      
      <!-- Left Sidebar -->
      <aside class="left-sidebar">
        <!-- Subject List -->
        <div class="subjects-sidebar">
          <div class="subjects-header">
            <h2>Python Topics</h2>
            <span class="topic-count" id="topicCount">3 Topics</span>
          </div>

          <div class="subjects-list" id="subjectsList">
            <div class="subject-item active" data-subject="1">
              <div class="subject-info">
                <h3>Intro to Python</h3>
                <p class="subject-level">Beginner</p>
              </div>
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 0%;"></div>
                </div>
                <span class="progress-text">0%</span>
              </div>
              <div class="quiz-status">
                <span class="status-badge not-started">○ Not Started</span>
              </div>
            </div>

            <div class="subject-item" data-subject="2">
              <div class="subject-info">
                <h3>Python Syntax</h3>
                <p class="subject-level">Beginner</p>
              </div>
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 0%;"></div>
                </div>
                <span class="progress-text">0%</span>
              </div>
              <div class="quiz-status">
                <span class="status-badge not-started">○ Not Started</span>
              </div>
            </div>

            <div class="subject-item" data-subject="3">
              <div class="subject-info">
                <h3>Python Output</h3>
                <p class="subject-level">Beginner</p>
              </div>
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 0%;"></div>
                </div>
                <span class="progress-text">0%</span>
              </div>
              <div class="quiz-status">
                <span class="status-badge not-started">○ Not Started</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Section Container -->
        <div class="report-container">
          <div class="report-header">
            <div class="report-title-group">
              <span class="material-symbols-rounded">flag</span>
              <h3>Report Issue</h3>
            </div>
          </div>

          <form id="reportForm" class="report-form">
            <div class="form-group">
              <label for="reportType" class="form-label">Report Type</label>
              <select id="reportType" class="form-select" required>
                <option value="">Select Type</option>
                <option value="typo">Typo Error</option>
                <option value="content-error">Content Error</option>
                <option value="video-issue">Video Issue</option>
                <option value="code-error">Code Error</option>
                <option value="quiz-issue">Quiz Issue</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div class="form-group">
              <label for="reportContent" class="form-label">Description</label>
              <textarea 
                id="reportContent" 
                class="form-textarea" 
                placeholder="Describe the issue..." 
                rows="3" 
                required>
              </textarea>
              <span class="char-count"><span id="charCount">0</span>/300</span>
            </div>

            <div id="reportStatus" class="report-status" style="display: none;"></div>

            <button type="submit" class="btn-report-submit">
              <span class="material-symbols-rounded">send</span>
              Submit
            </button>
          </form>
        </div>
      </aside>

      <!-- Center Section - Subject Information & Quiz -->
      <section class="content-area">
        <div class="subject-content" id="subjectContent">
          <div class="content-header">
            <h2 id="contentTitle">Intro to Python</h2>
            <div class="level-badge" id="levelBadge">Beginner</div>
          </div>

          <div class="content-body">
            <div class="content-section">
              <h3>Overview</h3>
              <p id="contentOverview">
                Get started with Python programming! Learn what Python is, why it's popular, and how to set up your development environment.
              </p>
            </div>

            <div class="content-section">
              <h3>Key Topics</h3>
              <ul class="learning-objectives" id="learningObjectives">
                <li>What is Python</li>
                <li>Why Learn Python</li>
                <li>Python Installation</li>
                <li>Python Quick Start</li>
              </ul>
            </div>

            <div class="content-section">
              <h3>What is Python?</h3>
              <div class="lesson-content" id="lessonContent">
                <p>Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python has become one of the most popular programming languages in the world.</p>
              </div>
            </div>

            <!-- Learning Resources Section -->
            <div class="content-section learning-resources-section" id="learningResourcesSection">
              <h3>Learning Resources</h3>
              <div class="resources-grid" id="resourcesContainer"></div>
            </div>

            <!-- Start Quiz Button -->
            <div class="content-section quiz-button-section" id="startQuizSection">
              <button class="btn-start-quiz" id="startQuizBtn">Start Exercises</button>
            </div>

            <!-- Quiz Section -->
            <div class="content-section quiz-wrapper" id="quizWrapper" style="display: none;">
              <div class="quiz-header">
                <h3 id="quizTitle">Exercises: Intro to Python</h3>
                <button class="close-quiz" id="closeQuizBtn">✕</button>
              </div>

              <div class="quiz-content" id="quizContent">
                <div class="quiz-progress">
                  <span id="questionNumber">Question 1 of 3</span>
                  <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" id="quizProgressFill" style="width: 33%;"></div>
                  </div>
                </div>

                <div class="quiz-question">
                  <h4 id="quizQuestion">Question text goes here</h4>
                  <div class="quiz-feedback" id="quizFeedback"></div>
                </div>

                <div class="quiz-options" id="quizOptions"></div>

                <div class="quiz-navigation">
                  <button id="prevBtn" class="btn-nav btn-prev">
                    <span class="material-symbols-rounded">arrow_back</span>
                    Previous
                  </button>
                  <button id="nextBtn" class="btn-nav btn-next" style="display: none;">
                    Next
                    <span class="material-symbols-rounded">arrow_forward</span>
                  </button>
                  <button id="submitBtn" class="btn-nav btn-submit" style="display: none;">
                    <span class="material-symbols-rounded">check_circle</span>
                    Submit
                  </button>
                </div>
              </div>

              <div class="quiz-results" style="display: none;">
                <div class="results-header">
                  <h3>Exercises Complete!</h3>
                  <p id="scorePercentage">0%</p>
                </div>

                <div class="final-score">
                  <div class="score-circle">
                    <span id="finalScore">0/0</span>
                  </div>
                </div>

                <div class="results-breakdown">
                  <div class="result-item correct">
                    <span class="result-icon">✓</span>
                    <span class="result-text">0 Correct Answers</span>
                  </div>
                  <div class="result-item incorrect">
                    <span class="result-icon">✕</span>
                    <span class="result-text">0 Incorrect Answers</span>
                  </div>
                </div>

                <div class="performance-message">
                  <p id="performanceText">Keep practicing to improve your skills!</p>
                </div>

                <div class="results-actions">
                  <button class="btn-primary" id="retakeBtn">Retake Exercises</button>
                  <button class="btn-secondary" id="continueBtn">Continue Learning</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script src="<?= BASE_URL ?>/JS/python.js"></script>
</body>
</html>