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
}`,
  
  golang: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // Variables
    name := "John"
    age := 25
    fmt.Printf("Name: %s, Age: %d\\n", name, age)
    
    // Loop
    for i := 1; i <= 5; i++ {
        fmt.Printf("Number: %d\\n", i)
    }
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
  
  // Apply Practice Challenge Data if it exists
  if (window.PracticeData && window.PracticeData.isChallenge) {
      languageSelect.value = window.PracticeData.language;
      // languageSelect.disabled = true; // Removed language lock to allow users to switch languages
      codeEditor.value = `# Write your ${window.PracticeData.language} code below to solve the challenge:\n\n`;
  } else {
      // Set initial code for sandbox mode
      codeEditor.value = codeExamples.python;
  }
  
  updateLineNumbers();
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
    cpp: 'C++ Editor',
    golang: 'Go Editor'
  };
  
  editorTitle.textContent = languageNames[languageSelect.value];
}

// Run code (simulated execution / challenge validation)
function runCode() {
  const codeEditor = document.getElementById('code-editor');
  const languageSelect = document.getElementById('language-select');
  const outputConsole = document.getElementById('output-console');
  
  const code = codeEditor.value;
  const language = languageSelect.value;
  
  if (!code.trim()) {
    clearOutput();
    addOutput('Please write some code first!', 'warning');
    return;
  }

  clearOutput();
  addOutput(`[${new Date().toLocaleTimeString()}] Checking ${language} code...`, 'info');
  addOutput('---', 'info');

  // Extract simulated output to show to the user
  const extractSimulatedOutput = (codeString, lang) => {
      let regexList = [];
      if (lang === 'python') regexList = [/print\s*\(\s*(['"])(.*?)\1\s*\)/g];
      else if (lang === 'javascript') regexList = [/console\.log\s*\(\s*(['"])(.*?)\1\s*\)/g];
      else if (lang === 'golang') regexList = [/fmt\.Print(?:ln|f)?\s*\(\s*(['"])(.*?)\1/g];
      else if (lang === 'cpp') regexList = [/cout\s*<<\s*(['"])(.*?)\1/g];

      let outputs = [];
      regexList.forEach(regex => {
          let match;
          while ((match = regex.exec(codeString)) !== null) {
              addOutput(`> ${match[2]}`, 'success');
              outputs.push(match[2]);
          }
      });
      return outputs;
  };

  // Challenge Validation Logic
  if (window.PracticeData && window.PracticeData.isChallenge) {
      const expectedKeys = window.PracticeData.expectedKeys.split(',').map(k => k.trim()).filter(k => k);
      let passed = true;
      let missingKeys = [];
      
      const outputs = extractSimulatedOutput(code, language);
      const combinedOutput = outputs.join(" ");

      // 1. Check base keyword presence
      expectedKeys.forEach(key => {
          const safeKey = key.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
          const regex = new RegExp(safeKey, 'i');
          if (!regex.test(code)) {
              passed = false;
              missingKeys.push(key);
          }
      });
      
      // 2. Strict Quoted Literal Matching: If the problem asks to print "Hello, World!", force exact output match
      const problemContext = window.PracticeData.problemContext || "";
      const quoteMatches = problemContext.match(/"([^"]+)"/g);
      if (quoteMatches) {
          quoteMatches.forEach(q => {
              const exactString = q.replace(/"/g, ''); // Strip quotes
              if (!combinedOutput.includes(exactString)) {
                  passed = false;
                  missingKeys.push(`Output missing exact phrase: "${exactString}"`);
              }
          });
      }

      if (passed) {
          addOutput('✅ Challenge Passed! Your code contains the required logic.', 'success');
          addOutput('Great job! You can now close this sandbox and continue with the next lesson.', 'success');
      } else {
          addOutput('❌ Challenge Failed.', 'error');
          addOutput(`Hint: Your code seems to be missing: ${missingKeys.join(' | ')}`, 'warning');
      }
  } else {
      // Sandbox Mode
      extractSimulatedOutput(code, language);
      addOutput('Executing secure regex analysis...', 'info');
      
      try {
        if (language === 'javascript') {
          // Super safe basic eval ONLY for javascript sandbox, though regex is better
          executeJavaScript(code);
        } else if (language === 'html' || language === 'css') {
          if (language === 'html') executeHTML(code);
          if (language === 'css') executeCSS(code);
        } else {
          addOutput(`Your ${language} code looks conceptually correct. (Backend compilation disabled in sandbox mode)`, 'success');
        }
      } catch (error) {
        addOutput(`Error: ${error.message}`, 'error');
      }
  }

  updateFileStatus(true);
}

// Python simulation (Removed unsafe eval)
function executePythonSimulation(code) {
    addOutput('Compilation disabled block.', 'info');
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
  addOutput('C++ code analyzed successfully.', 'success');
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

// Load user data dynamically from PHP backend later instead of mock
function loadUserData() {
  // The header UI data is actually populated by PHP now directly in coding.php
  // This mock isn't needed anymore as PHP handles session UI rendering.
}