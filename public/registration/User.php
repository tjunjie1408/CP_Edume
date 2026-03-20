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

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, username, email, password_hash, role, primary_vark_style, primary_vark_style AS learning_style, experience_level, bio, created_at
             FROM users WHERE id = ?"
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ?: null;
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

    public function updateProfile(int $id, string $username, string $email): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        return $stmt->execute([$username, $email, $id]);
    }

    public function updateStudentProfile(int $id, string $username, string $email, string $learningStyle, string $experience): bool
    {
        // For enum fields, they should match DB definitions. learning_style: 'Visual','Aural','Reading/Writing','Kinesthetic'. We will assume correct input format.
        $stmt = $this->db->prepare("UPDATE users SET username = ?, email = ?, primary_vark_style = ?, experience_level = ? WHERE id = ?");
        return $stmt->execute([$username, $email, $learningStyle, $experience, $id]);
    }

    public function updateBio(int $id, string $bio): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET bio = ? WHERE id = ?");
        return $stmt->execute([$bio, $id]);
    }

    public function updateSkills(int $id, array $skills): bool
    {
        try {
            $this->db->beginTransaction();

            // Clean up existing
            $delStmt = $this->db->prepare("DELETE FROM user_skills WHERE user_id = ?");
            $delStmt->execute([$id]);

            // Insert new. If array is empty, this just skips inserting.
            if (!empty($skills)) {
                $insertStmt = $this->db->prepare("INSERT INTO user_skills (user_id, skill_name) VALUES (?, ?)");
                foreach ($skills as $skill) {
                    $insertStmt->execute([$id, trim($skill)]);
                }
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    public function getUserSkills(int $id): array
    {
        $stmt = $this->db->prepare("SELECT skill_name FROM user_skills WHERE user_id = ?");
        $stmt->execute([$id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $skills = [];
        foreach ($rows as $row) {
            $skills[] = $row['skill_name'];
        }
        return $skills;
    }
}
