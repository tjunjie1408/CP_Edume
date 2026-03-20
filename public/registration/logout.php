<?php
session_start();
session_unset();
session_destroy();
setcookie(session_name(), '', time() - 3600, '/');

require_once __DIR__ . '/../../config/constants.php';
header("Location: " . BASE_URL . "/public/registration/login.php");
exit;
?>
