-- Edume Seed Data
-- Sample data for testing
SET FOREIGN_KEY_CHECKS = 0;
USE edume;

-- Clear existing data (in correct order due to FK constraints)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user_achievements;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE user_progress;
TRUNCATE TABLE quiz_questions;
TRUNCATE TABLE quizzes;
TRUNCATE TABLE content_materials;
TRUNCATE TABLE chapters;
TRUNCATE TABLE courses;
TRUNCATE TABLE user_vark_results;
TRUNCATE TABLE vark_options;
TRUNCATE TABLE vark_questions;
TRUNCATE TABLE achievements;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Admin User (password: admin123)
INSERT INTO users (username, email, password_hash, role, primary_vark_style) VALUES
('admin', 'admin@edume.com', '$2y$10$QafSPPEwtpHY1.wPPli3OeLpTSxpldE7vOtzZ4xN7kOm4O82X9s7a', 'admin', 'visual');

-- VARK Assessment Questions (10 questions for better accuracy)
INSERT INTO vark_questions (question_text, order_num, is_active) VALUES
('When learning a new software, I prefer to:', 1, TRUE),
('I remember things best when I:', 2, TRUE),
('When explaining directions to someone, I would:', 3, TRUE),
('If I need to assemble furniture, I would:', 4, TRUE),
('When studying for an exam, I typically:', 5, TRUE),
('At a presentation, I pay most attention to:', 6, TRUE),
('When cooking a new recipe, I prefer to:', 7, TRUE),
('I learn a new dance move best by:', 8, TRUE),
('When troubleshooting a problem, I tend to:', 9, TRUE),
('To remember a phone number, I would:', 10, TRUE);

-- VARK Options for each question
-- Question 1: Learning new software
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(1, 'Watch video tutorials demonstrating the features', 'visual'),
(1, 'Read the user manual or documentation', 'read'),
(1, 'Jump in and start clicking around to explore', 'kinesthetic');

-- Question 2: Remembering things
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(2, 'See diagrams, charts, or visual representations', 'visual'),
(2, 'Write them down in detailed notes', 'read'),
(2, 'Practice and repeat the activity myself', 'kinesthetic');

-- Question 3: Explaining directions
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(3, 'Draw a map or show pictures of landmarks', 'visual'),
(3, 'Write out step-by-step text instructions', 'read'),
(3, 'Walk them through the route physically', 'kinesthetic');

-- Question 4: Assembling furniture
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(4, 'Follow the picture diagrams in the manual', 'visual'),
(4, 'Read the written instructions carefully', 'read'),
(4, 'Start assembling and figure it out as I go', 'kinesthetic');

-- Question 5: Studying for exams
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(5, 'Use mind maps, diagrams, and color-coded notes', 'visual'),
(5, 'Reread textbooks and my written notes', 'read'),
(5, 'Practice problems and do hands-on exercises', 'kinesthetic');

-- Question 6: At presentations
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(6, 'The slides, graphs, and visual demonstrations', 'visual'),
(6, 'The handouts and written materials provided', 'read'),
(6, 'Interactive demos or when I can try things myself', 'kinesthetic');

-- Question 7: Cooking new recipe
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(7, 'Watch a cooking video showing the process', 'visual'),
(7, 'Follow a written recipe with detailed steps', 'read'),
(7, 'Experiment and taste as I cook', 'kinesthetic');

-- Question 8: Learning dance moves
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(8, 'Watch someone perform the moves first', 'visual'),
(8, 'Read about the technique and positions', 'read'),
(8, 'Get up and start moving immediately', 'kinesthetic');

-- Question 9: Troubleshooting problems
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(9, 'Look for visual error indicators or diagrams', 'visual'),
(9, 'Search for written solutions and documentation', 'read'),
(9, 'Try different solutions until something works', 'kinesthetic');

-- Question 10: Remembering phone number
INSERT INTO vark_options (question_id, option_text, vark_type) VALUES
(10, 'Picture the number in my mind visually', 'visual'),
(10, 'Write it down multiple times', 'read'),
(10, 'Dial it several times to memorize it', 'kinesthetic');

-- Python Basics Course
INSERT INTO courses (title, description, category, difficulty, cover_image, has_visual, has_read, has_kinesthetic, is_published) VALUES
('Python Basics', 'Learn Python programming from scratch. Perfect for beginners who want to start their coding journey with one of the most popular and versatile programming languages.', 'Python', 'beginner', '/image/1.png', TRUE, TRUE, TRUE, TRUE);

