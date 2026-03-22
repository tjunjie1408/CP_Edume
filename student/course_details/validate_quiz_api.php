<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
require_once CONFIG_PATH . '/Database.php';
require_once __DIR__ . '/../../public/registration/User.php';

$page = new StudentPage();
$page->requireAuth();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => 405, "message" => "Method Not Allowed"]);
    exit();
}

// Get the raw POST data
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
    // 1. Fetch the correct answers from the database
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
    
    // 2. Map correct answers by question ID
    $correctAnswersMap = [];
    foreach ($quizData as $qd) {
        $correctAnswersMap[$qd['id']] = [
            'correct' => $qd['correct_answer'],
            'explanation' => $qd['explanation']
        ];
    }
    
    // 3. Evaluate the student's submission
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
    
    // 4. Calculate score and conditionally assign XP
    $scorePercentage = ($correctCount / $totalQuestions) * 100;
    $passed = $scorePercentage >= 50; // Arbitrary 50% pass mark
    
    // Note: Assuming User class has an addXP or similar method. 
    // Implementing a simple direct SQL update for XP here to ensure it works.
    if ($passed) {
        $xpToAward = 50; // base XP for passing a chapter
        
        $updateXpSql = "UPDATE users SET xp = xp + :xp WHERE id = :user_id";
        $xpStmt = $db->prepare($updateXpSql);
        $xpStmt->bindParam(':xp', $xpToAward, PDO::PARAM_INT);
        $xpStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $xpStmt->execute();
        
        // Also log progress (Upsert)
        $progressSql = "INSERT INTO user_progress (user_id, chapter_id, is_completed, xp_earned, last_accessed) 
                        VALUES (:uid, :cid, 1, :xp, NOW()) 
                        ON DUPLICATE KEY UPDATE is_completed = 1, last_accessed = NOW()";
        $progStmt = $db->prepare($progressSql);
        $progStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
        $progStmt->bindParam(':cid', $chapterId, PDO::PARAM_INT);
        $progStmt->bindParam(':xp', $xpToAward, PDO::PARAM_INT);
        $progStmt->execute();
    }
    
    // 5. Return success and the results mapping (explanations)
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
