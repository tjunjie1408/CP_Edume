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
  <title>Student Dashboard - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- CodeMirror CSS for Sandbox -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/dracula.min.css">
</head>
<body>
  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <!-- Sidebar Header -->
    <nav class="sidebar-header">
      <a href="<?= BASE_URL ?>/student/dashboard/dashboard.php" class="header-logo">
        <img src="<?= BASE_URL ?>/image/Edume.png" alt="EduMe Logo" class="logo-image">
        <span class="logo-text">EduMe</span>
      </a>
      <button class="sidebar-toggler">
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
    </nav>

    <!-- Sidebar Navigation Menu -->
    <nav class="sidebar-nav">
      <!-- Primary Navigation -->
      <ul class="nav-list primary-nav">
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/student/dashboard/dashboard.php" class="nav-link active">
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

      <!-- Secondary Navigation -->
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

  <!-- Header/Top Navigation Bar -->
  <header class="top-header">
    <!-- Mobile Sidebar Menu Button -->
    <button class="sidebar-menu-button">
      <span class="material-symbols-rounded">menu</span>
    </button>

    <div class="header-left">
      <h1>Welcome Back!</h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name"><?= htmlspecialchars($_SESSION['username'] ?? 'Student') ?></span></p>
      </div>
      <a href="<?= BASE_URL ?>/student/profile/profile.php" class="user-avatar-link">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main Dashboard Content -->
  <main class="dashboard-content">
    <!-- Welcome Banner Section -->
    <section class="section welcome-banner">
      <div class="banner-content">
        <h2>Welcome Back, <span id="banner-user-name"><?= htmlspecialchars($_SESSION['username'] ?? 'Student') ?></span>! 👋</h2>
        <p>Continue your learning journey and unlock your potential</p>
        <div class="banner-stats">
          <div class="stat-box">
            <span class="stat-number">12</span>
            <span class="stat-label">Courses Active</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">85%</span>
            <span class="stat-label">Progress Overall</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">24</span>
            <span class="stat-label">Days Streak</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Personalized Content Section based on VARK -->
    <?php switch ($_SESSION['primary_vark_style'] ?? 'unassigned'): case 'visual': ?>
      <!-- VISUAL LEARNER -->
      <section class="section personalized-section visual-mode">
        <div class="card core-video-card">
          <div class="section-header">
            <h3>Featured Video Lesson</h3>
            <span class="badge visual-badge">Visual Pick</span>
          </div>
          <div class="video-container">
            <iframe width="100%" height="400" src="https://www.youtube.com/embed/zJSY8tbf_ys" title="PHP Programming For Beginners" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          
          <div class="accordion" id="notesAccordion">
            <div class="accordion-header" onclick="toggleAccordion('notesAccordion')">
              <h4>Review Written Notes</h4>
              <span class="material-symbols-rounded">expand_more</span>
            </div>
            <div class="accordion-content">
              <p>PHP is a server scripting language, and a powerful tool for making dynamic and interactive Web pages. PHP is a widely-used, free, and efficient alternative to competitors such as Microsoft's ASP.</p>
            </div>
          </div>
          
          <div class="actions-row">
            <button class="btn-primary" onclick="scrollToSandbox()">Practice in Sandbox</button>
          </div>
        </div>
      </section>

    <?php break; case 'read': ?>
      <!-- READ/WRITE LEARNER -->
      <section class="section personalized-section read-mode">
        <div class="dashboard-grid read-grid">
          <div class="card reading-material-card">
             <div class="section-header">
                <h3>Official Tutorial</h3>
                <span class="badge read-badge">Reading Pick</span>
             </div>
             <article class="reading-material">
               <h2>Introduction to PHP</h2>
               <p>PHP code is executed on the server, and the result is returned to the browser as plain HTML.</p>
               <h3>Basic PHP Syntax</h3>
               <p>A PHP script can be placed anywhere in the document. A PHP script starts with <code>&lt;?php</code> and ends with <code>?&gt;</code>.</p>
               <pre><code>&lt;?php
  echo "Hello World!";