-- Web Development Course (Locked - Coming Soon)
INSERT INTO courses (title, description, category, difficulty, cover_image, has_visual, has_read, has_kinesthetic, is_published) VALUES
('Web Development Fundamentals', 'Master HTML, CSS, and JavaScript to build beautiful websites. Coming soon!', 'Web Development', 'beginner', '/image/2.png', TRUE, TRUE, TRUE, FALSE);

-- Data Science Course (Locked - Coming Soon)
INSERT INTO courses (title, description, category, difficulty, cover_image, has_visual, has_read, has_kinesthetic, is_published) VALUES
('Data Science Essentials', 'Explore data analysis, visualization, and machine learning basics. Coming soon!', 'Data Science', 'intermediate', '/image/3.webp', TRUE, TRUE, TRUE, FALSE);

-- Python Course Chapters
INSERT INTO chapters (course_id, title, order_num, xp_reward) VALUES
(1, 'Introduction to Python', 1, 50),
(1, 'Variables and Data Types', 2, 75),
(1, 'Operators and Expressions', 3, 75),
(1, 'Control Flow - If Statements', 4, 100),
(1, 'Loops - For and While', 5, 100),
(1, 'Functions', 6, 125);

-- Content Materials for Chapter 1: Introduction to Python
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(1, 'video', 'Introduction to Python Series', 'https://www.youtube.com/embed/kqtD5dpn9C8?start=0&end=75', NULL, NULL, NULL, 'python', 'visual'),
(1, 'text', 'Python Core Concepts', NULL, '<h2>What is Python?</h2>
<p>Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and first released in 1991, Python has become one of the most popular programming languages in the world.</p>

<h3>Why Learn Python?</h3>
<ul>
<li><strong>Easy to Learn</strong> - Python has a clean, readable syntax</li>
<li><strong>Versatile</strong> - Used in web development, data science, AI, automation</li>
<li><strong>Large Community</strong> - Extensive libraries and helpful resources</li>
<li><strong>In-Demand</strong> - High-paying job opportunities</li>
</ul>

<h3>Your First Python Program</h3>
<pre><code>print("Hello, World!")</code></pre>
<p>This simple line of code outputs "Hello, World!" to the screen.</p>', NULL, NULL, 'python', 'read'),
(1, 'practice', 'Hello World Output', NULL, NULL, 'Write a Python program that prints "Hello, World!" to the console.

Your code should use the print() function to display the message.', 'print,Hello', 'python', 'kinesthetic');

-- Content Materials for Chapter 2: Variables and Data Types
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(2, 'video', 'Python Variables Explained', 'https://www.youtube.com/embed/cQT33yu9pY8?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(2, 'text', 'Variables & Data Types', NULL, '<h2>Variables in Python</h2>
<p>Variables are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable.</p>

<h3>Creating Variables</h3>
<pre><code>name = "Alice"
age = 25
height = 5.6
is_student = True</code></pre>

<h3>Data Types</h3>
<table>
<tr><th>Type</th><th>Example</th><th>Description</th></tr>
<tr><td>str</td><td>"Hello"</td><td>Text/String</td></tr>
<tr><td>int</td><td>42</td><td>Integer number</td></tr>
<tr><td>float</td><td>3.14</td><td>Decimal number</td></tr>
<tr><td>bool</td><td>True/False</td><td>Boolean value</td></tr>
</table>

<h3>Checking Data Type</h3>
<pre><code>x = 10
print(type(x))  # Output: &lt;class ''int''&gt;</code></pre>', NULL, NULL, 'python', 'read'),
(2, 'practice', 'Variable Creation', NULL, NULL, 'Create three variables:
1. A variable called "name" storing your name as a string
2. A variable called "age" storing a number
3. Print both variables using the print() function', 'name,age,print', 'python', 'kinesthetic');

-- Content Materials for Chapter 3: Operators
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(3, 'video', 'Python Operators Guide', 'https://www.youtube.com/embed/v5MR5JnKcZI?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(3, 'text', 'Basic Operators in Python', NULL, '<h2>Python Operators</h2>
<p>Operators are used to perform operations on variables and values.</p>

<h3>Arithmetic Operators</h3>
<pre><code>a = 10
b = 3

print(a + b)   # Addition: 13
print(a - b)   # Subtraction: 7
print(a * b)   # Multiplication: 30
print(a / b)   # Division: 3.333...
print(a % b)   # Modulus: 1
print(a ** b)  # Exponent: 1000</code></pre>

<h3>Comparison Operators</h3>
<pre><code>x = 5
y = 10

print(x == y)  # Equal: False
print(x != y)  # Not equal: True
print(x < y)   # Less than: True
print(x > y)   # Greater than: False</code></pre>', NULL, NULL, 'python', 'read'),
(3, 'practice', 'Math with Variables', NULL, NULL, 'Create two variables with numbers and calculate:
1. Their sum
2. Their product
3. Print both results', 'print,+,*', 'python', 'kinesthetic');

-- Content Materials for Chapter 4: If Statements
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(4, 'video', 'Control Flow Video', 'https://www.youtube.com/embed/Zp5MuPOtsSY?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(4, 'text', 'If Statements & Logic', NULL, '<h2>Control Flow - If Statements</h2>
<p>If statements allow you to execute code conditionally based on whether a condition is true or false.</p>

<h3>Basic If Statement</h3>
<pre><code>age = 18

if age >= 18:
    print("You are an adult")</code></pre>

<h3>If-Else Statement</h3>
<pre><code>temperature = 25

if temperature > 30:
    print("It''s hot!")
else:
    print("It''s comfortable")</code></pre>

<h3>If-Elif-Else Statement</h3>
<pre><code>score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade is {grade}")</code></pre>', NULL, NULL, 'python', 'read'),
(4, 'practice', 'Grade Calculator', NULL, NULL, 'Write a program that:
1. Creates a variable "score" with a value
2. Uses if-elif-else to determine the grade (A, B, C, or F)
3. Prints the result', 'if,elif,else,print', 'python', 'kinesthetic');

-- Content Materials for Chapter 5: Loops
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(5, 'video', 'Loops Series', 'https://www.youtube.com/embed/6iF8Xb7Z3wQ?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(5, 'text', 'For and While Loops', NULL, '<h2>Loops in Python</h2>
<p>Loops allow you to execute a block of code multiple times.</p>

<h3>For Loop</h3>
<pre><code># Loop through a range
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)</code></pre>

<h3>While Loop</h3>
<pre><code>count = 0
while count < 5:
    print(count)
    count += 1</code></pre>

<h3>Loop Control</h3>
<pre><code># Break - exit the loop
for i in range(10):
    if i == 5:
        break
    print(i)

# Continue - skip current iteration
for i in range(5):
    if i == 2:
        continue
    print(i)</code></pre>', NULL, NULL, 'python', 'read'),
(5, 'practice', 'For Loop Challenge', NULL, NULL, 'Write a for loop that:
1. Loops through numbers 1 to 5 using range()
2. Prints each number', 'for,range,print', 'python', 'kinesthetic');

-- Content Materials for Chapter 6: Functions
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(6, 'video', 'Mastering Functions', 'https://www.youtube.com/embed/9Os0o3wzS_I?start=0&end=180', NULL, NULL, NULL, 'python', 'visual'),
(6, 'text', 'Python Functions', NULL, '<h2>Functions in Python</h2>
<p>Functions are reusable blocks of code that perform a specific task.</p>

<h3>Defining a Function</h3>
<pre><code>def greet():
    print("Hello!")

greet()  # Call the function</code></pre>

<h3>Functions with Parameters</h3>
<pre><code>def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Output: Hello, Alice!</code></pre>

<h3>Return Values</h3>
<pre><code>def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # Output: 8</code></pre>

<h3>Default Parameters</h3>
<pre><code>def greet(name="World"):
    return f"Hello, {name}!"

print(greet())        # Hello, World!
print(greet("Bob"))   # Hello, Bob!</code></pre>', NULL, NULL, 'python', 'read'),
(6, 'practice', 'Add Function', NULL, NULL, 'Create a function called "add" that:
1. Takes two parameters
2. Returns their sum
3. Call the function and print the result', 'def,add,return,print', 'python', 'kinesthetic');

-- Quizzes for each chapter
INSERT INTO quizzes (chapter_id, title, passing_score) VALUES
(1, 'Introduction to Python Quiz', 60),
(2, 'Variables and Data Types Quiz', 60),
(3, 'Operators Quiz', 60),
(4, 'Control Flow Quiz', 60),
(5, 'Loops Quiz', 60),
(6, 'Functions Quiz', 60);

-- Quiz Questions for Chapter 1
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(1, 'Who created Python?', 'James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup', 'B', 'Python was created by Guido van Rossum and released in 1991.'),
(1, 'Which function is used to output text in Python?', 'echo()', 'console.log()', 'print()', 'write()', 'C', 'The print() function is used to output text in Python.'),
(1, 'What type of language is Python?', 'Compiled', 'Interpreted', 'Assembly', 'Machine', 'B', 'Python is an interpreted, high-level programming language.');

-- Quiz Questions for Chapter 2
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(2, 'Which is a valid variable name in Python?', '2name', 'my-var', 'my_var', 'my var', 'C', 'Variable names can contain letters, numbers, and underscores, but cannot start with a number.'),
(2, 'What data type is "Hello World"?', 'int', 'float', 'str', 'bool', 'C', '"Hello World" is a string (str) because it is text enclosed in quotes.'),
(2, 'What function checks the data type of a variable?', 'typeof()', 'datatype()', 'type()', 'check()', 'C', 'The type() function returns the data type of a variable.');

-- Quiz Questions for Chapter 3
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(3, 'What is the result of 10 % 3?', '3', '1', '3.33', '0', 'B', 'The modulus operator (%) returns the remainder. 10 / 3 = 3 remainder 1.'),
(3, 'What operator is used for exponentiation in Python?', '^', '**', 'exp()', '^^', 'B', 'The ** operator is used for exponentiation. Example: 2**3 = 8'),
(3, 'What does == check?', 'Assignment', 'Equality', 'Not equal', 'Greater than', 'B', 'The == operator checks if two values are equal.');

-- Quiz Questions for Chapter 4
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(4, 'What keyword is used for multiple conditions?', 'else if', 'elseif', 'elif', 'elsif', 'C', 'Python uses elif for else-if conditions.'),
(4, 'What is printed: if 5 > 3: print("Yes")', 'Yes', 'No', 'Error', 'Nothing', 'A', '5 > 3 is True, so "Yes" is printed.'),
(4, 'What must be at the end of an if statement line?', ';', ':', '{}', '()', 'B', 'Python uses a colon : at the end of if statement lines.');

-- Quiz Questions for Chapter 5
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(5, 'What does range(5) generate?', '1 to 5', '0 to 5', '0 to 4', '1 to 4', 'C', 'range(5) generates numbers from 0 to 4 (5 numbers total).'),
(5, 'Which keyword exits a loop immediately?', 'exit', 'break', 'stop', 'end', 'B', 'The break keyword immediately exits the current loop.'),
(5, 'What loop runs while a condition is True?', 'for', 'while', 'do', 'repeat', 'B', 'A while loop continues as long as its condition is True.');

-- Quiz Questions for Chapter 6
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(6, 'Which keyword is used to define a function?', 'function', 'func', 'def', 'define', 'C', 'Python uses the def keyword to define functions.'),
(6, 'What keyword sends a value back from a function?', 'send', 'back', 'return', 'output', 'C', 'The return keyword sends a value back from a function.'),
(6, 'What are values passed to a function called?', 'Variables', 'Arguments', 'Returns', 'Outputs', 'B', 'Values passed to a function are called arguments or parameters.');

-- JavaScript Fundamentals Course
INSERT INTO courses (title, description, category, difficulty, cover_image, has_visual, has_read, has_kinesthetic, is_published) VALUES
('JavaScript Fundamentals', 'Master JavaScript from basic syntax to advanced concepts. The essential language for modern web development.', 'JavaScript', 'beginner', '/image/12.png', TRUE, TRUE, TRUE, TRUE);

-- JavaScript Course Chapters (Course ID 4)
INSERT INTO chapters (course_id, title, order_num, xp_reward) VALUES
(4, 'Introduction to JavaScript', 1, 50),
(4, 'Variables and Data Types', 2, 75),
(4, 'Operators and Expressions', 3, 75),
(4, 'Control Flow', 4, 100),
(4, 'Loops', 5, 100),
(4, 'Functions', 6, 125);

-- Content Materials for JS Chapter 7: Intro (Chapter IDs auto-increment to 7-12)
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(7, 'video', 'What is JavaScript?', 'https://www.youtube.com/embed/upDLs1sn7g4?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(7, 'text', 'JavaScript Overview', NULL, '<h2>Welcome to JavaScript</h2><p>JavaScript is the programming language of the Web. It can update and change both HTML and CSS, and can calculate, manipulate and validate data.</p><h3>Your First JS Code</h3><pre><code>console.log(''Hello, World!'');</code></pre>', NULL, NULL, 'javascript', 'read'),
(7, 'practice', 'Hello Console', NULL, NULL, 'Write a JavaScript program that prints "Hello, JavaScript!" to the console.\n\nYour code should use console.log() to display the message.', 'console.log,Hello', 'javascript', 'kinesthetic');

-- Content Materials for JS Chapter 8: Variables
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(8, 'video', 'let, const, var Explained', 'https://www.youtube.com/embed/sjyJq2rX6eA?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(8, 'text', 'Variables & Types', NULL, '<h2>JS Variables</h2><p>In modern JS, we use <code>let</code> and <code>const</code>.</p><pre><code>let name = ''John'';\nconst age = 30;\nlet isStudent = true;</code></pre>', NULL, NULL, 'javascript', 'read'),
(8, 'practice', 'Variable Creation', NULL, NULL, 'Create two variables:\n1. A const called "language" storing "JavaScript"\n2. A let called "version" storing a number\n3. Print both variables using console.log()', 'const,let,console.log', 'javascript', 'kinesthetic');

-- Content Materials for JS Chapter 9: Operators
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(9, 'video', 'JS Operators', 'https://www.youtube.com/embed/406D-sD8qY8?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(9, 'text', 'Operators and Logic', NULL, '<h2>JS Operators</h2><p>We have arithmetic (+, -, *, /) and strict equality (===, !==) in JS.</p><pre><code>let x = 5;\nlet y = ''5'';\nconsole.log(x === y); // false</code></pre>', NULL, NULL, 'javascript', 'read'),
(9, 'practice', 'Math with JS', NULL, NULL, 'Create two variables with numbers and calculate:\n1. Their sum\n2. Their product\n3. Print both results with console.log()', 'console.log,+,*', 'javascript', 'kinesthetic');

-- Content Materials for JS Chapter 10: Control Flow
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(10, 'video', 'If Statements & Ternary', 'https://www.youtube.com/embed/IsG4Xd6LlsM?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(10, 'text', 'Conditional Logic', NULL, '<h2>If Statements</h2><pre><code>let score = 85;\nif (score >= 90) {\n  console.log(''A'');\n} else {\n  console.log(''B'');\n}</code></pre>', NULL, NULL, 'javascript', 'read'),
(10, 'practice', 'Grade Logic', NULL, NULL, 'Write an if-else block that:\n1. Checks if a variable score is at least 50\n2. Prints "Pass" if true, "Fail" if false', 'if,else,console.log', 'javascript', 'kinesthetic');

-- Content Materials for JS Chapter 11: Loops
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(11, 'video', 'For and While Loops', 'https://www.youtube.com/embed/s9wW2PpJsmQ?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(11, 'text', 'Looping in JS', NULL, '<h2>Loops</h2><pre><code>for (let i = 0; i &lt; 5; i++) {\n  console.log(i);\n}</code></pre>', NULL, NULL, 'javascript', 'read'),
(11, 'practice', 'For Loop Challenge', NULL, NULL, 'Write a for loop that:\n1. Initialization: let i = 1\n2. Condition: i <= 5\n3. Increment: i++\n4. Prints each number', 'for,console.log', 'javascript', 'kinesthetic');

-- Content Materials for JS Chapter 12: Functions
INSERT INTO content_materials (chapter_id, content_type, title, youtube_url, text_content, practice_problem, practice_solution, practice_language, vark_tag) VALUES
(12, 'video', 'Functions & Arrow Functions', 'https://www.youtube.com/embed/N8ap4k_1QEQ?start=0&end=180', NULL, NULL, NULL, 'javascript', 'visual'),
(12, 'text', 'JS Functions', NULL, '<h2>Arrow Functions</h2><p>Modern JS relies heavily on arrow functions.</p><pre><code>const add = (a, b) =&gt; a + b;\nconsole.log(add(2, 3));</code></pre>', NULL, NULL, 'javascript', 'read'),
(12, 'practice', 'Arrow Function Challenge', NULL, NULL, 'Create an arrow function called "multiply" that:\n1. Takes two parameters\n2. Returns their product\n3. Call the function and print the result', 'const,return,console.log', 'javascript', 'kinesthetic');

-- JS Quizzes
INSERT INTO quizzes (chapter_id, title, passing_score) VALUES
(7, 'Intro to JS Quiz', 60),
(8, 'Variables Quiz', 60),
(9, 'Operators Quiz', 60),
(10, 'Control Flow Quiz', 60),
(11, 'Loops Quiz', 60),
(12, 'Functions Quiz', 60);

-- JS Quiz Questions
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(7, 'Which company created JavaScript?', 'Microsoft', 'Netscape', 'Google', 'Apple', 'B', 'Netscape created JavaScript in 1995.'),
(7, 'What is used to print values in the browser console?', 'print()', 'echo()', 'console.log()', 'System.out.print()', 'C', 'console.log() is used to log messages to the console.'),
(7, 'Where is the correct place to insert a JavaScript?', 'The <body> section', 'The <head> section', 'Both <head> and <body> are correct', 'Neither', 'C', 'Scripts can be placed in both <head> and <body>.');

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(8, 'Which keyword declares a block-scoped variable?', 'var', 'let', 'static', 'def', 'B', 'let declares a block-scoped local variable.'),
(8, 'Which keyword declares a constant?', 'constant', 'const', 'fixed', 'let', 'B', 'const creates a read-only reference to a value.'),
(8, 'What is the data type of true?', 'String', 'Number', 'Boolean', 'Object', 'C', 'true and false are Boolean values.');

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(9, 'What operator means ''strict equality''?', '==', '===', '=', '!=', 'B', '=== checks both value and type for equality.'),
(9, 'What does 5 + ''5'' evaluate to in JavaScript?', '10', '55', 'Error', 'undefined', 'B', 'JS coerces the number to a string and concatenates them to ''55''.'),
(9, 'Which is the Logical AND operator?', '&&', '||', '!', '&', 'A', '&& is the logical AND operator in JavaScript.');

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(10, 'Which statement is used to execute different actions based on conditions?', 'if...else', 'for', 'while', 'return', 'A', 'if...else statements control conditional execution.'),
(10, 'How do you write a ternary operator?', 'condition ? true : false', 'condition : true ? false', 'if condition then true else false', 'condition ? false : true', 'A', 'The ternary operator syntax is condition ? true_expr : false_expr.'),
(10, 'Can an if statement omit the else block?', 'Yes', 'No', 'Only inside functions', 'Depends on the browser', 'A', 'The else block is optional.');

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(11, 'How does a FOR loop start?', 'for (i <= 5; i++)', 'for (let i = 0; i <= 5; i++)', 'for i = 1 to 5', 'for (i = 0; i <= 5)', 'B', 'It has initialization, condition, and final expression.'),
(11, 'Which loop executes a block of code at least once?', 'for', 'while', 'do...while', 'for...in', 'C', 'do...while executes the code block once before checking the condition.'),
(11, 'What statement breaks out of a loop?', 'stop', 'break', 'exit', 'return', 'B', 'The break statement jumps out of a loop.');

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(12, 'How do you create an arrow function?', 'function => {}', '() => {}', '=> function()', 'arrow() {}', 'B', '() => {} is the syntax for an arrow function.'),
(12, 'Inside which HTML element do we put JavaScript?', '<scripting>', '<javascript>', '<js>', '<script>', 'D', 'JavaScript code is placed inside <script> tags.'),
(12, 'What does the return statement do?', 'Prints to console', 'Stops function and returns a value', 'Declares a variable', 'Loops code', 'B', 'return ends function execution and specifies a value to be returned.');

-- Achievements
INSERT INTO achievements (name, description, badge_icon, criteria_type, criteria_value) VALUES
('First Steps', 'Complete your first chapter', '/assets/images/badges/first-steps.png', 'courses_completed', 1),
('Python Beginner', 'Complete the Python Basics course', '/assets/images/badges/python-beginner.png', 'courses_completed', 1),
('Quiz Master', 'Pass 5 quizzes', '/assets/images/badges/quiz-master.png', 'quizzes_passed', 5),
('XP Hunter', 'Earn 500 XP', '/assets/images/badges/xp-hunter.png', 'xp_earned', 500),
('Visual Learner', 'Identified as a Visual learner', '/assets/images/badges/visual.png', 'vark_style', 1),
('Read/Write Learner', 'Identified as a Read/Write learner', '/assets/images/badges/read.png', 'vark_style', 2),
('Kinesthetic Learner', 'Identified as a Kinesthetic learner', '/assets/images/badges/kinesthetic.png', 'vark_style', 3),
('Code Warrior', 'Complete 10 practice exercises', '/assets/images/badges/code-warrior.png', 'courses_completed', 10);
SET FOREIGN_KEY_CHECKS = 1;