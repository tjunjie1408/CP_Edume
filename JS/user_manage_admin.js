// ============================================
// USER MANAGEMENT ADMIN DASHBOARD
// ============================================

// Store for current edit data
let currentEditingUser = null;
let allUsers = [];

// Initialize User Management Dashboard
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    initializeUserManagement();
  }, 100);
});

function initializeUserManagement() {
  loadUsers();
  setupEventListeners();
  setupSearchAndFilters();
  loadUserStatistics();
  setupAutoRefresh();
}

// ============================================
// LOAD USERS DATA
// ============================================

async function loadUsers() {
  try {
    showLoadingState();
    allUsers = await fetchUsersData();
    displayUsers(allUsers);
    updateUserCount(allUsers.length);
    hideLoadingState();
  } catch (error) {
    console.error('Error loading users:', error);
    showErrorMessage('Failed to load users');
  }
}

async function fetchUsersData() {
  // TODO: Replace with actual API endpoint
  // Example: const response = await fetch('/api/admin/users');
  
  // Load from localStorage or return mock data
  const savedUsers = localStorage.getItem('users_data');
  if (savedUsers) {
    try {
      return JSON.parse(savedUsers);
    } catch (error) {
      console.error('Error parsing saved users:', error);
    }
  }

  // Mock data structure matching your database schema
  return [
    {
      userID: 'USR001',
      username: 'sarah_j',
      email: 'sarah.johnson@example.com',
      password: 'hashed_password_1',
      learningStyle: 'Visual'
    },
    {
      userID: 'USR002',
      username: 'mike_chen',
      email: 'mike.chen@example.com',
      password: 'hashed_password_2',
      learningStyle: 'Aural'
    },
    {
      userID: 'USR003',
      username: 'emma_d',
      email: 'emma.davis@example.com',
      password: 'hashed_password_3',
      learningStyle: 'Reading/Writing'
    },
    {
      userID: 'USR004',
      username: 'john_smith',
      email: 'john.smith@example.com',
      password: 'hashed_password_4',
      learningStyle: 'Kinesthetic'
    },
    {
      userID: 'USR005',
      username: 'lisa_a',
      email: 'lisa.anderson@example.com',
      password: 'hashed_password_5',
      learningStyle: 'Visual'
    }
  ];
}

