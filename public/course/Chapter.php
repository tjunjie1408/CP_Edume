<?php
require_once __DIR__ . '/ChapterInterface.php';

class Chapter implements ChapterInterface {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getChaptersByCourseId(int $courseId): array {
        $query = "SELECT id, title, order_num AS chapter_order, overview AS description 
                  FROM chapters 
                  WHERE course_id = :course_id 
                  ORDER BY order_num ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':course_id', $courseId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id): ?array {
        $query = "SELECT * FROM chapters WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row : null;
    }
}
