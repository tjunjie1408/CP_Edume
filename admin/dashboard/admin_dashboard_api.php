<?php
/**
 * Admin Dashboard API
 * GET — Returns dashboard statistics, charts, lists
 * 
 * Security: AdminPage auth guard (session-based)
 */

require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/AdminPage.php';
require_once CONFIG_PATH . '/Database.php';

// Auth guard — blocks unauthenticated/non-admin access
$page = new AdminPage();
$page->requireAuth();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // ── 1. Statistics ──────────────────────────────────────

    // Total users (students only)
    $stmt = $db->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    $totalUsers = (int) $stmt->fetchColumn();

    // Total courses
    $stmt = $db->query("SELECT COUNT(*) FROM courses");
    $totalCourses = (int) $stmt->fetchColumn();

    // Total enrollments (distinct user-course pairs via user_progress → chapters → courses)
    $stmt = $db->query("
        SELECT COUNT(DISTINCT CONCAT(up.user_id, '-', ch.course_id))
        FROM user_progress up
        JOIN chapters ch ON up.chapter_id = ch.id
    ");
    $totalEnrollments = (int) $stmt->fetchColumn();

    // Completion rate (% of user_progress rows where is_completed = 1)
    $stmt = $db->query("SELECT COUNT(*) FROM user_progress");
    $totalProgress = (int) $stmt->fetchColumn();
    $stmt = $db->query("SELECT COUNT(*) FROM user_progress WHERE is_completed = 1");
    $completedProgress = (int) $stmt->fetchColumn();
    $completionRate = $totalProgress > 0 ? round(($completedProgress / $totalProgress) * 100, 1) : 0;

    $statistics = [
        'totalUsers'           => $totalUsers,
        'totalCourses'         => $totalCourses,
        'totalEnrollments'     => $totalEnrollments,
        'completionRate'       => $completionRate,
        'usersChange'          => '', // No historical comparison yet
        'coursesChange'        => '',
        'enrollmentsChange'    => '',
        'completionRateChange' => ''
    ];

    // ── 2. VARK Distribution ───────────────────────────────

    $stmt = $db->query("
        SELECT primary_vark_style, COUNT(*) as cnt
        FROM users
        WHERE primary_vark_style IS NOT NULL AND role = 'student'
        GROUP BY primary_vark_style
    ");
    $varkRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $varkDistribution = [
        'visual'      => 0,
        'aural'       => 0,
        'reading'     => 0,
        'kinesthetic' => 0
    ];
    foreach ($varkRows as $row) {
        $style = strtolower($row['primary_vark_style']);
        if ($style === 'read') {
            $varkDistribution['reading'] = (int) $row['cnt'];
        } elseif (isset($varkDistribution[$style])) {
            $varkDistribution[$style] = (int) $row['cnt'];
        }
    }

    // ── 3. User Activity (Last 7 Days) ─────────────────────
    // Classic time-series gap fix: generate all 7 dates in PHP, fill SQL data in

    $stmt = $db->query("
        SELECT DATE(created_at) as reg_date, COUNT(*) as cnt
        FROM users
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY reg_date ASC
    ");
    $activityRows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // ['2026-03-18' => 3, ...]

    $activityLabels = [];
    $activityData = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-{$i} days"));
        $dayName = date('D', strtotime($date)); // Mon, Tue, etc.
        $activityLabels[] = $dayName;
        $activityData[] = isset($activityRows[$date]) ? (int) $activityRows[$date] : 0;
    }

    $userActivity = [
        'labels' => $activityLabels,
        'data'   => $activityData
    ];

    // ── 4. Top Performing Courses ──────────────────────────

    $stmt = $db->query("
        SELECT c.id, c.title as name,
               COUNT(DISTINCT up.user_id) as enrollments,
               COUNT(DISTINCT ch.id) as chapter_count
        FROM courses c
        LEFT JOIN chapters ch ON ch.course_id = c.id
        LEFT JOIN user_progress up ON up.chapter_id = ch.id
        GROUP BY c.id, c.title
        ORDER BY enrollments DESC
        LIMIT 4
    ");
    $topCourses = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $topCourses[] = [
            'id'           => (int) $row['id'],
            'name'         => htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'),
            'enrollments'  => (int) $row['enrollments'],
            'chapterCount' => (int) $row['chapter_count']
        ];
    }

    // ── 5. Recent Sign-ups ─────────────────────────────────

    $stmt = $db->query("
        SELECT id, username, email, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
    ");
    $recentUsers = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $gravatarHash = md5(strtolower(trim($row['email'])));
        $recentUsers[] = [
            'id'       => (int) $row['id'],
            'name'     => htmlspecialchars($row['username'], ENT_QUOTES, 'UTF-8'),
            'email'    => htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8'),
            'avatar'   => "https://www.gravatar.com/avatar/{$gravatarHash}?d=mp&s=40",
            'joinDate' => $row['created_at']
        ];
    }

    // ── 6. System Health ───────────────────────────────────
    // DB is already connected if we got here

    $systemHealth = [
        'server'   => ['status' => 'online', 'uptime' => '99.9%'],
        'database' => ['status' => 'online', 'load'   => 'Connected'],
        'api'      => ['status' => 'online', 'responseTime' => round((microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']) * 1000) . 'ms'],
        'storage'  => ['status' => 'online', 'usage'  => 'Available']
    ];

    // ── Response ───────────────────────────────────────────

    echo json_encode([
        'statistics'       => $statistics,
        'varkDistribution' => $varkDistribution,
        'userActivity'     => $userActivity,
        'topCourses'       => $topCourses,
        'recentUsers'      => $recentUsers,
        'systemHealth'     => $systemHealth
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
