// Initialize Admin Profile Page
document.addEventListener('DOMContentLoaded', function() {
  loadAdminProfileData();
  setupAdminProfileEventListeners();
  setupTabNavigation();
  setupAvatarUpload();
});

// Load Admin Profile Data
function loadAdminProfileData() {
  // Attempt to load from localStorage first, fallback to defaults
  const savedData = localStorage.getItem('adminProfileData');
  const adminProfileData = savedData ? JSON.parse(savedData) : {
    fullName: 'John Administrator',
    email: 'john.admin@example.com',
    phone: '+1 (555) 123-4567',
    department: 'System Administration',
    adminLevel: 'Super Administrator',
    accountStatus: 'Active',
    createdDate: 'January 15, 2024',
    lastLogin: 'Today at 10:30 AM',
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
  setElementText('admin-username', adminProfileData.fullName);
  setElementText('admin-email', adminProfileData.email);
  setElementText('admin-role-display', adminProfileData.adminLevel);
  setElementSrc('profileAdminAvatar', adminProfileData.avatar);
  setElementSrc('userAvatar', adminProfileData.avatar);
  setElementText('user-name', adminProfileData.fullName);

  // Update view mode
  setElementText('view-full-name', adminProfileData.fullName);
  setElementText('view-email', adminProfileData.email);
  setElementText('view-phone', adminProfileData.phone);
  setElementText('view-department', adminProfileData.department);
  setElementText('view-admin-level', adminProfileData.adminLevel);
  setElementText('view-account-status', adminProfileData.accountStatus);
  setElementText('view-created-date', adminProfileData.createdDate);
  setElementText('view-last-login', adminProfileData.lastLogin);

  // Update edit mode
  setElementValue('edit-full-name', adminProfileData.fullName);
  setElementValue('edit-email', adminProfileData.email);
  setElementValue('edit-phone', adminProfileData.phone);
  setElementValue('edit-department', adminProfileData.department);

  // Save to localStorage
  localStorage.setItem('adminProfileData', JSON.stringify(adminProfileData));
}

// Setup Admin Profile Event Listeners
function setupAdminProfileEventListeners() {
  const editPersonalBtn = document.getElementById('edit-personal-btn');
  const personalForm = document.getElementById('personal-form');
  const cancelPersonalBtn = document.getElementById('cancel-personal-btn');
  const changePasswordBtn = document.getElementById('change-password-btn');
  const twoFactorBtn = document.getElementById('two-factor-btn');

  if (editPersonalBtn) {
    editPersonalBtn.addEventListener('click', switchToEditPersonal);
  }

  if (personalForm) {
    personalForm.addEventListener('submit', savePersonalInfo);
  }

  if (cancelPersonalBtn) {
    cancelPersonalBtn.addEventListener('click', switchToViewPersonal);
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', handleChangePassword);
  }

  if (twoFactorBtn) {
    twoFactorBtn.addEventListener('click', handleTwoFactor);
  }
}

// Switch to Edit Mode - Personal Info
function switchToEditPersonal(e) {
  e.preventDefault();
  const viewMode = document.getElementById('personal-view');
  const editMode = document.getElementById('personal-edit');
  
  if (viewMode) viewMode.classList.add('hidden');
  if (editMode) editMode.classList.remove('hidden');
}

// Switch to View Mode - Personal Info
function switchToViewPersonal(e) {
  e.preventDefault();
  const viewMode = document.getElementById('personal-view');
  const editMode = document.getElementById('personal-edit');
  
  if (viewMode) viewMode.classList.remove('hidden');
  if (editMode) editMode.classList.add('hidden');
}

// Save Personal Information
function savePersonalInfo(e) {
  e.preventDefault();

  // Get form data
  const formData = {
    fullName: document.getElementById('edit-full-name').value,
    email: document.getElementById('edit-email').value,
    phone: document.getElementById('edit-phone').value,
    department: document.getElementById('edit-department').value
  };

  // Validate data
  if (!formData.fullName || !formData.email) {
    alert('Please fill in all required fields');
    return;
  }

  // Get existing data and update
  const savedData = localStorage.getItem('adminProfileData');
  const adminProfileData = savedData ? JSON.parse(savedData) : {};
  
  Object.assign(adminProfileData, formData);
  
  // Save to localStorage
  localStorage.setItem('adminProfileData', JSON.stringify(adminProfileData));

  // Update display
  document.getElementById('admin-username').textContent = formData.fullName;
  document.getElementById('admin-email').textContent = formData.email;
  document.getElementById('user-name').textContent = formData.fullName;
  
  document.getElementById('view-full-name').textContent = formData.fullName;
  document.getElementById('view-email').textContent = formData.email;
  document.getElementById('view-phone').textContent = formData.phone;
  document.getElementById('view-department').textContent = formData.department;

  // Switch back to view mode
  switchToViewPersonal({preventDefault: () => {}});

  // Show success message
  showSuccessMessage('Personal information updated successfully!');
}

// Setup Tab Navigation
function setupTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      openTab(tabName, this);
    });
  });
}

// Open Tab
function openTab(tabName, element) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  // Remove active class from all tab buttons
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab content
  const tabContent = document.getElementById(tabName);
  if (tabContent) {
    tabContent.classList.add('active');
  }

  // Add active class to clicked button
  element.classList.add('active');
}

// Setup Avatar Upload
function setupAvatarUpload() {
  const uploadTrigger = document.getElementById('avatar-upload-trigger');
  const uploadInput = document.getElementById('avatar-upload-input');

  if (uploadTrigger && uploadInput) {
    uploadTrigger.addEventListener('click', function() {
      uploadInput.click();
    });

    uploadInput.addEventListener('change', handleAvatarUpload);
  }
}

// Handle Avatar Upload
function handleAvatarUpload(e) {
  const file = e.target.files[0];
  
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      const imageData = event.target.result;
      
      // Update avatar images
      document.getElementById('profileAdminAvatar').src = imageData;
      document.getElementById('userAvatar').src = imageData;
      
      // Save to localStorage
      const savedData = localStorage.getItem('adminProfileData');
      const adminProfileData = savedData ? JSON.parse(savedData) : {};
      adminProfileData.avatar = imageData;
      localStorage.setItem('adminProfileData', JSON.stringify(adminProfileData));
      
      showSuccessMessage('Avatar updated successfully!');
    };
    
    reader.readAsDataURL(file);
  } else {
    alert('Please select a valid image file');
  }
}

// Handle Change Password
function handleChangePassword() {
  const newPassword = prompt('Enter your new password:');
  if (newPassword) {
    // In a real application, this would send to backend
    showSuccessMessage('Password changed successfully!');
  }
}

// Show Success Message
function showSuccessMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'success-message';
  msgDiv.textContent = message;
  msgDiv.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: #d4edda;
    color: #155724;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #28a745;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(msgDiv);
  
  setTimeout(() => {
    msgDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => msgDiv.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);