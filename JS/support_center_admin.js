// ============================================
// SUPPORT CENTER ADMIN - Main Logic
// ============================================

// Global Variables
let allReports = [];
let filteredReports = [];
let currentPage = 1;
const reportsPerPage = 10;
let currentEditingReportId = null;

// Initialize Support Center
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  setActiveNav();
  loadReports();
  setupEventListeners();
  updateStatistics();
});

// Setup Event Listeners
function setupEventListeners() {
  // Search
  document.getElementById('searchInput').addEventListener('input', filterReports);

  // Filters
  document.getElementById('statusFilter').addEventListener('change', filterReports);
  document.getElementById('courseFilter').addEventListener('change', filterReports);

  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', function() {
    this.style.animation = 'none';
    setTimeout(() => {
      this.style.animation = 'spin 2s linear';
    }, 10);
    loadReports();
  });

  // Pagination
  document.getElementById('prevBtn').addEventListener('click', previousPage);
  document.getElementById('nextBtn').addEventListener('click', nextPage);

  // Modal close on overlay click
  document.getElementById('reportModal').addEventListener('click', function(e) {
    if (e.target === this) closeReportModal();
  });

  document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) closeDeleteModal();
  });
}

// Load Reports Data
async function loadReports() {
  try {
    // Show loading state
    const tableBody = document.getElementById('reportsTableBody');
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;"><p>Loading reports...</p></td></tr>';

    // Fetch from backend or use mock data
    const response = await fetchReportsData();
    allReports = response;

    // Perform initial filter
    filterReports();
    updateStatistics();

  } catch (error) {
    console.error('Error loading reports:', error);
    showErrorMessage('Failed to load reports');
  }
}

// Fetch Reports Data (Mock or API)
async function fetchReportsData() {
  // TODO: Replace with actual API endpoint
  // Example: const response = await fetch('/api/admin/reports');
  // const data = await response.json();
  // return data;

  // Mock data structure with only pending and resolved status
  return [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userEmail: 'sarah@example.com',
      course: 'Python',
      content: 'There is a typo in chapter 3 about loops. The code example shows "for i in range(10)" but the explanation says "range(5)". Please fix this inconsistency.',
      submitDate: '2024-02-22T10:30:00',
      status: 'pending',
      notes: ''
    },
    {
      id: 2,
      userName: 'Mike Chen',
      userEmail: 'mike@example.com',
      course: 'JavaScript',
      content: 'The quiz question on async/await is confusing. The explanation doesn\'t match the correct answer. Please review this question.',
      submitDate: '2024-02-21T14:15:00',
      status: 'resolved',
      notes: 'Fixed on 2024-02-21. Updated explanation and correct answer.'
    },
    {
      id: 3,
      userName: 'Emma Davis',
      userEmail: 'emma@example.com',
      course: 'Web Development',
      content: 'The video link in lesson 2 is broken. It returns a 404 error. The YouTube link needs to be updated.',
      submitDate: '2024-02-20T09:45:00',
      status: 'resolved',
      notes: 'Fixed on 2024-02-21. New video link added.'
    },
    {
      id: 4,
      userName: 'John Smith',
      userEmail: 'john@example.com',
      course: 'Data Science',
      content: 'In the data visualization section, the matplotlib example doesn\'t run. There\'s an import error. Please provide a corrected version.',
      submitDate: '2024-02-19T16:20:00',
      status: 'pending',
      notes: ''
    },
    {
      id: 5,
      userName: 'Lisa Wong',
      userEmail: 'lisa@example.com',
      course: 'Python',
      content: 'Chapter 5 resources are outdated. The pandas documentation links point to old versions.',
      submitDate: '2024-02-18T11:00:00',
      status: 'pending',
      notes: ''
    },
    {
      id: 6,
      userName: 'Alex Turner',
      userEmail: 'alex@example.com',
      course: 'JavaScript',
      content: 'Great course! Just a suggestion - could you add more real-world project examples?',
      submitDate: '2024-02-17T13:30:00',
      status: 'resolved',
      notes: 'Suggestion noted for future updates'
    },
    {
      id: 7,
      userName: 'Rachel Green',
      userEmail: 'rachel@example.com',
      course: 'Web Development',
      content: 'The CSS grid section has outdated browser compatibility information. Modern browsers support all features now.',
      submitDate: '2024-02-16T10:15:00',
      status: 'pending',
      notes: ''
    },
    {
      id: 8,
      userName: 'Tom Harris',
      userEmail: 'tom@example.com',
      course: 'Python',
      content: 'The quiz feedback for question 3 is incomplete. It doesn\'t explain why other options are wrong.',
      submitDate: '2024-02-15T15:45:00',
      status: 'pending',
      notes: ''
    }
  ];
}

