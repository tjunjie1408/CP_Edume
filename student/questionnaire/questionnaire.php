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
    <title>Edume - Learning Style Assessment</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/questionnaire.css">
    <link rel="icon" type="image/png" href="<?= BASE_URL ?>/image/Edume.png?v=1.0">
</head>
<body>
    <div class="container">
        <header>
            <div class="left">
                <img src="<?= BASE_URL ?>/image/Edume.png" alt="logo">
                <h1>Edume</h1>
            </div>
            <div class="auth-buttons">
                <a href="<?= BASE_URL ?>/public/index.html" class="btn btn-login">Back to Home</a>
            </div>
        </header>

        <section class="questionnaire-container">
            <div class="glass-card" id="questionnaire-box">
                
                <div id="start-screen">
                    <h1 class="gradient-text">Discover Your Coding Style</h1>
                    <p>Answer 8 questions about your programming habits to find out if you are an Visual-Audio, Read/Write, or Kinesthetic learner.</p>
                    <button id="start-btn" class="action-btn">Start Assessment</button>
                </div>

                <div id="question-screen" class="hide">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress"></div>
                    </div>
                    
                    <div class="question-header">
                        <h2 id="question-text">Question goes here?</h2>
                        <span id="question-count" class="question-text">1 / 8</span>
                    </div>

                    <div class="options-container" id="options-list">
                        </div>
                </div>

                <div id="result-screen" class="hide">
                    <img src="<?= BASE_URL ?>/image/digital brain (2).png" alt="Brain" class="result-img">
                    <h2>You are an <span id="result-title" class="gradient-text">Visual-Audio</span> Learner!</h2>
                    <p id="result-desc">You learn best by watching videos and discussing logic.</p>
                    
                    <div class="score-breakdown">
                        <div class="score-item">Visual-Audio: <span id="score-VA">0</span></div>
                        <div class="score-item">Read/Write: <span id="score-r">0</span></div>
                        <div class="score-item">Kinesthetic: <span id="score-k">0</span></div>
                    </div>

                    <a href="<?= BASE_URL ?>/student/dashboard/dashboard.php" class="action-btn">Go to Dashboard</a>
                    <button id="restart-btn" class="secondary-btn">Retake Test</button>
                </div>

            </div>
        </section>
    </div>

    <script src="<?= BASE_URL ?>/JS/questionnaire.js"></script>
</body>
</html>