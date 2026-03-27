<?php
require_once __DIR__ . '/BasePage.php';

/**
 * StudentPage — Auth guard for student-only pages.
 */
class StudentPage extends BasePage
{
    protected function authorize(): bool
    {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'student';
    }
}
