<?php
require_once __DIR__ . '/UserInterface.php';

/**
 * User Model
 * Implements UserInterface using PDO prepared statements.
 * Maps to the `users` table in edume_merged_schema.sql.
 */
class User implements UserInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, username, email, password_hash, role, primary_vark_style
             FROM users WHERE email = ?"
        );
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    public function isUsernameTaken(string $username): bool
    {
        $stmt = $this->db->prepare("SELECT 1 FROM users WHERE username = ?");
        $stmt->execute([$username]);

        return (bool) $stmt->fetch();
    }

    public function isEmailTaken(string $email): bool
    {
        $stmt = $this->db->prepare("SELECT 1 FROM users WHERE email = ?");
        $stmt->execute([$email]);

        return (bool) $stmt->fetch();
    }

    public function create(string $username, string $email, string $passwordHash): bool
    {
        $stmt = $this->db->prepare(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
        );

        return $stmt->execute([$username, $email, $passwordHash]);
    }

    public function getPasswordHash(string $email): ?string
    {
        $stmt = $this->db->prepare("SELECT password_hash FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        return $row ? $row['password_hash'] : null;
    }

    public function getRoleByEmail(string $email): ?string
    {
        $stmt = $this->db->prepare("SELECT role FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        return $row ? $row['role'] : null;
    }

    public function updatePassword(string $email, string $newHash): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET password_hash = ? WHERE email = ?");

        return $stmt->execute([$newHash, $email]);
    }
}
