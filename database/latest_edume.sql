-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2026 at 11:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edume`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `badge_icon` varchar(255) DEFAULT NULL,
  `criteria_type` enum('courses_completed','quizzes_passed','xp_earned','vark_style') NOT NULL,
  `criteria_value` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `name`, `description`, `badge_icon`, `criteria_type`, `criteria_value`) VALUES
(1, 'First Steps', 'Complete your first chapter', '/assets/images/badges/first-steps.png', 'courses_completed', 1),
(2, 'Python Beginner', 'Complete the Python Basics course', '/assets/images/badges/python-beginner.png', 'courses_completed', 1),
(3, 'Quiz Master', 'Pass 5 quizzes', '/assets/images/badges/quiz-master.png', 'quizzes_passed', 5),
(4, 'XP Hunter', 'Earn 500 XP', '/assets/images/badges/xp-hunter.png', 'xp_earned', 500),
(5, 'Visual Learner', 'Identified as a Visual learner', '/assets/images/badges/visual.png', 'vark_style', 1),
(6, 'Read/Write Learner', 'Identified as a Read/Write learner', '/assets/images/badges/read.png', 'vark_style', 2),
(7, 'Kinesthetic Learner', 'Identified as a Kinesthetic learner', '/assets/images/badges/kinesthetic.png', 'vark_style', 3),
(8, 'Code Warrior', 'Complete 10 practice exercises', '/assets/images/badges/code-warrior.png', 'courses_completed', 10);

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `overview` text DEFAULT NULL,
  `order_num` int(11) NOT NULL DEFAULT 0,
  `xp_reward` int(11) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`id`, `course_id`, `title`, `overview`, `order_num`, `xp_reward`) VALUES
(1, 1, 'Introduction to Python', NULL, 1, 50),
(2, 1, 'Variables and Data Types', NULL, 2, 75),
(3, 1, 'Operators and Expressions', NULL, 3, 75),
(4, 1, 'Control Flow - If Statements', NULL, 4, 100),
(5, 1, 'Loops - For and While', NULL, 5, 100),
(6, 1, 'Functions', NULL, 6, 125),
(7, 4, 'Introduction to JavaScript', NULL, 1, 50),
(8, 4, 'Variables and Data Types', NULL, 2, 75),
(9, 4, 'Operators and Expressions', NULL, 3, 75),
(10, 4, 'Control Flow', NULL, 4, 100),
(11, 4, 'Loops', NULL, 5, 100),
(12, 4, 'Functions', NULL, 6, 125),
(13, 5, 'Chapter 1: Introduction & Variable', 'Get started with Go syntax, variables, and basic I/O operations', 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `chapter_objectives`
--

CREATE TABLE `chapter_objectives` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `objective_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `content_materials`
--

