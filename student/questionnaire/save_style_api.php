<?php
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../config/StudentPage.php';
require_once __DIR__ . '/../../config/Database.php';

// Auth Guard
$page = new StudentPage();
$page->requireAuth();

header("Content-Type: application/json");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data["learnerType"])) {
        echo json_encode(["status" => 400, "message" => "Invalid request data"]);
        exit;
    }
    
    $user_id = $_SESSION["user_id"];
    $learnerType = $data["learnerType"]; // Should be 'visual', 'read', or 'kinesthetic'
    
    $database = new Database();
    $conn = $database->getConnection();
    
    // Update the correct column using PDO
    $stmt = $conn->prepare("UPDATE users SET primary_vark_style = ? WHERE id = ?");
    
    if ($stmt->execute([$learnerType, $user_id])) {
        $_SESSION["primary_vark_style"] = $learnerType;
        echo json_encode(["status" => 200, "message" => "Learning style saved successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Failed to save learning style"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => 500, "message" => "Server error: " . $e->getMessage()]);
}
