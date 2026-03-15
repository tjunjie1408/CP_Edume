<?php

interface ProgressInterface {
    
    /**
     * Get the high-level dashboard metrics for a user
     * Calculates the number of active courses and overall progress safely.
     * 
     * @param int $userId The ID of the student
     * @return array Returns ['active_courses' => X, 'overall_progress' => Y]
     */
    public function getUserDashboardData(int $userId): array;

    /**
     * Get a list of recent activities for the timeline feed.
     * 
     * @param int $userId The ID of the student
     * @param int $limit Number of recent activities to fetch
     * @return array Array of recent activity records
     */
    public function getRecentActivity(int $userId, int $limit = 5): array;
    
    /**
     * Get detailed per-course progress.
     * 
     * @param int $userId The ID of the student
     * @return array Array of course titles, their respective progress %, and last_accessed
     */
    public function getEnrolledCoursesProgress(int $userId): array;
}
