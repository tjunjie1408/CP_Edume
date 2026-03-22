<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';
require_once __DIR__ . '/../../public/registration/User.php';
require_once __DIR__ . '/../../public/course/Course.php';
require_once __DIR__ . '/../../public/course/Chapter.php';
require_once __DIR__ . '/../../public/course/ContentMaterial.php';

$page = new StudentPage();
$page->requireAuth();

$database = new Database();
$db = $database->getConnection();

$userModel = new User($db);
$userData = $userModel->findById($_SESSION['user_id']);

if (!$userData) {
    session_destroy();
    header("Location: " . BASE_URL . "/public/registration/login.php");
    exit();
}

$courseModel = new Course($db);
$chapterModel = new Chapter($db);
$materialModel = new ContentMaterial($db);

$courseId = $_GET['id'] ?? null;

// GET Parameter Guard: Strict validation
if (!$courseId || !is_numeric($courseId) || !($courseData = $courseModel->findById($courseId))) {
    // Redirect back to courses list with an error query param
    header("Location: " . BASE_URL . "/student/course/course.php?error=invalid_course");
    exit();
}

$studentVark = strtolower($userData['primary_vark_style'] ?? 'unassigned');
$gravatarUrl = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($userData['email']))) . "?d=mp";

// Fetch Chapters
$chapters = $chapterModel->getChaptersByCourseId($courseId);

