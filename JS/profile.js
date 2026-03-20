// Initialize Profile Page Only
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
  setupProfileEventListeners();
  setupTabNavigation();
  setupSettingsEventListeners();
  setupAvatarUpload();
});

// Load Profile Data
function loadProfileData() {
  // Initial page data is now rendered directly via PHP in profile.php
  // using $userData and $skills. We no longer use localStorage mock data.
}

// Display Skills
function displaySkills(skills) {
  const skillsView = document.getElementById('skillsView');
  if (skillsView) {
    skillsView.innerHTML = '';
    skills.forEach(skill => {
      const skillBadge = document.createElement('div');
      skillBadge.className = 'skill-badge';
      skillBadge.textContent = skill.trim();
      skillsView.appendChild(skillBadge);
    });
  }
}

// Setup Profile-Specific Event Listeners
function setupProfileEventListeners() {
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const editSkillsBtn = document.getElementById('edit-skills-btn');
  const editBioBtn = document.getElementById('edit-bio-btn');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', switchToEdit);
  }

  if (editSkillsBtn) {
    editSkillsBtn.addEventListener('click', switchToEditSkills);
  }

  if (editBioBtn) {
    editBioBtn.addEventListener('click', switchToEditBio);
  }
}

// Setup Tab Navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      this.classList.add('active');
      const tabTarget = document.getElementById(tabName + '-tab');
      if (tabTarget) tabTarget.classList.add('active');
    });
  });
}

// ============================================
// AVATAR UPLOAD FEATURE 
// ============================================

function setupAvatarUpload() {
  // Avatar uploading is now disabled from the frontend logic since
  // we rely on the direct Gravatar link placed in profile.php HTML.
}

// Show Notification
function showNotification(message, type = 'info') {
  // Add animation styles if not already present
  if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Determine background color based on type
  let bgColor = '#667eea'; // info
  if (type === 'success') bgColor = '#48dbfb';
  if (type === 'error') bgColor = '#ff6b6b';
  if (type === 'warning') bgColor = '#ffa502';

  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
    max-width: 90%;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// SETTINGS EVENT LISTENERS
// ============================================

function setupSettingsEventListeners() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const emailNotifToggle = document.getElementById('email-notif-toggle');

  if (darkModeToggle) {
    darkModeToggle.checked = localStorage.getItem('theme') === 'dark';
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        showNotification('Dark Mode enabled!', 'success');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        showNotification('Light Mode enabled!', 'info');
      }
    });
  }

  if (emailNotifToggle) {
    emailNotifToggle.addEventListener('change', function() {
      const isEnabled = this.checked;
      
      fetch((window.AppConfig?.baseUrl || '') + '/student/profile/update_settings_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: isEnabled })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          showNotification(data.message || 'Notification settings updated.', 'success');
        } else {
          showNotification(data.message || 'Failed to update settings.', 'error');
          this.checked = !isEnabled; // revert
        }
      })
      .catch(err => {
        showNotification('Network error occurred.', 'error');
        this.checked = !isEnabled; // revert
      });
    });
  }
}

// ============================================
// PROFILE EDITING FUNCTIONS
// ============================================

// Switch to Edit Mode - Personal Information
function switchToEdit() {
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");
  const eUsername = document.getElementById("e-username");
  
  if (viewMode) viewMode.classList.add("hidden");
  if (editMode) editMode.classList.remove("hidden");
  if (eUsername) eUsername.focus();
}

// Switch to Edit Mode - Skills
function switchToEditSkills() {
  const viewMode = document.getElementById("skillsViewMode");
  const editMode = document.getElementById("skillsEditMode");
  
  if (viewMode) viewMode.classList.add("hidden");
  if (editMode) editMode.classList.remove("hidden");
}

// Switch to Edit Mode - Bio
function switchToEditBio() {
  const viewMode = document.getElementById("bioViewMode");
  const editMode = document.getElementById("bioEditMode");
  
  if (viewMode) viewMode.classList.add("hidden");
  if (editMode) editMode.classList.remove("hidden");
}

// Cancel Edit - Personal Information
function cancelEdit() {
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");
  
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  loadProfileData();
}

// Cancel Edit - Skills
function cancelEditSkills() {
  const viewMode = document.getElementById("skillsViewMode");
  const editMode = document.getElementById("skillsEditMode");
  
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  loadProfileData();
}

// Cancel Edit - Bio
function cancelEditBio() {
  const viewMode = document.getElementById("bioViewMode");
  const editMode = document.getElementById("bioEditMode");
  
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  loadProfileData();
}

// Save Changes - Personal Information
function saveChanges() {
  const btn = document.querySelector('#editMode .btn-save');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-rounded">sync</span> Saving...';
  btn.disabled = true;

  const username = document.getElementById("e-username").value.trim();
  const email = document.getElementById("e-email").value.trim();
  const learningStyle = document.getElementById("e-learning-style").value;
  const experience = document.getElementById("e-experience").value;

  if (!username || !email) {
    showNotification('Name and Email are required', 'warning');
    resetBtn(btn, originalHtml);
    return;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    resetBtn(btn, originalHtml);
    return;
  }

  const formData = { username, email, learningStyle, experience };

  fetch((window.AppConfig?.baseUrl || '') + '/student/profile/update_student_profile_api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(resp => resp.json())
  .then(data => {
    if (data.status === 200) {
      showNotification(data.message || 'Profile updated successfully!', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showNotification(data.message || 'Failed to update', 'error');
      resetBtn(btn, originalHtml);
    }
  })
  .catch(err => {
    console.error(err);
    showNotification('Network error occurred', 'error');
    resetBtn(btn, originalHtml);
  });
}

function resetBtn(btn, originalHtml) {
  btn.innerHTML = originalHtml;
  btn.disabled = false;
}

// Save Skills
function saveSkills() {
  const btn = document.querySelector('#skillsEditMode .btn-save');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-rounded">sync</span> Saving...';
  btn.disabled = true;

  const skillsInput = document.getElementById("e-skills").value.trim();
  const skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);

  fetch((window.AppConfig?.baseUrl || '') + '/student/profile/update_skills_api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills })
  })
  .then(resp => resp.json())
  .then(data => {
    if (data.status === 200) {
      showNotification(data.message || 'Skills updated successfully!', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showNotification(data.message || 'Failed to update skills', 'error');
      resetBtn(btn, originalHtml);
    }
  })
  .catch(err => {
    console.error(err);
    showNotification('Network error occurred', 'error');
    resetBtn(btn, originalHtml);
  });
}

// Save Bio
function saveBio() {
  const btn = document.querySelector('#bioEditMode .btn-save');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-rounded">sync</span> Saving...';
  btn.disabled = true;

  const bio = document.getElementById("e-bio").value.trim();

  if (bio.length > 500) {
    showNotification('Bio must be 500 characters or less', 'error');
    resetBtn(btn, originalHtml);
    return;
  }

  fetch((window.AppConfig?.baseUrl || '') + '/student/profile/update_bio_api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio })
  })
  .then(resp => resp.json())
  .then(data => {
    if (data.status === 200) {
      showNotification(data.message || 'Bio updated successfully!', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showNotification(data.message || 'Failed to update bio', 'error');
      resetBtn(btn, originalHtml);
    }
  })
  .catch(err => {
    console.error(err);
    showNotification('Network error occurred', 'error');
    resetBtn(btn, originalHtml);
  });
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}