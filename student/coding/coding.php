<?php
require_once __DIR__ . '/../../config/constants.php';
require_once CONFIG_PATH . '/StudentPage.php';
$page = new StudentPage();
$page->requireAuth();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Editor - EduMe Learning System</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/dashboard.css">
  <link rel="stylesheet" href="<?= BASE_URL ?>/CSS/coding.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <!-- Header/Top Navigation Bar - NO SIDEBAR -->
  <header class="top-header coding-header">
    <div class="header-left">
      <h1>
        <span class="material-symbols-rounded">code</span>
        Code Editor
      </h1>
    </div>
    <div class="header-right">
      <div class="user-info" id="username">
        <p class="hello">Hello, <span id="user-name">John Doe</span></p>
      </div>
      <a href="<?= BASE_URL ?>/student/profile/profile.php" class="user-avatar-link">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar" id="userAvatar">
      </a>
    </div>
  </header>

  <!-- Main Coding Content -->
  <main class="coding-content">
    <!-- Editor Toolbar -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <label for="language-select" class="language-label">Language:</label>
        <select id="language-select" class="language-select">
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      
      <div class="toolbar-center">
        <span class="editor-title" id="editor-title">Python Editor</span>
      </div>
      
      <div class="toolbar-right">
        <button id="run-btn" class="btn-action btn-run" title="Run Code (Ctrl+Enter)">
          <span class="material-symbols-rounded">play_arrow</span>
          Run
        </button>
        <button id="clear-btn" class="btn-action btn-clear" title="Clear Code">
          <span class="material-symbols-rounded">delete</span>
          Clear
        </button>
        <button id="reset-btn" class="btn-action btn-reset" title="Reset to Default">
          <span class="material-symbols-rounded">refresh</span>
          Reset
        </button>
      </div>
    </div>

    <!-- Editor Container -->
    <div class="editor-container">
      <!-- Code Editor Panel -->
      <div class="editor-panel">
        <div class="panel-header">
          <span class="panel-title">
            <span class="material-symbols-rounded">edit</span>
            Code Editor
          </span>
          <span class="file-info" id="file-info">Unsaved</span>
        </div>
        <div class="editor-wrapper">
          <textarea id="code-editor" class="code-editor" placeholder="Write your code here..."></textarea>
          <div class="editor-line-numbers" id="line-numbers"></div>
        </div>
      </div>

      <!-- Output Panel -->
      <div class="output-panel">
        <div class="panel-header">
          <span class="panel-title">
            <span class="material-symbols-rounded">terminal</span>
            Output
          </span>
          <button id="output-clear-btn" class="output-clear-btn" title="Clear Output">
            <span class="material-symbols-rounded">clear</span>
          </button>
        </div>
        <div id="output-console" class="output-console">
          <div class="output-welcome">
            <p>Output will appear here</p>
            <p class="output-hint">Click "Run" to execute your code</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Reference Panel -->
    <div class="quick-reference">
      <div class="reference-header">
        <span class="material-symbols-rounded">help</span>
        Quick Reference
      </div>
      <div class="reference-content" id="reference-content">
        <div class="reference-section">
          <h4>Keyboard Shortcuts</h4>
          <ul>
            <li><kbd>Ctrl + Enter</kbd> - Run Code</li>
            <li><kbd>Ctrl + A</kbd> - Select All</li>
            <li><kbd>Tab</kbd> - Indent</li>
            <li><kbd>Shift + Tab</kbd> - Unindent</li>
          </ul>
        </div>
      </div>
    </div>
  </main>

  <script src="<?= BASE_URL ?>/JS/dashboard.js"></script>
  <script src="<?= BASE_URL ?>/JS/coding.js"></script>
</body>
</html>