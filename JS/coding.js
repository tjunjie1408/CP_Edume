// Default code examples for each language
const codeExamples = {
  python: `# Python Example
print("Hello, World!")

# Variables
name = "John"
age = 25
print(f"Name: {name}, Age: {age}")

# Loop
for i in range(1, 6):
    print(f"Number: {i}")`,
  
  javascript: `// JavaScript Example
console.log("Hello, World!");

// Variables
const name = "John";
const age = 25;
console.log(\`Name: \${name}, Age: \${age}\`);

// Loop
for (let i = 1; i <= 5; i++) {
    console.log(\`Number: \${i}\`);
}`,
  
  html: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to HTML</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
</body>
</html>`,
  
  css: `/* CSS Example */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}

button {
    background-color: #667eea;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}`,
  
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Variables
    string name = "John";
    int age = 25;
    cout << "Name: " << name << ", Age: " << age << endl;
    
    // Loop
    for (int i = 1; i <= 5; i++) {
        cout << "Number: " << i << endl;
    }
    
    return 0;
}`
};

// Initialize coding editor
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  initializeCodeEditor();
  setupEventListeners();
  loadSavedCode();
});

// Initialize code editor
function initializeCodeEditor() {
  const languageSelect = document.getElementById('language-select');
  const codeEditor = document.getElementById('code-editor');
  
  // Set initial code
  codeEditor.value = codeExamples.python;
  updateLineNumbers();
  
  // Update editor title
  updateEditorTitle();
}

// Setup event listeners
function setupEventListeners() {
  const languageSelect = document.getElementById('language-select');
  const codeEditor = document.getElementById('code-editor');
  const runBtn = document.getElementById('run-btn');
  const clearBtn = document.getElementById('clear-btn');
  const resetBtn = document.getElementById('reset-btn');
  const outputClearBtn = document.getElementById('output-clear-btn');

  // Language change
  languageSelect.addEventListener('change', function() {
    const selectedLanguage = this.value;
    codeEditor.value = codeExamples[selectedLanguage];
    updateLineNumbers();
    updateEditorTitle();
    clearOutput();
    saveCode();
  });

  // Code editor input
  codeEditor.addEventListener('input', function() {
    updateLineNumbers();
    updateFileStatus(false);
    saveCode();
  });

  // Keyboard shortcuts
  codeEditor.addEventListener('keydown', function(e) {
    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
      updateLineNumbers();
      saveCode();
    }
    
    // Ctrl + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      runCode();
    }
  });

  // Shift + Tab for unindent
  codeEditor.addEventListener('keydown', function(e) {
    if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      
      if (this.value.substring(start - 1, start) === '\t') {
        this.value = this.value.substring(0, start - 1) + this.value.substring(start);
        this.selectionStart = this.selectionEnd = start - 1;
      }
      updateLineNumbers();
      saveCode();
    }
  });

  // Run button
  runBtn.addEventListener('click', runCode);

  // Clear button
  clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all code?')) {
      codeEditor.value = '';
      updateLineNumbers();
      clearOutput();
      updateFileStatus(false);
      saveCode();
    }
  });

  // Reset button
  resetBtn.addEventListener('click', function() {
    const selectedLanguage = languageSelect.value;
    if (confirm('Are you sure you want to reset to default code?')) {
      codeEditor.value = codeExamples[selectedLanguage];
      updateLineNumbers();
      clearOutput();
      updateFileStatus(true);
      saveCode();
    }
  });

  // Output clear button
  outputClearBtn.addEventListener('click', clearOutput);
}

// Update line numbers
function updateLineNumbers() {
  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  
  const lines = codeEditor.value.split('\n').length;
  let lineNumberText = '';
  
  for (let i = 1; i <= lines; i++) {
    lineNumberText += i + '\n';
  }
  
  lineNumbers.textContent = lineNumberText;
}

// Update editor title
function updateEditorTitle() {
  const languageSelect = document.getElementById('language-select');
  const editorTitle = document.getElementById('editor-title');
  
  const languageNames = {
    python: 'Python Editor',
    javascript: 'JavaScript Editor',
    html: 'HTML Editor',
    css: 'CSS Editor',
    cpp: 'C++ Editor'
  };
  
  editorTitle.textContent = languageNames[languageSelect.value];
}

// Run code (simulated execution)
function runCode() {
  const codeEditor = document.getElementById('code-editor');
  const languageSelect = document.getElementById('language-select');
  const outputConsole = document.getElementById('output-console');
  
  const code = codeEditor.value;
  const language = languageSelect.value;
  
  if (!code.trim()) {
    addOutput('Please write some code first!', 'warning');
    return;
  }

  clearOutput();
  addOutput(`[${new Date().toLocaleTimeString()}] Executing ${language} code...`, 'info');
  addOutput('---', 'info');

  // Simulate different language executions
  try {
    if (language === 'python') {
      executePythonSimulation(code);
    } else if (language === 'javascript') {
      executeJavaScript(code);
    } else if (language === 'html') {
      executeHTML(code);
    } else if (language === 'css') {
      executeCSS(code);
    } else if (language === 'cpp') {
      executeCPPSimulation(code);
    }
  } catch (error) {
    addOutput(`Error: ${error.message}`, 'error');
  }

  updateFileStatus(true);
}

// Python simulation
function executePythonSimulation(code) {
  // Simple Python simulation - look for print statements
  const printMatches = code.match(/print\([^)]*\)/g);
  
  if (printMatches) {
    printMatches.forEach(match => {
      const content = match.replace(/print\(/, '').replace(/\)$/, '');
      try {
        // Simple evaluation
        const result = eval(content.replace(/f"/g, '`').replace(/f'/g, '`'));
        addOutput(result.toString(), 'success');
      } catch (e) {
        addOutput('Python: ' + match, 'info');
      }
    });
  } else {
    addOutput('Python code executed successfully', 'success');
  }
}

