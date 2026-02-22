// Course Management Admin - Complete App with JSON Storage & Image Compression

let currentCourseId = null;
let currentSubjectId = null;
let currentEditingResourceId = null;
let currentEditingQuestionId = null;
let currentCourseImageBase64 = null;
let coursesData = {};
let changesMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  loadCoursesData();
  setupEventListeners();
  displayCoursesList();
}

// ============================================
// LOAD & SAVE DATA - Using JSON Storage
// ============================================

const STORAGE_KEY = 'coursesDataAdmin';

function loadCoursesData() {
  // Try to load from localStorage first
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      coursesData = JSON.parse(saved);
      console.log('✓ Loaded courses from storage:', Object.keys(coursesData).length, 'courses');
    } catch (error) {
      console.error('Error parsing stored data:', error);
      initializeDefaultData();
    }
  } else {
    initializeDefaultData();
  }
}

function initializeDefaultData() {
  // Mock data - Replace with API call
  coursesData = {
    1: {
      id: 1,
      name: 'Python Programming',
      language: 'Python',
      description: 'Learn Python from basics to advanced',
      image: 'image/1.png',
      subjects: [
        {
          id: 1,
          title: 'Intro to Python',
          level: 'Beginner',
          overview: 'Get started with Python programming!',
          objectives: ['What is Python', 'Why Learn Python', 'Installation'],
          content: '<h4>What is Python?</h4><p>Python is a high-level programming language...</p>',
          resources: [
            { 
              id: 1, 
              type: 'video', 
              title: 'Python Setup', 
              url: 'https://youtube.com/embed/dQw4w9WgXcQ', 
              description: 'Installation guide' 
            },
            { 
              id: 2, 
              type: 'document', 
              title: 'Python Guide', 
              url: 'https://python.org' , 
              description: 'Official documentation' 
            }
          ],
          quiz: [
            {
              id: 1,
              question: 'What year was Python created?',
              options: ['1989', '1991', '1995', '2000'],
              correct: 1,
              feedback: 'Correct! Python was created in 1991 by Guido van Rossum.'
            },
            {
              id: 2,
              question: 'Who created Python?',
              options: ['Guido van Rossum', 'Bjarne Stroustrup', 'Dennis Ritchie', 'Brendan Eich'],
              correct: 0,
              feedback: 'Correct! Guido van Rossum created Python.'
            }
          ]
        },
        {
          id: 2,
          title: 'Python Syntax',
          level: 'Beginner',
          overview: 'Master Python syntax and structure',
          objectives: ['Indentation', 'Variables', 'Comments', 'Data Types'],
          content: '<h4>Python Indentation</h4><p>Indentation is crucial in Python...</p>',
          resources: [],
          quiz: []
        }
      ]
    },
    2: {
      id: 2,
      name: 'JavaScript Mastery',
      language: 'JavaScript',
      description: 'Master JavaScript fundamentals',
      image: 'image/12.png',
      subjects: []
    }
  };

  saveToStorage();
}

/**
 * CORE JSON SAVE FUNCTION - All changes go through here
 */
function saveToStorage() {
  try {
    const jsonString = JSON.stringify(coursesData, null, 2);
    localStorage.setItem(STORAGE_KEY, jsonString);
    console.log('✓ Data saved to localStorage');
    notifyCoursesUpdated();
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    alert('Error saving data. Please try again.');
    return false;
  }
}

/**
 * GET Course by ID
 */
function getCourse(courseId) {
  return coursesData[courseId] || null;
}

/**
 * GET Subject by Course ID and Subject ID
 */
function getSubject(courseId, subjectId) {
  const course = getCourse(courseId);
  return course ? course.subjects.find(s => s.id === subjectId) : null;
}

/**
 * GET Resource by IDs
 */
function getResource(courseId, subjectId, resourceId) {
  const subject = getSubject(courseId, subjectId);
  return subject ? subject.resources.find(r => r.id === resourceId) : null;
}

/**
 * GET Question by IDs
 */
function getQuestion(courseId, subjectId, questionId) {
  const subject = getSubject(courseId, subjectId);
  return subject ? subject.quiz.find(q => q.id === questionId) : null;
}

