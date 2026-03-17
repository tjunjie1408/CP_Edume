<?php
require_once __DIR__ . '/../../config/Database.php';

interface CourseInterface {
    /**
     * Get all published courses from the database.
     * 
     * @return array Array of associative arrays containing course data.
     */
    public function getAllPublishedCourses(): array;

    /**
     * Find a single course by its ID.
     * 
     * @param int $id The course ID
     * @return array|null The course data or null if not found
     */
    public function findById(int $id): ?array;
}
