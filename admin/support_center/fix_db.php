<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Add report_type if it doesn't exist
    $db->exec("ALTER TABLE `reports` ADD COLUMN `report_type` VARCHAR(50) NOT NULL DEFAULT 'General' AFTER `course_id`");
    echo "Column report_type added successfully.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column report_type already exists.\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