function displayUsers(users) {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '';

  if (!users || users.length === 0) {
    tbody.innerHTML = `
      <tr class="loading-row">
        <td colspan="5" class="loading-placeholder">
          <span class="material-symbols-rounded">person_off</span>
          <p>No users found</p>
        </td>
      </tr>
    `;
    return;
  }

  users.forEach(user => {
    const row = document.createElement('tr');
    const learningStyleClass = user.learningStyle.toLowerCase()
      .replace(/\s+/g, '')
      .replace('reading/writing', 'readingwriting');
    
    row.innerHTML = `
      <td>${user.userID}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td><span class="learning-style-badge ${learningStyleClass}">${user.learningStyle}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" title="Edit User" onclick="openUserModal('${user.userID}')">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="btn-delete" title="Delete" onclick="deleteUser('${user.userID}')">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ============================================
// USER STATISTICS
// ============================================

async function loadUserStatistics() {
  try {
    const users = await fetchUsersData();
    
    const totalUsers = users.length;
    const visualCount = users.filter(u => u.learningStyle === 'Visual').length;
    const auralCount = users.filter(u => u.learningStyle === 'Aural').length;
    const readingCount = users.filter(u => u.learningStyle === 'Reading/Writing').length;
    const kinestheticCount = users.filter(u => u.learningStyle === 'Kinesthetic').length;

    document.getElementById('total-users-count').textContent = totalUsers;
    document.getElementById('visual-count').textContent = visualCount;
    document.getElementById('aural-count').textContent = auralCount;
    document.getElementById('reading-count').textContent = readingCount;
    document.getElementById('kinesthetic-count').textContent = kinestheticCount;
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

// ============================================
// USER MODAL FUNCTIONS
// ============================================

async function openUserModal(userID) {
  try {
    const users = await fetchUsersData();
    const user = users.find(u => u.userID === userID);
    
    if (!user) {
      showErrorMessage('User not found');
      return;
    }

    currentEditingUser = { ...user };

    // Populate modal with user data
    document.getElementById('detail-user-id').value = user.userID;
    document.getElementById('detail-username').value = user.username;
    document.getElementById('detail-email').value = user.email;
    document.getElementById('detail-current-password').value = user.password; // Show current password
    document.getElementById('detail-password').value = ''; // Leave new password blank
    document.getElementById('detail-learning-style').value = user.learningStyle;

    // Reset change summary
    document.getElementById('change-summary').style.display = 'none';
    document.getElementById('changes-list').innerHTML = '';

    // Show modal
    const modal = document.getElementById('user-detail-modal');
    const overlay = document.getElementById('modal-overlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Reset scroll position to top
    setTimeout(() => {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }, 0);

  } catch (error) {
    console.error('Error opening user modal:', error);
    showErrorMessage('Failed to load user details');
  }
}

function closeUserModal() {
  const modal = document.getElementById('user-detail-modal');
  const overlay = document.getElementById('modal-overlay');
  
  modal.classList.remove('active');
  overlay.classList.remove('active');
  
  // Re-enable body scroll
  document.body.style.overflow = 'auto';
}

// ============================================
// DETECT CHANGES
// ============================================

function getChangedFields() {
  const changes = {};
  
  const username = document.getElementById('detail-username').value.trim();
  const email = document.getElementById('detail-email').value.trim();
  const password = document.getElementById('detail-password').value;
  const learningStyle = document.getElementById('detail-learning-style').value;

  // Check for required fields
  if (!username) {
    throw new Error('Username is required');
  }
  if (!email) {
    throw new Error('Email is required');
  }
  if (!learningStyle) {
    throw new Error('Learning Style is required');
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Detect changes
  if (username !== currentEditingUser.username) {
    changes.username = {
      from: currentEditingUser.username,
      to: username
    };
  }

  if (email !== currentEditingUser.email) {
    changes.email = {
      from: currentEditingUser.email,
      to: email
    };
  }

  if (password) {
    changes.password = {
      from: '***hidden***',
      to: '***new password set***'
    };
  }

  if (learningStyle !== currentEditingUser.learningStyle) {
    changes.learningStyle = {
      from: currentEditingUser.learningStyle,
      to: learningStyle
    };
  }

  return changes;
}

function displayChangesSummary(changes) {
  const changesList = document.getElementById('changes-list');
  changesList.innerHTML = '';

  const fieldLabels = {
    username: 'Username',
    email: 'Email',
    password: 'Password',
    learningStyle: 'Learning Style'
  };

  Object.keys(changes).forEach(field => {
    const change = changes[field];
    const changeItem = document.createElement('div');
    changeItem.className = 'change-item';
    changeItem.innerHTML = `
      <div class="change-field">${fieldLabels[field]}</div>
      <div class="change-from">From: ${change.from}</div>
      <div class="change-to">To: ${change.to}</div>
    `;
    changesList.appendChild(changeItem);
  });

  const changeSummary = document.getElementById('change-summary');
  changeSummary.style.display = 'block';
  
  // Scroll modal body to show changes summary
  const modalBody = document.querySelector('.modal-body');
  if (modalBody) {
    setTimeout(() => {
      modalBody.scrollTop = modalBody.scrollHeight;
    }, 50);
  }
}

// ============================================
// SAVE/UPDATE USER
// ============================================

async function saveUserChanges() {
  try {
    // Validate and get changes
    let changes;
    try {
      changes = getChangedFields();
    } catch (error) {
      showErrorMessage(error.message);
      return;
    }

    // If no changes, close modal
    if (Object.keys(changes).length === 0) {
      showInfoMessage('No changes made');
      closeUserModal();
      return;
    }

    // Display changes summary
    displayChangesSummary(changes);

    // Disable button while saving
    const saveBtn = document.getElementById('save-changes-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    // Fetch all users and update the target user
    let users = await fetchUsersData();
    const userIndex = users.findIndex(u => u.userID === currentEditingUser.userID);

    if (userIndex === -1) {
      showErrorMessage('User not found');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
      return;
    }

    // Update user data
    if (changes.username) {
      users[userIndex].username = changes.username.to.replace('***', 'new_username');
    }
    if (changes.email) {
      users[userIndex].email = changes.email.to;
    }
    if (changes.password) {
      // In production, this should be hashed on the backend
      users[userIndex].password = document.getElementById('detail-password').value;
    }
    if (changes.learningStyle) {
      users[userIndex].learningStyle = changes.learningStyle.to;
    }

    // Save to localStorage
    localStorage.setItem('users_data', JSON.stringify(users));

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/admin/users/${currentEditingUser.userID}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(users[userIndex])
    // });
    // if (!response.ok) throw new Error('Failed to save changes');

    showSuccessMessage('User information updated successfully!');
    
    // Reset button
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Changes';

    // Reload data and close modal
    await loadUsers();
    await loadUserStatistics();
    
    // Close modal after short delay
    setTimeout(() => {
      closeUserModal();
    }, 1000);

  } catch (error) {
    console.error('Error saving user:', error);
    showErrorMessage('Failed to save user changes');
    
    const saveBtn = document.getElementById('save-changes-btn');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Changes';
  }
}

// ============================================
// DELETE USER
// ============================================

async function deleteUser(userID) {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    return;
  }

  try {
    let users = await fetchUsersData();
    const deletedUser = users.find(u => u.userID === userID);
    
    users = users.filter(u => u.userID !== userID);

    // Save to localStorage
    localStorage.setItem('users_data', JSON.stringify(users));

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/admin/users/${userID}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete user');

    showSuccessMessage(`User ${deletedUser.username} deleted successfully`);
    await loadUsers();
    await loadUserStatistics();
  } catch (error) {
    console.error('Error deleting user:', error);
    showErrorMessage('Failed to delete user');
  }
}

// ============================================
// SEARCH AND FILTER
// ============================================

function setupSearchAndFilters() {
  const searchInput = document.getElementById('search-users');
  const learningStyleFilter = document.getElementById('filter-learning-style');

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleFilterChange = debounce(async () => {
    const searchTerm = searchInput.value.toLowerCase();
    const learningStyleValue = learningStyleFilter.value;

    let filtered = allUsers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.userID.toLowerCase().includes(searchTerm)
      );
    }

    // Learning style filter
    if (learningStyleValue) {
      filtered = filtered.filter(user => user.learningStyle === learningStyleValue);
    }

    displayUsers(filtered);
    updateUserCount(filtered.length);
  }, 300);

  searchInput.addEventListener('input', handleFilterChange);
  learningStyleFilter.addEventListener('change', handleFilterChange);
}

function updateUserCount(count) {
  const users = count === 1 ? 'user' : 'users';
  document.getElementById('user-count').textContent = `Showing ${count} ${users}`;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Modal close button
  document.getElementById('close-modal').addEventListener('click', closeUserModal);

  // Modal overlay click
  document.getElementById('modal-overlay').addEventListener('click', closeUserModal);

  // Cancel button
  document.getElementById('cancel-edit-btn').addEventListener('click', closeUserModal);

  // Save button
  document.getElementById('save-changes-btn').addEventListener('click', saveUserChanges);

  // Refresh button
  document.getElementById('refresh-users').addEventListener('click', () => {
    showInfoMessage('Refreshing user data...');
    loadUsers();
    loadUserStatistics();
  });

  // Export button
  document.getElementById('export-users').addEventListener('click', exportUsersToCSV);

  // Toggle current password visibility
  const toggleCurrentPasswordBtn = document.getElementById('toggle-current-password-btn');
  if (toggleCurrentPasswordBtn) {
    toggleCurrentPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const passwordInput = document.getElementById('detail-current-password');
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      // Update icon
      const icon = this.querySelector('.material-symbols-rounded');
      if (icon) {
        icon.textContent = isPassword ? 'visibility_off' : 'visibility';
      }
    });
  }

  // Toggle new password visibility
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const passwordInput = document.getElementById('detail-password');
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      // Update icon
      const icon = this.querySelector('.material-symbols-rounded');
      if (icon) {
        icon.textContent = isPassword ? 'visibility_off' : 'visibility';
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('user-detail-modal');
      if (modal && modal.classList.contains('active')) {
        closeUserModal();
      }
    }
  });
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

async function exportUsersToCSV() {
  try {
    const users = allUsers;
    
    if (users.length === 0) {
      showErrorMessage('No users to export');
      return;
    }

    // CSV headers
    const headers = ['User ID', 'Username', 'Email', 'Learning Style'];
    
    // CSV rows (don't include password in export for security)
    const rows = users.map(user => [
      user.userID,
      user.username,
      user.email,
      user.learningStyle
    ]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccessMessage(`Exported ${users.length} users successfully`);
  } catch (error) {
    console.error('Error exporting users:', error);
    showErrorMessage('Failed to export users');
  }
}

// ============================================
// AUTO-REFRESH
// ============================================

function setupAutoRefresh() {
  // Auto-refresh data every 10 minutes
  setInterval(() => {
    loadUsers();
    loadUserStatistics();
  }, 10 * 60 * 1000);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showSuccessMessage(message) {
  console.log('Success:', message);
  showToast(message, 'success');
}

function showErrorMessage(message) {
  console.error('Error:', message);
  showToast(message, 'error');
}

function showInfoMessage(message) {
  console.log('Info:', message);
  showToast(message, 'info');
}

function showLoadingState() {
  // Can add a global loading indicator here if needed
}

function hideLoadingState() {
  // Hide global loading indicator
}