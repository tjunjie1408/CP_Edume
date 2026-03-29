// Course Management Admin - Complete App with JSON Storage & Image Compression

let currentCourseId = null;
let currentSubjectId = null;
let currentEditingResourceId = null;
let currentEditingQuestionId = null;
let currentCourseImageBase64 = null;
let coursesData = {};
let changesMode = false;
let isSaving = false;

// UTILITY: Decode HTML entities sent from API
function decodeHtml(html) {
  if (!html) return '';
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  setupEventListeners();
  await loadCoursesData();
  displayCoursesList();
}

const API_URL = () => (window.AppConfig?.baseUrl || '') + '/admin/course_manage/admin_courses_api.php';

async function loadCoursesData() {
  try {
    const response = await fetch(API_URL());
    if (!response.ok) throw new Error('Failed to load courses');
    coursesData = await response.json();
    console.log('✓ Loaded courses from API:', Object.keys(coursesData).length, 'courses');
  } catch (error) {
    console.error('Error loading courses:', error);
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
 * LOCAL-ONLY save — real persistence happens in individual API calls.
 * This function just dispatches the update event for UI sync.
 */
function saveToStorage() {
  notifyCoursesUpdated();
  return true;
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

async function saveCourseChanges() {
  if (!currentSubjectId || !currentCourseId) return;
  if (isSaving) return;

  const subject = getSubject(currentCourseId, currentSubjectId);
  if (!subject) return;

  // Collect current values
  const titleEl = document.getElementById('subjectTitle');
  const titleInput = document.getElementById('subjectTitleInput');
  const overviewInput = document.getElementById('overviewInput');

  // Use input value if in edit mode, otherwise existing value
  const newTitle = (titleEl.style.display === 'none' && titleInput)
    ? titleInput.value.trim()
    : subject.title;
  const newOverview = overviewInput.classList.contains('active')
    ? overviewInput.value.trim()
    : (overviewInput.value.trim() || subject.overview || '');

  if (!newTitle) {
    showNotification('Title cannot be empty.', 'error');
    return;
  }

  isSaving = true;
  const saveBtn = document.getElementById('btnSaveChanges');
  if (saveBtn) { saveBtn.textContent = 'Saving...'; saveBtn.disabled = true; }

  try {
    const response = await fetch(API_URL() + '?action=chapter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentSubjectId, title: newTitle, overview: newOverview })
    });
    const result = await response.json();

    if (response.ok) {
      showNotification('✓ Saved successfully!', 'success');
      changesMode = false;
      // Reload course to refresh sidebar + content
      const courseResp = await fetch(API_URL() + `?course_id=${currentCourseId}`);
      const course = await courseResp.json();
      coursesData[currentCourseId] = course;
      displaySubjects(course.subjects);
    } else {
      showNotification('Failed to save: ' + (result.error || result.message || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Save error:', error);
    showNotification('Network error, please try again.', 'error');
  } finally {
    isSaving = false;
    if (saveBtn) { saveBtn.textContent = 'Save Changes'; saveBtn.disabled = false; }
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

// IMAGE UPLOAD HANDLING WITH COMPRESSION

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

// EVENT LISTENERS

function setupEventListeners() {
  // Course List View
  document.getElementById('btnAddNewCourse')?.addEventListener('click', openCourseModal);

  // Subject Editor
  document.getElementById('btnAddSubject')?.addEventListener('click', openSubjectModal);
  document.getElementById('btnEditSubject')?.addEventListener('click', toggleEditSubject);
  document.getElementById('btnDeleteSubject')?.addEventListener('click', deleteSubject);
  document.getElementById('btnSaveChanges')?.addEventListener('click', saveSubjectChanges);

  // Edit Toggles (only Overview remains)
  document.getElementById('btnEditOverview')?.addEventListener('click', (e) => toggleEditMode('overview', e));

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

// LEVEL 1: COURSES LIST VIEW

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
    
    if (imageSrc && !imageSrc.startsWith('data:') && !imageSrc.startsWith('http')) {
       const imgPath = imageSrc.startsWith('/') ? imageSrc : '/' + imageSrc;
       const baseUrl = window.AppConfig.baseUrl ? window.AppConfig.baseUrl.replace(/\/$/, '') : '';
       imageSrc = baseUrl + imgPath;
    }
    
    // Log image info for debugging
    console.log('Course:', course.name, 'Image:', course.image, 'ParsedSrc:', imageSrc);
    
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
          <p class="course-card-meta">${course.language} • ${course.subjectCount ?? course.subjects?.length ?? 0} subjects</p>
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

async function editCourse(courseId) {
  try {
    // Lazy load: fetch course + chapters from API
    const response = await fetch(API_URL() + `?course_id=${courseId}`);
    if (!response.ok) throw new Error('Failed to load course');
    const course = await response.json();

    // Store in local cache
    coursesData[courseId] = course;
    currentCourseId = courseId;

    document.getElementById('courseBreadcrumbName').textContent = `${course.name} (${course.language})`;
    document.getElementById('pageTitle').textContent = `${course.name}`;
    displaySubjects(course.subjects);

    document.getElementById('coursesListView').classList.add('hidden');
    document.getElementById('courseEditorView').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading course:', error);
    alert('Error: ' + error.message);
  }
}

function backToCoursesList() {
  document.getElementById('courseEditorView').classList.add('hidden');
  document.getElementById('coursesListView').classList.remove('hidden');
  document.getElementById('pageTitle').textContent = 'Course Management';
  currentCourseId = null;
  currentSubjectId = null;
}

async function deleteCourse(courseId) {
  if (confirm('Are you sure you want to delete this course? This cannot be undone.')) {
    try {
      const response = await fetch(API_URL() + `?action=course&id=${courseId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete course');

      delete coursesData[courseId];
      displayCoursesList();
      alert('✓ Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error: ' + error.message);
    }
  }
}

async function handleSaveCourse(e) {
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
    return;
  }

  try {
    const response = await fetch(API_URL() + '?action=course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, language, description, image: currentCourseImageBase64 })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to create course');

    // Reload courses from API
    await loadCoursesData();
    closeCourseModal();
    displayCoursesList();
    alert('✓ Course created successfully!');
  } catch (error) {
    console.error('Error creating course:', error);
    alert('Error: ' + error.message);
  }
}

// LEVEL 2: SUBJECT MANAGEMENT

function displaySubjects(subjects) {
  const subjectsList = document.getElementById('subjectsList');
  if (!subjectsList) return;

  const subjectEditorBody = document.getElementById('subjectEditorBody');
  
  if (subjects.length === 0) {
    subjectsList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No subjects yet</p>';
    
    // Hide the editor body instead of destroying its HTML
    if (subjectEditorBody) subjectEditorBody.style.display = 'none';
    
    // Show or create empty state message
    let emptyMsg = document.getElementById('subjectEmptyStateMsg');
    if (!emptyMsg) {
      emptyMsg = document.createElement('div');
      emptyMsg.id = 'subjectEmptyStateMsg';
      emptyMsg.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 2rem;">Click "+" to add a subject</p>';
      subjectEditorBody.parentNode.appendChild(emptyMsg);
    }
    emptyMsg.style.display = 'block';
    
    document.getElementById('subjectTitle').textContent = 'No Subjects';
    
    return;
  } else {
    if (subjectEditorBody) subjectEditorBody.style.display = 'block';
    const emptyMsg = document.getElementById('subjectEmptyStateMsg');
    if (emptyMsg) emptyMsg.style.display = 'none';
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

async function selectSubject(subjectId) {
  currentSubjectId = subjectId;

  // Lazy load: fetch chapter details from API
  try {
    const response = await fetch(API_URL() + `?chapter_id=${subjectId}`);
    if (!response.ok) throw new Error('Failed to load chapter');
    const subject = await response.json();

    // Update local cache
    const course = getCourse(currentCourseId);
    if (course) {
      const idx = course.subjects.findIndex(s => s.id === subjectId);
      if (idx !== -1) course.subjects[idx] = subject;
    }

    // Update active state
    document.querySelectorAll('.subject-item-admin').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.subjectId === String(subjectId)) {
        item.classList.add('active');
      }
    });

    displaySubjectEditor(subject);
    displayResources(subject.resources || []);
    displayQuiz(subject.quiz || []);
  } catch (error) {
    console.error('Error loading chapter details:', error);
    alert('Error: ' + error.message);
  }
}

function displaySubjectEditor(subject) {
  const decodedTitle = decodeHtml(subject.title);
  const decodedOverview = decodeHtml(subject.overview);

  document.getElementById('subjectTitle').textContent = decodedTitle;
  document.getElementById('subjectsTitle').textContent = `Subjects (${getCourse(currentCourseId).subjects.length})`;
  
  // Reset Subject title edit mode
  document.getElementById('subjectTitle').style.display = 'block';
  document.getElementById('subjectTitleInput').classList.add('hidden');
  document.getElementById('subjectTitleInput').value = decodedTitle;
  const btnEditSubj = document.getElementById('btnEditSubject');
  if (btnEditSubj) btnEditSubj.innerHTML = '<span class="material-symbols-rounded">edit</span>';

  // Reset Overview section back to VIEW mode
  const d = document.getElementById('overviewDisplay');
  const i = document.getElementById('overviewInput');
  const b = document.getElementById('btnEditOverview');
  if (d) d.style.display = 'block';
  if (i) { i.classList.remove('active'); i.classList.add('hidden'); i.value = decodedOverview; }
  if (b) b.innerHTML = '<span class="material-symbols-rounded">edit</span>';

  // Overview
  document.getElementById('overviewDisplay').innerHTML = decodedOverview 
    ? `<p>${decodedOverview}</p>` 
    : '<p style="color: var(--text-light); font-style: italic;">No overview set. Click edit to add one.</p>';
}

function toggleEditMode(section, e) {
  const display = document.getElementById(`${section}Display`);
  const input = document.getElementById(`${section}Input`);
  const button = (e || window.event).target.closest('.btn-edit-toggle');

  if (input.classList.contains('active')) {
    // LOCK UI MODE (Awaiting global save)
    const newValue = input.value.trim();
    display.innerHTML = newValue 
      ? `<p>${newValue}</p>` 
      : '<p style="color: var(--text-light); font-style: italic;">No overview set. Click edit to add one.</p>';
    display.style.display = 'block';
    input.classList.remove('active');
    input.classList.add('hidden');
    button.innerHTML = '<span class="material-symbols-rounded">edit</span>';
  } else {
    // EDIT MODE
    display.style.display = 'none';
    input.classList.remove('hidden');
    input.classList.add('active');
    button.innerHTML = '<span class="material-symbols-rounded">check</span>';
    input.focus();
  }
}

function toggleEditSubject(e) {
  const title = document.getElementById('subjectTitle');
  const input = document.getElementById('subjectTitleInput');
  const button = (e || window.event).target.closest('.btn-icon');

  if (title.style.display === 'none') {
    // LOCK UI MODE (Awaiting global save)
    const newTitle = input.value.trim();
    if (!newTitle) {
      showNotification('Title cannot be empty.', 'error');
      return;
    }
    title.textContent = newTitle;
    title.style.display = 'block';
    input.classList.add('hidden');
    button.innerHTML = '<span class="material-symbols-rounded">edit</span>';
  } else {
    // EDIT MODE
    input.value = title.textContent;
    title.style.display = 'none';
    input.classList.remove('hidden');
    button.innerHTML = '<span class="material-symbols-rounded">check</span>';
    input.focus();
  }
}

async function saveSubjectChanges() {
  if (!currentSubjectId) return;
  const btn = document.getElementById('btnSaveChanges');
  
  // Grab Title safely
  let newTitle = document.getElementById('subjectTitleInput').value.trim();
  if (document.getElementById('subjectTitleInput').classList.contains('hidden')) {
      newTitle = document.getElementById('subjectTitle').textContent.trim();
  }
  
  // Grab Overview safely
  let newOverview = document.getElementById('overviewInput').value.trim();
  if (document.getElementById('overviewInput').classList.contains('hidden')) {
      const p = document.querySelector('#overviewDisplay p');
      newOverview = p ? p.textContent.trim() : '';
      if (newOverview === 'No overview set. Click edit to add one.') newOverview = '';
  }

  if (!newTitle) {
    showNotification('Subject title cannot be empty.', 'error');
    return;
  }

  const originalText = btn.innerHTML;
  btn.innerHTML = 'Saving...';
  btn.disabled = true;

  try {
    const payload = { 
      id: currentSubjectId,
      title: newTitle,
      overview: newOverview
    };

    const response = await fetch(API_URL() + '?action=chapter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error('Failed to save subject changes');

    // Reload course exactly requested to deeply load active course and subjects cache
    const courseResp = await fetch(API_URL() + `?course_id=${currentCourseId}`);
    const course = await courseResp.json();
    coursesData[currentCourseId] = course;
    displaySubjects(course.subjects);
    
    // Attempt to re-select the subject after reload so UI completely refreshes
    selectSubject(currentSubjectId);
    
    showNotification('Saved successfully!', 'success');
  } catch (error) {
    console.error('Save changes error:', error);
    showNotification('Error saving: ' + error.message, 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}


async function deleteSubject() {
  if (!confirm('Delete this subject and all its content?')) return;
  if (isSaving) return;

  isSaving = true;
  try {
    const response = await fetch(API_URL() + `?action=chapter&id=${currentSubjectId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to delete subject');

    showNotification('✓ Subject deleted successfully', 'success');

    // Reload course to refresh sidebar
    const courseResp = await fetch(API_URL() + `?course_id=${currentCourseId}`);
    const course = await courseResp.json();
    coursesData[currentCourseId] = course;
    currentSubjectId = null;
    displaySubjects(course.subjects);
  } catch (error) {
    console.error('Delete subject error:', error);
    showNotification('Error: ' + error.message, 'error');
  } finally {
    isSaving = false;
  }
}

async function handleSaveSubject(e) {
  e.preventDefault();
  
  const name = document.getElementById('subjectName').value.trim();
  const level = document.getElementById('subjectLevel').value;

  if (!name || !level) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch(API_URL() + '?action=chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: currentCourseId, title: name, level })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to create chapter');

    // Reload course to get updated chapters
    const courseResp = await fetch(API_URL() + `?course_id=${currentCourseId}`);
    const course = await courseResp.json();
    coursesData[currentCourseId] = course;

    closeSubjectModal();
    displaySubjects(course.subjects);
    alert('✓ Subject created successfully. You can now add content!');
  } catch (error) {
    console.error('Error creating subject:', error);
    alert('Error: ' + error.message);
  }
}

// RESOURCES MANAGEMENT - With JSON

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
  document.getElementById('resourceContent').value = resource.content || '';
  document.getElementById('resourceDescription').value = resource.description || '';

  // Update modal title
  document.getElementById('resourceModalTitle').textContent = 'Edit Learning Resource';
  
  // Show modal
  updateResourceForm();
  document.getElementById('resourceModal').classList.add('active');
}

async function deleteResource(resourceId) {
  if (confirm('Delete this resource?')) {
    try {
      const response = await fetch(API_URL() + `?action=material&id=${resourceId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete resource');

      const subject = getSubject(currentCourseId, currentSubjectId);
      if (subject) {
        subject.resources = subject.resources.filter(r => r.id !== resourceId);
        displayResources(subject.resources);
      }
      alert('✓ Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Error: ' + error.message);
    }
  }
}

async function handleSaveResource(e) {
  e.preventDefault();
  
  const type = document.getElementById('resourceType').value;
  const title = document.getElementById('resourceTitle').value.trim();
  const url = document.getElementById('resourceUrl').value.trim();
  const description = document.getElementById('resourceDescription').value.trim();
  const content = document.getElementById('resourceContent') ? document.getElementById('resourceContent').value.trim() : '';

  if (!type || !title) {
    alert('Please fill in required fields (Type and Title)');
    return;
  }

  const subject = getSubject(currentCourseId, currentSubjectId);
  if (!subject) {
    alert('Subject not found');
    return;
  }

  try {
    const payload = {
      type,
      title,
      url,
      description,
      content
    };

    if (currentEditingResourceId) {
      // EDIT MODE: Update existing resource
      payload.id = currentEditingResourceId;
      const response = await fetch(API_URL() + '?action=material', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update resource');
    } else {
      // CREATE MODE: Add new resource
      payload.chapterId = currentSubjectId;
      const response = await fetch(API_URL() + '?action=material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create resource');
    }

    // Refresh subject to get new IDs/Data
    await selectSubject(currentSubjectId);
    closeResourceModal();
    alert('✓ Resource saved successfully');

  } catch (error) {
    console.error('Error saving resource:', error);
    alert('Error: ' + error.message);
  }
}

// QUIZ MANAGEMENT - With JSON

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

async function deleteQuestion(questionId) {
  if (confirm('Delete this question?')) {
    try {
      const response = await fetch(API_URL() + `?action=quiz_question&id=${questionId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete question');

      const subject = getSubject(currentCourseId, currentSubjectId);
      if (subject) {
        subject.quiz = subject.quiz.filter(q => q.id !== questionId);
        displayQuiz(subject.quiz);
      }
      alert('✓ Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error: ' + error.message);
    }
  }
}

async function handleSaveQuestion(e) {
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

  try {
    const payload = {
      question,
      options,
      correct: correctIndex,
      feedback
    };

    if (currentEditingQuestionId) {
      // EDIT MODE
      payload.id = currentEditingQuestionId;
      const response = await fetch(API_URL() + '?action=quiz_question', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update question');
    } else {
      // CREATE MODE
      payload.chapterId = currentSubjectId;
      const response = await fetch(API_URL() + '?action=quiz_question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create question');
    }

    // Refresh subject to get new IDs/Data
    await selectSubject(currentSubjectId);
    closeQuestionModal();
    alert('✓ Question saved successfully');

  } catch (error) {
    console.error('Error saving question:', error);
    alert('Error: ' + error.message);
  }
}

// TAB SWITCHING

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

// MODALS

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
  const contentLabel = document.querySelector('label[for="resourceContent"]');

  if (type === 'video') {
    urlGroup.style.display = 'block';
    contentGroup.style.display = 'none';
    urlLabel.textContent = 'Video URL (YouTube embed link)';
  } else if (type === 'document') {
    urlGroup.style.display = 'none';
    contentGroup.style.display = 'block';
    if (contentLabel) contentLabel.textContent = 'Document / Article Content';
  } else if (type === 'exercise') {
    urlGroup.style.display = 'none';
    contentGroup.style.display = 'block';
    if (contentLabel) contentLabel.textContent = 'Practice Problem';
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

// UTILITY FUNCTIONS

async function discardChanges() {
  if (!confirm('Are you sure you want to discard your unsaved changes?')) return;
  if (!currentSubjectId) return;

  try {
    // Re-fetch from API to discard local dirty data
    await selectSubject(currentSubjectId);
    showNotification('Changes discarded.', 'info');
  } catch (error) {
    console.error('Discard error:', error);
    showNotification('Error refreshing data.', 'error');
  }
}

// Listen for external updates
window.addEventListener('coursesDataUpdated', function(e) {
  console.log('📥 Courses updated externally:', e.detail);
});