<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';
require_once __DIR__ . '/../../public/registration/User.php';
require_once __DIR__ . '/../../public/course/Course.php';

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
$courses = $courseModel->getAllPublishedCourses();

$studentVark = strtolower($userData['primary_vark_style'] ?? '');
$gravatarUrl = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($userData['email']))) . "?d=mp";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Courses - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/course.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" type="image/png" href="<?= BASE_URL ?>/image/Edume.png?v=1.0">
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
      <h1>Programming Courses</h1>
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

  <!-- Main Course Content -->
  <main class="course-content">
    <div class="course-container">
      <!-- Page Title and Description -->
      <div class="course-header">
        <h2>Choose Your Programming Language</h2>
        <p>Learn from beginner to advanced level in your preferred programming language</p>
      </div>

      <!-- Dynamic Grid Layout -->
      <div class="course-grid">
        <?php if (empty($courses)): ?>
          <p>No courses available at the moment.</p>
        <?php else: ?>
          <?php foreach ($courses as $course): 
            // Determine "Recommended" from actual content materials' vark_tag instead of course-level flags
            $isRecommended = false;
            if ($studentVark) {
              $varkCheck = $db->prepare("
                SELECT COUNT(*) FROM content_materials cm
                JOIN chapters ch ON cm.chapter_id = ch.id
                WHERE ch.course_id = :cid AND cm.vark_tag = :vtag
              ");
              $varkTagMap = ['visual' => 'visual', 'aural' => 'visual', 'read' => 'read', 'kinesthetic' => 'kinesthetic'];
              $mappedTag = $varkTagMap[$studentVark] ?? null;
              if ($mappedTag) {
                $varkCheck->execute([':cid' => $course['id'], ':vtag' => $mappedTag]);
                $isRecommended = (int) $varkCheck->fetchColumn() > 0;
              }
            }

            // Image: detect base64 data URI vs relative path vs empty
            $coverImage = $course['cover_image'] ?? '';
            if (str_starts_with($coverImage, 'data:')) {
              $imgSrc = $coverImage; // base64 data URI from admin upload
            } elseif (!empty($coverImage)) {
              $imgSrc = BASE_URL . $coverImage; // relative path from seed data
            } else {
              $imgSrc = ''; // no image
            }
          ?>
            <div class="course-card" data-course-id="<?= htmlspecialchars($course['id']) ?>">
              <div class="card-inner">
                <div class="card-image">
                  <?php if ($imgSrc): ?>
                    <img src="<?= htmlspecialchars($imgSrc) ?>" alt="<?= htmlspecialchars($course['title']) ?>">
                  <?php else: ?>
                    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;font-size:1.5rem;font-weight:bold;text-align:center;padding:1rem;">
                      <?= htmlspecialchars($course['title']) ?>
                    </div>
                  <?php endif; ?>
                </div>
                <div class="card-content">
                  <?php if ($isRecommended): ?>
                    <span style="display:inline-block; font-size:0.75rem; background:#48dbfb; color:white; padding:3px 8px; border-radius:12px; margin-bottom:5px; font-weight:bold;">
                      ★ Recommended for You
                    </span>
                  <?php endif; ?>
                  <h3><?= htmlspecialchars($course['title']) ?></h3>
                  <p><?= htmlspecialchars(ucfirst($course['difficulty'])) ?></p>
                  <button class="btn-enroll" onclick="enrollCourse(<?= htmlspecialchars($course['id']) ?>)">
                    <span class="material-symbols-rounded">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    window.AppConfig = {
      baseUrl: "<?= BASE_URL ?>"
    };
  </script>
  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script src="<?= BASE_URL ?>/JS/course.js"></script>
</body>
</html>