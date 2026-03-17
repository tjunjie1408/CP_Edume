<?php

require_once 'ProgressInterface.php';

class Progress implements ProgressInterface {
    /** @var PDO */
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getUserDashboardData(int $userId): array {
        // Query to get active courses and overall progress.
        // We calculate progress per course first (completed chapters / total chapters)
        // Then we average those out.
        // Uses subquery to count total chapters since courses table has no total_chapters column.
        $query = "
            SELECT 
                COUNT(DISTINCT c.id) as active_courses,
                COALESCE(AVG(
                    (SELECT COUNT(up_inner.id) 
                     FROM user_progress up_inner 
                     JOIN chapters ch_inner ON up_inner.chapter_id = ch_inner.id 
                     WHERE up_inner.user_id = :user_id_inner 
                       AND ch_inner.course_id = c.id
                       AND up_inner.is_completed = 1) 
                    / NULLIF(
                        (SELECT COUNT(ch_total.id) FROM chapters ch_total WHERE ch_total.course_id = c.id)
                    , 0) * 100
                ), 0) as overall_progress
            FROM courses c
            JOIN chapters ch ON c.id = ch.course_id
            JOIN user_progress u_prog ON ch.id = u_prog.chapter_id
            WHERE u_prog.user_id = :user_id
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':user_id_inner', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'active_courses' => (int) ($row['active_courses'] ?? 0),
            'overall_progress' => round((float) ($row['overall_progress'] ?? 0))
        ];
    }

    public function getRecentActivity(int $userId, int $limit = 5): array {
        // Fetch recent completed chapters and quiz attempts across all courses
        $query = "
            SELECT 
                c.title as course_title,
                ch.title as chapter_title,
                up.completed_at as timestamp,
                'chapter_completed' as activity_type
            FROM user_progress up
            JOIN chapters ch ON up.chapter_id = ch.id
            JOIN courses c ON ch.course_id = c.id
            WHERE up.user_id = :user_id AND up.is_completed = 1
            ORDER BY up.completed_at DESC
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
                (SELECT COUNT(up_inner.id) 
                 FROM user_progress up_inner 
                 JOIN chapters ch2 ON up_inner.chapter_id = ch2.id 
                 WHERE up_inner.user_id = :user_id_inner 
                   AND ch2.course_id = c.id 
                   AND up_inner.is_completed = 1) as completed_chapters,
                (SELECT COUNT(ch_total.id) 
                 FROM chapters ch_total 
                 WHERE ch_total.course_id = c.id) as total_chapters,
                MAX(up_main.completed_at) as last_activity
            FROM courses c
            JOIN chapters ch ON c.id = ch.course_id
            JOIN user_progress up_main ON ch.id = up_main.chapter_id
            WHERE up_main.user_id = :user_id
            GROUP BY c.id
            ORDER BY last_activity DESC
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':user_id_inner', $userId, PDO::PARAM_INT);
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
