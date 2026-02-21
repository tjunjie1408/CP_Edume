// Initialize Profile Page Only
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
  setupProfileEventListeners();
  setupTabNavigation();
  setupAvatarUpload();
});

// Load Profile Data
function loadProfileData() {
  // Attempt to load from localStorage first, fallback to defaults
  const savedData = localStorage.getItem('profileData');
  const profileData = savedData ? JSON.parse(savedData) : {
    username: 'John Doe',
    email: 'john@example.com',
    learningStyle: 'Visual',
    experience: 'Beginner',
    bio: 'I\'m a passionate learner interested in web development and programming. Always looking to improve my skills and stay updated with the latest technologies.',
    skills: ['React', 'JavaScript', 'CSS', 'HTML5', 'Node.js', 'Web Design'],
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
  setElementSrc('userAvatar', profileData.avatar);

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

  // Load skills
  displaySkills(profileData.skills);
  setElementValue('e-skills', profileData.skills.join(', '));

  // Load bio
  setElementValue('e-bio', profileData.bio);

  localStorage.setItem('profileData', JSON.stringify(profileData));
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

// Setup Avatar Upload
function setupAvatarUpload() {
  const avatarEditBtn = document.getElementById('avatar-edit-btn');
  const avatarFileInput = document.getElementById('avatar-file-input');

  if (avatarEditBtn) {
    avatarEditBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      avatarFileInput.click();
    });
  }

  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', handleAvatarChange);
  }
}

// Handle Avatar File Change
function handleAvatarChange(event) {
  const file = event.target.files[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showNotification('Please select an image file', 'error');
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showNotification('File size must be less than 5MB', 'error');
    return;
  }

  // Read file and convert to base64
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const base64Image = e.target.result;

    // Update avatar in profile
    updateAvatar(base64Image);

    // Save to localStorage
    saveAvatarToStorage(base64Image);

    // Show success message
    showNotification('Avatar updated successfully!', 'success');
  };

  reader.onerror = function() {
    showNotification('Error reading file', 'error');
  };

  reader.readAsDataURL(file);

  // Reset file input
  event.target.value = '';
}

// Update Avatar Display
function updateAvatar(imageData) {
  const profileAvatar = document.getElementById('profileAvatar');
  const userAvatar = document.getElementById('userAvatar');

  if (profileAvatar) {
    profileAvatar.src = imageData;
  }

  if (userAvatar) {
    userAvatar.src = imageData;
  }
}

// Save Avatar to Storage
function saveAvatarToStorage(imageData) {
  const savedData = localStorage.getItem('profileData');
  const profileData = savedData ? JSON.parse(savedData) : {};

  profileData.avatar = imageData;

  localStorage.setItem('profileData', JSON.stringify(profileData));
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
  const username = document.getElementById("e-username").value.trim();
  const email = document.getElementById("e-email").value.trim();
  const learningStyle = document.getElementById("e-learning-style").value;
  const experience = document.getElementById("e-experience").value;

  if (!username || !email || !learningStyle || !experience) {
    showNotification('Please fill in all fields', 'warning');
    return;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }

  const savedData = localStorage.getItem('profileData');
  const profileData = savedData ? JSON.parse(savedData) : {};

  profileData.username = username;
  profileData.email = email;
  profileData.learningStyle = learningStyle;
  profileData.experience = experience;

  localStorage.setItem('profileData', JSON.stringify(profileData));

  loadProfileData();

  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");
  
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  showNotification('Profile updated successfully!', 'success');
}

// Save Skills
function saveSkills() {
  const skillsInput = document.getElementById("e-skills").value.trim();

  if (!skillsInput) {
    showNotification('Please enter at least one skill', 'warning');
    return;
  }

  const skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);

  if (skills.length === 0) {
    showNotification('Please enter at least one valid skill', 'warning');
    return;
  }

  const savedData = localStorage.getItem('profileData');
  const profileData = savedData ? JSON.parse(savedData) : {};

  profileData.skills = skills;

  localStorage.setItem('profileData', JSON.stringify(profileData));

  displaySkills(skills);

  const viewMode = document.getElementById("skillsViewMode");
  const editMode = document.getElementById("skillsEditMode");
  
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  showNotification('Skills updated successfully!', 'success');
}

// Save Bio
function saveBio() {
  const bio = document.getElementById("e-bio").value.trim();

  if (!bio) {
    showNotification('Please enter your bio', 'warning');
    return;
  }

  if (bio.length > 500) {
    showNotification('Bio must be 500 characters or less', 'error');
    return;
  }

  const savedData = localStorage.getItem('profileData');
  const profileData = savedData ? JSON.parse(savedData) : {};

  profileData.bio = bio;

  localStorage.setItem('profileData', JSON.stringify(profileData));

  document.getElementById('profile-bio').textContent = bio;

  const viewMode = document.getElementById("bioViewMode");
  const editMode = document.getElementById("bioEditMode");
  
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  showNotification('Bio updated successfully!', 'success');
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}