// Initialize Profile Page Only
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
  setupProfileEventListeners();
  setupTabNavigation();
});

// Load Profile Data
function loadProfileData() {
  // Attempt to load from storage first, fallback to defaults
  const savedData = sessionStorage.getItem('profileData');
  const profileData = savedData ? JSON.parse(savedData) : {
    username: 'John Doe',
    email: 'john@example.com',
    learningStyle: 'Visual',
    experience: 'Beginner',
    bio: 'I\'m a passionate learner interested in web development and programming. Always looking to improve my skills and stay updated with the latest technologies.',
    avatar: 'https://via.placeholder.com/120'
  };

  // Safe DOM updates
  const setElementText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  
  const setElementValue = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  const setElementSrc = (id, src) => {
    const el = document.getElementById(id);
    if (el) el.src = src;
  };

  // Update profile header
  setElementText('profile-username', profileData.username);
  setElementText('profile-email', profileData.email);
  setElementSrc('profileAvatar', profileData.avatar);
  setElementSrc('userAvatar', profileData.avatar); // The top right icon

  // Update view mode
  setElementText('view-username', profileData.username);
  setElementText('view-email', profileData.email);
  setElementText('view-learning-style', profileData.learningStyle);
  setElementText('view-experience', profileData.experience);
  setElementText('profile-bio', profileData.bio);

  // Update edit mode
  setElementValue('e-username', profileData.username);
  setElementValue('e-email', profileData.email);
  setElementValue('e-learning-style', profileData.learningStyle);
  setElementValue('e-experience', profileData.experience);
  
  sessionStorage.setItem('profileData', JSON.stringify(profileData));
}

// Setup Profile-Specific Event Listeners
function setupProfileEventListeners() {
  const editProfileBtn = document.getElementById('edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', switchToEdit);
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

// Switch to Edit Mode
function switchToEdit() {
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");
  const eUsername = document.getElementById("e-username");
  
  if (viewMode) viewMode.classList.add("hidden");
  if (editMode) editMode.classList.remove("hidden");
  if (eUsername) eUsername.focus();
}

// Cancel Edit
function cancelEdit() {
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");
  
  if (editMode) editMode.classList.add("hidden");
  if (viewMode) viewMode.classList.remove("hidden");
}

// Save Changes
function saveChanges() {
  const usernameInput = document.getElementById("e-username");
  const emailInput = document.getElementById("e-email");
  const learningStyleInput = document.getElementById("e-learning-style");
  const experienceInput = document.getElementById("e-experience");

  const profileData = {
    username: usernameInput ? usernameInput.value : '',
    email: emailInput ? emailInput.value : '',
    learningStyle: learningStyleInput ? learningStyleInput.value : '',
    experience: experienceInput ? experienceInput.value : ''
  };

  // Validation
  if (!profileData.username || !profileData.email) {
    if (typeof showNotification === 'function') {
      showNotification('Please fill in all required fields', 'error');
    }
    return;
  }

  if (!validateEmail(profileData.email)) {
    if (typeof showNotification === 'function') {
      showNotification('Please enter a valid email address', 'error');
    }
    return;
  }

  // Update UI safe
  const setElementText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setElementText('view-username', profileData.username);
  setElementText('view-email', profileData.email);
  setElementText('view-learning-style', profileData.learningStyle);
  setElementText('view-experience', profileData.experience);
  setElementText('profile-username', profileData.username);
  
  // Update header username (managed by dashboard layout)
  setElementText('user-name', profileData.username);

  // Save changes
  sessionStorage.setItem('profileData', JSON.stringify(profileData));

  // Trigger notification from dashboard.js
  if (typeof showNotification === 'function') {
    showNotification('Profile updated successfully!', 'success');
  }

  setTimeout(() => {
    cancelEdit();
  }, 500);
}

// Email Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}