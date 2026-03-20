<?php
/**
 * UserInterface
 * Defines the contract for user data operations.
 * No JSON, no sessions — pure data access only.
 */
interface UserInterface
{
    /**
     * Find a user by ID. Returns associative array or null.
     */
    public function findById(int $id): ?array;

    /**
     * Find a user by email. Returns associative array or null.
     */
    public function findByEmail(string $email): ?array;

    /**
     * Check if a username is already taken.
     */
    public function isUsernameTaken(string $username): bool;

    /**
     * Check if an email is already taken.
     */
    public function isEmailTaken(string $email): bool;

    /**
     * Create a new user. Returns true on success.
     */
    public function create(string $username, string $email, string $passwordHash): bool;

    /**
     * Get the password hash for a given email. Returns null if not found.
     */
    public function getPasswordHash(string $email): ?string;

    /**
     * Get the role for a given email. Returns null if not found.
     */
    public function getRoleByEmail(string $email): ?string;

    /**
     * Update the password hash for a given email. Returns true on success.
     */
    public function updatePassword(string $email, string $newHash): bool;

    /**
     * Update the username and email for a given user ID. Returns true on success.
     */
    public function updateProfile(int $id, string $username, string $email): bool;

    /**
     * Update the student's profile (name, email, learning style, experience).
     */
    public function updateStudentProfile(int $id, string $username, string $email, string $learningStyle, string $experience): bool;

    /**
     * Update the user's bio.
     */
    public function updateBio(int $id, string $bio): bool;

    /**
     * Update the user's skills. Removes existing skills and adds new ones.
     */
    public function updateSkills(int $id, array $skills): bool;

    /**
     * Get a simple array of skill names for a given user ID.
     */
    public function getUserSkills(int $id): array;
}