function saveCourseChanges() {
  if (!currentSubjectId || !currentCourseId) return;

  const subject = getSubject(currentCourseId, currentSubjectId);
  if (!subject) return;

  // Get updated values from display (if they're in edit mode)
  const overviewInput = document.getElementById('overviewInput');
  const contentInput = document.getElementById('contentInput');
  
  if (overviewInput.classList.contains('active')) {
    subject.overview = overviewInput.value;
  }
  
  if (contentInput.classList.contains('active')) {
    subject.content = contentInput.value;
  }
  
  if (saveToStorage()) {
    alert('✓ All changes saved successfully!');
    changesMode = false;
    // Refresh display
    displaySubjectEditor(subject);
  }
}

function notifyCoursesUpdated() {
  // Notify course.html and python.html about updates
  const event = new CustomEvent('coursesDataUpdated', {
    detail: { 
      timestamp: new Date().toISOString(), 
      data: coursesData 
    }
  });
  window.dispatchEvent(event);
  console.log('📢 Courses update event dispatched');
}

// ============================================
// IMAGE UPLOAD HANDLING WITH COMPRESSION
// ============================================

/**
 * Compress image using Canvas API
 * @param {File} file - The image file to compress
 * @param {Function} callback - Callback with compressed base64
 */
function compressImage(file, callback) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Create canvas
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions (max 400x400px)
      const maxSize = 400;
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with quality compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedBase64);
    };
    img.src = event.target.result;
  };
  
  reader.readAsDataURL(file);
}