// Filter Reports
function filterReports() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const courseFilter = document.getElementById('courseFilter').value;

  filteredReports = allReports.filter(report => {
    const matchesSearch = report.userName.toLowerCase().includes(searchTerm) ||
                         report.course.toLowerCase().includes(searchTerm) ||
                         report.content.toLowerCase().includes(searchTerm) ||
                         report.userEmail.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesCourse = !courseFilter || report.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  currentPage = 1;
  displayReports();
}

// Display Reports in Table
function displayReports() {
  const tableBody = document.getElementById('reportsTableBody');
  const emptyState = document.getElementById('emptyState');
  const reportCount = document.getElementById('reportCount');

  if (filteredReports.length === 0) {
    tableBody.style.display = 'none';
    emptyState.style.display = 'block';
    reportCount.textContent = '0 reports';
    document.getElementById('paginationSection').style.display = 'none';
    return;
  }

  tableBody.style.display = 'table-row-group';
  emptyState.style.display = 'none';
  reportCount.textContent = `${filteredReports.length} report${filteredReports.length !== 1 ? 's' : ''}`;

  // Pagination
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Clear table
  tableBody.innerHTML = '';

  // Add rows
  paginatedReports.forEach(report => {
    const row = createReportRow(report);
    tableBody.appendChild(row);
  });

  // Show/hide pagination
  if (filteredReports.length > reportsPerPage) {
    document.getElementById('paginationSection').style.display = 'flex';
    updatePaginationButtons();
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${Math.ceil(filteredReports.length / reportsPerPage)}`;
  } else {
    document.getElementById('paginationSection').style.display = 'none';
  }
}

// Create Report Row
function createReportRow(report) {
  const row = document.createElement('tr');
  row.dataset.reportId = report.id;

  const statusBadge = `<span class="status-badge ${report.status}">${report.status}</span>`;
  
  const contentPreview = report.content.length > 50 
    ? report.content.substring(0, 50) + '...' 
    : report.content;

  const dateFormatted = formatDate(report.submitDate);

  row.innerHTML = `
    <td class="col-status">${statusBadge}</td>
    <td class="col-user">${report.userName}</td>
    <td class="col-course">${report.course}</td>
    <td class="col-date">${dateFormatted}</td>
    <td class="col-content">
      <div class="content-preview">${contentPreview}</div>
    </td>
    <td class="col-actions">
      <div class="action-buttons">
        <button class="btn-icon" title="View Details" onclick="viewReport(${report.id})">
          <span class="material-symbols-rounded">visibility</span>
        </button>
        <button class="btn-icon btn-delete" title="Delete" onclick="deleteReport(${report.id})">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
    </td>
  `;

  return row;
}

// View Report Details
function viewReport(reportId) {
  const report = allReports.find(r => r.id === reportId);
  if (!report) return;

  currentEditingReportId = reportId;

  // Populate modal
  document.getElementById('modalUserName').textContent = report.userName;
  document.getElementById('modalUserEmail').textContent = report.userEmail;
  document.getElementById('modalCourse').textContent = report.course;
  document.getElementById('modalDate').textContent = formatDate(report.submitDate);
  document.getElementById('modalStatus').innerHTML = `<span class="status-badge ${report.status}">${report.status}</span>`;
  document.getElementById('modalContent').textContent = report.content;
  document.getElementById('adminNotes').value = report.notes || '';

  // Update button text based on status
  const markResolvedBtn = document.getElementById('markResolvedBtn');
  if (report.status === 'pending') {
    markResolvedBtn.textContent = 'Mark Resolved';
  } else {
    markResolvedBtn.textContent = 'Mark Pending';
  }

  // Show modal
  document.getElementById('reportModal').classList.add('active');
}

// Toggle Report Status (Pending <-> Resolved)
function toggleReportStatus() {
  const report = allReports.find(r => r.id === currentEditingReportId);
  if (!report) return;

  // Toggle between pending and resolved
  report.status = report.status === 'pending' ? 'resolved' : 'pending';
  report.notes = document.getElementById('adminNotes').value;

  saveReports();
  filterReports();
  closeReportModal();
  
  const newStatus = report.status === 'pending' ? 'Pending' : 'Resolved';
  showNotification(`✓ Report marked as ${newStatus}`, 'success');
}

// Delete Report
function deleteReport(reportId) {
  currentEditingReportId = reportId;
  document.getElementById('deleteModal').classList.add('active');
}

function confirmDelete() {
  allReports = allReports.filter(r => r.id !== currentEditingReportId);
  saveReports();
  filterReports();
  closeDeleteModal();
  
  showNotification('✓ Report deleted successfully', 'success');
}

// Pagination Functions
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayReports();
    scrollToTop();
  }
}

function nextPage() {
  const maxPage = Math.ceil(filteredReports.length / reportsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    displayReports();
    scrollToTop();
  }
}

function updatePaginationButtons() {
  const maxPage = Math.ceil(filteredReports.length / reportsPerPage);
  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = currentPage === maxPage;
}

// Update Statistics
function updateStatistics() {
  const totalReports = allReports.length;
  const pendingReports = allReports.filter(r => r.status === 'pending').length;
  const resolvedReports = allReports.filter(r => r.status === 'resolved').length;

  document.getElementById('totalReports').textContent = totalReports;
  document.getElementById('pendingReports').textContent = pendingReports;
  document.getElementById('resolvedReports').textContent = resolvedReports;
}

// Modal Functions
function closeReportModal() {
  document.getElementById('reportModal').classList.remove('active');
  currentEditingReportId = null;
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('active');
  currentEditingReportId = null;
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function scrollToTop() {
  document.querySelector('.reports-section').scrollIntoView({ behavior: 'smooth' });
}

function saveReports() {
  // TODO: Save to backend
  // fetch('/api/admin/reports', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(allReports)
  // });
  console.log('Reports saved:', allReports);
}

function showNotification(message, type = 'info') {
  // Use existing notification function from dashboard.js if available
  if (typeof showNotification === 'function') {
    showNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

function showErrorMessage(message) {
  console.error(message);
  if (typeof showNotification === 'function') {
    showNotification(message, 'error');
  }
}

// Add animation for refresh button
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);