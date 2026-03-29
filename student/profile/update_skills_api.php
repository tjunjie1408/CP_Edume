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
    if (!$data || !isset($data['skills']) || !is_array($data['skills'])) {
        echo json_encode(["status" => 400, "message" => "Invalid skills format"]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $skills = array_filter(array_map('trim', $data['skills'])); // sanitize array

    $database = new Database();
    $db = $database->getConnection();
    $userModel = new User($db);

    $success = $userModel->updateSkills($userId, $skills);

    if ($success) {
        echo json_encode(["status" => 200, "message" => "Skills updated successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Failed to update skills"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => 500, "message" => "Server error: " . $e->getMessage()]);
}
