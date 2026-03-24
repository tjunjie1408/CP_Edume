// Admin Dashboard Initialization
// Wait for dashboard.js to load first
document.addEventListener('DOMContentLoaded', function() {
  // Load admin-specific data after shared functions are ready
  setTimeout(function() {
    initializeAdminDashboard();
  }, 100);
});

// Initialize Admin Dashboard
function initializeAdminDashboard() {
  loadAdminData();
  setupAdminEventListeners();
  initializeCharts();
  setupRefreshTimer();
}

// Load Admin Data from Backend
async function loadAdminData() {
  try {
    // Show loading state
    showLoadingState();

    // Fetch data from backend API
    const adminData = await fetchAdminDashboardData();

    // Update statistics
    updateStatistics(adminData.statistics);

    // Update charts
    updateVARKChart(adminData.varkDistribution);
    updateActivityChart(adminData.userActivity);

    // Update lists
    updateTopCourses(adminData.topCourses);
    updateRecentUsers(adminData.recentUsers);

    // Update system health
    updateSystemHealth(adminData.systemHealth);

    // Hide loading state
    hideLoadingState();
  } catch (error) {
    console.error('Error loading admin data:', error);
    showErrorMessage('Failed to load dashboard data');
  }
}

// Fetch Admin Dashboard Data from Backend API
async function fetchAdminDashboardData() {
  const response = await fetch(window.AppConfig?.baseUrl
    ? window.AppConfig.baseUrl + '/admin/dashboard/admin_dashboard_api.php'
    : 'admin_dashboard_api.php');

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to fetch dashboard data');
  }

  return await response.json();
}

// Update Statistics Cards
function updateStatistics(stats) {
  // Total Users
  const usersValue = document.getElementById('total-users-value');
  const usersChange = document.getElementById('total-users-change');
  if (usersValue) usersValue.textContent = formatNumber(stats.totalUsers);
  if (usersChange) usersChange.textContent = stats.usersChange;

  // Total Courses
  const coursesValue = document.getElementById('total-courses-value');
  const coursesChange = document.getElementById('total-courses-change');
  if (coursesValue) coursesValue.textContent = formatNumber(stats.totalCourses);
  if (coursesChange) coursesChange.textContent = stats.coursesChange;

  // Total Enrollments
  const enrollmentsValue = document.getElementById('total-enrollments-value');
  const enrollmentsChange = document.getElementById('total-enrollments-change');
  if (enrollmentsValue) enrollmentsValue.textContent = formatNumber(stats.totalEnrollments);
  if (enrollmentsChange) enrollmentsChange.textContent = stats.enrollmentsChange;

  // Completion Rate
  const rateValue = document.getElementById('completion-rate-value');
  const rateChange = document.getElementById('completion-rate-change');
  if (rateValue) rateValue.textContent = stats.completionRate + '%';
  if (rateChange) rateChange.textContent = stats.completionRateChange;
}

// Initialize Charts
function initializeCharts() {
  initializeVARKChart();
  initializeActivityChart();
}

