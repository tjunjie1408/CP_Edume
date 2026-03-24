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
- **Video URL**: `https://www.youtube.com/embed/un6ZyFkqFKo?start=0&end=900`
- **Description**: `A quick 15-minute introduction to Go syntax by FreeCodeCamp.`

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

**Question 3:**
- **Question**: `Which of the following describes the difference between var and := in Go?`
- **Options**:
  - `Option A`: `var is used for constants, := is used for variables`
  - `Option B`: `:= can only be used inside functions, while var can be used anywhere`
  - `Option C`: `var requires a type declaration, := does not`
  - `Option D`: `There is no difference between them`
- **Correct Answer**: `Option B`
- **Feedback**: `The short declaration operator := can only be used inside function bodies, whereas var can be used at the package level as well.`

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
- **Video URL**: `https://www.youtube.com/embed/YS4e4q9oBaU?start=900&end=1500`
- **Description**: `A 10-minute segment to master flow control in Go.`

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

**Question 3:**
- **Question**: `Which keyword is used in Go to skip the current iteration of a loop and proceed to the next one?`
- **Options**:
  - `Option A`: `continue`
  - `Option B`: `break`
  - `Option C`: `pass`
  - `Option D`: `next`
- **Correct Answer**: `Option A`
- **Feedback**: `The 'continue' keyword is used to skip the rest of the current loop iteration and move to the next iteration.`

---

### 🎤 Presentation Demo Flow & Script (演讲流程与讲稿)

**Step 1. Course Creation (Admin Dashboard)**
- **操作 (Action)**: Log in as Admin -> Go to Course Management -> Create New Course.
- **讲稿 (Script)**: 
  > "Hello everyone, today we will demonstrate the EduMe Learning System. Let's start by creating a brand new course from the Admin Dashboard. As you can see, I am filling in the course details for 'Go Programming Masterclass'. Notice that I set the language exactly as 'golang'. This triggers our dynamic Content Management System to automatically configure the code sandbox later. Let's save the course."

**Step 2. Adding Chapters and Resources (VARK & Multi-media)**
- **操作 (Action)**: Add "Chapter 1" -> Add Video, Article, and Code Exercise.
- **讲稿 (Script)**: 
  > "Next, we structure our course by adding a Subject: Chapter 1. The power of EduMe's CMS is our multi-layered resource system. For this chapter, I will upload a YouTube video, a text document, and an interactive coding exercise. This variety is crucial because our system adapts to the student's VARK learning style—Visual, Aural, Read/Write, or Kinesthetic. By providing different formats, the platform intelligently re-prioritizes content to suit each individual learner's needs."

**Step 3. Creating Quizzes**
- **操作 (Action)**: Go to the Quiz tab and add the listed questions.
- **讲稿 (Script)**: 
  > "To assess learning, we can instantly create quizzes for each chapter. Here, I'm adding multiple-choice questions with customized feedback. Real-time assessments ensure students actively evaluate their understanding immediately after learning."

**Step 4. Student View & VARK Personalization**
- **操作 (Action)**: Switch to a Student account (e.g., a "Visual" learner) and open the Go course.
- **讲稿 (Script)**: 
  > "Now, let's switch perspectives. I am logging in as a student whose onboarding assessment identified them as a 'Visual' learner. When they open the Go course, observe how the system dynamically personalizes the layout. The Video Tutorial is placed at the very top of their resources list. If they were a 'Read/Write' learner, the text documentation would appear first. This adaptive learning environment significantly boosts engagement and comprehension."

**Step 5. Integrated Code Sandbox**
- **操作 (Action)**: Click "Open Sandbox" or go to the code exercise. Run the Go code.
- **讲稿 (Script)**: 
  > "For programming courses, hands-on practice is essential. Notice this sandbox feature. Because we tagged this course as 'golang', the sandbox environment instantly initializes a Go workspace. The student can write, compile, and run Go code securely directly within the browser—no local setup or software installation required. Let's run a quick 'Hello World' to see the instant output."

**Step 6. Taking the Assessment & Dashboard Update**
- **操作 (Action)**: Complete the Chapter Quiz and return to the Student Dashboard.
- **讲稿 (Script)**: 
  > "Finally, let's take the quiz we just created. As I select the answers, you'll see instant feedback which is great for continuous learning. Once completed, the student's progress, EXP points, and quiz scores are immediately synced back to their Dashboard in real-time. Thank you for watching this demonstration of EduMe!"
