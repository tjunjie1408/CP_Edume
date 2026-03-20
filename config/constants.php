<?php
/**
 * Global Constants
 * Include this file first in every PHP page.
 * Eliminates relative-path hell.
 */

// Filesystem root of the project
define('ROOT_PATH',   dirname(__DIR__));

// Web-accessible base URL (no trailing slash)
define('BASE_URL',    '/Edume');

// Shortcut to the config folder
define('CONFIG_PATH', ROOT_PATH . '/config');
