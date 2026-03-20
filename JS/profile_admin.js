// Initialize Admin Profile Page
document.addEventListener('DOMContentLoaded', function() {
  loadAdminProfileData();
  setupAdminProfileEventListeners();
  setupTabNavigation();
  setupAvatarUpload();
});

// Load Admin Profile Data
function loadAdminProfileData() {
  // Initial display is now entirely rendered via PHP in profile.php
  // We no longer populate using localStorage!
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

  const submitBtn = document.querySelector('#personal-form .btn-save');
  const currentText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="material-symbols-rounded">sync</span> Saving...';
  submitBtn.disabled = true;

  // Get form data
  const formData = {
    fullName: document.getElementById('edit-full-name').value.trim(),
    email: document.getElementById('edit-email').value.trim()
  };

  // Validate data
  if (!formData.fullName || !formData.email) {
    alert('Please fill in all required fields');
    resetButton();
    return;
  }

  // Send AJAX request
  fetch((window.AppConfig?.baseUrl || '') + '/admin/profile/update_profile_api.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 200) {
      // Update display
      document.getElementById('admin-username').textContent = formData.fullName;
      document.getElementById('admin-email').textContent = formData.email;
      document.getElementById('user-name').textContent = formData.fullName;
      
      document.getElementById('view-full-name').textContent = formData.fullName;
      document.getElementById('view-email').textContent = formData.email;

      // Switch back to view mode
      switchToViewPersonal({preventDefault: () => {}});

      // Show success message
      showSuccessMessage(data.message || 'Personal information updated successfully!');
      
      // Attempt to reload the page completely after a short delay so the fresh Gravatar URL and server state loads
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } else {
      alert(data.message || 'Failed to update profile');
    }
  })
  .catch(error => {
    console.error('Error updating profile:', error);
    alert('A network error occurred. Please try again.');
  })
  .finally(() => {
    resetButton();
  });

  function resetButton() {
    submitBtn.innerHTML = currentText;
    submitBtn.disabled = false;
  }
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
  // Avatar uploading is now disabled from the frontend logic since
  // we rely on the direct Gravatar link placed in profile.php HTML.
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