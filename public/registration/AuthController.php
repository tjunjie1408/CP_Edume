<?php
session_start();

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/UserInterface.php';
require_once __DIR__ . '/User.php';

class AuthController
{
    private UserInterface $user;

    public function __construct(UserInterface $user)
    {
        $this->user = $user;
    }

    /**
     * Route the request to the correct handler based on ?action= parameter.
     */
    public function handleRequest(): void
    {
        $action = $_GET['action'] ?? '';
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];

        switch ($action) {
            case 'signup':
                $this->handleSignup($data);
                break;
            case 'login':
                $this->handleLogin($data);
                break;
            case 'forget_password':
                $this->handleForgetPassword($data);
                break;
            case 'reset_password':
                $this->handleResetPassword($data);
                break;
            default:
                $this->respond(400, 'Invalid action');
        }
    }

        /* --- Request Handlers --- */
        private function handleSignup(array $data): void
    {
        $name     = trim($data['name']     ?? '');
        $email    = trim($data['email']    ?? '');
        $password = $data['password']      ?? '';

        // Enforce required fields validation
        if ($name === '' || $email === '' || $password === '') {
            $this->respond(422, 'All fields are required');
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->respond(422, 'Invalid email address');
            return;
        }
        if (strlen($password) < 6) {
            $this->respond(422, 'Password must be at least 6 characters');
            return;
        }

        // Prevent duplicate registrations by verifying uniqueness
        if ($this->user->isUsernameTaken($name)) {
            $this->respond(422, 'Username already exists');
            return;
        }
        if ($this->user->isEmailTaken($email)) {
            $this->respond(422, 'Email already exists');
            return;
        }

        // Persist new user securely with bcrypt hashing
        $hash = password_hash($password, PASSWORD_BCRYPT);
        if ($this->user->create($name, $email, $hash)) {
            // Auto login the user immediately after creation
            $user = $this->user->findByEmail($email);
            if ($user) {
                $_SESSION['user_id']  = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email']    = $user['email'];
                $_SESSION['role']     = $user['role'];
                $_SESSION['primary_vark_style'] = $user['primary_vark_style'];
                $this->user->updateLoginStreak((int)$user['id']);
            }
            $this->respond(201, 'User registered successfully. Redirecting...');
        } else {
            $this->respond(500, 'Failed to register user');
        }
    }

    private function handleLogin(array $data): void
    {
        $email    = trim($data['email']    ?? '');
        $password = trim($data['password'] ?? '');

        // Ensure payload requirements are met before querying the database
        if ($email === '' || $password === '') {
            $this->respond(422, 'All fields are required');
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->respond(422, 'Invalid email address');
            return;
        }

        // Find user
        $user = $this->user->findByEmail($email);
        if (!$user) {
            $this->respond(422, 'Email does not exist');
            return;
        }

        // Verify password hash against the stored database hash
        if (!password_verify($password, $user['password_hash'])) {
            $this->respond(422, 'Incorrect password');
            return;
        }

        // Initialize secure session state for the authenticated user
        $_SESSION['user_id']  = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email']    = $user['email'];
        $_SESSION['role']     = $user['role'];
        $_SESSION['primary_vark_style'] = $user['primary_vark_style'];

        // Update Login Streak
        $this->user->updateLoginStreak((int)$user['id']);

        // Map role to numeric for JS compatibility
        $roleNum = ($user['role'] === 'admin') ? 1 : 0;

        echo json_encode([
            'status'             => 200,
            'message'            => 'Login successful',
            'role'               => $roleNum,
            'primary_vark_style' => $user['primary_vark_style'],
        ]);
    }

    private function handleForgetPassword(array $data): void
    {
        $email = trim($data['email'] ?? '');

        if ($email === '') {
            $this->respond(422, 'Email is required');
            return;
        }

        $role = $this->user->getRoleByEmail($email);

        if ($role === null) {
            $this->respond(422, 'Email does not exist');
            return;
        }
        if ($role === 'admin') {
            $this->respond(422, 'Admin cannot change password');
            return;
        }

        $this->respond(200, 'Email exists');
    }

    private function handleResetPassword(array $data): void
    {
        $email       = trim($data['email']       ?? '');
        $newPassword = trim($data['newPassword']  ?? '');

        if ($email === '' || $newPassword === '') {
            $this->respond(422, 'Missing data');
            return;
        }

        // Ensure safety check against current active password before overwriting
        $oldHash = $this->user->getPasswordHash($email);
        if ($oldHash === null) {
            $this->respond(422, 'Email does not exist');
            return;
        }
        if (password_verify($newPassword, $oldHash)) {
            $this->respond(422, 'Please set a new password.');
            return;
        }

        // Proceed explicitly with updating the persistence layer
        $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
        if ($this->user->updatePassword($email, $newHash)) {
            $this->respond(200, 'Password reset successfully');
        } else {
            $this->respond(500, 'Failed to reset password');
        }
    }

        /* --- Private Helpers --- */
        private function respond(int $status, string $message): void
    {
        echo json_encode(['status' => $status, 'message' => $message]);
    }
}

// --- Script Bootstrap Initialization ---
$database   = new Database();
$connection = $database->getConnection();
$user       = new User($connection);
$controller = new AuthController($user);
$controller->handleRequest();
