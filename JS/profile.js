// Initialize Profile Page Only
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
  setupProfileEventListeners();
  setupTabNavigation();
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
    alert('Please fill in all fields');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
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

  alert('Profile updated successfully!');
}

// Save Skills
function saveSkills() {
  const skillsInput = document.getElementById("e-skills").value.trim();

  if (!skillsInput) {
    alert('Please enter at least one skill');
    return;
  }

  const skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);

  if (skills.length === 0) {
    alert('Please enter at least one valid skill');
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

  alert('Skills updated successfully!');
}

// Save Bio
function saveBio() {
  const bio = document.getElementById("e-bio").value.trim();

  if (!bio) {
    alert('Please enter your bio');
    return;
  }

  if (bio.length > 500) {
    alert('Bio must be 500 characters or less');
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

  alert('Bio updated successfully!');
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}