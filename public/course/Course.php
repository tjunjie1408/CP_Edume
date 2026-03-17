<?php
require_once __DIR__ . '/CourseInterface.php';

class Course implements CourseInterface {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAllPublishedCourses(): array {
        // We select only published courses. The seed file currently sets Python to TRUE.
        $stmt = $this->db->prepare("SELECT * FROM courses WHERE is_published = 1 ORDER BY id ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM courses WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }
}
