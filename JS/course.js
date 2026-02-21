// Initialize Course Page
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  setupCourseEventListeners();
});

// Load User Data
function loadUserData() {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    learningStyle: 'Visual',
    profilePicture: 'https://via.placeholder.com/50'
  };

  const userNameEl = document.getElementById('user-name');
  const userAvatarEl = document.getElementById('userAvatar');

  if (userNameEl) userNameEl.textContent = userData.name;
  if (userAvatarEl) userAvatarEl.src = userData.profilePicture;

  sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Setup Course Event Listeners
function setupCourseEventListeners() {
  const courseCards = document.querySelectorAll('.course-card');

  courseCards.forEach(card => {
    card.addEventListener('click', function() {
      const language = this.getAttribute('data-language');
      enrollCourse(language);
    });
  });
}

// Enroll Course Function
function enrollCourse(courseName) {
  // Get enrolled courses from localStorage
  const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

  // Check if already enrolled
  if (enrolledCourses.includes(courseName)) {
    alert(`You are already enrolled in ${courseName}!`);
    return;
  }

  // Add to enrolled courses
  enrolledCourses.push(courseName);
  localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));

  // Optional: Add visual feedback
  const card = document.querySelector(`[data-language="${courseName}"]`);
  if (card) {
    card.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
      card.style.animation = '';
    }, 600);
  }

  console.log('Enrolled courses:', enrolledCourses);
}

// Get enrolled courses
function getEnrolledCourses() {
  return JSON.parse(localStorage.getItem('enrolledCourses')) || [];
}

// Check if user is enrolled in a course
function isEnrolled(courseName) {
  return getEnrolledCourses().includes(courseName);
}

// Logout handler (from dashboard.js)
function handleLogout() {
  localStorage.removeItem('profileData');
  localStorage.removeItem('enrolledCourses');
  sessionStorage.clear();
  alert('You have been logged out');
  window.location.href = 'loginpage.html';
}

// Pulse animation for enrollment feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);