<?php
require_once __DIR__ . '/constants.php';

/**
 * BasePage — Abstract base class for all authenticated pages.
 *
 * Responsibilities:
 *   - Start session (if not already started)
 *   - Define the authorize() contract
 *   - Provide redirect helper
 *   - Provide requireAuth() entry point
 */
abstract class BasePage
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Each child class defines its own access rule.
     */
    abstract protected function authorize(): bool;

    /**
     * Redirect to a URL and stop execution.
     */
    protected function redirect(string $url): void
    {
        header("Location: $url");
        exit;
    }

    /**
     * Call this at the top of every protected page.
     * If not authorized → redirect to login.
     */
    public function requireAuth(): void
    {
        if (!$this->authorize()) {
            $this->redirect(BASE_URL . '/public/registration/login.php');
        }
    }
}
