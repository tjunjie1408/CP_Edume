// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  setupEventListeners();
  animateProgressBars();
  setupSidebarToggle();
  setupMobileMenu();
});

// Load User Data
function loadUserData() {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    learningStyle: 'Visual',
    profilePicture: 'https://via.placeholder.com/50'
  };

  document.getElementById('user-name').textContent = userData.name;
  document.getElementById('banner-user-name').textContent = userData.name;
  
  sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#logout') {
        e.preventDefault();
        handleLogout();
      }
    });
  });

  // Course Enrollment Buttons
  document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseName = this.closest('.course-card').querySelector('h4').textContent;
      enrollCourse(courseName);
    });
  });

  // Continue Learning Buttons
  document.querySelectorAll('.resume-course-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseName = this.closest('.resume-course-card').querySelector('h4').textContent;
      resumeCourse(courseName);
    });
  });
}

// Sidebar Toggle Functionality - Desktop Only
function setupSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggler');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      // Only toggle collapse on desktop (width > 768px)
      if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      }
    });
  }

  // Restore sidebar state on desktop only
  if (window.innerWidth > 768 && localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
  }
}

// Mobile Menu Setup
function setupMobileMenu() {
  const menuBtn = document.querySelector('.sidebar-menu-button');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('active');
        }
      });
    });
  }

  // Close sidebar when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    const isClickOnSidebar = e.target.closest('.sidebar');
    const isClickOnMenuBtn = e.target.closest('.sidebar-menu-button');
    
    if (!isClickOnSidebar && !isClickOnMenuBtn && window.innerWidth <= 768) {
      sidebar.classList.remove('active');
    }
  });
}

// Scroll to Section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Animate Progress Bars
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  bars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.transition = 'width 1s ease-in-out';
      bar.style.width = targetWidth;
    }, 100);
  });
}

// Enroll Course
function enrollCourse(courseName) {
  showNotification(`You have successfully enrolled in "${courseName}"!`, 'success');
  console.log(`Enrolled in: ${courseName}`);
}

// Resume Course
function resumeCourse(courseName) {
  showNotification(`Resuming "${courseName}"...`, 'info');
  console.log(`Resuming: ${courseName}`);
}

// Handle Logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.clear();
    localStorage.removeItem('sidebarCollapsed');
    window.location.href = 'login.html';
  }
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? '#48dbfb' : '#667eea'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
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

// Real-time Updates
function setupRealtimeUpdates() {
  setInterval(() => {
    console.log('Checking for updates...');
  }, 30000);
}

// Search Functionality
function searchCourses(query) {
  const courses = document.querySelectorAll('.course-card');
  courses.forEach(course => {
    const title = course.querySelector('h4').textContent.toLowerCase();
    if (title.includes(query.toLowerCase())) {
      course.style.display = 'block';
    } else {
      course.style.display = 'none';
    }
  });
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
  const sidebar = document.querySelector('.sidebar');
  
  // On desktop (> 768px)
  if (window.innerWidth > 768) {
    // Remove mobile active state
    sidebar.classList.remove('active');
    // Restore collapsed state if it was saved
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  } 
  // On mobile (≤ 768px)
  else {
    // Remove collapsed state on mobile
    sidebar.classList.remove('collapsed');
  }
});

// Initial check on page load
window.addEventListener('load', function() {
  const sidebar = document.querySelector('.sidebar');
  
  // On desktop
  if (window.innerWidth > 768) {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  } 
  // On mobile
  else {
    sidebar.classList.remove('collapsed', 'active');
  }
});