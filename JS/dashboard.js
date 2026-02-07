// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  setupEventListeners();
  animateProgressBars();
});

// Load User Data
function loadUserData() {
  // This would typically come from your backend/API
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    learningStyle: 'Visual',
    profilePicture: 'https://via.placeholder.com/50'
  };

  document.getElementById('user-name').textContent = userData.name;
  
  // Store in session for later use
  sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation Links
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.href === '#logout') {
        e.preventDefault();
        handleLogout();
      }
    });
  });

  // Sidebar Links
  document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
    });
  });

  // Course Enrollment Buttons
  document.querySelectorAll('.course-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseName = this.closest('.course-card').querySelector('h3').textContent;
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
  alert(`You have successfully enrolled in "${courseName}"!`);
  // Add API call here to save enrollment to backend
  console.log(`Enrolled in: ${courseName}`);
}

// Resume Course
function resumeCourse(courseName) {
  alert(`Resuming "${courseName}"...`);
  // Redirect to course interface
  console.log(`Resuming: ${courseName}`);
}

// Handle Logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = 'login.html';
  }
}

// Real-time Updates (Placeholder for WebSocket/Server Updates)
function setupRealtimeUpdates() {
  // This would connect to your backend for real-time notifications
  setInterval(() => {
    // Check for new achievements, course updates, etc.
    console.log('Checking for updates...');
  }, 30000); // Check every 30 seconds
}

// Search Functionality (Example)
function searchCourses(query) {
  const courses = document.querySelectorAll('.course-card');
  courses.forEach(course => {
    const title = course.querySelector('h3').textContent.toLowerCase();
    if (title.includes(query.toLowerCase())) {
      course.style.display = 'block';
    } else {
      course.style.display = 'none';
    }
  });
}

// Theme Toggle (Optional)
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Store preference
  localStorage.setItem('theme', newTheme);
  
  // Apply theme changes (you can extend this with more CSS variables)
  if (newTheme === 'dark') {
    root.style.setProperty('--light-bg', '#1a1a2e');
    root.style.setProperty('--card-bg', '#16213e');
    root.style.setProperty('--text-dark', '#eaeaea');
  } else {
    root.style.setProperty('--light-bg', '#f5f6fa');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--text-dark', '#2c3e50');
  }
}

// Notification System (Example)
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Initialize realtime updates
setupRealtimeUpdates();