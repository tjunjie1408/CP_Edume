<?php
/**
 * Admin Course Management API (Lazy Loading)
 * 
 * GET endpoints:
 *   (no params)          → list all courses with chapter counts
 *   ?course_id=X         → single course + its chapters
 *   ?chapter_id=X        → chapter + content_materials + quiz_questions
 * 
 * POST: ?action=course|chapter|material|quiz_question
 * PUT:  ?action=course|chapter
 * DELETE: ?action=course|chapter&id=X
 * 
 * Security: Auth guard, htmlspecialchars, php://input + ?? []
 */

require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/AdminPage.php';
require_once CONFIG_PATH . '/Database.php';

$page = new AdminPage();
$page->requireAuth();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? '';

$database = new Database();
$db = $database->getConnection();

function esc($val) {
    return htmlspecialchars($val ?? '', ENT_QUOTES, 'UTF-8');
}

try {
    switch ($method) {

        // ══════════════════════════════════════════════
        // GET — Lazy Loading
        // ══════════════════════════════════════════════
        case 'GET':

            // ── Level 3: Get chapter details (materials + quiz) ──
            if (!empty($_GET['chapter_id'])) {
                $chapterId = (int) $_GET['chapter_id'];

                // Chapter info
                $stmt = $db->prepare("SELECT id, course_id, title, overview, order_num FROM chapters WHERE id = :id");
                $stmt->execute([':id' => $chapterId]);
                $chapter = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$chapter) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Chapter not found']);
                    exit;
                }

                // Objectives
                $stmt = $db->prepare("SELECT id, objective_text FROM chapter_objectives WHERE chapter_id = :id ORDER BY id");
                $stmt->execute([':id' => $chapterId]);
                $objectives = $stmt->fetchAll(PDO::FETCH_COLUMN, 1); // just the text

                // Content materials
                $stmt = $db->prepare("
                    SELECT id, content_type, title, youtube_url, text_content, 
                           practice_problem, practice_solution, practice_language, vark_tag
                    FROM content_materials WHERE chapter_id = :id ORDER BY id
                ");
                $stmt->execute([':id' => $chapterId]);
                $materials = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Map materials to frontend resource format
                $resources = [];
                foreach ($materials as $m) {
                    $resources[] = [
                        'id'          => (int) $m['id'],
                        'type'        => $m['content_type'],
                        'title'       => esc($m['title']),
                        'url'         => $m['youtube_url'] ?? '',
                        'description' => esc(mb_substr($m['text_content'] ?? $m['practice_problem'] ?? '', 0, 100)),
                        'vark_tag'    => $m['vark_tag']
                    ];
                }

                // Quiz questions
                $stmt = $db->prepare("
                    SELECT qq.id, qq.question_text, qq.option_a, qq.option_b, qq.option_c, qq.option_d,
                           qq.correct_option, qq.explanation
                    FROM quiz_questions qq
                    JOIN quizzes q ON qq.quiz_id = q.id
                    WHERE q.chapter_id = :id
                    ORDER BY qq.id
                ");
                $stmt->execute([':id' => $chapterId]);
                $quizRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $quiz = [];
                foreach ($quizRows as $q) {
                    $correctIndex = ord(strtolower($q['correct_option'])) - ord('a');
                    $quiz[] = [
                        'id'       => (int) $q['id'],
                        'question' => esc($q['question_text']),
                        'options'  => [esc($q['option_a']), esc($q['option_b']), esc($q['option_c']), esc($q['option_d'])],
                        'correct'  => $correctIndex,
                        'feedback' => esc($q['explanation'] ?? '')
                    ];
                }

                echo json_encode([
                    'id'         => (int) $chapter['id'],
                    'title'      => esc($chapter['title']),
                    'level'      => 'Beginner', // No level column in chapters
                    'overview'   => esc($chapter['overview'] ?? ''),
                    'objectives' => $objectives,
                    'content'    => '', // Content is in materials
                    'resources'  => $resources,
                    'quiz'       => $quiz
                ]);
                break;
            }

            // ── Level 2: Get course with chapters ──
            if (!empty($_GET['course_id'])) {
                $courseId = (int) $_GET['course_id'];

                $stmt = $db->prepare("SELECT * FROM courses WHERE id = :id");
                $stmt->execute([':id' => $courseId]);
                $course = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$course) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Course not found']);
                    exit;
                }

                // Chapters
                $stmt = $db->prepare("
                    SELECT id, title, overview, order_num
                    FROM chapters WHERE course_id = :id ORDER BY order_num
                ");
                $stmt->execute([':id' => $courseId]);
                $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $subjects = [];
                foreach ($chapters as $ch) {
                    // Count objectives
                    $stmtObj = $db->prepare("SELECT COUNT(*) FROM chapter_objectives WHERE chapter_id = :id");
                    $stmtObj->execute([':id' => $ch['id']]);
                    $objCount = (int) $stmtObj->fetchColumn();

                    $subjects[] = [
                        'id'    => (int) $ch['id'],
                        'title' => esc($ch['title']),
                        'level' => 'Beginner',
                        'overview'   => esc($ch['overview'] ?? ''),
                        'objectives' => [], // Loaded lazily at level 3
                        'content'    => '',
                        'resources'  => [],
                        'quiz'       => [],
                        'objectiveCount' => $objCount
                    ];
                }

                echo json_encode([
                    'id'          => (int) $course['id'],
                    'name'        => esc($course['title']),
                    'language'    => esc($course['category']),
                    'description' => esc($course['description'] ?? ''),
                    'image'       => $course['cover_image'] ?? '',
                    'subjects'    => $subjects
                ]);
                break;
            }

            // ── Level 1: List all courses ──
            $stmt = $db->query("
                SELECT c.id, c.title, c.description, c.category, c.cover_image, c.difficulty,
                       (SELECT COUNT(*) FROM chapters ch WHERE ch.course_id = c.id) as chapter_count
                FROM courses c
                ORDER BY c.id
            ");
            $courses = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $courses[$row['id']] = [
                    'id'          => (int) $row['id'],
                    'name'        => esc($row['title']),
                    'language'    => esc($row['category']),
                    'description' => esc($row['description'] ?? ''),
                    'image'       => $row['cover_image'] ?? '',
                    'subjects'    => [], // Not loaded — lazy
                    'subjectCount' => (int) $row['chapter_count']
                ];
            }
            echo json_encode($courses);
            break;

        // ══════════════════════════════════════════════
        // POST — Create
        // ══════════════════════════════════════════════
        case 'POST':
            if ($action === 'course') {
                $title    = trim($data['name'] ?? '');
                $category = trim($data['language'] ?? '');
                $desc     = trim($data['description'] ?? '');
                $image    = $data['image'] ?? '';

                if (!$title || !$category || !$desc) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Title, language, and description are required']);
                    exit;
                }

                $stmt = $db->prepare("
                    INSERT INTO courses (title, category, description, cover_image, difficulty, is_published)
                    VALUES (:title, :category, :desc, :image, 'beginner', 1)
                ");
                $stmt->execute([
                    ':title'    => $title,
                    ':category' => $category,
                    ':desc'     => $desc,
                    ':image'    => $image
                ]);

                echo json_encode(['success' => true, 'id' => (int) $db->lastInsertId(), 'message' => 'Course created']);

            } elseif ($action === 'chapter') {
                $courseId = (int) ($data['courseId'] ?? 0);
                $title    = trim($data['title'] ?? '');
                $level    = trim($data['level'] ?? 'Beginner');

                if (!$courseId || !$title) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Course ID and title are required']);
                    exit;
                }

                // Get next order_num
                $stmt = $db->prepare("SELECT COALESCE(MAX(order_num), 0) + 1 FROM chapters WHERE course_id = :cid");
                $stmt->execute([':cid' => $courseId]);
                $nextOrder = (int) $stmt->fetchColumn();

                $stmt = $db->prepare("
                    INSERT INTO chapters (course_id, title, order_num)
                    VALUES (:cid, :title, :order_num)
                ");
                $stmt->execute([
                    ':cid'       => $courseId,
                    ':title'     => $title,
                    ':order_num' => $nextOrder
                ]);

                echo json_encode(['success' => true, 'id' => (int) $db->lastInsertId(), 'message' => 'Chapter created']);

            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Unknown action: ' . $action]);
            }
            break;

        // ══════════════════════════════════════════════
        // PUT — Update
        // ══════════════════════════════════════════════
        case 'PUT':
            if ($action === 'course') {
                $id    = (int) ($data['id'] ?? 0);
                $title = trim($data['name'] ?? '');
                $desc  = trim($data['description'] ?? '');
                $image = $data['image'] ?? null;

                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Course ID is required']);
                    exit;
                }

                $fields = [];
                $params = [':id' => $id];
                if ($title) { $fields[] = 'title = :title'; $params[':title'] = $title; }
                if ($desc)  { $fields[] = 'description = :desc'; $params[':desc'] = $desc; }
                if ($image !== null) { $fields[] = 'cover_image = :image'; $params[':image'] = $image; }

                if (empty($fields)) {
                    echo json_encode(['success' => true, 'message' => 'Nothing to update']);
                    break;
                }

                $sql = "UPDATE courses SET " . implode(', ', $fields) . " WHERE id = :id";
                $stmt = $db->prepare($sql);
                $stmt->execute($params);
                echo json_encode(['success' => true, 'message' => 'Course updated']);

            } elseif ($action === 'chapter') {
                $id       = (int) ($data['id'] ?? 0);
                $title    = trim($data['title'] ?? '');
                $overview = $data['overview'] ?? null;

                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Chapter ID is required']);
                    exit;
                }

                $fields = [];
                $params = [':id' => $id];
                if ($title)           { $fields[] = 'title = :title'; $params[':title'] = $title; }
                if ($overview !== null) { $fields[] = 'overview = :overview'; $params[':overview'] = $overview; }

                if (!empty($fields)) {
                    $sql = "UPDATE chapters SET " . implode(', ', $fields) . " WHERE id = :id";
                    $stmt = $db->prepare($sql);
                    $stmt->execute($params);
                }

                // Update objectives if provided
                if (isset($data['objectives']) && is_array($data['objectives'])) {
                    $db->prepare("DELETE FROM chapter_objectives WHERE chapter_id = :id")->execute([':id' => $id]);
                    $stmtObj = $db->prepare("INSERT INTO chapter_objectives (chapter_id, objective_text) VALUES (:cid, :text)");
                    foreach ($data['objectives'] as $obj) {
                        if (trim($obj)) {
                            $stmtObj->execute([':cid' => $id, ':text' => trim($obj)]);
                        }
                    }
                }

                echo json_encode(['success' => true, 'message' => 'Chapter updated']);

            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Unknown action: ' . $action]);
            }
            break;

        // ══════════════════════════════════════════════
        // DELETE
        // ══════════════════════════════════════════════
        case 'DELETE':
            $id = (int) ($_GET['id'] ?? $data['id'] ?? 0);
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                exit;
            }

            if ($action === 'course') {
                // CASCADE will handle chapters → content_materials, quizzes, etc.
                $stmt = $db->prepare("DELETE FROM courses WHERE id = :id");
                $stmt->execute([':id' => $id]);
                echo json_encode(['success' => true, 'message' => 'Course deleted']);

            } elseif ($action === 'chapter') {
                $stmt = $db->prepare("DELETE FROM chapters WHERE id = :id");
                $stmt->execute([':id' => $id]);
                echo json_encode(['success' => true, 'message' => 'Chapter deleted']);

            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Unknown action: ' . $action]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
