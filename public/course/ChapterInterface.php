<?php

interface ChapterInterface {
    /**
     * Get all chapters for a specific course
     *
     * @param int $courseId
     * @return array
     */
    public function getChaptersByCourseId(int $courseId): array;

    /**
     * Get a specific chapter by ID
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array;
}
