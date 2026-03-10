<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/AdminPage.php';
$page = new AdminPage();
$page->requireAuth();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Profile - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard_admin.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/profile_admin.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <!-- Sidebar Header -->
    <nav class="sidebar-header">
      <a href="<?= BASE_URL ?>/admin/dashboard/dashboard.php" class="header-logo">
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
          <a href="<?= BASE_URL ?>/admin/dashboard/dashboard.php" class="nav-link">
            <span class="material-symbols-rounded">dashboard</span>
            <span class="nav-label">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/admin/course_manage/course_manage.php" class="nav-link">
            <span class="material-symbols-rounded">library_books</span>
            <span class="nav-label">Course Manage</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/admin/user_manage/user_manage.php" class="nav-link">
            <span class="material-symbols-rounded">people</span>
            <span class="nav-label">User Manage</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="<?= BASE_URL ?>/admin/support_center/support_center.php" class="nav-link">
            <span class="material-symbols-rounded">support_agent</span>
            <span class="nav-label">Support Center</span>
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
      <h1>Admin Profile</h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name">Admin</span></p>
      </div>
      <a href="#profile" class="user-avatar-link">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main Profile Content -->
  <main class="profile-admin-content">
    <!-- Profile Container -->
    <div class="profile-admin-container">
      <!-- Profile Header Section -->
      <div class="profile-admin-header">
        <div class="profile-admin-header-background"></div>
        <div class="profile-admin-header-content">
          <!-- Avatar with Edit Button -->
          <div class="profile-admin-avatar-wrapper">
            <img src="https://via.placeholder.com/120" alt="Admin Avatar" class="profile-admin-avatar" id="profileAdminAvatar">
            <button class="admin-avatar-edit-btn" id="avatar-upload-trigger" title="Change Avatar">
              <span class="material-symbols-rounded">camera_alt</span>
            </button>
            <input type="file" id="avatar-upload-input" style="display: none;" accept="image/*">
          </div>
          
          <!-- Admin Info Header -->
          <div class="profile-admin-info-header">
            <h2 id="admin-username">Admin Name</h2>
            <p class="admin-email" id="admin-email">admin@example.com</p>
            <p class="admin-role" id="admin-role-display">Administrator</p>
          </div>
        </div>
      </div>

      <!-- Profile Tabs Navigation -->
      <div class="profile-admin-tabs">
        <button class="tab-btn active" data-tab="personal-info">
          <span class="material-symbols-rounded">person</span>
          Personal Information
        </button>
        <button class="tab-btn" data-tab="activity">
          <span class="material-symbols-rounded">history</span>
          Activity
        </button>
      </div>

      <!-- Tab Content -->
      <div class="profile-admin-tabs-content">
        
        <!-- Personal Information Tab -->
        <div class="tab-content active" id="personal-info">
          <div class="admin-section">
            <div class="section-header">
              <h3>Personal Information</h3>
              <button class="btn-edit-section" id="edit-personal-btn">
                <span class="material-symbols-rounded">edit</span> Edit
              </button>
            </div>

            <!-- View Mode -->
            <div class="view-mode" id="personal-view">
              <div class="info-grid">
                <div class="info-item">
                  <label>Full Name</label>
                  <p id="view-full-name">John Administrator</p>
                </div>
                <div class="info-item">
                  <label>Email Address</label>
                  <p id="view-email">john.admin@example.com</p>
                </div>
                <div class="info-item">
                  <label>Phone Number</label>
                  <p id="view-phone">+1 (555) 123-4567</p>
                </div>
                <div class="info-item">
                  <label>Department</label>
                  <p id="view-department">System Administration</p>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div class="edit-mode hidden" id="personal-edit">
              <form id="personal-form">
                <div class="form-group">
                  <label for="edit-full-name">Full Name</label>
                  <input type="text" id="edit-full-name" name="fullName" required>
                </div>
                <div class="form-group">
                  <label for="edit-email">Email Address</label>
                  <input type="email" id="edit-email" name="email" required>
                </div>
                <div class="form-group">
                  <label for="edit-phone">Phone Number</label>
                  <input type="tel" id="edit-phone" name="phone">
                </div>
                <div class="form-group">
                  <label for="edit-department">Department</label>
                  <input type="text" id="edit-department" name="department">
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn-save">
                    <span class="material-symbols-rounded">check</span> Save Changes
                  </button>
                  <button type="button" class="btn-cancel" id="cancel-personal-btn">
                    <span class="material-symbols-rounded">close</span> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Activity Tab -->
        <div class="tab-content" id="activity">
          <div class="admin-section">
            <div class="section-header">
              <h3>Recent Activity</h3>
            </div>

            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <span class="material-symbols-rounded">login</span>
                </div>
                <div class="activity-details">
                  <p class="activity-action">Logged in</p>
                  <p class="activity-time">Today at 10:30 AM</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <span class="material-symbols-rounded">person_add</span>
                </div>
                <div class="activity-details">
                  <p class="activity-action">Created new user: sarah@example.com</p>
                  <p class="activity-time">February 20, 2026 at 2:15 PM</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <span class="material-symbols-rounded">edit</span>
                </div>
                <div class="activity-details">
                  <p class="activity-action">Updated course: Python Basics</p>
                  <p class="activity-time">February 19, 2026 at 11:45 AM</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <span class="material-symbols-rounded">settings</span>
                </div>
                <div class="activity-details">
                  <p class="activity-action">Modified system settings</p>
                  <p class="activity-time">February 18, 2026 at 3:20 PM</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <span class="material-symbols-rounded">logout</span>
                </div>
                <div class="activity-details">
                  <p class="activity-action">Logged out</p>
                  <p class="activity-time">February 17, 2026 at 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>

  <!-- Scripts -->
  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script src="<?= BASE_URL ?>/JS/profile_admin.js"></script>
</body>
</html>