// Initialize VARK Chart
let varkChart = null;
function initializeVARKChart() {
  const ctx = document.getElementById('vark-chart');
  if (!ctx) return;

  varkChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Visual', 'Aural', 'Reading/Writing', 'Kinesthetic'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe'
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Update VARK Chart
function updateVARKChart(varkData) {
  if (!varkChart) {
    initializeVARKChart();
  }

  if (varkChart) {
    varkChart.data.datasets[0].data = [
      varkData.visual,
      varkData.aural,
      varkData.reading,
      varkData.kinesthetic
    ];
    varkChart.update();
  }

  // Update legend
  const legendItems = [
    { key: 'visual', value: varkData.visual },
    { key: 'aural', value: varkData.aural },
    { key: 'reading', value: varkData.reading },
    { key: 'kinesthetic', value: varkData.kinesthetic }
  ];

  const legendElements = document.querySelectorAll('.chart-legend .legend-item');
  legendElements.forEach((element, index) => {
    const valueSpan = element.querySelector('.legend-value');
    if (valueSpan && legendItems[index]) {
      valueSpan.textContent = `(${legendItems[index].value})`;
    }
  });
}

// Initialize Activity Chart
let activityChart = null;
function initializeActivityChart() {
  const ctx = document.getElementById('activity-chart');
  if (!ctx) return;

  activityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'User Activity',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'rgba(102, 126, 234, 0.7)'
          },
          grid: {
            color: 'rgba(102, 126, 234, 0.1)'
          }
        },
        x: {
          ticks: {
            color: 'rgba(102, 126, 234, 0.7)'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Update Activity Chart
function updateActivityChart(activityData) {
  if (!activityChart) {
    initializeActivityChart();
  }

  if (activityChart) {
    activityChart.data.labels = activityData.labels;
    activityChart.data.datasets[0].data = activityData.data;
    activityChart.update();
  }
}

// Update Top Courses List
function updateTopCourses(courses) {
  const coursesList = document.getElementById('top-courses-list');
  if (!coursesList) return;
  
  coursesList.innerHTML = '';

  if (!courses || courses.length === 0) {
    coursesList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No courses available</p>';
    return;
  }

  courses.forEach((course, index) => {
    const enrollText = course.enrollments > 0
      ? `<strong>${course.enrollments}</strong> enrollment${course.enrollments > 1 ? 's' : ''}`
      : '<em style="color: var(--text-light);">No enrollments yet</em>';
    const chapterText = course.chapterCount != null
      ? ` • ${course.chapterCount} chapter${course.chapterCount !== 1 ? 's' : ''}`
      : '';

    const courseElement = document.createElement('div');
    courseElement.className = 'course-item';
    courseElement.innerHTML = `
      <div class="course-item-header">
        <span class="course-item-name">${index + 1}. ${course.name}</span>
        <span class="course-item-badge">#${index + 1}</span>
      </div>
      <div class="course-item-stats">
        <span>${enrollText}${chapterText}</span>
      </div>
    `;
    coursesList.appendChild(courseElement);
  });
}

// Update Recent Users List
function updateRecentUsers(users) {
  const usersList = document.getElementById('recent-users-list');
  if (!usersList) return;
  
  usersList.innerHTML = '';

  if (!users || users.length === 0) {
    usersList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No recent users</p>';
    return;
  }

  users.forEach((user) => {
    const userElement = document.createElement('div');
    userElement.className = 'user-item';
    userElement.innerHTML = `
      <img src="${user.avatar}" alt="${user.name}" class="user-avatar-small">
      <div class="user-info-content">
        <span class="user-name">${user.name}</span>
        <span class="user-email">${user.email}</span>
      </div>
      <span class="user-join-date">${formatDate(user.joinDate)}</span>
    `;
    usersList.appendChild(userElement);
  });
}

// Update System Health
function updateSystemHealth(healthData) {
  const healthContainer = document.getElementById('system-health');
  if (!healthContainer) return;

  Object.keys(healthData).forEach(key => {
    const healthItem = healthContainer.querySelector(`[data-health="${key}"]`);
    if (healthItem) {
      const health = healthData[key];
      const statusElement = healthItem.querySelector('.health-status');
      const valueElement = healthItem.querySelector('.health-value');

      // Update status indicator
      statusElement.className = `health-status ${health.status}`;

      // Update value
      if (key === 'database') {
        valueElement.textContent = `Load: ${health.load}`;
      } else if (key === 'api') {
        valueElement.textContent = `Response: ${health.responseTime}`;
      } else if (key === 'storage') {
        valueElement.textContent = `Usage: ${health.usage}`;
      } else {
        valueElement.textContent = health.uptime || health.status;
      }
    }
  });
}

// Setup Event Listeners
function setupAdminEventListeners() {
  // Refresh button
  const refreshBtn = document.getElementById('refresh-stats');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = 'spin 2s linear';
      }, 10);
      loadAdminData();
    });
  }
}

// Setup Refresh Timer
function setupRefreshTimer() {
  // Auto-refresh data every 5 minutes
  setInterval(loadAdminData, 5 * 60 * 1000);
}

// Utility Functions
function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function showLoadingState() {
  // You can add a global loading indicator here if needed
}

function hideLoadingState() {
  // Hide global loading indicator
}

function showErrorMessage(message) {
  console.error(message);
  // You can show an error toast/notification here
  if (typeof showNotification === 'function') {
    showNotification(message, 'error');
  }
}