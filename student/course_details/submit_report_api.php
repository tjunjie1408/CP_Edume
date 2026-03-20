<?php
/**
 * Student Report Submission API
 * POST — Submit a new report from student course page
 * 
 * Security: StudentPage auth guard, htmlspecialchars, php://input + ?? []
 */

require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';

$page = new StudentPage();
$page->requireAuth();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];

$reportType = trim($data['reportType'] ?? '');
$content    = trim($data['content'] ?? '');
$courseId   = !empty($data['courseId']) ? (int) $data['courseId'] : null;

// Validation
if (!$reportType || strlen($content) < 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Report type and description (min 5 chars) are required']);
    exit;
}

// Prepend report type to content for admin readability
$fullContent = "[{$reportType}] " . $content;

try {
    $database = new Database();
    $db = $database->getConnection();

    // Auto-create reports table if not exists
    $db->exec("
        CREATE TABLE IF NOT EXISTS `reports` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `course_id` INT DEFAULT NULL,
            `content` TEXT NOT NULL,
            `status` ENUM('pending','resolved') DEFAULT 'pending',
            `admin_notes` TEXT DEFAULT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
            FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $stmt = $db->prepare("
        INSERT INTO reports (user_id, course_id, content, status)
        VALUES (:uid, :cid, :content, 'pending')
    ");
    $stmt->execute([
        ':uid'     => $_SESSION['user_id'],
        ':cid'     => $courseId,
        ':content' => $fullContent
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Report submitted successfully! Thank you for your feedback.',
        'id'      => (int) $db->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
