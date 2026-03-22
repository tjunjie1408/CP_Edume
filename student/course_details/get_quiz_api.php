<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';

$page = new StudentPage();
$page->requireAuth();

$chapterId = $_GET['chapter_id'] ?? null;

if (!$chapterId || !is_numeric($chapterId)) {
    echo json_encode(['status' => 400, 'message' => 'Invalid chapter ID provided.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    // Fetch quiz questions for this chapter
    $query = "SELECT qq.id, qq.question_text AS question, qq.option_a, qq.option_b, qq.option_c, qq.option_d 
              FROM quiz_questions qq 
              JOIN quizzes q ON qq.quiz_id = q.id 
              WHERE q.chapter_id = :chapter_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':chapter_id', $chapterId, PDO::PARAM_INT);
    $stmt->execute();
    
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // We strictly DO NOT select 'correct_answer' or 'explanation' to prevent client-side cheating.
    
    if (count($questions) > 0) {
        echo json_encode([
            'status' => 200, 
            'data' => $questions
        ]);
    } else {
        echo json_encode([
            'status' => 404, 
            'message' => 'No quiz found for this chapter.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 500, 'message' => 'Database error: ' . $e->getMessage()]);
}