// Inject initial progress record so they appear in 'Enrolled Courses'
if (!empty($chapters)) {
    try {
        $firstChapterId = $chapters[0]['id'];
        $insertStmt = $db->prepare("
            INSERT IGNORE INTO user_progress (user_id, chapter_id, is_completed, xp_earned) 
            VALUES (?, ?, 0, 0)
        ");
        $insertStmt->execute([$_SESSION['user_id'], $firstChapterId]);
    } catch (PDOException $e) {
        // Silently ignore if it fails, as it's just an enrollment tracker
    }
}

// For the initial load, just grab the materials for the first chapter if chapters exist
$activeChapterId = isset($_GET['chapter']) ? (int)$_GET['chapter'] : ($chapters[0]['id'] ?? null);
$materials = [];
$activeChapterData = null;

if ($activeChapterId) {
    $materials = $materialModel->getMaterialsByChapterId($activeChapterId);

    // ── VARK-based content reordering ──
    // Move materials matching the student's VARK style to the front
    $varkTagMap = [
        'visual'      => 'visual',
        'aural'       => 'visual',  // aural + visual combined per project spec
        'read'        => 'read',
        'kinesthetic' => 'kinesthetic'
    ];
    $preferredTag = $varkTagMap[$studentVark] ?? null;

    if ($preferredTag) {
        usort($materials, function($a, $b) use ($preferredTag) {
            $aMatch = (strtolower($a['vark_tag'] ?? '') === $preferredTag) ? -1 : 0;
            $bMatch = (strtolower($b['vark_tag'] ?? '') === $preferredTag) ? -1 : 0;
            return $aMatch - $bMatch; // preferred first
        });
    }

    foreach ($chapters as $ch) {
        if ($ch['id'] === $activeChapterId) {
            $activeChapterData = $ch;
            break;
        }
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($courseData['title']) ?> - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/python.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" type="image/png" href="<?= BASE_URL ?>/image/Edume.png?v=1.0">
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
      <h1><?= htmlspecialchars($courseData['title']) ?> Course</h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name"><?= htmlspecialchars($userData['username']) ?></span></p>
      </div>
      <a href="<?= BASE_URL ?>/student/profile/profile.php" class="user-avatar-link">
        <img src="<?= htmlspecialchars($gravatarUrl) ?>" alt="User Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main Content -->
  <main class="python-content">
    <!-- Back Button -->
    <div style="padding: 0.75rem 1.5rem;">
      <a href="<?= BASE_URL ?>/student/course/course.php" style="display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; color: var(--primary-color); font-weight: 600; font-size: 0.95rem;">
        <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
        Back to Courses
      </a>
    </div>
    <div class="python-container">
      
      <!-- Left Sidebar -->
      <aside class="left-sidebar">
        <!-- Subject List -->
        <div class="subjects-sidebar">
          <div class="subjects-header">
            <h2>Course Topics</h2>
            <span class="topic-count" id="topicCount"><?= count($chapters) ?> Topics</span>
          </div>

          <div class="subjects-list" id="subjectsList">
            <?php if (empty($chapters)): ?>
               <p style="padding: 1rem; color: #a0a0b0;">No chapters available yet.</p>
            <?php else: ?>
               <?php foreach ($chapters as $index => $chapter): 
                    $isActive = ($chapter['id'] === $activeChapterId) ? 'active' : '';
               ?>
                <a href="?id=<?= $courseId ?>&chapter=<?= $chapter['id'] ?>" style="text-decoration:none; color:inherit;">
                  <div class="subject-item <?= $isActive ?>" data-subject="<?= $chapter['id'] ?>">
                    <div class="subject-info">
                      <h3><?= htmlspecialchars($chapter['title']) ?></h3>
                      <p class="subject-level">Chapter <?= $chapter['chapter_order'] ?></p>
                    </div>
                    <div class="progress-container">
                      <div class="progress-bar">
                        <!-- Progress logic will be added here later -->
                        <div class="progress-fill" style="width: 0%;"></div>
                      </div>
                      <span class="progress-text">0%</span>
                    </div>
                    <div class="quiz-status">
                      <span class="status-badge not-started">○ Not Started</span>
                    </div>
                  </div>
                </a>
               <?php endforeach; ?>
            <?php endif; ?>
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
          <?php if (!$activeChapterData): ?>
             <div class="content-header"><h2>Please select a chapter</h2></div>
          <?php else: ?>
            <div class="content-header">
              <h2 id="contentTitle"><?= htmlspecialchars($activeChapterData['title']) ?></h2>
              <div class="level-badge" id="levelBadge">Chapter <?= htmlspecialchars($activeChapterData['chapter_order']) ?></div>
            </div>

            <div class="content-body">
              <div class="content-section">
                <h3>Overview</h3>
                <p id="contentOverview">
                  <?= nl2br(htmlspecialchars($activeChapterData['description'] ?? 'No description available for this chapter.')) ?>
                </p>
              </div>

              <!-- Learning Resources Section (Dynamic VARK Weighting) -->
              <div class="content-section learning-resources-section" id="learningResourcesSection">
                <h3>Learning Resources</h3>
                <div class="resources-container">
                    <?php if (empty($materials)): ?>
                        <p>No study materials uploaded for this chapter yet.</p>
                    <?php else: ?>
                        <?php foreach ($materials as $material): ?>
                            
                            <?php if ($material['content_type'] === 'video'): ?>
                                <div class="material-block video-block" style="margin-bottom: 2rem; <?= ($studentVark === 'visual') ? 'border: 2px solid #48dbfb; padding: 10px; border-radius: 8px;' : '' ?>">
                                    <h4><?= htmlspecialchars($material['title']) ?> <?= ($studentVark === 'visual') ? '<span style="font-size:0.8rem; background:#48dbfb; color:white; padding:2px 6px; border-radius:8px;">Recommended</span>' : '' ?></h4>
                                    <?php if (!empty($material['youtube_url'])): ?>
                                        <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
                                            <iframe src="<?= htmlspecialchars($material['youtube_url']) ?>" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
                                        </div>
                                    <?php else: ?>
                                        <p>Video URL is missing.</p>
                                    <?php endif; ?>
                                </div>
                            
                            <?php elseif ($material['content_type'] === 'text'): ?>
                                <div class="material-block text-block" style="margin-bottom: 2rem; background: #f8f9fc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e6f0; <?= ($studentVark === 'read') ? 'border: 2px solid #ff9ff3;' : '' ?>">
                                    <h4 style="color: #2c3e50; margin-bottom: 0.75rem;"><?= htmlspecialchars($material['title']) ?> <?= ($studentVark === 'read') ? '<span style="font-size:0.8rem; background:#ff9ff3; color:white; padding:2px 6px; border-radius:8px;">Recommended</span>' : '' ?></h4>
                                    <div class="text-content" style="line-height: 1.8; color: #34495e;">
                                        <!-- Note: If text_content contains safe HTML from a wysiwyg, use it without htmlspecialchars. Assuming safe for now -->
                                        <?= $material['text_content'] ?>
                                    </div>
                                </div>
                                
                            <?php elseif ($material['content_type'] === 'practice'): ?>
                                <div class="material-block practice-block" style="margin-bottom: 2rem; background: #fffdf5; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #feca57; border: 1px solid #f0e6c8; <?= ($studentVark === 'kinesthetic') ? 'border: 2px solid #feca57;' : '' ?>">
                                    <h4 style="color: #2c3e50; margin-bottom: 0.75rem;">🎯 Practice: <?= htmlspecialchars($material['title']) ?> <?= ($studentVark === 'kinesthetic') ? '<span style="font-size:0.8rem; background:#feca57; color:#222; padding:2px 6px; border-radius:8px;">Recommended</span>' : '' ?></h4>
                                    <p><?= nl2br(htmlspecialchars($material['practice_problem'])) ?></p>
                                    <a href="<?= BASE_URL ?>/student/coding/coding.php?material_id=<?= $material['id'] ?>" class="btn-primary" style="display: inline-block; margin-top: 1rem; text-decoration: none;">
                                        Open Sandbox Editor
                                    </a>
                                </div>
                            <?php endif; ?>

                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
              </div>

            <!-- Start Quiz Button -->
            <div class="content-section quiz-button-section" id="startQuizSection">
              <button class="btn-start-quiz" id="startQuizBtn">Start Exercises</button>
            </div>

            <!-- Quiz Section -->
            <div class="content-section quiz-wrapper" id="quizWrapper" style="display: none;">
                <div class="quiz-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 id="quizTitle" style="margin: 0;">Chapter Quiz</h3>
                    <button class="btn-close" id="closeQuizBtn" style="background: none; border: none; cursor: pointer; color: #a0a0b0;"><span class="material-symbols-rounded">close</span></button>
                </div>
                
                <div class="quiz-progress" style="margin-bottom: 2rem;">
                    <div class="progress-bar" style="height: 8px; background: #e2e6f0; border-radius: 4px; overflow: hidden;">
                        <div class="progress-fill" id="quizProgressFill" style="height: 100%; background: var(--primary-color); width: 0%; transition: width 0.3s ease;"></div>
                    </div>
                </div>

                <div id="quizContent">
                    <div class="question-header" style="margin-bottom: 2rem;">
                        <span class="question-number" id="questionNumber" style="font-size: 0.9rem; color: #6e7687; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Question 1 of 5</span>
                        <h4 class="question-text" id="quizQuestion" style="font-size: 1.25rem; color: #2c3e50; margin-top: 0.5rem; line-height: 1.5;">Loading question...</h4>
                    </div>
                    
                    <div class="options-container" id="quizOptions" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                        <!-- Options injected by JS -->
                    </div>

                    <div class="quiz-actions" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e6f0; padding-top: 1.5rem;">
                        <button class="btn-secondary" id="prevBtn" disabled style="padding: 0.75rem 1.5rem; border: 1px solid #e2e6f0; border-radius: 8px; background: transparent; color: #6e7687; font-weight: 600; cursor: pointer;">Previous</button>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn-primary" id="nextBtn" disabled style="padding: 0.75rem 2rem; border-radius: 8px; background: var(--primary-color); color: white; border: none; font-weight: 600; cursor: pointer;">Next</button>
                            <button class="btn-success" id="submitBtn" style="display: none; padding: 0.75rem 2rem; border-radius: 8px; background: var(--accent-success); color: white; border: none; font-weight: 600; cursor: pointer;" disabled>Submit Quiz</button>
                        </div>
                    </div>
                </div>

                <div class="quiz-results" style="display: none; text-align: center; padding: 2rem;">
                    <div class="result-score-circle" style="width: 120px; height: 120px; border-radius: 50%; border: 6px solid var(--primary-color); display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0 auto 1.5rem auto;">
                        <span class="score-number" id="finalScore" style="font-size: 1.5rem; font-weight: 700; color: #2c3e50;">0/0</span>
                        <span class="score-label" id="scorePercentage" style="font-size: 0.9rem; color: #6e7687;">0%</span>
                    </div>
                    
                    <div class="result-stats" style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem;">
                        <div class="result-item correct" style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-success); font-weight: 600;">
                            <span class="material-symbols-rounded">check_circle</span>
                            <span class="result-text">0 Correct</span>
                        </div>
                        <div class="result-item incorrect" style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-warning); font-weight: 600;">
                            <span class="material-symbols-rounded">cancel</span>
                            <span class="result-text">0 Incorrect</span>
                        </div>
                    </div>
                    
                    <p class="performance-text" id="performanceText" style="font-size: 1.1rem; margin-bottom: 2rem;">Performance details...</p>
                    
                    <div class="quiz-actions result-actions" style="display: flex; justify-content: center; gap: 1rem;">
                        <button class="btn-secondary" id="retakeBtn" style="padding: 0.75rem 1.5rem; border: 1px solid #e2e6f0; border-radius: 8px; background: transparent; color: #6e7687; font-weight: 600; cursor: pointer;">Retake Quiz</button>
                        <button class="btn-primary" id="continueBtn" style="padding: 0.75rem 2rem; border-radius: 8px; background: var(--primary-color); color: white; border: none; font-weight: 600; cursor: pointer;">Continue Learning</button>
                    </div>
                </div>
            </div>
            
          </div>
          <?php endif; ?>
        </div>
      </section>
    </div>
  <script>
    // Global Config for APIs
    window.AppConfig = {
      baseUrl: '<?= BASE_URL ?>'
    };
  </script>
  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script src="<?= BASE_URL ?>/JS/course_details.js"></script>
  <script src="<?= BASE_URL ?>/JS/course_quiz.js"></script>
</body>
</html>