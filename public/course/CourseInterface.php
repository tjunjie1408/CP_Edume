<?php
require_once __DIR__ . '/../../config/Database.php';

interface CourseInterface {
    /**
     * Get all published courses from the database.
     * 
     * @return array Array of associative arrays containing course data.
     */
    public function getAllPublishedCourses(): array;
}
