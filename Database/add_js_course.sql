-- --------------------------------------------------------
-- Safe Insert Script for JavaScript Fundamentals Course
-- --------------------------------------------------------
-- WARNING: Do not run TRUNCATE commands if you want to keep existing data!
-- This script only appends the JS course, chapters, materials, and quizzes.

-- 1. Insert JavaScript Fundamentals Course
INSERT INTO courses (id, title, description, category, difficulty, cover_image, has_visual, has_read, has_kinesthetic, is_published) VALUES
(4, 'JavaScript Fundamentals', 'Master JavaScript from basic syntax to advanced concepts. The essential language for modern web development.', 'JavaScript', 'beginner', '/image/12.png', TRUE, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE title = 'JavaScript Fundamentals';

-- 2. Insert JavaScript Course Chapters (Course ID 4)
INSERT INTO chapters (id, course_id, title, order_num, xp_reward) VALUES
(7, 4, 'Introduction to JavaScript', 1, 50),
(8, 4, 'Variables and Data Types', 2, 75),
(9, 4, 'Operators and Expressions', 3, 75),
(10, 4, 'Control Flow', 4, 100),
(11, 4, 'Loops', 5, 100),
(12, 4, 'Functions', 6, 125)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. Content Materials for JS Chapters
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(7, 'video', 'What is JavaScript?', 'https://www.youtube.com/embed/upDLs1sn7g4?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(7, 'text', 'JavaScript Overview', NULL, '<h2>Welcome to JavaScript</h2><p>JavaScript is the programming language of the Web. It can update and change both HTML and CSS, and can calculate, manipulate and validate data.</p><h3>Your First JS Code</h3><pre><code>console.log(''Hello, World!'');</code></pre>', NULL, NULL, 'javascript', 'read'),
(7, 'practice', 'Hello Console', NULL, NULL, 'Write a JavaScript program that prints "Hello, JavaScript!" to the console.\n\nYour code should use console.log() to display the message.', 'console.log,Hello', 'javascript', 'kinesthetic'),
(8, 'video', 'let, const, var Explained', 'https://www.youtube.com/embed/sjyJq2rX6eA?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(8, 'text', 'Variables & Types', NULL, '<h2>JS Variables</h2><p>In modern JS, we use <code>let</code> and <code>const</code>.</p><pre><code>let name = ''John'';\nconst age = 30;\nlet isStudent = true;</code></pre>', NULL, NULL, 'javascript', 'read'),
(8, 'practice', 'Variable Creation', NULL, NULL, 'Create two variables:\n1. A const called "language" storing "JavaScript"\n2. A let called "version" storing a number\n3. Print both variables using console.log()', 'const,let,console.log', 'javascript', 'kinesthetic'),
(9, 'video', 'JS Operators', 'https://www.youtube.com/embed/406D-sD8qY8?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(9, 'text', 'Operators and Logic', NULL, '<h2>JS Operators</h2><p>We have arithmetic (+, -, *, /) and strict equality (===, !==) in JS.</p><pre><code>let x = 5;\nlet y = ''5'';\nconsole.log(x === y); // false</code></pre>', NULL, NULL, 'javascript', 'read'),
(9, 'practice', 'Math with JS', NULL, NULL, 'Create two variables with numbers and calculate:\n1. Their sum\n2. Their product\n3. Print both results with console.log()', 'console.log,+,*', 'javascript', 'kinesthetic'),
(10, 'video', 'If Statements & Ternary', 'https://www.youtube.com/embed/IsG4Xd6LlsM?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(10, 'text', 'Conditional Logic', NULL, '<h2>If Statements</h2><pre><code>let score = 85;\nif (score >= 90) {\n  console.log(''A'');\n} else {\n  console.log(''B'');\n}</code></pre>', NULL, NULL, 'javascript', 'read'),
(10, 'practice', 'Grade Logic', NULL, NULL, 'Write an if-else block that:\n1. Checks if a variable score is at least 50\n2. Prints "Pass" if true, "Fail" if false', 'if,else,console.log', 'javascript', 'kinesthetic'),
(11, 'video', 'For and While Loops', 'https://www.youtube.com/embed/s9wW2PpJsmQ?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(11, 'text', 'Looping in JS', NULL, '<h2>Loops</h2><pre><code>for (let i = 0; i < 5; i++) {\n  console.log(i);\n}</code></pre>', NULL, NULL, 'javascript', 'read'),
(11, 'practice', 'For Loop Challenge', NULL, NULL, 'Write a for loop that:\n1. Initialization: let i = 1\n2. Condition: i <= 5\n3. Increment: i++\n4. Prints each number', 'for,console.log', 'javascript', 'kinesthetic'),
(12, 'video', 'Functions & Arrow Functions', 'https://www.youtube.com/embed/N8ap4k_1QEQ?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(12, 'text', 'JS Functions', NULL, '<h2>Arrow Functions</h2><p>Modern JS relies heavily on arrow functions.</p><pre><code>const add = (a, b) => a + b;\nconsole.log(add(2, 3));</code></pre>', NULL, NULL, 'javascript', 'read'),
(12, 'practice', 'Arrow Function Challenge', NULL, NULL, 'Create an arrow function called "multiply" that:\n1. Takes two parameters\n2. Returns their product\n3. Call the function and print the result', 'const,return,console.log', 'javascript', 'kinesthetic');

-- 4. JS Quizzes
INSERT INTO quizzes (id, chapter_id, title, passing_score) VALUES
(7, 7, 'Intro to JS Quiz', 60),
(8, 8, 'Variables Quiz', 60),
(9, 9, 'Operators Quiz', 60),
(10, 10, 'Control Flow Quiz', 60),
(11, 11, 'Loops Quiz', 60),
(12, 12, 'Functions Quiz', 60)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. JS Quiz Questions
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(7, 'Which company created JavaScript?', 'Microsoft', 'Netscape', 'Google', 'Apple', 'B', 'Netscape created JavaScript in 1995.'),
(7, 'What is used to print values in the browser console?', 'print()', 'echo()', 'console.log()', 'System.out.print()', 'C', 'console.log() is used to log messages to the console.'),
(7, 'Where is the correct place to insert a JavaScript?', 'The <body> section', 'The <head> section', 'Both <head> and <body> are correct', 'Neither', 'C', 'Scripts can be placed in both <head> and <body>.'),
(8, 'Which keyword declares a block-scoped variable?', 'var', 'let', 'static', 'def', 'B', 'let declares a block-scoped local variable.'),
(8, 'Which keyword declares a constant?', 'constant', 'const', 'fixed', 'let', 'B', 'const creates a read-only reference to a value.'),
(8, 'What is the data type of true?', 'String', 'Number', 'Boolean', 'Object', 'C', 'true and false are Boolean values.'),
(9, 'What operator means ''strict equality''?', '==', '===', '=', '!=', 'B', '=== checks both value and type for equality.'),
(9, 'What does 5 + ''5'' evaluate to in JavaScript?', '10', '55', 'Error', 'undefined', 'B', 'JS coerces the number to a string and concatenates them to ''55''.'),
(9, 'Which is the Logical AND operator?', '&&', '||', '!', '&', 'A', '&& is the logical AND operator in JavaScript.'),
(10, 'Which statement is used to execute different actions based on conditions?', 'if...else', 'for', 'while', 'return', 'A', 'if...else statements control conditional execution.'),
(10, 'How do you write a ternary operator?', 'condition ? true : false', 'condition : true ? false', 'if condition then true else false', 'condition ? false : true', 'A', 'The ternary operator syntax is condition ? true_expr : false_expr.'),
(10, 'Can an if statement omit the else block?', 'Yes', 'No', 'Only inside functions', 'Depends on the browser', 'A', 'The else block is optional.'),
(11, 'How does a FOR loop start?', 'for (i <= 5; i++)', 'for (let i = 0; i <= 5; i++)', 'for i = 1 to 5', 'for (i = 0; i <= 5)', 'B', 'It has initialization, condition, and final expression.'),
(11, 'Which loop executes a block of code at least once?', 'for', 'while', 'do...while', 'for...in', 'C', 'do...while executes the code block once before checking the condition.'),
(11, 'What statement breaks out of a loop?', 'stop', 'break', 'exit', 'return', 'B', 'The break statement jumps out of a loop.'),
(12, 'How do you create an arrow function?', 'function => {}', '() => {}', '=> function()', 'arrow() {}', 'B', '() => {} is the syntax for an arrow function.'),
(12, 'Inside which HTML element do we put JavaScript?', '<scripting>', '<javascript>', '<js>', '<script>', 'D', 'JavaScript code is placed inside <script> tags.'),
(12, 'What does the return statement do?', 'Prints to console', 'Stops function and returns a value', 'Declares a variable', 'Loops code', 'B', 'return ends function execution and specifies a value to be returned.');