CREATE TABLE `content_materials` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `content_type` enum('video','text','practice','link') NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `text_content` longtext DEFAULT NULL,
  `practice_problem` text DEFAULT NULL,
  `practice_solution` text DEFAULT NULL,
  `practice_language` varchar(20) DEFAULT 'python',
  `vark_tag` enum('visual','read','kinesthetic','aural') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_materials`
--

INSERT INTO `content_materials` (`id`, `chapter_id`, `content_type`, `title`, `youtube_url`, `text_content`, `practice_problem`, `practice_solution`, `practice_language`, `vark_tag`) VALUES
(1, 1, 'video', 'Introduction to Python Series', 'https://www.youtube.com/embed/kqtD5dpn9C8?start=0&end=75', NULL, NULL, NULL, 'python', 'visual'),
(2, 1, 'text', 'Python Core Concepts', NULL, '<h2>What is Python?</h2>\r\n<p>Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and first released in 1991, Python has become one of the most popular programming languages in the world.</p>\r\n\r\n<h3>Why Learn Python?</h3>\r\n<ul>\r\n<li><strong>Easy to Learn</strong> - Python has a clean, readable syntax</li>\r\n<li><strong>Versatile</strong> - Used in web development, data science, AI, automation</li>\r\n<li><strong>Large Community</strong> - Extensive libraries and helpful resources</li>\r\n<li><strong>In-Demand</strong> - High-paying job opportunities</li>\r\n</ul>\r\n\r\n<h3>Your First Python Program</h3>\r\n<pre><code>print(\"Hello, World!\")</code></pre>\r\n<p>This simple line of code outputs \"Hello, World!\" to the screen.</p>', NULL, NULL, 'python', 'read'),
(3, 1, 'practice', 'Hello World Output', NULL, NULL, 'Write a Python program that prints \"Hello, World!\" to the console.\r\n\r\nYour code should use the print() function to display the message.', 'print,Hello', 'python', 'kinesthetic'),
(4, 2, 'video', 'Python Variables Explained', 'https://www.youtube.com/embed/cQT33yu9pY8?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(5, 2, 'text', 'Variables & Data Types', NULL, '<h2>Variables in Python</h2>\r\n<p>Variables are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable.</p>\r\n\r\n<h3>Creating Variables</h3>\r\n<pre><code>name = \"Alice\"\r\nage = 25\r\nheight = 5.6\r\nis_student = True</code></pre>\r\n\r\n<h3>Data Types</h3>\r\n<table>\r\n<tr><th>Type</th><th>Example</th><th>Description</th></tr>\r\n<tr><td>str</td><td>\"Hello\"</td><td>Text/String</td></tr>\r\n<tr><td>int</td><td>42</td><td>Integer number</td></tr>\r\n<tr><td>float</td><td>3.14</td><td>Decimal number</td></tr>\r\n<tr><td>bool</td><td>True/False</td><td>Boolean value</td></tr>\r\n</table>\r\n\r\n<h3>Checking Data Type</h3>\r\n<pre><code>x = 10\r\nprint(type(x))  # Output: &lt;class \'int\'&gt;</code></pre>', NULL, NULL, 'python', 'read'),
(6, 2, 'practice', 'Variable Creation', NULL, NULL, 'Create three variables:\r\n1. A variable called \"name\" storing your name as a string\r\n2. A variable called \"age\" storing a number\r\n3. Print both variables using the print() function', 'name,age,print', 'python', 'kinesthetic'),
(7, 3, 'video', 'Python Operators Guide', 'https://www.youtube.com/embed/v5MR5JnKcZI?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(8, 3, 'text', 'Basic Operators in Python', NULL, '<h2>Python Operators</h2>\r\n<p>Operators are used to perform operations on variables and values.</p>\r\n\r\n<h3>Arithmetic Operators</h3>\r\n<pre><code>a = 10\r\nb = 3\r\n\r\nprint(a + b)   # Addition: 13\r\nprint(a - b)   # Subtraction: 7\r\nprint(a * b)   # Multiplication: 30\r\nprint(a / b)   # Division: 3.333...\r\nprint(a % b)   # Modulus: 1\r\nprint(a ** b)  # Exponent: 1000</code></pre>\r\n\r\n<h3>Comparison Operators</h3>\r\n<pre><code>x = 5\r\ny = 10\r\n\r\nprint(x == y)  # Equal: False\r\nprint(x != y)  # Not equal: True\r\nprint(x < y)   # Less than: True\r\nprint(x > y)   # Greater than: False</code></pre>', NULL, NULL, 'python', 'read'),
(9, 3, 'practice', 'Math with Variables', NULL, NULL, 'Create two variables with numbers and calculate:\r\n1. Their sum\r\n2. Their product\r\n3. Print both results', 'print,+,*', 'python', 'kinesthetic'),
(10, 4, 'video', 'Control Flow Video', 'https://www.youtube.com/embed/Zp5MuPOtsSY?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(11, 4, 'text', 'If Statements & Logic', NULL, '<h2>Control Flow - If Statements</h2>\r\n<p>If statements allow you to execute code conditionally based on whether a condition is true or false.</p>\r\n\r\n<h3>Basic If Statement</h3>\r\n<pre><code>age = 18\r\n\r\nif age >= 18:\r\n    print(\"You are an adult\")</code></pre>\r\n\r\n<h3>If-Else Statement</h3>\r\n<pre><code>temperature = 25\r\n\r\nif temperature > 30:\r\n    print(\"It\'s hot!\")\r\nelse:\r\n    print(\"It\'s comfortable\")</code></pre>\r\n\r\n<h3>If-Elif-Else Statement</h3>\r\n<pre><code>score = 85\r\n\r\nif score >= 90:\r\n    grade = \"A\"\r\nelif score >= 80:\r\n    grade = \"B\"\r\nelif score >= 70:\r\n    grade = \"C\"\r\nelse:\r\n    grade = \"F\"\r\n\r\nprint(f\"Your grade is {grade}\")</code></pre>', NULL, NULL, 'python', 'read'),
(12, 4, 'practice', 'Grade Calculator', NULL, NULL, 'Write a program that:\r\n1. Creates a variable \"score\" with a value\r\n2. Uses if-elif-else to determine the grade (A, B, C, or F)\r\n3. Prints the result', 'if,elif,else,print', 'python', 'kinesthetic'),
(13, 5, 'video', 'Loops Series', 'https://www.youtube.com/embed/6iF8Xb7Z3wQ?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(14, 5, 'text', 'For and While Loops', NULL, '<h2>Loops in Python</h2>\r\n<p>Loops allow you to execute a block of code multiple times.</p>\r\n\r\n<h3>For Loop</h3>\r\n<pre><code># Loop through a range\r\nfor i in range(5):\r\n    print(i)  # Prints 0, 1, 2, 3, 4\r\n\r\n# Loop through a list\r\nfruits = [\"apple\", \"banana\", \"cherry\"]\r\nfor fruit in fruits:\r\n    print(fruit)</code></pre>\r\n\r\n<h3>While Loop</h3>\r\n<pre><code>count = 0\r\nwhile count < 5:\r\n    print(count)\r\n    count += 1</code></pre>\r\n\r\n<h3>Loop Control</h3>\r\n<pre><code># Break - exit the loop\r\nfor i in range(10):\r\n    if i == 5:\r\n        break\r\n    print(i)\r\n\r\n# Continue - skip current iteration\r\nfor i in range(5):\r\n    if i == 2:\r\n        continue\r\n    print(i)</code></pre>', NULL, NULL, 'python', 'read'),
(15, 5, 'practice', 'For Loop Challenge', NULL, NULL, 'Write a for loop that:\r\n1. Loops through numbers 1 to 5 using range()\r\n2. Prints each number', 'for,range,print', 'python', 'kinesthetic'),
(16, 6, 'video', 'Mastering Functions', 'https://www.youtube.com/embed/9Os0o3wzS_I?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(17, 6, 'text', 'Python Functions', NULL, '<h2>Functions in Python</h2>\r\n<p>Functions are reusable blocks of code that perform a specific task.</p>\r\n\r\n<h3>Defining a Function</h3>\r\n<pre><code>def greet():\r\n    print(\"Hello!\")\r\n\r\ngreet()  # Call the function</code></pre>\r\n\r\n<h3>Functions with Parameters</h3>\r\n<pre><code>def greet(name):\r\n    print(f\"Hello, {name}!\")\r\n\r\ngreet(\"Alice\")  # Output: Hello, Alice!</code></pre>\r\n\r\n<h3>Return Values</h3>\r\n<pre><code>def add(a, b):\r\n    return a + b\r\n\r\nresult = add(3, 5)\r\nprint(result)  # Output: 8</code></pre>\r\n\r\n<h3>Default Parameters</h3>\r\n<pre><code>def greet(name=\"World\"):\r\n    return f\"Hello, {name}!\"\r\n\r\nprint(greet())        # Hello, World!\r\nprint(greet(\"Bob\"))   # Hello, Bob!</code></pre>', NULL, NULL, 'python', 'read'),
(18, 6, 'practice', 'Add Function', NULL, NULL, 'Create a function called \"add\" that:\r\n1. Takes two parameters\r\n2. Returns their sum\r\n3. Call the function and print the result', 'def,add,return,print', 'python', 'kinesthetic'),
(19, 7, 'video', 'What is JavaScript?', 'https://www.youtube.com/embed/upDLs1sn7g4?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(20, 7, 'text', 'JavaScript Overview', NULL, '<h2>Welcome to JavaScript</h2><p>JavaScript is the programming language of the Web. It can update and change both HTML and CSS, and can calculate, manipulate and validate data.</p><h3>Your First JS Code</h3><pre><code>console.log(\'Hello, World!\');</code></pre>', NULL, NULL, 'javascript', 'read'),
(21, 7, 'practice', 'Hello Console', NULL, NULL, 'Write a JavaScript program that prints \"Hello, JavaScript!\" to the console.\n\nYour code should use console.log() to display the message.', 'console.log,Hello', 'javascript', 'kinesthetic'),
(22, 8, 'video', 'let, const, var Explained', 'https://www.youtube.com/embed/sjyJq2rX6eA?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(23, 8, 'text', 'Variables & Types', NULL, '<h2>JS Variables</h2><p>In modern JS, we use <code>let</code> and <code>const</code>.</p><pre><code>let name = \'John\';\nconst age = 30;\nlet isStudent = true;</code></pre>', NULL, NULL, 'javascript', 'read'),
(24, 8, 'practice', 'Variable Creation', NULL, NULL, 'Create two variables:\n1. A const called \"language\" storing \"JavaScript\"\n2. A let called \"version\" storing a number\n3. Print both variables using console.log()', 'const,let,console.log', 'javascript', 'kinesthetic'),
(25, 9, 'video', 'JS Operators', 'https://www.youtube.com/embed/406D-sD8qY8?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(26, 9, 'text', 'Operators and Logic', NULL, '<h2>JS Operators</h2><p>We have arithmetic (+, -, *, /) and strict equality (===, !==) in JS.</p><pre><code>let x = 5;\nlet y = \'5\';\nconsole.log(x === y); // false</code></pre>', NULL, NULL, 'javascript', 'read'),
(27, 9, 'practice', 'Math with JS', NULL, NULL, 'Create two variables with numbers and calculate:\n1. Their sum\n2. Their product\n3. Print both results with console.log()', 'console.log,+,*', 'javascript', 'kinesthetic'),
(28, 10, 'video', 'If Statements & Ternary', 'https://www.youtube.com/embed/IsG4Xd6LlsM?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(29, 10, 'text', 'Conditional Logic', NULL, '<h2>If Statements</h2><pre><code>let score = 85;\nif (score >= 90) {\n  console.log(\'A\');\n} else {\n  console.log(\'B\');\n}</code></pre>', NULL, NULL, 'javascript', 'read'),
(30, 10, 'practice', 'Grade Logic', NULL, NULL, 'Write an if-else block that:\n1. Checks if a variable score is at least 50\n2. Prints \"Pass\" if true, \"Fail\" if false', 'if,else,console.log', 'javascript', 'kinesthetic'),
(31, 11, 'video', 'For and While Loops', 'https://www.youtube.com/embed/s9wW2PpJsmQ?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(32, 11, 'text', 'Looping in JS', NULL, '<h2>Loops</h2><pre><code>for (let i = 0; i < 5; i++) {\n  console.log(i);\n}</code></pre>', NULL, NULL, 'javascript', 'read'),
(33, 11, 'practice', 'For Loop Challenge', NULL, NULL, 'Write a for loop that:\n1. Initialization: let i = 1\n2. Condition: i <= 5\n3. Increment: i++\n4. Prints each number', 'for,console.log', 'javascript', 'kinesthetic'),
(34, 12, 'video', 'Functions & Arrow Functions', 'https://www.youtube.com/embed/N8ap4k_1QEQ?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(35, 12, 'text', 'JS Functions', NULL, '<h2>Arrow Functions</h2><p>Modern JS relies heavily on arrow functions.</p><pre><code>const add = (a, b) => a + b;\nconsole.log(add(2, 3));</code></pre>', NULL, NULL, 'javascript', 'read'),
(36, 12, 'practice', 'Arrow Function Challenge', NULL, NULL, 'Create an arrow function called \"multiply\" that:\n1. Takes two parameters\n2. Returns their product\n3. Call the function and print the result', 'const,return,console.log', 'javascript', 'kinesthetic'),
(37, 13, 'video', 'Go Crash Course - First Steps', 'https://www.youtube.com/embed/un6ZyFkqFKo?start=0&end=900', NULL, NULL, NULL, 'golang', 'visual'),
(38, 13, 'practice', 'Practice: Print Your First Message', NULL, NULL, 'Write a Go program that prints exactly \"Welcome to EduMe!\" to the console. Make sure you include \'package main\' and import the \'fmt\' package.', NULL, 'golang', 'kinesthetic'),
(39, 13, 'text', 'Go Syntax & Variables Guide', NULL, '<h3>Hello World in Go</h3>\n<p>In Go, every program is part of a package. An executable program must use <code>package main</code>.</p>\n<pre><code>package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go!\")\n}</code></pre>\n\n<h3>Variables & Types</h3>\n<p>You can declare variables using the <code>var</code> keyword or the short assignment <code>:=</code>.</p>\n<ul>\n  <li><code>var name string = \"EduMe\"</code></li>\n  <li><code>age := 20</code> (type dynamically inferred as int)</li>\n</ul>', NULL, NULL, 'golang', 'read');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `cover_image` longtext DEFAULT NULL,
  `has_visual` tinyint(1) NOT NULL DEFAULT 0,
  `has_read` tinyint(1) NOT NULL DEFAULT 0,
  `has_kinesthetic` tinyint(1) NOT NULL DEFAULT 0,
  `has_aural` tinyint(1) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `category`, `difficulty`, `cover_image`, `has_visual`, `has_read`, `has_kinesthetic`, `has_aural`, `is_published`, `created_at`) VALUES
(1, 'Python Basics', 'Learn Python programming from scratch. Perfect for beginners who want to start their coding journey with one of the most popular and versatile programming languages.', 'Python', 'beginner', '/image/1.png', 1, 1, 1, 0, 1, '2026-03-21 05:37:03'),
(2, 'Web Development Fundamentals', 'Master HTML, CSS, and JavaScript to build beautiful websites. Coming soon!', 'Web Development', 'beginner', '/image/2.png', 1, 1, 1, 0, 0, '2026-03-21 05:37:03'),
(3, 'Data Science Essentials', 'Explore data analysis, visualization, and machine learning basics. Coming soon!', 'Data Science', 'intermediate', '/image/3.webp', 1, 1, 1, 0, 0, '2026-03-21 05:37:03'),
(4, 'JavaScript Fundamentals', 'Master JavaScript from basic syntax to advanced concepts. The essential language for modern web development.', 'JavaScript', 'beginner', '/image/12.png', 1, 1, 1, 0, 1, '2026-03-21 06:09:18'),
(5, 'Foundation of Golang', 'The bacis of language go', 'Golang', 'beginner', 'data:image/jpeg;base64,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', 0, 0, 0, 0, 1, '2026-03-24 17:22:27');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `passing_score` int(11) NOT NULL DEFAULT 60
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `chapter_id`, `title`, `passing_score`) VALUES
(1, 1, 'Introduction to Python Quiz', 60),
(2, 2, 'Variables and Data Types Quiz', 60),
(3, 3, 'Operators Quiz', 60),
(4, 4, 'Control Flow Quiz', 60),
(5, 5, 'Loops Quiz', 60),
(6, 6, 'Functions Quiz', 60),
(7, 7, 'Intro to JS Quiz', 60),
(8, 8, 'Variables Quiz', 60),
(9, 9, 'Operators Quiz', 60),
(10, 10, 'Control Flow Quiz', 60),
(11, 11, 'Loops Quiz', 60),
(12, 12, 'Functions Quiz', 60),
(13, 13, 'Chapter Quiz', 60);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `attempted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_option` char(1) NOT NULL,
  `explanation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(1, 1, 'Who created Python?', 'James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup', 'B', 'Python was created by Guido van Rossum and released in 1991.'),
