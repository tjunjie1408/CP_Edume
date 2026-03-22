# EduMe Presentation Script: Golang Course Demo

*This document contains all the necessary content to manually construct a Go (Golang) course in the EduMe Admin Dashboard. It is designed to be used during your Capstone presentation to demonstrate the dynamic Content Management System (CMS), VARK learning styles, and Code Sandbox.*

---

## 📚 Course Level (Create Course)
- **Course Name**: `Go Programming Masterclass`
- **Programming Language**: `golang` *(⚠️ CRITICAL: Must be exactly "golang" to trigger the sandbox language lock)*
- **Description**: `Learn the basics of Go (Golang), a statically typed, compiled programming language designed at Google for simple, reliable, and efficient software. Perfect for backend development.`
- **Course Logo**: *(Upload a Go Gopher image or any relevant programming image)*

---

## 📘 CHAPTER 1: Introduction & Variables

*Click `+ Add Subject` inside the course.*
- **Subject Title**: `Chapter 1: Introduction & Variables`
- **Level**: `Beginner`
- **Overview**: `Get started with Go syntax, variables, and basic I/O operations.`
- **Learning Objectives** *(Add these one by one in the Edit mode)*:
  1. `Understand Go file structure & packages`
  2. `Declare variables using var and :=`
  3. `Print output to the console`

### 📥 Chapter 1 Resources

#### 1. Video Tutorial
- **Resource Type**: `Video Tutorial`
- **Title**: `Go Crash Course - First Steps`
- **Video URL**: `https://www.youtube.com/embed/un6ZyFkqFKo`
- **Description**: `A quick 10-minute introduction to Go syntax by FreeCodeCamp.`

#### 2. Document/Article
- **Resource Type**: `Document/Article`
- **Title**: `Go Syntax & Variables Guide`
- **Document Link / Content** *(Paste the HTML below into Content)*:
```html
<h3>Hello World in Go</h3>
<p>In Go, every program is part of a package. An executable program must use <code>package main</code>.</p>
<pre><code>package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}</code></pre>

<h3>Variables & Types</h3>
<p>You can declare variables using the <code>var</code> keyword or the short assignment <code>:=</code>.</p>
<ul>
  <li><code>var name string = "EduMe"</code></li>
  <li><code>age := 20</code> (type dynamically inferred as int)</li>
</ul>
```

#### 3. Exercise/Code (Sandbox)
- **Resource Type**: `Exercise/Code`
- **Title**: `Practice: Print Your First Message`
- **Content** *(Instructions for the Sandbox)*:
```text
Write a Go program that prints exactly "Welcome to EduMe!" to the console. Make sure you include 'package main' and import the 'fmt' package.
```

### 📝 Chapter 1 Quiz
*Go to the Quiz tab and click `+ Add Question`*

**Question 1:**
- **Question**: `Which keyword or operator is used to declare a variable in Go with automatic type inference?`
- **Options**:
  - `Option A`: `var`
  - `Option B`: `:=` 
  - `Option C`: [let](file:///d:/School/CapstoneProject/Edume/JS/user_manage_admin.js#349-382)
  - `Option D`: `def`
- **Correct Answer**: `Option B` (Check the 2nd radio button)
- **Feedback**: `The := syntax is used in Go for short variable declarations with implicit type inference.`

**Question 2:**
- **Question**: `What is the correct way to print output to the console in Go?`
- **Options**:
  - `Option A`: `console.log("Hello")`
  - `Option B`: `print("Hello")` 
  - `Option C`: `System.out.println("Hello")`
  - `Option D`: `fmt.Println("Hello")`
- **Correct Answer**: `Option D` (Check the 4th radio button)
- **Feedback**: `You must import the 'fmt' package and call fmt.Println to print to standard output in Go.`

---

## 📘 CHAPTER 2: Control Structures

*Click `+ Add Subject` inside the course.*
- **Subject Title**: `Chapter 2: Loops and Conditionals`
- **Level**: `Intermediate`
- **Overview**: `Learn how to control the flow of your Go programs using if/else statements and for loops.`
- **Learning Objectives**:
  1. `Write if/else conditional blocks`
  2. `Understand that Go only has the 'for' loop (no while loop)`

### 📥 Chapter 2 Resources

#### 1. Video Tutorial
- **Resource Type**: `Video Tutorial`
- **Title**: `Go Loops & Conditionals Explained`
- **Video URL**: `https://www.youtube.com/embed/YS4e4q9oBaU`
- **Description**: `Master the flow control in Go.`

#### 2. Document/Article
- **Resource Type**: `Document/Article`
- **Title**: `Control Flow Mastery`
- **Document Link / Content**:
```html
<h3>If / Else Statements</h3>
<p>Go's <code>if</code> statements are like those in C or Java, except that they don't need parentheses <code>( )</code>.</p>
<pre><code>if x > 10 {
    fmt.Println("x is greater than 10")
} else {
    fmt.Println("x is less than or equal to 10")
}</code></pre>

<h3>The For Loop</h3>
<p>Go has only one looping construct, the <code>for</code> loop. There is no <code>while</code> keyword.</p>
<pre><code>sum := 0
for i := 0; i < 10; i++ {
    sum += i
}</code></pre>
```

#### 3. Exercise/Code (Sandbox)
- **Resource Type**: `Exercise/Code`
- **Title**: `Practice: Write a For Loop`
- **Content**:
```text
Write a Go program using a 'for' loop that iterates from 1 to 5. Inside the loop, print the current number.
```

### 📝 Chapter 2 Quiz

**Question 1:**
- **Question**: `Which of the following loops does NOT exist in the Go programming language?`
- **Options**:
  - `Option A`: [for](file:///d:/School/CapstoneProject/Edume/JS/support_center_admin.js#315-329)
  - `Option B`: `while` 
  - `Option C`: `Both exist`
  - `Option D`: `Neither exist`
- **Correct Answer**: `Option B`
- **Feedback**: `Go is minimalist and only uses the 'for' loop keyword for all looping scenarios.`

**Question 2:**
- **Question**: `Do 'if' statements in Go require parentheses () around the condition?`
- **Options**:
  - `Option A`: `Yes, always`
  - `Option B`: `No, they are forbidden / not required` 
  - `Option C`: `Only if there is an 'else' block`
  - `Option D`: `Only for complex conditions`
- **Correct Answer**: `Option B` 
- **Feedback**: `Unlike Java or C++, Go removes the need for surrounding parentheses in conditional statements.`

---

### 🎤 Presentation Demo Flow Suggestion
1. **Admin View**: Show the panel. Copy-paste these details to create the Golang course live. Highlights the robust 3-layer CMS (Course > Chapter > Resources).
2. **Student View**: Log in as a student with a specific VARK style (e.g., Visual).
3. **VARK Demonstration**: Show how the student's Course Details page automatically puts the YouTube Video at the very top because they are a Visual learner.
4. **Code Sandbox**: Click the "Open Sandbox" button. Show how the environment instantly adapts to "Go", loads the Go code snippet gracefully, and runs it right in the browser.
5. **Assessment**: Take the Quiz at the end of the chapter and show the live scoring updating on the Dashboard.
