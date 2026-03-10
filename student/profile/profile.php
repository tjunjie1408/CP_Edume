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
  <title>Profile - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/profile.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
        <p class="hello">Hello, <span id="user-name">John Doe</span></p>
      </div>
      <a href="#profile" class="user-avatar-link">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar" id="userAvatar">
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
            <img src="https://via.placeholder.com/120" alt="Profile Avatar" class="profile-avatar" id="profileAvatar">
            <button class="avatar-edit-btn" id="avatar-edit-btn" title="Change Avatar">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
          </div>
          <div class="profile-info-header">
            <h2 id="profile-username">John Doe</h2>
            <p id="profile-email" class="profile-email">john@example.com</p>
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
                  <p id="view-username">John Doe</p>
                </div>
                <div class="info-item">
                  <label>Email Address</label>
                  <p id="view-email">john@example.com</p>
                </div>
                <div class="info-item">
                  <label>Learning Style</label>
                  <p id="view-learning-style">Visual</p>
                </div>
                <div class="info-item">
                  <label>Experience Level</label>
                  <p id="view-experience">Beginner</p>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div id="editMode" class="edit-mode hidden">
              <form class="edit-form">
                <div class="form-group">
                  <label for="e-username">Full Name</label>
                  <input type="text" id="e-username" placeholder="Enter your full name">
                </div>
                <div class="form-group">
                  <label for="e-email">Email Address</label>
                  <input type="email" id="e-email" placeholder="Enter your email">
                </div>
                <div class="form-group">
                  <label for="e-learning-style">Learning Style</label>
                  <select id="e-learning-style">
                    <option value="">Select learning style</option>
                    <option value="Visual">Visual</option>
                    <option value="Auditory">Auditory</option>
                    <option value="Reading/Writing">Reading/Writing</option>
                    <option value="Kinesthetic">Kinesthetic</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="e-experience">Experience Level</label>
                  <select id="e-experience">
                    <option value="">Select experience level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
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
                <div class="skill-badge">React</div>
                <div class="skill-badge">JavaScript</div>
                <div class="skill-badge">CSS</div>
                <div class="skill-badge">HTML5</div>
                <div class="skill-badge">Node.js</div>
                <div class="skill-badge">Web Design</div>
              </div>
            </div>

            <!-- Skills Edit Mode -->
            <div id="skillsEditMode" class="edit-mode hidden">
              <form class="edit-form">
                <div class="form-group">
                  <label for="e-skills">My Skills</label>
                  <textarea id="e-skills" placeholder="Enter skills separated by comma&#10;Example: React, JavaScript, CSS" rows="4"></textarea>
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
                <p id="profile-bio">I'm a passionate learner interested in web development and programming. Always looking to improve my skills and stay updated with the latest technologies.</p>
              </div>
            </div>

            <!-- Bio Edit Mode -->
            <div id="bioEditMode" class="edit-mode hidden">
              <form class="edit-form">
                <div class="form-group">
                  <label for="e-bio">About Me</label>
                  <textarea id="e-bio" placeholder="Tell us about yourself..." rows="5"></textarea>
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
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="settings-item">
              <div class="setting-info">
                <h4>Course Updates</h4>
                <p>Get notified about new course updates</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked>
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
  <script src="<?= BASE_URL ?>/JS/profile.js"></script>
</body>
</html>