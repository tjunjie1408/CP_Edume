<?php
require_once __DIR__ . '/../../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';

$page = new StudentPage();
$page->requireAuth();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 405, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$enabled = isset($data['enabled']) && $data['enabled'] ? 1 : 0;
$userId = $_SESSION['user_id'];

try {
    $database = new Database();
    $db = $database->getConnection();

    $stmt = $db->prepare("UPDATE users SET email_notifications_enabled = :enabled WHERE id = :id");
    $stmt->execute([':enabled' => $enabled, ':id' => $userId]);

    echo json_encode(['status' => 200, 'message' => 'Notification preferences updated']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 500, 'message' => 'Database error']);
}
