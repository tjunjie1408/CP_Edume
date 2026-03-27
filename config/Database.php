<?php
/**
 * Database Connection Class
 * Single responsibility: create and return a PDO connection.
 */
class Database
{
    private string $host     = "localhost";
    private string $db_name  = "edume";
    private string $username = "root";
    private string $password = "";

    /**
     * Create and return a PDO connection.
     */
    public function getConnection(): PDO
    {
        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";

        $pdo = new PDO($dsn, $this->username, $this->password, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        // Set MySQL session timezone to match PHP (Asia/Kuala_Lumpur = UTC+8)
        $pdo->exec("SET time_zone = '+08:00'");

        return $pdo;
    }
}
