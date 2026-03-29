<div align="center">
  <img src="image/Edume.png" alt="EduMe Logo" width="150" />
  <h1>🎓 EduMe - Next-Gen E-Learning & Gamification Platform</h1>
  <p><strong>A dynamic, data-driven learning management system personalized by the VARK pedagogical model.</strong></p>
  
  [![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net/)
  [![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![VARK Model](https://img.shields.io/badge/Pedagogy-VARK_Model-10b981?style=for-the-badge)](https://vark-learn.com/)
</div>

<br />

## 🔐 Quick Administrator Access
Want to explore the powerful backend management system right away? Use the credentials below to log into the **Admin Portal**:

> **Email:** `admin@edume.com`  
> **Password:** `admin123`  

*Log in through the main registration/login page, and the system will automatically route you to the secure Admin Dashboard based on your account role.*

---

## 🌟 Introduction
Welcome to **EduMe**! Moving away from traditional "one-size-fits-all" learning, EduMe curates a highly personalized educational experience based on the **VARK pedagogical model**. Whether you are a visual learner who prefers diagrams, an aural learner who loves podcasts, or a hands-on coder who learns by doing, EduMe dynamically surfaces the content variant that suits you best.

Beyond personalized learning paths, EduMe brings education to life with robust administrative controls, integrated gamification (streaks & achievements), and real-time interactive coding sandboxes.

---

## ✨ Core Features

### 🧑‍🎓 For Students: A Tailored Learning Journey
* **VARK Personalized Pathways**: Upon signing up, students take an embedded questionnaire to determine their core learning style (`Visual`, `Aural`, `Read/Write`, or `Kinesthetic`). The dashboard and course environments intelligently adapt to prioritize UI components best suited for that specific style.
* **Interactive Coding Sandbox**: Practice coding directly in the browser! Our integrated `CodeMirror` sandbox supports `Python`, `HTML`, `CSS`, and `JavaScript` without requiring any local dev environment setup.
* **Gamified "Smart Feed"**: Stay motivated with real-time tracking of achievements, course progress milestones, and daily login streaks.
* **Dynamic Content Variants**: Experience the same course chapter differently based on what works for you—whether that's a video tutorial, a detailed text guide, or an interactive coding challenge.
* **Support Center Ticket System**: Seamlessly submit feedback, course requests, or technical issues directly to instructors.

### 🛡️ For Administrators: Absolute Control
* **Comprehensive Dashboard**: Get a bird's-eye view of platform analytics, active users, and recent platform reports at a glance.
* **Course & Curriculum Management**: Easily create, edit, and organize courses. Add chapters and upload specific multi-media content variants tailored for the VARK model straight into the secure database.
* **User Management System**: Review student progress, adjust account security configurations, and oversee platform activity through an intuitive data grid.
* **Ticket Resolution Center**: Respond to and resolve incoming student support tickets via an asynchronous visual dashboard.
* **Secure Admin Guards**: All backend APIs and administrative panels are strictly protected by session guardrails to prevent unauthorized direct URL access.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Interface**: Vanilla JavaScript (ES6+), Semantic HTML5, and responsive custom CSS (Flexbox/Grid architecture). Integrated with the `CodeMirror` API for advanced interactive coding environments.
- **Backend Mechanics**: **PHP 8+** utilizing a bespoke Object-Oriented View Controller pattern (`AuthController`, `PageGuard`, `Database`).
- **Database Layer**: **MySQL** interacting securely via **PHP Data Objects (PDO)**. Employs prepared statements inherently mapped to prevent SQL injection vulnerabilities.
- **Security Protocols**: XSS sanitization via `htmlspecialchars()`, robust API input validation, and secure session state management linking back to absolute base URLs.

---

## 📂 Project Directory Framework

The codebase strictly enforces the separation of authenticated scopes, configuration, and modular capabilities:

```text
Edume/
├───admin/               # 🛡️ Secure Admin Control Panel (Courses, Users, Support)
├───config/              # ⚙️ Application Globals, Database Initiator, and Session Guards
├───CSS/                 # 🎨 Global Cascading Style Sheets (Unified Design System)
├───JS/                  # 🧠 Global JavaScript utility functions and AJAX controllers
├───database/            # 🗄️ Database Initialization (SQL Schemas & Payloads)
├───public/              # 🌐 Unauthenticated Visitor Workflows (Landing & Auth)
├───student/             # 🎓 Student Portal Capabilities (Dashboard, Sandbox, Profile)
└───image/ & material/   # 🖼️ Static content delivery bins (Icons, PDFs, Docs)
```

---

## 🚀 Quick Start & Installation Guide

Follow these steps to deploy EduMe locally or on a remote server:

1. **Environment Setup**: 
   Ensure you have a standard **LAMP / WAMP / XAMPP** stack running locally with PHP v7.4+ and MySQL v8.0+.
   
2. **Clone the Repository**:
   Navigate into your server web-root (e.g. `c:/xampp/htdocs/`) and clone this codebase.
   ```bash
   git clone https://github.com/tjunjie1408/CP_Edume.git
   ```

3. **Database Initialization**:
   - Access your database manager (such as `phpMyAdmin` or MySQL CLI).
   - Create a blank database named exactly: `edume`
   - Import the complete deployment schema and mock data by executing: `database/latest_edume.sql`

4. **Environment Initialization**:
   Ensure `config/constants.php` points exactly to where your application rests via the `BASE_URL` definition. By default, it expects:
   ```php
   define('BASE_URL', '/Edume');
   ```

5. **Launch & Explore**:
   - Open your browser to `http://localhost/Edume`
   - Start exploring! Use the **Admin credentials** listed at the top or create a brand new student account to experience the VARK questionnaire firsthand.

---
<div align="center">
  <i>Architected out of a passion to redefine interactive technology education.</i>
</div>
