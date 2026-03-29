<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';
require_once __DIR__ . '/../../public/registration/User.php';

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

$gravatarUrl = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($userData['email']))) . "?d=mp";
$skills = $userModel->getUserSkills($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/profile.css">
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
      <h1>My Profile</h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name"><?= htmlspecialchars($userData['username']) ?></span></p>
      </div>
      <a href="#profile" class="user-avatar-link">
        <img src="<?= htmlspecialchars($gravatarUrl) ?>" alt="User Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main Profile Content -->
  <main class="profile-content">
    <!-- Profile Container -->
    <div class="profile-container">
      <!-- Profile Header Section -->
      <div class="profile-header">
        <div class="profile-header-background"></div>
        <div class="profile-header-content">
          <!-- In the profile-header-content section, modify the avatar part -->
          <div class="profile-avatar-wrapper">
            <img src="<?= htmlspecialchars($gravatarUrl) ?>" alt="Profile Avatar" class="profile-avatar" id="profileAvatar">
            <a href="https://en.gravatar.com/" target="_blank" class="avatar-edit-btn" id="avatar-edit-btn" title="Change Avatar on Gravatar">
              <span class="material-symbols-rounded">edit</span>
            </a>
          </div>
          <div class="profile-info-header">
            <h2 id="profile-username"><?= htmlspecialchars($userData['username']) ?></h2>
            <p id="profile-email" class="profile-email"><?= htmlspecialchars($userData['email']) ?></p>
          </div>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div class="profile-tabs">
        <button class="tab-btn active" data-tab="profile">Profile</button>
        <button class="tab-btn" data-tab="settings">Settings</button>
      </div>

      <!-- Profile Tab Content -->
      <div class="profile-tabs-content">
        <!-- Profile Tab -->
        <div class="tab-content active" id="profile-tab">
          <div class="profile-section">
            <div class="section-header">
              <h3>Personal Information</h3>
              <button class="edit-profile-btn" id="edit-profile-btn">
                <span class="material-symbols-rounded">edit</span>
                Edit
              </button>
            </div>

            <!-- View Mode -->
            <div id="viewMode" class="view-mode">
              <div class="info-grid">
                <div class="info-item">
                  <label>Full Name</label>
                  <p id="view-username"><?= htmlspecialchars($userData['username']) ?></p>
                </div>
                <div class="info-item">
                  <label>Email Address</label>
                  <p id="view-email"><?= htmlspecialchars($userData['email']) ?></p>
                </div>
                <div class="info-item">
                  <label>Learning Style</label>
                  <?php
                    $rawStyle = $userData['learning_style'] ?? '';
                    $displayStyle = 'Not set';
                    if ($rawStyle === 'visual' || strtolower($rawStyle) === 'visual') $displayStyle = 'Visual';
                    elseif ($rawStyle === 'aural' || strtolower($rawStyle) === 'aural') $displayStyle = 'Aural';
                    elseif ($rawStyle === 'read' || strtolower($rawStyle) === 'reading/writing') $displayStyle = 'Reading/Writing';
                    elseif ($rawStyle === 'kinesthetic' || strtolower($rawStyle) === 'kinesthetic') $displayStyle = 'Kinesthetic';
                    elseif (!empty($rawStyle)) $displayStyle = ucfirst($rawStyle);
                  ?>
                  <p id="view-learning-style"><?= htmlspecialchars($displayStyle) ?></p>
                </div>
                <div class="info-item">
                  <label>Experience Level</label>
                  <p id="view-experience"><?= htmlspecialchars(ucfirst($userData['experience_level'] ?? 'Not set')) ?></p>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div id="editMode" class="edit-mode hidden">
              <form class="edit-form">
                <div class="form-group">
                  <label for="e-username">Full Name</label>
                  <input type="text" id="e-username" value="<?= htmlspecialchars($userData['username']) ?>" placeholder="Enter your full name">
                </div>
                <div class="form-group">
                  <label for="e-email">Email Address</label>
                  <input type="email" id="e-email" value="<?= htmlspecialchars($userData['email']) ?>" placeholder="Enter your email">
                </div>
                <div class="form-group">
                  <label for="e-learning-style">Learning Style</label>
                  <select id="e-learning-style">
                    <?php $ls = strtolower($userData['learning_style'] ?? ''); ?>
                    <option value="" <?= empty($ls) ? 'selected' : '' ?>>Select learning style</option>
                    <option value="visual" <?= $ls === 'visual' ? 'selected' : '' ?>>Visual</option>
                    <option value="aural" <?= $ls === 'aural' ? 'selected' : '' ?>>Aural</option>
                    <option value="read" <?= ($ls === 'read' || $ls === 'reading/writing') ? 'selected' : '' ?>>Reading/Writing</option>
                    <option value="kinesthetic" <?= $ls === 'kinesthetic' ? 'selected' : '' ?>>Kinesthetic</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="e-experience">Experience Level</label>
                  <select id="e-experience">
                    <?php $ex = strtolower($userData['experience_level'] ?? ''); ?>
                    <option value="" <?= empty($ex) ? 'selected' : '' ?>>Select experience level</option>
                    <option value="beginner" <?= $ex === 'beginner' ? 'selected' : '' ?>>Beginner</option>
                    <option value="intermediate" <?= $ex === 'intermediate' ? 'selected' : '' ?>>Intermediate</option>
                    <option value="advanced" <?= $ex === 'advanced' ? 'selected' : '' ?>>Advanced</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn-save" onclick="saveChanges()">
                    <span class="material-symbols-rounded">check</span>
                    Save Changes
                  </button>
                  <button type="button" class="btn-cancel" onclick="cancelEdit()">
                    <span class="material-symbols-rounded">close</span>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="profile-section">
            <div class="section-header">
              <h3>My Skills</h3>
              <button class="edit-profile-btn" id="edit-skills-btn">
                <span class="material-symbols-rounded">edit</span>
                Edit
              </button>
            </div>
            
            <!-- Skills View Mode -->
            <div id="skillsViewMode">
              <div class="skills-container" id="skillsView">
                <?php if (!empty($skills)): ?>
                  <?php foreach ($skills as $skill): ?>
                    <div class="skill-badge"><?= htmlspecialchars($skill) ?></div>
                  <?php endforeach; ?>
                <?php else: ?>
                  <p>No skills added yet.</p>
                <?php endif; ?>
              </div>
            </div>

            <!-- Skills Edit Mode -->
            <div id="skillsEditMode" class="edit-mode hidden">
              <form class="edit-form">
                <div class="form-group">
                  <label for="e-skills">My Skills</label>
                  <textarea id="e-skills" placeholder="Enter skills separated by comma&#10;Example: React, JavaScript, CSS" rows="4"><?= htmlspecialchars(implode(', ', $skills)) ?></textarea>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn-save" onclick="saveSkills()">
                    <span class="material-symbols-rounded">check</span>
                    Save Skills
                  </button>
                  <button type="button" class="btn-cancel" onclick="cancelEditSkills()">
                    <span class="material-symbols-rounded">close</span>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Bio Section -->
          <div class="profile-section">
            <div class="section-header">
              <h3>About Me</h3>
              <button class="edit-profile-btn" id="edit-bio-btn">
                <span class="material-symbols-rounded">edit</span>
                Edit
              </button>
            </div>
            
            <!-- Bio View Mode -->
            <div id="bioViewMode">
              <div class="bio-content">
                <p id="profile-bio"><?= nl2br(htmlspecialchars($userData['bio'] ?? 'Write something about yourself...')) ?></p>
              </div>
            </div>

            <!-- Bio Edit Mode -->
            <div id="bioEditMode" class="edit-mode hidden">
              <form class="edit-form">
                <div class="form-group">
                  <label for="e-bio">About Me</label>
                  <textarea id="e-bio" placeholder="Tell us about yourself..." rows="5"><?= htmlspecialchars($userData['bio'] ?? '') ?></textarea>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn-save" onclick="saveBio()">
                    <span class="material-symbols-rounded">check</span>
                    Save Bio
                  </button>
                  <button type="button" class="btn-cancel" onclick="cancelEditBio()">
                    <span class="material-symbols-rounded">close</span>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div class="tab-content" id="settings-tab">
          <div class="profile-section">
            <h3>Notification Preferences</h3>
            <div class="settings-item">
              <div class="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="email-notif-toggle" <?= (!empty($userData['email_notifications_enabled'])) ? 'checked' : '' ?>>
                <span class="slider"></span>
              </label>
            </div>
            <div class="settings-item">
              <div class="setting-info">
                <h4>Dark Mode</h4>
                <p>Switch between light and dark themes</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="dark-mode-toggle">
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="settings-item">
              <div class="setting-info">
                <h4>Achievement Alerts</h4>
                <p>Notify me when I earn badges and certificates</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="profile-section">
            <h3>Privacy Settings</h3>
            <div class="settings-item">
              <div class="setting-info">
                <h4>Profile Visibility</h4>
                <p>Control who can see your profile</p>
              </div>
              <select class="settings-select">
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </select>
            </div>
            <div class="settings-item">
              <div class="setting-info">
                <h4>Show Progress</h4>
                <p>Let others see your learning progress</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script>
    window.AppConfig = {
      baseUrl: "<?= BASE_URL ?>"
    };
  </script>
  <script src="<?= BASE_URL ?>/JS/profile.js"></script>
</body>
</html>