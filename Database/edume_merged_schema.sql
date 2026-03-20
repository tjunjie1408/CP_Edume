-- phpMyAdmin SQL Dump
-- Database: `edume`

CREATE DATABASE IF NOT EXISTS `edume`;
USE `edume`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables to ensure a clean slate
DROP TABLE IF EXISTS `user_achievements`;
DROP TABLE IF EXISTS `achievements`;
DROP TABLE IF EXISTS `user_progress`;
DROP TABLE IF EXISTS `quiz_attempts`;
DROP TABLE IF EXISTS `quiz_questions`;
DROP TABLE IF EXISTS `quizzes`;
DROP TABLE IF EXISTS `content_materials`;
DROP TABLE IF EXISTS `chapter_objectives`;
DROP TABLE IF EXISTS `chapters`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `user_skills`;
DROP TABLE IF EXISTS `user_vark_results`;
DROP TABLE IF EXISTS `vark_options`;
DROP TABLE IF EXISTS `vark_questions`;
DROP TABLE IF EXISTS `users`;

-- Also drop old tables from the previous `edume.sql` (if any exist) to avoid confusion
DROP TABLE IF EXISTS `quiz_options`;
DROP TABLE IF EXISTS `resources`;
DROP TABLE IF EXISTS `subject_objectives`;
DROP TABLE IF EXISTS `subjects`;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `primary_vark_style` enum('visual','read','kinesthetic','aural') DEFAULT NULL,
  `experience_level` varchar(50) DEFAULT 'Beginner',
  `bio` text DEFAULT NULL,
  `profile_avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `user_skills` (NEW from ERD)
-- --------------------------------------------------------
CREATE TABLE `user_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_skills` (`user_id`),
  CONSTRAINT `fk_user_skills` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `courses`
-- --------------------------------------------------------
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `cover_image` longtext DEFAULT NULL, -- Changed from varchar to longtext to support Base64 as requested in JS
  `has_visual` tinyint(1) NOT NULL DEFAULT 0,
  `has_read` tinyint(1) NOT NULL DEFAULT 0,
  `has_kinesthetic` tinyint(1) NOT NULL DEFAULT 0,
  `has_aural` tinyint(1) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `chapters`
-- --------------------------------------------------------
CREATE TABLE `chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `overview` text DEFAULT NULL, -- Added from ERD 'subjects' table
  `order_num` int(11) NOT NULL DEFAULT 0,
  `xp_reward` int(11) NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_order` (`order_num`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `chapter_objectives` (NEW from ERD)
-- --------------------------------------------------------
CREATE TABLE `chapter_objectives` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_id` int(11) NOT NULL,
  `objective_text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_chapter_obj` (`chapter_id`),
  CONSTRAINT `fk_chapter_obj` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `content_materials`
-- --------------------------------------------------------
CREATE TABLE `content_materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_id` int(11) NOT NULL,
  `content_type` enum('video','text','practice','link') NOT NULL,
  `title` varchar(255) DEFAULT NULL, -- Added to label resources
  `youtube_url` varchar(255) DEFAULT NULL,
  `text_content` longtext DEFAULT NULL,
  `practice_problem` text DEFAULT NULL,
  `practice_solution` text DEFAULT NULL,
  `practice_language` varchar(20) DEFAULT 'python',
  `vark_tag` enum('visual','read','kinesthetic','aural') DEFAULT NULL, -- Added from ERD to allow dynamic filtering
  PRIMARY KEY (`id`),
  KEY `idx_chapter_content` (`chapter_id`),
  KEY `idx_type` (`content_type`),
  CONSTRAINT `content_materials_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Table structure for table `quizzes`
-- --------------------------------------------------------
CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `passing_score` int(11) NOT NULL DEFAULT 60,
  PRIMARY KEY (`id`),
  KEY `idx_chapter_quiz` (`chapter_id`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `quiz_questions`
-- --------------------------------------------------------
CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_option` char(1) NOT NULL,
  `explanation` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_question` (`quiz_id`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `quiz_attempts`
-- --------------------------------------------------------
CREATE TABLE `quiz_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `attempted_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_quiz` (`user_id`),
  KEY `idx_quiz_attempt` (`quiz_id`),
  CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `user_progress`
-- --------------------------------------------------------
CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `xp_earned` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_chapter` (`user_id`,`chapter_id`),
  KEY `idx_user_prog` (`user_id`),
  KEY `idx_chapter_prog` (`chapter_id`),
  CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `achievements`
-- --------------------------------------------------------
CREATE TABLE `achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `badge_icon` varchar(255) DEFAULT NULL,
  `criteria_type` enum('courses_completed','quizzes_passed','xp_earned','vark_style') NOT NULL,
  `criteria_value` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `user_achievements`
-- --------------------------------------------------------
CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `earned_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  KEY `idx_achievement` (`achievement_id`),
  KEY `idx_user_ach` (`user_id`),
  CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `vark_questions`
-- --------------------------------------------------------
CREATE TABLE `vark_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_text` text NOT NULL,
  `order_num` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_order_vark` (`order_num`),
  KEY `idx_active_vark` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `vark_options`
-- --------------------------------------------------------
CREATE TABLE `vark_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) NOT NULL,
  `vark_type` enum('visual','read','kinesthetic','aural') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_question_vark` (`question_id`),
  CONSTRAINT `vark_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `vark_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `user_vark_results`
-- --------------------------------------------------------
CREATE TABLE `user_vark_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `visual_score` int(11) NOT NULL DEFAULT 0,
  `read_score` int(11) NOT NULL DEFAULT 0,
  `kinesthetic_score` int(11) NOT NULL DEFAULT 0,
  `aural_score` int(11) NOT NULL DEFAULT 0,
  `assessed_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_vark_res` (`user_id`),
  CONSTRAINT `user_vark_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
