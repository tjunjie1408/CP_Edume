<?php

interface ContentMaterialInterface {
    /**
     * Get all content materials for a specific chapter
     *
     * @param int $chapterId
     * @return array
     */
    public function getMaterialsByChapterId(int $chapterId): array;

    /**
     * Get a specific material by ID
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array;
}