(2, 1, 'Which function is used to output text in Python?', 'echo()', 'console.log()', 'print()', 'write()', 'C', 'The print() function is used to output text in Python.'),
(3, 1, 'What type of language is Python?', 'Compiled', 'Interpreted', 'Assembly', 'Machine', 'B', 'Python is an interpreted, high-level programming language.'),
(4, 2, 'Which is a valid variable name in Python?', '2name', 'my-var', 'my_var', 'my var', 'C', 'Variable names can contain letters, numbers, and underscores, but cannot start with a number.'),
(5, 2, 'What data type is \"Hello World\"?', 'int', 'float', 'str', 'bool', 'C', '\"Hello World\" is a string (str) because it is text enclosed in quotes.'),
(6, 2, 'What function checks the data type of a variable?', 'typeof()', 'datatype()', 'type()', 'check()', 'C', 'The type() function returns the data type of a variable.'),
(7, 3, 'What is the result of 10 % 3?', '3', '1', '3.33', '0', 'B', 'The modulus operator (%) returns the remainder. 10 / 3 = 3 remainder 1.'),
(8, 3, 'What operator is used for exponentiation in Python?', '^', '**', 'exp()', '^^', 'B', 'The ** operator is used for exponentiation. Example: 2**3 = 8'),
(9, 3, 'What does == check?', 'Assignment', 'Equality', 'Not equal', 'Greater than', 'B', 'The == operator checks if two values are equal.'),
(10, 4, 'What keyword is used for multiple conditions?', 'else if', 'elseif', 'elif', 'elsif', 'C', 'Python uses elif for else-if conditions.'),
(11, 4, 'What is printed: if 5 > 3: print(\"Yes\")', 'Yes', 'No', 'Error', 'Nothing', 'A', '5 > 3 is True, so \"Yes\" is printed.'),
(12, 4, 'What must be at the end of an if statement line?', ';', ':', '{}', '()', 'B', 'Python uses a colon : at the end of if statement lines.'),
(13, 5, 'What does range(5) generate?', '1 to 5', '0 to 5', '0 to 4', '1 to 4', 'C', 'range(5) generates numbers from 0 to 4 (5 numbers total).'),
(14, 5, 'Which keyword exits a loop immediately?', 'exit', 'break', 'stop', 'end', 'B', 'The break keyword immediately exits the current loop.'),
(15, 5, 'What loop runs while a condition is True?', 'for', 'while', 'do', 'repeat', 'B', 'A while loop continues as long as its condition is True.'),
(16, 6, 'Which keyword is used to define a function?', 'function', 'func', 'def', 'define', 'C', 'Python uses the def keyword to define functions.'),
(17, 6, 'What keyword sends a value back from a function?', 'send', 'back', 'return', 'output', 'C', 'The return keyword sends a value back from a function.'),
(18, 6, 'What are values passed to a function called?', 'Variables', 'Arguments', 'Returns', 'Outputs', 'B', 'Values passed to a function are called arguments or parameters.'),
(19, 7, 'Which company created JavaScript?', 'Microsoft', 'Netscape', 'Google', 'Apple', 'B', 'Netscape created JavaScript in 1995.'),
(20, 7, 'What is used to print values in the browser console?', 'print()', 'echo()', 'console.log()', 'System.out.print()', 'C', 'console.log() is used to log messages to the console.'),
(21, 7, 'Where is the correct place to insert a JavaScript?', 'The <body> section', 'The <head> section', 'Both <head> and <body> are correct', 'Neither', 'C', 'Scripts can be placed in both <head> and <body>.'),
(22, 8, 'Which keyword declares a block-scoped variable?', 'var', 'let', 'static', 'def', 'B', 'let declares a block-scoped local variable.'),
(23, 8, 'Which keyword declares a constant?', 'constant', 'const', 'fixed', 'let', 'B', 'const creates a read-only reference to a value.'),
(24, 8, 'What is the data type of true?', 'String', 'Number', 'Boolean', 'Object', 'C', 'true and false are Boolean values.'),
(25, 9, 'What operator means \'strict equality\'?', '==', '===', '=', '!=', 'B', '=== checks both value and type for equality.'),
(26, 9, 'What does 5 + \'5\' evaluate to in JavaScript?', '10', '55', 'Error', 'undefined', 'B', 'JS coerces the number to a string and concatenates them to \'55\'.'),
(27, 9, 'Which is the Logical AND operator?', '&&', '||', '!', '&', 'A', '&& is the logical AND operator in JavaScript.'),
(28, 10, 'Which statement is used to execute different actions based on conditions?', 'if...else', 'for', 'while', 'return', 'A', 'if...else statements control conditional execution.'),
(29, 10, 'How do you write a ternary operator?', 'condition ? true : false', 'condition : true ? false', 'if condition then true else false', 'condition ? false : true', 'A', 'The ternary operator syntax is condition ? true_expr : false_expr.'),
(30, 10, 'Can an if statement omit the else block?', 'Yes', 'No', 'Only inside functions', 'Depends on the browser', 'A', 'The else block is optional.'),
(31, 11, 'How does a FOR loop start?', 'for (i <= 5; i++)', 'for (let i = 0; i <= 5; i++)', 'for i = 1 to 5', 'for (i = 0; i <= 5)', 'B', 'It has initialization, condition, and final expression.'),
(32, 11, 'Which loop executes a block of code at least once?', 'for', 'while', 'do...while', 'for...in', 'C', 'do...while executes the code block once before checking the condition.'),
(33, 11, 'What statement breaks out of a loop?', 'stop', 'break', 'exit', 'return', 'B', 'The break statement jumps out of a loop.'),
(34, 12, 'How do you create an arrow function?', 'function => {}', '() => {}', '=> function()', 'arrow() {}', 'B', '() => {} is the syntax for an arrow function.'),
(35, 12, 'Inside which HTML element do we put JavaScript?', '<scripting>', '<javascript>', '<js>', '<script>', 'D', 'JavaScript code is placed inside <script> tags.'),
(36, 12, 'What does the return statement do?', 'Prints to console', 'Stops function and returns a value', 'Declares a variable', 'Loops code', 'B', 'return ends function execution and specifies a value to be returned.'),
(37, 13, 'Which keyword or operator is used to declare a variable in Go with automatic type inference?', 'var', ':=', 'let', 'def', 'B', 'The := syntax is used in Go for short variable declarations with implicit type inference.'),
(38, 13, 'What is the correct way to print output to the console in Go?', 'console.log(\"Hello\")', 'print(\"Hello\")', 'System.out.println(\"Hello\")', 'fmt.Println(\"Hello\")', 'D', 'You must import the \'fmt\' package and call fmt.Println to print to standard output in Go.'),
(39, 13, 'Which of the following describes the difference between var and := in Go?', 'var is used for constants, := is used for variables', ':= can only be used inside functions, while var can be used anywhere', 'var requires a type declaration, := does not', 'There is no difference between them', 'B', 'The short declaration operator := can only be used inside function bodies, whereas var can be used at the package level as well.');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `report_type` varchar(50) NOT NULL DEFAULT 'General',
  `content` text NOT NULL,
  `status` enum('pending','resolved') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `user_id`, `course_id`, `report_type`, `content`, `status`, `admin_notes`, `created_at`) VALUES