function previewCourseImage(event) {
  const file = event.target.files[0];
  
  if (!file) {
    console.log('No file selected');
    return;
  }

  console.log('File selected:', file.name, file.type, (file.size / 1024).toFixed(2), 'KB');

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (PNG, JPG, GIF, etc.)');
    document.getElementById('courseImageUpload').value = '';
    return;
  }

  // Validate file size (max 10MB for original file)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('Image size should be less than 10MB. Your file is ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
    document.getElementById('courseImageUpload').value = '';
    return;
  }

  // Show loading state
  const previewBox = document.getElementById('imagePreview');
  previewBox.innerHTML = '<p style="color: var(--text-light);">Compressing image...</p>';

  // Compress image
  compressImage(file, function(compressedBase64) {
    try {
      currentCourseImageBase64 = compressedBase64;

      // Show preview with compressed image
      previewBox.classList.add('has-image');
      previewBox.innerHTML = `<img src="${compressedBase64}" alt="Course Logo Preview">`;

      const originalSizeKB = (file.size / 1024).toFixed(2);
      const compressedSizeKB = (compressedBase64.length / 1024).toFixed(2);
      const compressionPercent = (((file.size - compressedBase64.length) / file.size) * 100).toFixed(0);

      console.log('✓ Image compressed successfully');
      console.log('  Original size: ' + originalSizeKB + ' KB');
      console.log('  Compressed size: ' + compressedSizeKB + ' KB');
      console.log('  Compression: ' + compressionPercent + '%');
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Course List View
  document.getElementById('btnAddNewCourse')?.addEventListener('click', openCourseModal);

  // Subject Editor
  document.getElementById('btnAddSubject')?.addEventListener('click', openSubjectModal);
  document.getElementById('btnEditSubject')?.addEventListener('click', toggleEditSubject);
  document.getElementById('btnDeleteSubject')?.addEventListener('click', deleteSubject);
  document.getElementById('btnSaveChanges')?.addEventListener('click', saveCourseChanges);

  // Edit Toggles
  document.getElementById('btnEditOverview')?.addEventListener('click', () => toggleEditMode('overview'));
  document.getElementById('btnEditObjectives')?.addEventListener('click', handleObjectivesEdit);
  document.getElementById('btnEditContent')?.addEventListener('click', () => toggleEditMode('content'));

  // Resources & Quiz
  document.getElementById('btnAddResource')?.addEventListener('click', openResourceModal);
  document.getElementById('btnAddQuestion')?.addEventListener('click', openQuestionModal);

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Forms
  document.getElementById('courseForm')?.addEventListener('submit', handleSaveCourse);
  document.getElementById('subjectForm')?.addEventListener('submit', handleSaveSubject);
  document.getElementById('resourceForm')?.addEventListener('submit', handleSaveResource);
  document.getElementById('questionForm')?.addEventListener('submit', handleSaveQuestion);

  // Modal close on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });
}

// ============================================
// LEVEL 1: COURSES LIST VIEW
// ============================================

function displayCoursesList() {
  const coursesGrid = document.getElementById('coursesGrid');
  if (!coursesGrid) return;

  const courses = Object.values(coursesData);
  
  if (courses.length === 0) {
    coursesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 2rem;">No courses yet. Create one to get started.</p>';
    return;
  }

  coursesGrid.innerHTML = courses.map(course => {
    // Check if image is base64 or file path
    const isBase64 = course.image && course.image.startsWith('data:');
    let imageSrc = course.image;
    
    // Log image info for debugging
    console.log('Course:', course.name, 'Image:', course.image, 'Is Base64:', isBase64);
    
    return `
      <div class="course-card-admin">
        <div class="course-card-image">
          ${course.image ? `
            <img src="${imageSrc}" 
                 alt="${course.name}"
                 loading="lazy"
                 onerror="console.error('Image failed to load:', '${imageSrc}'); this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23667eea%22 width=%22150%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2230%22 fill=%22white%22 text-anchor=%22middle%22 dy=%22.3em%22%3E📚%3C/text%3E%3C/svg%3E'">
          ` : '<span class="material-symbols-rounded">image</span>'}
        </div>
        <div class="course-card-content">
          <h3>${course.name}</h3>
          <p class="course-card-meta">${course.language} • ${course.subjects.length} subjects</p>
          <div class="course-card-actions">
            <button class="btn-edit-course" onclick="editCourse(${course.id})">
              <span class="material-symbols-rounded">edit</span>
              Edit
            </button>
            <button class="btn-delete-course" onclick="deleteCourse(${course.id})">
              <span class="material-symbols-rounded">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function editCourse(courseId) {
  const course = getCourse(courseId);
  if (!course) {
    alert('Course not found');
    return;
  }

  currentCourseId = courseId;

  // Update header with course name and language
  document.getElementById('courseBreadcrumbName').textContent = `${course.name} (${course.language})`;
  document.getElementById('pageTitle').textContent = `${course.name}`;

  // Display subjects
  displaySubjects(course.subjects);

  // Switch views
  document.getElementById('coursesListView').classList.add('hidden');
  document.getElementById('courseEditorView').classList.remove('hidden');
}

function backToCoursesList() {
  document.getElementById('courseEditorView').classList.add('hidden');
  document.getElementById('coursesListView').classList.remove('hidden');
  document.getElementById('pageTitle').textContent = 'Course Management';
  currentCourseId = null;
  currentSubjectId = null;
}

function deleteCourse(courseId) {
  if (confirm('Are you sure you want to delete this course? This cannot be undone.')) {
    delete coursesData[courseId];
    if (saveToStorage()) {
      displayCoursesList();
      alert('✓ Course deleted successfully');
    }
  }
}

function handleSaveCourse(e) {
  e.preventDefault();
  
  const name = document.getElementById('courseName').value.trim();
  const language = document.getElementById('courseLanguage').value.trim();
  const description = document.getElementById('courseDescription').value.trim();

  if (!name || !language || !description) {
    alert('Please fill in all required fields (Course Name, Language, Description)');
    return;
  }

  if (!currentCourseImageBase64) {
    alert('Please upload a course logo image');
    console.warn('No image selected');
    return;
  }

  if (currentCourseImageBase64.length < 100) {
    alert('Image data is too small. Please try uploading again.');
    console.warn('Image data too small:', currentCourseImageBase64.length);
    return;
  }

  const newCourse = {
    id: Date.now(),
    name,
    language,
    description,
    image: currentCourseImageBase64,
    subjects: []
  };

  console.log('Creating new course with compressed image size:', (currentCourseImageBase64.length / 1024).toFixed(2), 'KB');

  coursesData[newCourse.id] = newCourse;
  
  if (saveToStorage()) {
    console.log('✓ Course saved to storage successfully');
    closeCourseModal();
    displayCoursesList();
    alert('✓ Course created successfully!');
  } else {
    console.error('Failed to save course to storage');
    alert('Error saving course. Please check console and try again.');
  }
}

// ============================================
// LEVEL 2: SUBJECT MANAGEMENT
// ============================================

function displaySubjects(subjects) {
  const subjectsList = document.getElementById('subjectsList');
  if (!subjectsList) return;

  if (subjects.length === 0) {
    subjectsList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No subjects yet</p>';
    document.getElementById('subjectEditorBody').innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 2rem;">Click "+" to add a subject</p>';
    return;
  }

  subjectsList.innerHTML = subjects.map((subject, index) => `
    <div class="subject-item-admin ${index === 0 ? 'active' : ''}" 
         onclick="selectSubject(${subject.id})" 
         data-subject-id="${subject.id}">
      <h4>${subject.title}</h4>
      <p>${subject.level} • ${subject.objectives?.length || 0} topics</p>
    </div>
  `).join('');

  if (subjects.length > 0) {
    selectSubject(subjects[0].id);
  }
}

function selectSubject(subjectId) {
  currentSubjectId = subjectId;
  const subject = getSubject(currentCourseId, subjectId);

  if (!subject) {
    console.error('Subject not found:', subjectId);
    return;
  }

  // Update active state
  document.querySelectorAll('.subject-item-admin').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.subjectId === String(subjectId)) {
      item.classList.add('active');
    }
  });

  // Display subject details
  displaySubjectEditor(subject);
  displayResources(subject.resources || []);
  displayQuiz(subject.quiz || []);
}

function displaySubjectEditor(subject) {
  document.getElementById('subjectTitle').textContent = subject.title;
  document.getElementById('subjectsTitle').textContent = `Subjects (${getCourse(currentCourseId).subjects.length})`;
  
  // Overview
  document.getElementById('overviewDisplay').innerHTML = subject.overview 
    ? `<p>${subject.overview}</p>` 
    : '<p style="color: var(--text-light); font-style: italic;">No overview set. Click edit to add one.</p>';
  document.getElementById('overviewInput').value = subject.overview || '';

  // Objectives
  const objectivesList = document.getElementById('objectivesList');
  if ((subject.objectives || []).length > 0) {
    objectivesList.innerHTML = subject.objectives.map(obj => `<li>${obj}</li>`).join('');
  } else {
    objectivesList.innerHTML = '<li style="color: var(--text-light); font-style: italic;">No objectives set. Click edit to add some.</li>';
  }

  // Content
  document.getElementById('contentDisplay').innerHTML = subject.content 
    ? subject.content 
    : '<p style="color: var(--text-light); font-style: italic;">No content set. Click edit to add content.</p>';
  document.getElementById('contentInput').value = subject.content || '';
}

function toggleEditMode(section) {
  const display = document.getElementById(`${section}Display`);
  const input = document.getElementById(`${section}Input`);
  const button = event.target.closest('.btn-edit-toggle');

  if (display.style.display === 'none') {
    // SAVE MODE - Hide input, show display
    const newValue = input.value.trim();
    
    if (section === 'overview') {
      display.innerHTML = newValue 
        ? `<p>${newValue}</p>` 
        : '<p style="color: var(--text-light); font-style: italic;">No overview set. Click edit to add one.</p>';
    } else if (section === 'content') {
      display.innerHTML = newValue 
        ? newValue 
        : '<p style="color: var(--text-light); font-style: italic;">No content set. Click edit to add content.</p>';
    }
    display.style.display = 'block';
    input.classList.remove('active');
    button.innerHTML = '<span class="material-symbols-rounded">edit</span>';
    
    // Save the changes
    const subject = getSubject(currentCourseId, currentSubjectId);
    if (subject) {
      if (section === 'overview') {
        subject.overview = newValue;
      } else if (section === 'content') {
        subject.content = newValue;
      }
      saveToStorage();
    }
  } else {
    // EDIT MODE - Show input, hide display
    display.style.display = 'none';
    input.classList.add('active');
    button.innerHTML = '<span class="material-symbols-rounded">check</span>';
    input.focus();
  }
}

function handleObjectivesEdit() {
  const display = document.getElementById('objectivesDisplay');
  const input = document.getElementById('objectivesInput');
  const button = event.target.closest('.btn-edit-toggle');
  
  const subject = getSubject(currentCourseId, currentSubjectId);
  if (!subject) return;

  if (display.style.display === 'none') {
    // SAVE MODE - Hide input, show display
    const objectiveInputs = Array.from(document.querySelectorAll('#objectivesEditList input[type="text"]'));
    const objectives = objectiveInputs
      .map(input => input.value.trim())
      .filter(val => val !== '');
    
    subject.objectives = objectives;
    saveToStorage();
    
    const objectivesList = document.getElementById('objectivesList');
    if (objectives.length > 0) {
      objectivesList.innerHTML = objectives.map(obj => `<li>${obj}</li>`).join('');
    } else {
      objectivesList.innerHTML = '<li style="color: var(--text-light); font-style: italic;">No objectives set. Click edit to add some.</li>';
    }
    
    display.style.display = 'block';
    input.classList.remove('active');
    button.innerHTML = '<span class="material-symbols-rounded">edit</span>';
  } else {
    // EDIT MODE - Show input, hide display
    const objectivesEditList = document.getElementById('objectivesEditList');
    objectivesEditList.innerHTML = '';
    
    // Create input fields for existing objectives
    (subject.objectives || []).forEach((obj, index) => {
      const inputDiv = document.createElement('div');
      inputDiv.style.display = 'flex';
      inputDiv.style.gap = '0.5rem';
      inputDiv.style.marginBottom = '0.5rem';
      inputDiv.innerHTML = `
        <input type="text" class="form-input" value="${obj}" placeholder="Objective ${index + 1}" style="flex: 1; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()" style="padding: 0.5rem 1rem; background: #f5576c; color: white; border: none; border-radius: 4px; cursor: pointer;">Remove</button>
      `;
      objectivesEditList.appendChild(inputDiv);
    });
    
    // Add button for new objective
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '+ Add Objective';
    addBtn.style.padding = '0.5rem 1rem';
    addBtn.style.background = 'var(--primary-color)';
    addBtn.style.color = 'white';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '4px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.marginTop = '0.5rem';
    addBtn.onclick = function(e) {
      e.preventDefault();
      const inputDiv = document.createElement('div');
      inputDiv.style.display = 'flex';
      inputDiv.style.gap = '0.5rem';
      inputDiv.style.marginBottom = '0.5rem';
      inputDiv.innerHTML = `
        <input type="text" class="form-input" placeholder="New Objective" style="flex: 1; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()" style="padding: 0.5rem 1rem; background: #f5576c; color: white; border: none; border-radius: 4px; cursor: pointer;">Remove</button>
      `;
      objectivesEditList.insertBefore(inputDiv, addBtn);
    };
    objectivesEditList.appendChild(addBtn);
    
    display.style.display = 'none';
    input.classList.add('active');
    button.innerHTML = '<span class="material-symbols-rounded">check</span>';
  }
}

function toggleEditSubject() {
  const title = document.getElementById('subjectTitle');
  const input = document.getElementById('subjectTitleInput');
  const button = event.target.closest('.btn-icon');

  if (title.style.display === 'none') {
    // SAVE MODE
    const subject = getSubject(currentCourseId, currentSubjectId);
    if (subject && input.value.trim()) {
      subject.title = input.value.trim();
      title.textContent = input.value.trim();
      title.style.display = 'block';
      input.classList.add('hidden');
      
      if (saveToStorage()) {
        displaySubjects(getCourse(currentCourseId).subjects);
      }
    }
  } else {
    // EDIT MODE
    input.value = title.textContent;
    title.style.display = 'none';
    input.classList.remove('hidden');
    input.focus();
  }
}

function deleteSubject() {
  if (confirm('Delete this subject and all its content?')) {
    const course = getCourse(currentCourseId);
    if (course) {
      course.subjects = course.subjects.filter(s => s.id !== currentSubjectId);
      
      if (saveToStorage()) {
        displaySubjects(course.subjects);
        currentSubjectId = null;
        alert('✓ Subject deleted successfully');
      }
    }
  }
}

function handleSaveSubject(e) {
  e.preventDefault();
  
  const name = document.getElementById('subjectName').value.trim();
  const level = document.getElementById('subjectLevel').value;

  if (!name || !level) {
    alert('Please fill in all required fields');
    return;
  }

  const newSubject = {
    id: Date.now(),
    title: name,
    level,
    overview: '',
    objectives: [],
    content: '',
    resources: [],
    quiz: []
  };

  const course = getCourse(currentCourseId);
  if (course) {
    course.subjects.push(newSubject);
    
    if (saveToStorage()) {
      closeSubjectModal();
      displaySubjects(course.subjects);
      // Automatically select the newly created subject
      selectSubject(newSubject.id);
      alert('✓ Subject created successfully. You can now add content!');
    }
  }
}

// ============================================
// RESOURCES MANAGEMENT - With JSON
// ============================================

function displayResources(resources) {
  const resourcesList = document.getElementById('resourcesList');
  if (!resourcesList) return;

  if (!resources || resources.length === 0) {
    resourcesList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No resources added yet</p>';
    return;
  }

  resourcesList.innerHTML = resources.map(resource => `
    <div class="resource-item">
      <div class="resource-info">
        <h4>${resource.title}</h4>
        <p>${resource.type} • ${resource.description || 'No description'}</p>
      </div>
      <div class="resource-actions">
        <button class="btn-icon" onclick="editResource(${resource.id})" title="Edit">
          <span class="material-symbols-rounded">edit</span>
        </button>
        <button class="btn-icon btn-delete" onclick="deleteResource(${resource.id})" title="Delete">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
    </div>
  `).join('');
}

function editResource(resourceId) {
  const resource = getResource(currentCourseId, currentSubjectId, resourceId);

  if (!resource) {
    console.error('Resource not found:', resourceId);
    alert('Resource not found');
    return;
  }

  console.log('Editing resource:', JSON.stringify(resource, null, 2));

  // Set editing mode
  currentEditingResourceId = resourceId;

  // Populate form with existing JSON data
  document.getElementById('resourceType').value = resource.type;
  document.getElementById('resourceTitle').value = resource.title;
  document.getElementById('resourceUrl').value = resource.url || '';
  document.getElementById('resourceDescription').value = resource.description || '';

  // Update modal title
  document.getElementById('resourceModalTitle').textContent = 'Edit Learning Resource';
  
  // Show modal
  updateResourceForm();
  document.getElementById('resourceModal').classList.add('active');
}

function deleteResource(resourceId) {
  if (confirm('Delete this resource?')) {
    const subject = getSubject(currentCourseId, currentSubjectId);
    if (subject) {
      subject.resources = subject.resources.filter(r => r.id !== resourceId);
      
      if (saveToStorage()) {
        displayResources(subject.resources);
        alert('✓ Resource deleted successfully');
      }
    }
  }
}

function handleSaveResource(e) {
  e.preventDefault();
  
  const type = document.getElementById('resourceType').value;
  const title = document.getElementById('resourceTitle').value.trim();
  const url = document.getElementById('resourceUrl').value.trim();
  const description = document.getElementById('resourceDescription').value.trim();

  if (!type || !title) {
    alert('Please fill in required fields (Type and Title)');
    return;
  }

  const subject = getSubject(currentCourseId, currentSubjectId);
  if (!subject) {
    alert('Subject not found');
    return;
  }

  if (currentEditingResourceId) {
    // EDIT MODE: Update existing resource from JSON
    const resource = subject.resources.find(r => r.id === currentEditingResourceId);
    if (resource) {
      resource.type = type;
      resource.title = title;
      resource.url = url;
      resource.description = description;
      console.log('✓ Resource updated in JSON:', JSON.stringify(resource, null, 2));
    }
  } else {
    // CREATE MODE: Add new resource to JSON
    const newResource = {
      id: Date.now(),
      type,
      title,
      url,
      description
    };
    subject.resources.push(newResource);
    console.log('✓ New resource added to JSON:', JSON.stringify(newResource, null, 2));
  }

  // Save to localStorage
  if (saveToStorage()) {
    displayResources(subject.resources);
    closeResourceModal();
    alert('✓ Resource saved successfully');
  }
}

// ============================================
// QUIZ MANAGEMENT - With JSON
// ============================================

function displayQuiz(quizzes) {
  const quizList = document.getElementById('quizList');
  if (!quizList) return;

  if (!quizzes || quizzes.length === 0) {
    quizList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No questions added yet</p>';
    return;
  }

  quizList.innerHTML = quizzes.map((q, idx) => `
    <div class="quiz-question-item">
      <div class="quiz-question-header">
        <span class="quiz-question-number">Q${idx + 1}</span>
        <div class="quiz-actions">
          <button class="btn-icon" onclick="editQuestion(${q.id})" title="Edit">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="btn-icon btn-delete" onclick="deleteQuestion(${q.id})" title="Delete">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </div>
      <div class="quiz-question-text">${q.question}</div>
      <ul class="quiz-question-options">
        ${q.options.map((opt, i) => `
          <li>
            ${opt}
            ${i === q.correct ? '<span class="quiz-correct-indicator"> ✓ CORRECT</span>' : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function editQuestion(questionId) {
  const question = getQuestion(currentCourseId, currentSubjectId, questionId);

  if (!question) {
    console.error('Question not found:', questionId);
    alert('Question not found');
    return;
  }

  console.log('Editing question:', JSON.stringify(question, null, 2));

  // Set editing mode
  currentEditingQuestionId = questionId;

  // Populate form with existing JSON data
  document.getElementById('questionText').value = question.question;
  document.getElementById('questionFeedback').value = question.feedback || '';

  // Clear and repopulate option inputs from JSON
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionHTML = `
      <div class="option-input-group">
        <input type="text" class="option-input" placeholder="Option ${String.fromCharCode(65 + index)}" value="${option}">
        <label class="radio-label">
          <input type="radio" name="correctAnswer" value="${index}" ${index === question.correct ? 'checked' : ''}>
          Correct
        </label>
      </div>
    `;
    optionsContainer.innerHTML += optionHTML;
  });

  // Update modal title
  document.getElementById('questionModalTitle').textContent = 'Edit Quiz Question';

  // Show modal
  document.getElementById('questionModal').classList.add('active');
}

function deleteQuestion(questionId) {
  if (confirm('Delete this question?')) {
    const subject = getSubject(currentCourseId, currentSubjectId);
    if (subject) {
      subject.quiz = subject.quiz.filter(q => q.id !== questionId);
      
      if (saveToStorage()) {
        displayQuiz(subject.quiz);
        alert('✓ Question deleted successfully');
      }
    }
  }
}

function handleSaveQuestion(e) {
  e.preventDefault();
  
  const question = document.getElementById('questionText').value.trim();
  const feedback = document.getElementById('questionFeedback').value.trim();
  const options = Array.from(document.querySelectorAll('.option-input'))
    .map(input => input.value.trim())
    .filter(val => val !== '');
  
  const correctRadio = document.querySelector('input[name="correctAnswer"]:checked');
  const correctIndex = correctRadio ? parseInt(correctRadio.value) : 0;

  if (!question || options.length < 2) {
    alert('Please enter a question and at least 2 options');
    return;
  }

  const subject = getSubject(currentCourseId, currentSubjectId);
  if (!subject) {
    alert('Subject not found');
    return;
  }

  if (currentEditingQuestionId) {
    // EDIT MODE: Update existing question from JSON
    const q = subject.quiz.find(qu => qu.id === currentEditingQuestionId);
    if (q) {
      q.question = question;
      q.options = options;
      q.correct = correctIndex;
      q.feedback = feedback;
      console.log('✓ Question updated in JSON:', JSON.stringify(q, null, 2));
    }
  } else {
    // CREATE MODE: Add new question to JSON
    const newQuestion = {
      id: Date.now(),
      question,
      options,
      correct: correctIndex,
      feedback
    };
    subject.quiz.push(newQuestion);
    console.log('✓ New question added to JSON:', JSON.stringify(newQuestion, null, 2));
  }

  // Save to localStorage
  if (saveToStorage()) {
    displayQuiz(subject.quiz);
    closeQuestionModal();
    alert('✓ Question saved successfully');
  }
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });

  // Update panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`${tabName}Panel`).classList.add('active');
}

// ============================================
// MODALS
// ============================================

function openCourseModal() {
  // Reset form
  document.getElementById('courseForm').reset();
  document.getElementById('courseModalTitle').textContent = 'Create New Course';
  
  // Reset image preview
  currentCourseImageBase64 = null;
  const previewBox = document.getElementById('imagePreview');
  previewBox.classList.remove('has-image');
  previewBox.innerHTML = `
    <span class="material-symbols-rounded">image</span>
    <p>Click to upload course logo</p>
  `;
  
  // Reset file input
  document.getElementById('courseImageUpload').value = '';
  
  // Show modal
  document.getElementById('courseModal').classList.add('active');
  
  console.log('Course modal opened');
}

function closeCourseModal() {
  document.getElementById('courseModal').classList.remove('active');
  document.getElementById('courseForm').reset();
  document.getElementById('courseImageUpload').value = '';
  currentCourseImageBase64 = null;
  
  console.log('Course modal closed');
}

function openSubjectModal() {
  document.getElementById('subjectForm').reset();
  document.getElementById('subjectModalTitle').textContent = 'Add New Subject';
  document.getElementById('subjectModal').classList.add('active');
}

function closeSubjectModal() {
  document.getElementById('subjectModal').classList.remove('active');
  document.getElementById('subjectForm').reset();
}

function openResourceModal() {
  // Reset editing mode
  currentEditingResourceId = null;
  
  document.getElementById('resourceForm').reset();
  document.getElementById('resourceModalTitle').textContent = 'Add Learning Resource';
  document.getElementById('resourceType').value = '';
  updateResourceForm();
  document.getElementById('resourceModal').classList.add('active');
}

function closeResourceModal() {
  document.getElementById('resourceModal').classList.remove('active');
  document.getElementById('resourceForm').reset();
  currentEditingResourceId = null;
}

function updateResourceForm() {
  const type = document.getElementById('resourceType').value;
  const urlGroup = document.getElementById('resourceUrlGroup');
  const contentGroup = document.getElementById('resourceContentGroup');
  const urlLabel = document.querySelector('label[for="resourceUrl"]');

  if (type === 'video') {
    urlGroup.style.display = 'block';
    contentGroup.style.display = 'none';
    urlLabel.textContent = 'Video URL (YouTube embed link)';
  } else if (type === 'exercise') {
    urlGroup.style.display = 'none';
    contentGroup.style.display = 'block';
  } else if (type === 'document') {
    urlGroup.style.display = 'block';
    contentGroup.style.display = 'none';
    urlLabel.textContent = 'Document Link';
  } else {
    urlGroup.style.display = 'block';
    contentGroup.style.display = 'none';
  }
}

function openQuestionModal() {
  // Reset editing mode
  currentEditingQuestionId = null;
  
  document.getElementById('questionForm').reset();
  document.getElementById('questionModalTitle').textContent = 'Add Quiz Question';
  
  // Reset option inputs to default 4 options
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const optionHTML = `
      <div class="option-input-group">
        <input type="text" class="option-input" placeholder="Option ${String.fromCharCode(65 + i)}">
        <label class="radio-label">
          <input type="radio" name="correctAnswer" value="${i}" ${i === 0 ? 'checked' : ''}>
          Correct
        </label>
      </div>
    `;
    optionsContainer.innerHTML += optionHTML;
  }
  
  document.getElementById('questionModal').classList.add('active');
}

function closeQuestionModal() {
  document.getElementById('questionModal').classList.remove('active');
  document.getElementById('questionForm').reset();
  currentEditingQuestionId = null;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function discardChanges() {
  if (confirm('Discard all changes?')) {
    selectSubject(currentSubjectId);
  }
}

// Listen for external updates
window.addEventListener('coursesDataUpdated', function(e) {
  console.log('📥 Courses updated externally:', e.detail);
});