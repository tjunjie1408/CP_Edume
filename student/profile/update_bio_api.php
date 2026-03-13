<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';
require_once __DIR__ . '/../../public/registration/User.php';

$page = new StudentPage();
$page->requireAuth();

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data['bio'])) {
        echo json_encode(["status" => 400, "message" => "Missing bio data"]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $bio = trim($data['bio']);

    $database = new Database();
    $db = $database->getConnection();
    $userModel = new User($db);

    $success = $userModel->updateBio($userId, $bio);

    if ($success) {
        echo json_encode(["status" => 200, "message" => "Bio updated successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Failed to update bio"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => 500, "message" => "Server error: " . $e->getMessage()]);
}