(1, 2, 5, 'feedback', 'Material quality no bad', 'resolved', '', '2026-03-24 20:25:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
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
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `last_login_date` date DEFAULT NULL,
  `email_notifications_enabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `primary_vark_style`, `experience_level`, `bio`, `profile_avatar_url`, `created_at`, `updated_at`, `current_streak`, `last_login_date`, `email_notifications_enabled`) VALUES
(1, 'admin', 'admin@edume.com', '$2y$10$QafSPPEwtpHY1.wPPli3OeLpTSxpldE7vOtzZ4xN7kOm4O82X9s7a', 'admin', 'visual', 'Beginner', NULL, NULL, '2026-03-21 05:37:03', '2026-03-26 13:10:43', 5, '2026-03-26', 1),
(2, 'student', 'student@gmail.com', '$2y$10$sfrMG8XADHDOZ47QPDPjuOQ6ejXuMCVPK/cgWJlaWYDKV88bKtZge', 'student', 'read', 'Beginner', NULL, NULL, '2026-03-21 05:38:53', '2026-03-29 17:29:42', 1, '2026-03-29', 1),
(5, 'vera', 'vera@gmail.com', '$2y$10$hh2Axaz4oQYUG2XT7Djf6uhb00RH1TUIUWfxqw2HdWVH1wIA5JaPy', 'student', NULL, 'Beginner', NULL, NULL, '2026-03-23 05:42:56', '2026-03-23 21:31:07', 1, '2026-03-22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `earned_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `xp_earned` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_id`, `chapter_id`, `is_completed`, `completed_at`, `xp_earned`) VALUES
(1, 2, 1, 1, '2026-03-24 17:08:53', 0),
(6, 2, 13, 1, '2026-03-24 20:44:00', 0),
(29, 2, 7, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_vark_results`
--

CREATE TABLE `user_vark_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `visual_score` int(11) NOT NULL DEFAULT 0,
  `read_score` int(11) NOT NULL DEFAULT 0,
  `kinesthetic_score` int(11) NOT NULL DEFAULT 0,
  `aural_score` int(11) NOT NULL DEFAULT 0,
  `assessed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vark_options`
--

CREATE TABLE `vark_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) NOT NULL,
  `vark_type` enum('visual','read','kinesthetic','aural') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vark_options`
--

INSERT INTO `vark_options` (`id`, `question_id`, `option_text`, `vark_type`) VALUES
(1, 1, 'Watch video tutorials demonstrating the features', 'visual'),
(2, 1, 'Read the user manual or documentation', 'read'),
(3, 1, 'Jump in and start clicking around to explore', 'kinesthetic'),
(4, 2, 'See diagrams, charts, or visual representations', 'visual'),
(5, 2, 'Write them down in detailed notes', 'read'),
(6, 2, 'Practice and repeat the activity myself', 'kinesthetic'),
(7, 3, 'Draw a map or show pictures of landmarks', 'visual'),
(8, 3, 'Write out step-by-step text instructions', 'read'),
(9, 3, 'Walk them through the route physically', 'kinesthetic'),
(10, 4, 'Follow the picture diagrams in the manual', 'visual'),
(11, 4, 'Read the written instructions carefully', 'read'),
(12, 4, 'Start assembling and figure it out as I go', 'kinesthetic'),
(13, 5, 'Use mind maps, diagrams, and color-coded notes', 'visual'),
(14, 5, 'Reread textbooks and my written notes', 'read'),
(15, 5, 'Practice problems and do hands-on exercises', 'kinesthetic'),
(16, 6, 'The slides, graphs, and visual demonstrations', 'visual'),
(17, 6, 'The handouts and written materials provided', 'read'),
(18, 6, 'Interactive demos or when I can try things myself', 'kinesthetic'),
(19, 7, 'Watch a cooking video showing the process', 'visual'),
(20, 7, 'Follow a written recipe with detailed steps', 'read'),
(21, 7, 'Experiment and taste as I cook', 'kinesthetic'),
(22, 8, 'Watch someone perform the moves first', 'visual'),
(23, 8, 'Read about the technique and positions', 'read'),
(24, 8, 'Get up and start moving immediately', 'kinesthetic'),
(25, 9, 'Look for visual error indicators or diagrams', 'visual'),
(26, 9, 'Search for written solutions and documentation', 'read'),
(27, 9, 'Try different solutions until something works', 'kinesthetic'),
(28, 10, 'Picture the number in my mind visually', 'visual'),
(29, 10, 'Write it down multiple times', 'read'),
(30, 10, 'Dial it several times to memorize it', 'kinesthetic');

-- --------------------------------------------------------

--
-- Table structure for table `vark_questions`
--

CREATE TABLE `vark_questions` (
  `id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `order_num` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vark_questions`
--

INSERT INTO `vark_questions` (`id`, `question_text`, `order_num`, `is_active`) VALUES
(1, 'When learning a new software, I prefer to:', 1, 1),
(2, 'I remember things best when I:', 2, 1),
(3, 'When explaining directions to someone, I would:', 3, 1),
(4, 'If I need to assemble furniture, I would:', 4, 1),
(5, 'When studying for an exam, I typically:', 5, 1),
(6, 'At a presentation, I pay most attention to:', 6, 1),
(7, 'When cooking a new recipe, I prefer to:', 7, 1),
(8, 'I learn a new dance move best by:', 8, 1),
(9, 'When troubleshooting a problem, I tend to:', 9, 1),
(10, 'To remember a phone number, I would:', 10, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`course_id`),
  ADD KEY `idx_order` (`order_num`);

--
-- Indexes for table `chapter_objectives`
--
ALTER TABLE `chapter_objectives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapter_obj` (`chapter_id`);

--
-- Indexes for table `content_materials`
--
ALTER TABLE `content_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapter_content` (`chapter_id`),
  ADD KEY `idx_type` (`content_type`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_difficulty` (`difficulty`),
  ADD KEY `idx_published` (`is_published`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapter_quiz` (`chapter_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_quiz` (`user_id`),
  ADD KEY `idx_quiz_attempt` (`quiz_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_quiz_question` (`quiz_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `idx_achievement` (`achievement_id`),
  ADD KEY `idx_user_ach` (`user_id`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_chapter` (`user_id`,`chapter_id`),
  ADD KEY `idx_user_prog` (`user_id`),
  ADD KEY `idx_chapter_prog` (`chapter_id`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_skills` (`user_id`);

--
-- Indexes for table `user_vark_results`
--
ALTER TABLE `user_vark_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_vark_res` (`user_id`);

--
-- Indexes for table `vark_options`
--
ALTER TABLE `vark_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_question_vark` (`question_id`);

--
-- Indexes for table `vark_questions`
--
ALTER TABLE `vark_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_vark` (`order_num`),
  ADD KEY `idx_active_vark` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `chapter_objectives`
--
ALTER TABLE `chapter_objectives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `content_materials`
--
ALTER TABLE `content_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_vark_results`
--
ALTER TABLE `user_vark_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vark_options`
--
ALTER TABLE `vark_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vark_questions`
--
ALTER TABLE `vark_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chapter_objectives`
--
ALTER TABLE `chapter_objectives`
  ADD CONSTRAINT `fk_chapter_obj` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `content_materials`
--
ALTER TABLE `content_materials`
  ADD CONSTRAINT `content_materials_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `fk_user_skills` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_vark_results`
--
ALTER TABLE `user_vark_results`
  ADD CONSTRAINT `user_vark_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vark_options`
--
ALTER TABLE `vark_options`
  ADD CONSTRAINT `vark_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `vark_questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
