<?php
require_once __DIR__ . '/constants.php';

abstract class BasePage
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    abstract protected function authorize(): bool;

    protected function redirect(string $url): void
    {
        header("Location: $url");
        exit;
    }

    public function requireAuth(): void
    {
        if (!$this->authorize()) {
            $this->redirect(BASE_URL . '/public/registration/login.php');
        }
    }
}
