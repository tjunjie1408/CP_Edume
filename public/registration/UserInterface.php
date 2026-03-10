<?php
/**
 * UserInterface
 * Defines the contract for user data operations.
 * No JSON, no sessions — pure data access only.
 */
interface UserInterface
{
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
}
