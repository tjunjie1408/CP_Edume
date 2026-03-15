<?php

require_once 'ProgressInterface.php';

class Progress implements ProgressInterface {
    private PDO $conn;

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    public function getUserDashboardData(int $userId): array {
        // Query to get active courses and overall progress.
        // We calculate progress per course first (completed chapters / total chapters)
        // Then we average those out.
        // NULLIF prevents division by zero if total_chapters is 0.
        $query = "
            SELECT 
                COUNT(DISTINCT c.id) as active_courses,
                COALESCE(AVG(
                    (SELECT COUNT(up.id) 
                     FROM user_progress up 
                     JOIN chapters ch ON up.chapter_id = ch.id 
                     WHERE up.user_id = :user_id 
                       AND ch.course_id = c.id) 
                    / NULLIF(c.total_chapters, 0) * 100
                ), 0) as overall_progress
            FROM courses c
            JOIN chapters ch ON c.id = ch.course_id
            JOIN user_progress u_prog ON ch.id = u_prog.chapter_id
            WHERE u_prog.user_id = :user_id
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'active_courses' => (int) ($row['active_courses'] ?? 0),
            'overall_progress' => round((float) ($row['overall_progress'] ?? 0))
        ];
    }

    public function getRecentActivity(int $userId, int $limit = 5): array {
        // Fetch recent progress updates across all courses
        $query = "
            SELECT 
                c.title as course_title,
                ch.title as chapter_title,
                up.score,
                up.last_accessed as timestamp,
                'quiz_passed' as activity_type
            FROM user_progress up
            JOIN chapters ch ON up.chapter_id = ch.id
            JOIN courses c ON ch.course_id = c.id
            WHERE up.user_id = :user_id AND up.completed = 1
            ORDER BY up.last_accessed DESC
            LIMIT :limit
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEnrolledCoursesProgress(int $userId): array {
        $query = "
            SELECT 
                c.id,
                c.title,
                c.cover_image,
                c.difficulty,
                (SELECT COUNT(up.id) 
                 FROM user_progress up 
                 JOIN chapters ch2 ON up.chapter_id = ch2.id 
                 WHERE up.user_id = :user_id AND ch2.course_id = c.id AND up.completed = 1) as completed_chapters,
                c.total_chapters,
                MAX(up_main.last_accessed) as last_activity
            FROM courses c
            JOIN chapters ch ON c.id = ch.course_id
            JOIN user_progress up_main ON ch.id = up_main.chapter_id
            WHERE up_main.user_id = :user_id
            GROUP BY c.id
            ORDER BY last_activity DESC
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calculate percentages
        foreach ($courses as &$course) {
            $total = (int)$course['total_chapters'];
            $completed = (int)$course['completed_chapters'];
            $course['progress_percent'] = $total > 0 ? round(($completed / $total) * 100) : 0;
        }
        
        return $courses;
    }
}
