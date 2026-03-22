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
    if (!$data || !isset($data['username']) || !isset($data['email'])) {
        echo json_encode(["status" => 400, "message" => "Missing required fields"]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $username = trim($data['username']);
    $email = trim($data['email']);
    $learningStyle = strtolower(trim($data['learningStyle'] ?? ''));
    $experience = strtolower(trim($data['experience'] ?? ''));

    // Normalize legacy learning styles
    if ($learningStyle === 'reading/writing') {
        $learningStyle = 'read';
    }

    if ($username === '' || $email === '') {
        echo json_encode(["status" => 400, "message" => "Name and email cannot be empty"]);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => 400, "message" => "Invalid email format"]);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();
    $userModel = new User($db);

    // Email Uniqueness Check
    $existingUser = $userModel->findByEmail($email);
    if ($existingUser && $existingUser['id'] !== $userId) {
        echo json_encode(["status" => 400, "message" => "This email is already in use by another account"]);
        exit;
    }

    $success = $userModel->updateStudentProfile($userId, $username, $email, $learningStyle, $experience);

    if ($success) {
        // Sync Session
        $_SESSION['username'] = $username;
        if (isset($_SESSION['email'])) {
            $_SESSION['email'] = $email;
        }
        
        // Also update learning style in session if we track it
        $_SESSION['primary_vark_style'] = $learningStyle;

        echo json_encode(["status" => 200, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Failed to update profile"]);
    }

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => 400, "message" => "This username or email is already taken"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Database error: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => 500, "message" => "Server error: " . $e->getMessage()]);
}