// JavaScript execution
function executeJavaScript(code) {
  // Capture console.log output
  const originalLog = console.log;
  const outputs = [];
  
  console.log = function(...args) {
    outputs.push(args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return String(arg);
    }).join(' '));
  };

  try {
    eval(code);
    
    if (outputs.length > 0) {
      outputs.forEach(output => addOutput(output, 'success'));
    } else {
      addOutput('JavaScript executed successfully', 'success');
    }
  } catch (error) {
    addOutput(`JavaScript Error: ${error.message}`, 'error');
  } finally {
    console.log = originalLog;
  }
}

// HTML execution
function executeHTML(code) {
  const outputConsole = document.getElementById('output-console');
  
  const htmlFrame = document.createElement('iframe');
  htmlFrame.style.width = '100%';
  htmlFrame.style.height = '100%';
  htmlFrame.style.border = 'none';
  htmlFrame.style.background = 'white';
  
  outputConsole.innerHTML = '';
  outputConsole.appendChild(htmlFrame);
  
  htmlFrame.contentDocument.write(code);
  htmlFrame.contentDocument.close();
  
  addOutput('[HTML Preview Loaded]', 'info');
}

// CSS execution
function executeCSS(code) {
  const outputConsole = document.getElementById('output-console');
  
  const cssPreview = document.createElement('div');
  cssPreview.style.width = '100%';
  cssPreview.style.height = '100%';
  cssPreview.style.background = 'white';
  cssPreview.style.padding = '2rem';
  
  const style = document.createElement('style');
  style.textContent = code;
  cssPreview.appendChild(style);
  
  const demoContent = document.createElement('div');
  demoContent.innerHTML = `
    <h1>CSS Preview</h1>
    <p>This is a paragraph to demonstrate your CSS.</p>
    <button>Sample Button</button>
  `;
  cssPreview.appendChild(demoContent);
  
  outputConsole.innerHTML = '';
  outputConsole.appendChild(cssPreview);
  
  addOutput('[CSS Preview Loaded]', 'info');
}

// C++ simulation
function executeCPPSimulation(code) {
  // Simple C++ simulation - look for cout statements
  const coutMatches = code.match(/cout\s*<<\s*[^;]+/g);
  
  if (coutMatches) {
    coutMatches.forEach(match => {
      const content = match.replace(/cout\s*<<\s*/, '').trim();
      addOutput('C++: ' + content, 'success');
    });
  } else {
    addOutput('C++ code executed successfully', 'success');
  }
}

// Add output to console
function addOutput(text, type = 'info') {
  const outputConsole = document.getElementById('output-console');
  
  // Remove welcome message if it's there
  const welcome = outputConsole.querySelector('.output-welcome');
  if (welcome) {
    welcome.remove();
  }
  
  const line = document.createElement('div');
  line.className = `output-line output-${type}`;
  line.textContent = text;
  
  outputConsole.appendChild(line);
  outputConsole.scrollTop = outputConsole.scrollHeight;
}

// Clear output
function clearOutput() {
  const outputConsole = document.getElementById('output-console');
  outputConsole.innerHTML = `
    <div class="output-welcome">
      <p>Output will appear here</p>
      <p class="output-hint">Click "Run" to execute your code</p>
    </div>
  `;
}

// Update file status
function updateFileStatus(saved = false) {
  const fileInfo = document.getElementById('file-info');
  if (saved) {
    fileInfo.textContent = 'Saved';
    fileInfo.classList.add('saved');
  } else {
    fileInfo.textContent = 'Unsaved';
    fileInfo.classList.remove('saved');
  }
}

// Save code to localStorage
function saveCode() {
  const codeEditor = document.getElementById('code-editor');
  const languageSelect = document.getElementById('language-select');
  
  const codeData = {
    [languageSelect.value]: codeEditor.value
  };
  
  localStorage.setItem('savedCode', JSON.stringify(codeData));
}

// Load code from localStorage
function loadSavedCode() {
  const savedData = localStorage.getItem('savedCode');
  
  if (savedData) {
    try {
      const codeData = JSON.parse(savedData);
      const languageSelect = document.getElementById('language-select');
      const language = languageSelect.value;
      
      if (codeData[language]) {
        document.getElementById('code-editor').value = codeData[language];
        updateLineNumbers();
      }
    } catch (e) {
      console.error('Error loading saved code:', e);
    }
  }
}

// Load user data
function loadUserData() {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    learningStyle: 'Visual',
    profilePicture: 'https://via.placeholder.com/50'
  };

  const userNameEl = document.getElementById('user-name');
  const userAvatarEl = document.getElementById('userAvatar');

  if (userNameEl) userNameEl.textContent = userData.name;
  if (userAvatarEl) userAvatarEl.src = userData.profilePicture;

  sessionStorage.setItem('userData', JSON.stringify(userData));
}