?&gt;</code></pre>
               <p>The default file extension for PHP files is ".php". A PHP file normally contains HTML tags, and some PHP scripting code.</p>
             </article>
          </div>
          <div class="side-panel">
            <div class="card side-video-card">
              <h4>Prefer to watch?</h4>
              <div class="video-thumbnail">
                <a href="https://www.youtube.com/watch?v=zJSY8tbf_ys" target="_blank">
                  <img src="https://img.youtube.com/vi/zJSY8tbf_ys/hqdefault.jpg" alt="Video Thumbnail" style="width: 100%; border-radius: 8px;">
                </a>
              </div>
            </div>
            <div class="card side-sandbox-card" style="margin-top: 1rem;">
               <h4>Try it out</h4>
               <button class="btn-primary" style="width: 100%;" onclick="scrollToSandbox()">Open Sandbox</button>
            </div>
          </div>
        </div>
      </section>

    <?php break; case 'kinesthetic': ?>
      <!-- KINESTHETIC LEARNER -->
      <section class="section personalized-section kinesthetic-mode">
        <div class="card sandbox-card">
          <div class="section-header">
            <h3>Interactive Sandbox</h3>
            <span class="badge kinesthetic-badge">Kinesthetic Pick</span>
          </div>
          <div class="sandbox-container grid-two-col">
            <div class="mission-brief">
              <h4>🎯 Your Mission</h4>
              <p>Write a PHP script that outputs "Hello World" using the <code>echo</code> command.</p>
              
              <div class="help-actions">
                <button class="btn-secondary" onclick="toggleHint('kHint1')">Show Hint</button>
                <a href="https://www.php.net/manual/en/function.echo.php" target="_blank" class="btn-secondary">Read Docs</a>
              </div>
              
              <div id="kHint1" class="hint-box hide">
                <p>Hint: Remember to wrap your string in quotes and end the statement with a semicolon (<code>;</code>).</p>
              </div>
            </div>
            
            <div class="code-editor-wrapper">
              <textarea id="php-sandbox" name="code">&lt;?php&#13;&#10;// Write your code here...&#13;&#10;&#13;&#10;?&gt;</textarea>
              <div class="editor-toolbar">
                <button class="btn-primary run-btn" onclick="runMockCompiler('php-sandbox')">Run Code</button>
              </div>
            </div>
          </div>
        </div>
      </section>

    <?php break; default: ?>
      <!-- UNASSIGNED LEARNER -->
      <section class="section personalized-section unassigned-mode">
        <div class="card cta-card">
          <div class="cta-content text-center">
            <h2>Unlock Your Personalized Dashboard! 🔓</h2>
            <p>Take our quick 8-question VARK assessment so we can tailor the dashboard to your unique learning style.</p>
            <br>
            <a href="<?= BASE_URL ?>/student/questionnaire/questionnaire.php" class="btn-primary" style="text-decoration:none; padding: 1rem 2rem; font-size: 1.1rem;">Take the VARK Quiz Now</a>
          </div>
        </div>
      </section>

    <?php endswitch; ?>
    
    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Left Column -->
      <div class="dashboard-column-left">
        <!-- Smart Feed Section -->
        <section class="card">
          <div class="section-header">
            <h3>Smart Feed</h3>
          </div>
          <div class="card-content">
            <div class="feed-item">
              <h4>Latest Course Update</h4>
              <p>New lessons available in "Advanced Web Development"</p>
              <small>2 hours ago</small>
            </div>
            <div class="feed-item">
              <h4>Achievement Unlocked!</h4>
              <p>You've completed 50% of "React Fundamentals"</p>
              <small>1 day ago</small>
            </div>
            <div class="feed-item">
              <h4>Streak Milestone!</h4>
              <p>You've maintained a 7-day learning streak</p>
              <small>3 days ago</small>
            </div>
          </div>
        </section>

        <!-- Progress Section -->
        <section class="card">
          <div class="section-header">
            <h3>Your Progress</h3>
          </div>
          <div class="card-content">
            <div class="progress-item">
              <div class="progress-header">
                <span class="course-name">React Fundamentals</span>
                <span class="percentage">65%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 65%"></div>
              </div>
            </div>
            <div class="progress-item">
              <div class="progress-header">
                <span class="course-name">JavaScript Mastery</span>
                <span class="percentage">82%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 82%"></div>
              </div>
            </div>
            <div class="progress-item">
              <div class="progress-header">
                <span class="course-name">Web Design Basics</span>
                <span class="percentage">45%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 45%"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="dashboard-column-right">
        <!-- Continue Learning Section -->
        <section class="card">
          <div class="section-header">
            <h3>Continue Learning</h3>
          </div>
          <div class="card-content">
            <div class="resume-course-card">
              <h4>Advanced React Hooks</h4>
              <p class="course-meta">Module 5 of 12</p>
              <p class="last-accessed">Last accessed: Yesterday</p>
              <button class="btn-primary">Resume Course</button>
            </div>
            <div class="resume-course-card">
              <h4>JavaScript ES6 Features</h4>
              <p class="course-meta">Module 3 of 8</p>
              <p class="last-accessed">Last accessed: 3 days ago</p>
              <button class="btn-primary">Resume Course</button>
            </div>
          </div>
        </section>

        <!-- Recommended Courses Section -->
        <section class="card">
          <div class="section-header">
            <h3>Tailored For You</h3>
          </div>
          <div class="card-content">
            <div class="course-card">
              <h4>Vue.js for Beginners</h4>
              <p class="course-description">Learn Vue.js from scratch and build dynamic web applications.</p>
              <div class="course-footer">
                <span class="course-level">Beginner</span>
                <button class="btn-secondary">Enroll</button>
              </div>
            </div>
            <div class="course-card">
              <h4>Python Data Science</h4>
              <p class="course-description">Master data analysis and visualization with Python.</p>
              <div class="course-footer">
                <span class="course-level">Intermediate</span>
                <button class="btn-secondary">Enroll</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Activity Section -->
        <section class="card">
          <div class="section-header">
            <h3>Recent Activity</h3>
          </div>
          <div class="card-content">
            <ul class="activity-list">
              <li class="activity-item">
                <span class="activity-icon">✓</span>
                <span class="activity-text">Completed "State Management" quiz</span>
                <small>Today</small>
              </li>
              <li class="activity-item">
                <span class="activity-icon">▶</span>
                <span class="activity-text">Started "Component Lifecycle" lesson</span>
                <small>Yesterday</small>
              </li>
              <li class="activity-item">
                <span class="activity-icon">⭐</span>
                <span class="activity-text">Earned badge "Quick Learner"</span>
                <small>2 days ago</small>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </main>

  <!-- CodeMirror JS dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/php/php.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/xml/xml.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/css/css.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/htmlmixed/htmlmixed.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/clike/clike.min.js"></script>

  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
</body>
</html>