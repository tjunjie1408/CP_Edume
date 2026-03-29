<?php
/**
 * Global Constants
 * Include this file first in every PHP page.
 * Eliminates relative-path hell.
 */

// Set timezone to Malaysia (UTC+8)
date_default_timezone_set('Asia/Kuala_Lumpur');

// Filesystem root of the project
define('ROOT_PATH',   dirname(__DIR__));

// Dynamically determine the base URL so that it works regardless of the folder name
$docRoot = str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']);
$rootPath = str_replace('\\', '/', ROOT_PATH);

if (strpos($rootPath, $docRoot) === 0) {
    // Expected behaviour on typical Apache setup
    $baseUrl = substr($rootPath, strlen($docRoot));
} else {
    // Fallback if running via PHP built-in server or unexpected config
    $parts = explode('/', trim($_SERVER['SCRIPT_NAME'] ?? '', '/'));
    if (!empty($parts) && file_exists($docRoot . '/' . $parts[0])) {
        $baseUrl = '/' . $parts[0];
    } else {
        $baseUrl = '';
    }
}

// Web-accessible base URL (no trailing slash)
define('BASE_URL',    $baseUrl);

// Shortcut to the config folder
define('CONFIG_PATH', ROOT_PATH . '/config');
