<?php
require_once __DIR__ . '/ContentMaterialInterface.php';

class ContentMaterial implements ContentMaterialInterface {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getMaterialsByChapterId(int $chapterId): array {
        $query = "SELECT * 
                  FROM content_materials 
                  WHERE chapter_id = :chapter_id 
                  ORDER BY id ASC"; // Assuming order by insertion ID for now
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':chapter_id', $chapterId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id): ?array {
        $query = "SELECT * FROM content_materials WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row : null;
    }
}
