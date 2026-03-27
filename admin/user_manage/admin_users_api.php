<?php
/**
 * Admin User Management API
 * GET    — List all users
 * PUT    — Update user (username, email, password, primary_vark_style)
 * DELETE — Delete user by ID
 * 
 * Security: Auth guard, self-delete prevention, no role escalation,
 *           password_hash(), htmlspecialchars(), php://input parsing
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

try {
    switch ($method) {

        // ── GET: List all users ─────────────────────────────
        case 'GET':
            $stmt = $db->query("
                SELECT id, username, email, role, primary_vark_style, created_at
                FROM users
                ORDER BY created_at DESC
            ");
            $users = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Map DB fields to frontend-expected names
                $style = $row['primary_vark_style'];
                $learningStyleLabel = 'Unassigned';
                if ($style === 'visual')      $learningStyleLabel = 'Visual';
                elseif ($style === 'aural')   $learningStyleLabel = 'Aural';
                elseif ($style === 'read')    $learningStyleLabel = 'Reading/Writing';
                elseif ($style === 'kinesthetic') $learningStyleLabel = 'Kinesthetic';

                $users[] = [
                    'userID'        => 'USR' . str_pad($row['id'], 3, '0', STR_PAD_LEFT),
                    'dbId'          => (int) $row['id'],
                    'username'      => htmlspecialchars($row['username'], ENT_QUOTES, 'UTF-8'),
                    'email'         => htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8'),
                    'role'          => $row['role'],
                    'learningStyle' => $learningStyleLabel,
                    'password'      => '********', // Never expose real hash
                    'createdAt'     => $row['created_at']
                ];
            }
            echo json_encode($users);
            break;

        // ── PUT: Update user ────────────────────────────────
        case 'PUT':
            if (empty($data['dbId'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing user ID']);
                exit;
            }

            $targetId = (int) $data['dbId'];

            // Build dynamic UPDATE query — only update provided fields
            $fields = [];
            $params = [':id' => $targetId];

            if (!empty($data['username'])) {
                $fields[] = 'username = :username';
                $params[':username'] = trim($data['username']);
            }
            if (!empty($data['email'])) {
                $fields[] = 'email = :email';
                $params[':email'] = trim($data['email']);
            }
            // Password: hash on server, never accept pre-hashed from frontend
            if (!empty($data['newPassword'])) {
                $fields[] = 'password_hash = :password_hash';
                $params[':password_hash'] = password_hash($data['newPassword'], PASSWORD_DEFAULT);
            }
            if (!empty($data['learningStyle'])) {
                // Map frontend label back to DB enum
                $styleMap = [
                    'Visual'          => 'visual',
                    'Aural'           => 'aural',
                    'Reading/Writing' => 'read',
                    'Kinesthetic'     => 'kinesthetic'
                ];
                $dbStyle = $styleMap[$data['learningStyle']] ?? null;
                if ($dbStyle) {
                    $fields[] = 'primary_vark_style = :vark';
                    $params[':vark'] = $dbStyle;
                }
            }

            // Security: role field is NOT accepted — prevents privilege escalation

            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                exit;
            }

            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
            break;

        // ── DELETE: Delete user ──────────────────────────────
        case 'DELETE':
            $targetId = $data['dbId'] ?? $_GET['id'] ?? null;
            if (!$targetId) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing user ID']);
                exit;
            }
            $targetId = (int) $targetId;

            // Security: prevent admin self-delete
            if ($targetId === (int) $_SESSION['user_id']) {
                http_response_code(403);
                echo json_encode(['error' => 'You cannot delete your own account']);
                exit;
            }

            $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
            $stmt->execute([':id' => $targetId]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                exit;
            }

            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    // Check for duplicate key errors
    if ($e->getCode() == 23000) {
        echo json_encode(['error' => 'Username or email already exists']);
    } else {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
