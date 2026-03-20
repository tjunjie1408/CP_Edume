// Initialize Shared Layout & Dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  setActiveNav();
  setupSharedEventListeners();
  
  
  // Only run if progress bars exist (Dashboard only)
  if (document.querySelector('.progress-fill')) {
    animateProgressBars();
  }
  
  setupSidebarToggle();
  setupMobileMenu();
  initDarkMode();
});

// Set Active Navigation Link
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const navItem = link.closest('.nav-item');
    const href = link.getAttribute('href');
    
    if (href === currentPage) {
      navItem.classList.add('active');
    } else {
      navItem.classList.remove('active');
    }
  });
}

// Load User Data — Names are now rendered server-side by PHP via $_SESSION.
// This function is kept as a no-op so any callers don't break.
function loadUserData() {
  // PHP already injects the real username into #user-name and #banner-user-name.
  // No client-side override needed.
}

// Setup Shared Event Listeners
function setupSharedEventListeners() {
  // Navigation Links (Shared)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#logout') {
        e.preventDefault();
        handleLogout();
      }
    });
  });

  // Course Enrollment Buttons (Dashboard only)
  document.querySelectorAll('.btn-secondary').forEach(btn => {
    if (btn.closest('.course-card')) {
      btn.addEventListener('click', function() {
        const courseName = this.closest('.course-card').querySelector('h4').textContent;
        enrollCourse(courseName);
      });
    }
  });

  // Continue Learning Buttons (Dashboard only)
  document.querySelectorAll('.resume-course-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseName = this.closest('.resume-course-card').querySelector('h4').textContent;
      resumeCourse(courseName);
    });
  });
}

// Sidebar Toggle Functionality (Fixed 768px Breakpoint)
function setupSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggler');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      }
    });
  }

  if (window.innerWidth > 768 && localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
  }
}

// Mobile Menu Setup (Fixed 768px Breakpoint)
function setupMobileMenu() {
  const menuBtn = document.querySelector('.sidebar-menu-button');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('active');
        }
      });
    });
  }

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

// Notification System (Shared)
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? '#48dbfb' : type === 'error' ? '#ff6b6b' : '#667eea'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
    max-width: 90%;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles for notifications
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
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
  if (window.innerWidth > 768) {
    sidebar.classList.remove('active');
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  } else {
    sidebar.classList.remove('collapsed');
  }
});

// Initial check on page load
window.addEventListener('load', function() {
  const sidebar = document.querySelector('.sidebar');
  if (window.innerWidth > 768) {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  } else {
    sidebar.classList.remove('collapsed', 'active');
  }
});

//   VARK PERSONALIZED DASHBOARD LOGIC

// Initialize CodeMirror (Kinesthetic Sandbox)
let editor = null;
function initCodeMirror() {
  const textarea = document.getElementById('php-sandbox');
  if (textarea) {
    editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: "python",
      theme: "dracula",
      matchBrackets: true,
      indentUnit: 4,
      indentWithTabs: true
    });
  }
}

// Ensure CodeMirror is initialized if the text area is present
document.addEventListener('DOMContentLoaded', () => {
  initCodeMirror();
});

// Mock Compiler Logic
function runMockCompiler(editorId) {
  if (!editor) return;
  
  const code = editor.getValue();
  
  // Extremely lenient Regex: look for 'print' followed by 'Hello World' (ignoring quotes, spacing, casing)
  const isValid = /print\s*\(\s*['"]Hello\s+World['"]\s*\)/i.test(code);
  
  if (isValid) {
    showNotification("Mission Accomplished! You successfully wrote Hello World in Python! \uD83C\uDF89", "success");
  } else {
    showNotification("Oops! That doesn't look quite right. Did you type 'print(\"Hello World\")'?", "error");
  }
}

// Accordion Toggle (Visual Learner)
function toggleAccordion(id) {
  const el = document.getElementById(id);
  if(el) {
    el.classList.toggle('active');
  }
}

// Hint Toggle (Kinesthetic Learner)
function toggleHint(id) {
  const el = document.getElementById(id);
  if(el) {
    el.classList.toggle('hide');
  }
}

// Scroll to Sandbox helper
function scrollToSandbox() {
  showNotification("The full sandbox is available on the course player page!", "info");
}

// Dark Mode logic (Shared across site)
function initDarkMode() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
}