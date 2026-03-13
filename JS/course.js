// Initialize Course Page
document.addEventListener('DOMContentLoaded', function() {
  setupCourseEventListeners();
});

// User data is now loaded dynamically via PHP in course.php

// Setup Course Event Listeners
function setupCourseEventListeners() {
  const courseCards = document.querySelectorAll('.course-card');

  courseCards.forEach(card => {
    card.addEventListener('click', function() {
      const courseId = this.getAttribute('data-course-id');
      if (courseId) {
        enrollCourse(courseId);
      }
    });
  });
}

// Enroll Course Function
function enrollCourse(courseId) {
  // Add visual feedback
  const card = document.querySelector(`[data-course-id="${courseId}"]`);
  if (card) {
    card.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
      card.style.animation = '';
    }, 600);
  }

  // Navigate to dynamic course detail page
  // Using the global AppConfig.baseUrl defined in course.php
  const baseUrl = window.AppConfig ? window.AppConfig.baseUrl : '';
  window.location.href = `${baseUrl}/student/course_details/course_details.php?id=${courseId}`;
}

// Get enrolled courses via API (to be implemented)
function getEnrolledCourses() {
  return []; // Placeholder until database progress tracking is integrated
}

// Check if user is enrolled in a course (to be implemented)
function isEnrolled(courseId) {
  return false; // Placeholder
}

// Logout handler (from dashboard.js)
function handleLogout() {
  localStorage.removeItem('profileData');
  localStorage.removeItem('enrolledCourses');
  sessionStorage.clear();
  alert('You have been logged out');
  window.location.href = 'registration/login.php';
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