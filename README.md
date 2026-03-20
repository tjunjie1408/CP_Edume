# Edume - E-Learning Platform

Edume is a customizable e-learning platform built with PHP, MySQL, HTML, CSS, and JavaScript. The platform is designed to provide interactive courses, quizzes, and coding exercises for students, along with a comprehensive management dashboard for administrators.

## Project Structure

The codebase is organized into a modular directory structure, separating the core application roles, static assets, and configuration.

```text
Edume/
├───admin/               # Admin panel modules
│   ├───course_manage/   # Course creation and management
│   ├───dashboard/       # Admin dashboard and analytics overview
│   ├───profile/         # Admin profile settings
│   ├───support_center/  # Admin support and ticket management
│   └───user_manage/     # User (student/instructor) management
│
├───config/              # Global configuration files (e.g., constants.php, database connection)
│
├───CSS/                 # Global cascasing style sheets for the application
│
├───database/            # Database initialization scripts and seed data (e.g., edume.sql)
│
├───image/               # Global image assets and platform diagrams (e.g., Edume_ERD.drawio.png)
│
├───JS/                  # Global JavaScript files for frontend logic, DOM manipulation, and AJAX
│
├───material/            # Downloadable course materials and resources
│
├───public/              # Public-facing views
│   └───registration/    # User authentication, login, and registration flows
│
├───student/             # Student portal modules
│   ├───coding/          # Interactive coding exercises and environment
│   ├───course/          # Course viewing and interaction interfaces
│   ├───dashboard/       # Student dashboard overview
│   ├───profile/         # Student user profile management
│   ├───python/          # Python-specific course modules
│   └───questionnaire/   # Quizzes and assessment questionnaires
│
└───video/               # Hosted video resources for courses
```

## Key Directories Explained

- **`admin/` & `student/`**: These directories contain the core PHP logic and views tailored for the two primary roles in the system. Each subfolder represents a distinct modular feature page (e.g., `dashboard`, `profile`, `course_manage`).
- **`public/`**: Contains files that handle unauthenticated user flows, primarily registration and login.
- **`config/`**: Centralized storage for environment configurations, base URL definitions, and database credentials.
- **`database/`**: Houses the SQL files required to initialize the MySQL database schema and populate it with seed data for development.
- **`CSS/` & `JS/`**: Centralized locations for frontend static assets.
- **`image/`, `material/`, `video/`**: Media and content assets served across various courses and platform pages.
