<?php
/**
 * Admin Reports (Support Center) API
 * GET    — List all reports (with user + course names)
 * PUT    — Update report status/notes
 * DELETE — Delete report
 * 
 * Automatically creates the `reports` table if it doesn't exist.
 * 
 * Security: Auth guard, htmlspecialchars on content (XSS), php://input + ?? []
 */

require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/AdminPage.php';
require_once CONFIG_PATH . '/Database.php';

$page = new AdminPage();
$page->requireAuth();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true) ?? [];

$database = new Database();
$db = $database->getConnection();

// ── Auto-create reports table if not exists ──
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

try {
    switch ($method) {

        // ── GET: List all reports ──
        case 'GET':
            $stmt = $db->query("
                SELECT r.id, r.content, r.status, r.admin_notes, r.created_at,
                       u.username, u.email,
                       c.title as course_title
                FROM reports r
                JOIN users u ON r.user_id = u.id
                LEFT JOIN courses c ON r.course_id = c.id
                ORDER BY r.created_at DESC
            ");

            $reports = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $reports[] = [
                    'id'         => (int) $row['id'],
                    'userName'   => htmlspecialchars($row['username'], ENT_QUOTES, 'UTF-8'),
                    'userEmail'  => htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8'),
                    'course'     => htmlspecialchars($row['course_title'] ?? 'General', ENT_QUOTES, 'UTF-8'),
                    'content'    => htmlspecialchars($row['content'], ENT_QUOTES, 'UTF-8'),
                    'submitDate' => $row['created_at'],
                    'status'     => $row['status'],
                    'notes'      => htmlspecialchars($row['admin_notes'] ?? '', ENT_QUOTES, 'UTF-8')
                ];
            }

            echo json_encode($reports);
            break;

        // ── PUT: Update report status/notes ──
        case 'PUT':
            $id     = (int) ($data['id'] ?? 0);
            $status = $data['status'] ?? null;
            $notes  = $data['notes'] ?? null;

            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing report ID']);
                exit;
            }

            $fields = [];
            $params = [':id' => $id];

            if ($status && in_array($status, ['pending', 'resolved'])) {
                $fields[] = 'status = :status';
                $params[':status'] = $status;
            }
            if ($notes !== null) {
                $fields[] = 'admin_notes = :notes';
                $params[':notes'] = $notes;
            }

            if (empty($fields)) {
                echo json_encode(['success' => true, 'message' => 'Nothing to update']);
                break;
            }

            $sql = "UPDATE reports SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['success' => true, 'message' => 'Report updated']);
            break;

        // ── DELETE: Delete report ──
        case 'DELETE':
            $id = (int) ($_GET['id'] ?? $data['id'] ?? 0);
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing report ID']);
                exit;
            }

            $stmt = $db->prepare("DELETE FROM reports WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Report not found']);
                exit;
            }

            echo json_encode(['success' => true, 'message' => 'Report deleted']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
