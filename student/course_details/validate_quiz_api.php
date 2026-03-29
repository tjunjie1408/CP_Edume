<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';
/**
 * Quiz Validation API
 * 
 * Receives the student's selected answers, compares them against the database truth,
 * calculates the percentage score, and updates their course progress if they pass.
 * Requires an active student session.
 */
require_once __DIR__ . '/../../public/registration/User.php';
$page = new StudentPage();
$page->requireAuth();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => 405, "message" => "Method Not Allowed"]);
    exit();
}

// Parse JSON payload containing user's answer mapping
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$chapterId = $data['chapter_id'] ?? null;
$answers = $data['answers'] ?? []; // Format: { question_id: 'A', ... }

if (!$chapterId || !is_numeric($chapterId) || empty($answers)) {
    echo json_encode(['status' => 400, 'message' => 'Missing chapter ID or answers payload.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$userModel = new User($db);

$userId = $_SESSION['user_id'];

try {
    // Retrieve the authoritative correct options and feedback from the database
    $query = "SELECT qq.id, qq.correct_option AS correct_answer, qq.explanation 
              FROM quiz_questions qq 
              JOIN quizzes q ON qq.quiz_id = q.id 
              WHERE q.chapter_id = :chapter_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':chapter_id', $chapterId, PDO::PARAM_INT);
    $stmt->execute();
    $quizData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($quizData) === 0) {
        echo json_encode(['status' => 404, 'message' => 'Quiz not found.']);
        exit();
    }
    
    // Restructure DB rows into an easily searchable associative array by question ID
    $correctAnswersMap = [];
    foreach ($quizData as $qd) {
        $correctAnswersMap[$qd['id']] = [
            'correct' => $qd['correct_answer'],
            'explanation' => $qd['explanation']
        ];
    }
    
    // Compare submitted answers against the authoritative map
    $totalQuestions = count($correctAnswersMap);
    $correctCount = 0;
    $results = []; // Detailed feedback to send back
    
    foreach ($answers as $qId => $studentSelectedOption) {
        if (isset($correctAnswersMap[$qId])) {
            $isCorrect = (strtoupper($studentSelectedOption) === strtoupper($correctAnswersMap[$qId]['correct']));
            if ($isCorrect) {
                 $correctCount++;
            }
            
            $results[$qId] = [
                'is_correct' => $isCorrect,
                'explanation' => $correctAnswersMap[$qId]['explanation']
            ];
        }
    }
    
    // Determine pass/fail thresholds
    $scorePercentage = ($correctCount / $totalQuestions) * 100;
    $passed = $scorePercentage >= 50; // 50% pass mark
    
    if ($passed) {
        // Persist completion status using an UPSERT to handle retakes cleanly
        $progressSql = "INSERT INTO user_progress (user_id, chapter_id, is_completed, completed_at) 
                        VALUES (:uid, :cid, 1, NOW()) 
                        ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = NOW()";
        $progStmt = $db->prepare($progressSql);
        $progStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
        $progStmt->bindParam(':cid', $chapterId, PDO::PARAM_INT);
        $progStmt->execute();
    }
    
    // Dispatch detailed validation packet to the frontend UI
    echo json_encode([
        'status' => 200,
        'passed' => $passed,
        'score_percentage' => round($scorePercentage),
        'correct_count' => $correctCount,
        'total_questions' => $totalQuestions,
        'results_breakdown' => $results
    ]);

} catch (PDOException $e) {
    echo json_encode(['status' => 500, 'message' => 'Database error: ' . $e->getMessage()]);
}
