<?php
$host = 'localhost';
$db = 'edume';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Add new columns to users if they don't exist
    try {
        $pdo->exec("ALTER TABLE users 
                    ADD COLUMN current_streak int(11) NOT NULL DEFAULT 0,
                    ADD COLUMN last_login_date date DEFAULT NULL,
                    ADD COLUMN email_notifications_enabled tinyint(1) NOT NULL DEFAULT 1");
        echo "Successfully added current_streak, last_login_date, and email_notifications_enabled to users table.\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Columns already exist in users table (Skipping ALTER).\n";
        } else {
            throw $e;
        }
    }

    // Create reports table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `reports` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `course_id` int(11) DEFAULT NULL,
      `report_type` varchar(50) NOT NULL,
      `content` text NOT NULL,
      `status` enum('pending','resolved') DEFAULT 'pending',
      `admin_notes` text DEFAULT NULL,
      `created_at` datetime NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (`id`),
      KEY `idx_user_reports` (`user_id`),
      CONSTRAINT `fk_user_reports` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "Successfully verified/created reports table.\n";

} catch (PDOException $e) {
    echo "Error applying migration: " . $e->getMessage() . "\n";
}
?>
