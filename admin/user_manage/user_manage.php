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
  <title>User Management - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard_admin.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/user_manage_admin.css">
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
          <a href="<?= BASE_URL ?>/admin/user_manage/user_manage.php" class="nav-link active">
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
      <h1>User Management</h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name"><?= htmlspecialchars($_SESSION['username'] ?? 'Admin') ?></span></p>
      </div>
      <a href="<?= BASE_URL ?>/admin/profile/profile.php" class="user-avatar-link">
        <img src="https://via.placeholder.com/50" alt="Admin Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main User Management Content -->
  <main class="dashboard-content">
    <!-- Welcome Banner -->
    <section class="section welcome-banner admin-banner">
      <div class="banner-content">
        <h2>User Management Center 👥</h2>
        <p>Monitor and manage user accounts and personal information</p>
      </div>
    </section>

    <!-- User Management Toolbar -->
    <section class="section user-toolbar">
      <div class="toolbar-left">
        <div class="search-box">
          <span class="material-symbols-rounded">search</span>
          <input 
            type="text" 
            id="search-users" 
            class="search-input" 
            placeholder="Search by username, email, or ID..."
          >
        </div>
        
        <select id="filter-learning-style" class="filter-select">
          <option value="">All Learning Styles</option>
          <option value="Visual">Visual</option>
          <option value="Aural">Aural</option>
          <option value="Reading/Writing">Reading/Writing</option>
          <option value="Kinesthetic">Kinesthetic</option>
        </select>
      </div>

      <div class="toolbar-right">
        <button class="btn-action btn-refresh" id="refresh-users" title="Refresh Users">
          <span class="material-symbols-rounded">refresh</span>
          <span>Refresh</span>
        </button>
        <button class="btn-action btn-export" id="export-users" title="Export Users">
          <span class="material-symbols-rounded">download</span>
          <span>Export</span>
        </button>
      </div>
    </section>

    <!-- Users Statistics -->
    <section class="section user-stats-section">
      <div class="stats-grid">
        <div class="stat-mini-card">
          <div class="stat-mini-header">
            <span class="material-symbols-rounded">people</span>
            <span>Total Users</span>
          </div>
          <div class="stat-mini-value" id="total-users-count">---</div>
        </div>
        <div class="stat-mini-card">
          <div class="stat-mini-header">
            <span class="material-symbols-rounded">visibility</span>
            <span>Visual Learners</span>
          </div>
          <div class="stat-mini-value" id="visual-count">---</div>
        </div>
        <div class="stat-mini-card">
          <div class="stat-mini-header">
            <span class="material-symbols-rounded">volume_up</span>
            <span>Aural Learners</span>
          </div>
          <div class="stat-mini-value" id="aural-count">---</div>
        </div>
        <div class="stat-mini-card">
          <div class="stat-mini-header">
            <span class="material-symbols-rounded">menu_book</span>
            <span>Reading/Writing</span>
          </div>
          <div class="stat-mini-value" id="reading-count">---</div>
        </div>
        <div class="stat-mini-card">
          <div class="stat-mini-header">
            <span class="material-symbols-rounded">trackpad_input</span>
            <span>Kinesthetic</span>
          </div>
          <div class="stat-mini-value" id="kinesthetic-count">---</div>
        </div>
      </div>
    </section>

    <!-- Users Table Section -->
    <section class="section users-table-section">
      <div class="section-header">
        <h3>User List</h3>
        <span class="user-count" id="user-count">Showing 0 users</span>
      </div>

      <div class="table-container">
        <table class="users-table" id="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Learning Style</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="users-tbody">
            <tr class="loading-row">
              <td colspan="5" class="loading-placeholder">
                <span class="material-symbols-rounded">hourglass_empty</span>
                <p>Loading users...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <!-- Modal Overlay -->
  <div class="modal-overlay" id="modal-overlay"></div>

  <!-- User Detail Modal -->
  <div class="modal-wrapper" id="user-detail-modal">
    <div class="modal-header">
      <h2>Edit User Profile</h2>
      <button class="modal-close" id="close-modal">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>

    <div class="modal-body">
      <div class="user-detail-container">
        <!-- User Information Section -->
        <div class="detail-section">
          <h3>User Information</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <label>User ID: <span class="required">*</span></label>
              <input type="text" id="detail-user-id" class="detail-input" readonly>
              <small class="text-muted">User ID cannot be changed</small>
            </div>
            <div class="detail-item">
              <label>Username: <span class="required">*</span></label>
              <input type="text" id="detail-username" class="detail-input" placeholder="Enter username">
            </div>
            <div class="detail-item">
              <label>Email: <span class="required">*</span></label>
              <input type="email" id="detail-email" class="detail-input" placeholder="Enter email address">
            </div>
            
            <!-- Current Password Display Row -->
            <div class="detail-item">
              <label>Current Password:</label>
              <div class="password-display-field">
                <input type="password" id="detail-current-password" class="detail-input" readonly>
                <button type="button" class="btn-toggle-password" id="toggle-current-password-btn" title="Show/Hide Current Password">
                  <span class="material-symbols-rounded">visibility</span>
                </button>
              </div>
              <small class="text-muted">User's current password (read-only)</small>
            </div>

            <!-- New Password Field -->
            <div class="detail-item">
              <label>New Password:</label>
              <div class="password-field">
                <input type="password" id="detail-password" class="detail-input" placeholder="Leave blank to keep current password">
                <button type="button" class="btn-toggle-password" id="toggle-password-btn" title="Show/Hide New Password">
                  <span class="material-symbols-rounded">visibility</span>
                </button>
              </div>
              <small class="text-muted">Leave blank to keep current password</small>
            </div>

            <div class="detail-item">
              <label>Learning Style: <span class="required">*</span></label>
              <select id="detail-learning-style" class="detail-select">
                <option value="">Select Learning Style</option>
                <option value="Visual">Visual</option>
                <option value="Aural">Aural</option>
                <option value="Reading/Writing">Reading/Writing</option>
                <option value="Kinesthetic">Kinesthetic</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Change Summary -->
        <div class="detail-section" id="change-summary" style="display: none;">
          <h3>Changes Summary</h3>
          <div id="changes-list" class="changes-list"></div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary" id="cancel-edit-btn">Cancel</button>
      <button class="btn btn-primary" id="save-changes-btn">Save Changes</button>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" id="toast-notification"></div>

  <script>
    window.AppConfig = { baseUrl: '<?= BASE_URL ?>' };
  </script>
  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script src="<?= BASE_URL ?>/JS/user_manage_admin.js"></script>
</body>
</html>