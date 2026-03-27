// ============================================
// COURSE DETAILS - MAIN SCRIPT WITH REPORT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupReportForm();
});

// ============================================
// REPORT FORM FUNCTIONS
// ============================================

function setupReportForm() {
    const reportForm = document.getElementById('reportForm');
    const reportContent = document.getElementById('reportContent');
    const charCount = document.getElementById('charCount');
    const reportStatus = document.getElementById('reportStatus');

    if (!reportForm) return;

    // Character counter
    if (reportContent && charCount) {
        reportContent.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 300) {
                this.value = this.value.substring(0, 300);
                charCount.textContent = '300';
                charCount.style.color = 'var(--accent-danger)';
            } else {
                charCount.style.color = '';
            }
        });
    }

    // Form submission
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const reportType = document.getElementById('reportType').value;
        const submitContent = reportContent.value.trim();
        
        if (!reportType || submitContent.length < 5) {
            showReportStatus('Please select a type and provide a description (min 5 chars).', 'error');
            return;
        }

        const submitBtn = this.querySelector('.btn-report-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="material-symbols-rounded loading">refresh</span> Submitting...';
        submitBtn.disabled = true;

        // Extract course ID from URL (?id=X)
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id') || null;

        fetch((window.AppConfig?.baseUrl || '') + '/student/course_details/submit_report_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportType, content: submitContent, courseId })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Failed to submit report');
            showReportStatus(data.message || 'Report submitted successfully!', 'success');
            reportForm.reset();
            charCount.textContent = '0';
        })
        .catch(err => {
            showReportStatus('Error: ' + err.message, 'error');
        })
        .finally(() => {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                if(reportStatus) reportStatus.style.display = 'none';
            }, 3000);
        });
    });
}

function showReportStatus(message, type) {
    const statusElement = document.getElementById('reportStatus');
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `report-status ${type}`;
    statusElement.style.display = 'block';

    if (type === 'error') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
}
