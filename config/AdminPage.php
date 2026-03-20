<?php
require_once __DIR__ . '/BasePage.php';

/**
 * AdminPage — Auth guard for admin-only pages.
 */
class AdminPage extends BasePage
{
    protected function authorize(): bool
    {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
    }
}
