<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/AdminPage.php';
require_once CONFIG_PATH . '/Database.php';
require_once __DIR__ . '/../../public/registration/User.php';

// Ensure the user is authenticated and is an Admin
$page = new AdminPage();
$page->requireAuth();

header('Content-Type: application/json');

try {
    // 1. Parse JSON body
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data['fullName']) || !isset($data['email'])) {
        echo json_encode(["status" => 400, "message" => "Invalid request: missing fields"]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $fullName = trim($data['fullName']);
    $email = trim($data['email']);

    // Basic Validation
    if ($fullName === '' || $email === '') {
        echo json_encode(["status" => 400, "message" => "Name and email cannot be empty"]);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => 400, "message" => "Invalid email format"]);
        exit;
    }

    // 2. Initialize Database and User model
    $database = new Database();
    $db = $database->getConnection();
    $userModel = new User($db);

    // 3. Email Uniqueness Check (Security Fix)
    // Check if another user already has this email
    $existingUser = $userModel->findByEmail($email);
    if ($existingUser && $existingUser['id'] !== $userId) {
        echo json_encode(["status" => 400, "message" => "This email is already in use by another account"]);
        exit;
    }

    // Optional: Username Uniqueness Check (Since email collision is fixed, good to fix username too if changed)
    // Currently findByEmail was implemented. The User model might need a findByUsername or just rely on the DB UNIQUE constraint try/catch.
    // Assuming the DB will throw if username is dupe, we can catch it.

    // 4. Update Database
    $success = $userModel->updateProfile($userId, $fullName, $email);

    if ($success) {
        // 5. Session Sync (UX Fix)
        // Update the session so the sidebar/header reflects the new name/email immediately
        $_SESSION['username'] = $fullName;
        if (isset($_SESSION['email'])) { // if it was tracking email previously
            $_SESSION['email'] = $email;
        }

        echo json_encode([
            "status" => 200,
            "message" => "Profile updated successfully"
        ]);
    } else {
        echo json_encode(["status" => 500, "message" => "Failed to update profile in database"]);
    }

} catch (PDOException $e) {
    // Check for MySQL Integrity Constraint Violation (e.g., duplicate username)
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => 400, "message" => "This username or email is already taken"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Database error: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => 500, "message" => "Server error: " . $e->getMessage()]);
}
