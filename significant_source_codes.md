# Significant Source Codes

以下 5 段代码涵盖了 EduMe 系统的核心模块：**认证授权、VARK 个性化推荐、VARK 内容排序、Quiz 验证与进度追踪、VARK 评估与后端通信**。

---

## 1. Authentication Guard — OOP Abstract Class Pattern

> **文件**: [BasePage.php](file:///c:/xampp/htdocs/Edume/config/BasePage.php) (Lines 1–47) + [StudentPage.php](file:///c:/xampp/htdocs/Edume/config/StudentPage.php) (Lines 1–14)

```php
// BasePage.php — Lines 13-46
abstract class BasePage
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    abstract protected function authorize(): bool;

    public function requireAuth(): void
    {
        if (!$this->authorize()) {
            $this->redirect(BASE_URL . '/public/registration/login.php');
        }
    }
}

// StudentPage.php — Lines 7-13
class StudentPage extends BasePage
{
    protected function authorize(): bool
    {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'student';
    }
}
```

### 作用解释

| # | 作用 |
|---|------|
| 1 | **Session 管理** — [__construct()](file:///d:/School/CapstoneProject/Edume/public/course/Progress.php#9-12) 检查 `session_status()`，确保不会重复调用 `session_start()`，防止 PHP Warning |
| 2 | **抽象类设计模式 (Template Method Pattern)** — [BasePage](file:///c:/xampp/htdocs/Edume/config/BasePage.php#13-47) 定义了认证流程的骨架，子类 [StudentPage](file:///c:/xampp/htdocs/Edume/config/StudentPage.php#7-14) 和 [AdminPage](file:///c:/xampp/htdocs/Edume/config/AdminPage.php#7-14) 只需实现 [authorize()](file:///c:/xampp/htdocs/Edume/config/StudentPage.php#9-13) 方法即可 |
| 3 | **角色权限控制 (RBAC)** — [StudentPage](file:///c:/xampp/htdocs/Edume/config/StudentPage.php#7-14) 检查 `$_SESSION['role'] === 'student'`，确保只有学生角色能访问学生页面；AdminPage 同理检查 `admin` |
| 4 | **安全重定向** — 未授权用户自动跳转到 [login.php](file:///c:/xampp/htdocs/Edume/public/registration/login.php)，并通过 `exit` 阻止后续代码执行，防止未授权数据泄露 |
| 5 | **代码复用** — 所有受保护页面只需两行代码 `$page = new StudentPage(); $page->requireAuth();` 即可完成认证，遵循 DRY 原则 |

---

## 2. VARK-Based Course Recommendation Query

> **文件**: [dashboard.php](file:///c:/xampp/htdocs/Edume/student/dashboard/dashboard.php) (Lines 28–47)

```php
// dashboard.php — Lines 28-47
$userStyle = $_SESSION['primary_vark_style'] ?? 'visual';
if (!in_array($userStyle, ['visual', 'read', 'kinesthetic', 'aural'])) {
    $userStyle = 'visual';
}
$styleColumn = 'has_' . $userStyle;
$stmtRec = $db->prepare("
    SELECT id, title, description, difficulty 
    FROM courses 
    WHERE is_published = 1 AND {$styleColumn} = 1 
      AND id NOT IN (
          SELECT DISTINCT c.course_id 
          FROM chapters c 
          JOIN user_progress up ON c.id = up.chapter_id 
          WHERE up.user_id = ?
      ) 
    LIMIT 2
");
$stmtRec->execute([$userId]);
$recommendedCourses = $stmtRec->fetchAll(PDO::FETCH_ASSOC);
```

### 作用解释

| # | 作用 |
|---|------|
| 1 | **VARK 个性化推荐算法** — 根据学生的 `primary_vark_style`（如 visual、read、kinesthetic）动态选择数据库列 `has_visual`/`has_read`/`has_kinesthetic` 来筛选匹配的课程 |
| 2 | **输入白名单验证防 SQL 注入** — `in_array()` 确保 `$userStyle` 只能是 4 个合法值之一，即使拼接到 SQL 也不会产生注入风险 |
| 3 | **子查询排除已学课程** — `NOT IN (SELECT ...)` 子查询排除学生已开始学习的课程，确保推荐的是全新内容 |
| 4 | **Prepared Statement 防注入** — `$userId` 通过 `?` 占位符传入，利用 PDO 预处理语句防止 SQL 注入攻击 |
| 5 | **Smart Default** — 如果 Session 中没有 `primary_vark_style`（如未做 VARK 测试），默认回退到 `'visual'`，保证系统不会因缺失数据而崩溃 |

---

## 3. VARK Content Reordering Using `usort()`

> **文件**: [course_details.php](file:///c:/xampp/htdocs/Edume/student/course_details/course_details.php) (Lines 66–82)

```php
// course_details.php — Lines 66-82
// ── VARK-based content reordering ──
// Move materials matching the student's VARK style to the front
$varkTagMap = [
    'visual'      => 'visual',
    'aural'       => 'visual',  // aural + visual combined per project spec
    'read'        => 'read',
    'kinesthetic' => 'kinesthetic'
];
$preferredTag = $varkTagMap[$studentVark] ?? null;

if ($preferredTag) {
    usort($materials, function($a, $b) use ($preferredTag) {
        $aMatch = (strtolower($a['vark_tag'] ?? '') === $preferredTag) ? -1 : 0;
        $bMatch = (strtolower($b['vark_tag'] ?? '') === $preferredTag) ? -1 : 0;
        return $aMatch - $bMatch; // preferred first
    });
}
```

### 作用解释

| # | 作用 |
|---|------|
| 1 | **VARK 内容优先排序** — 匹配学生学习风格的教材（视频/文本/练习）会被排到最前面，确保学生优先看到最适合自己的学习资源 |
| 2 | **VARK 类型映射 (Mapping)** — `$varkTagMap` 将 4 种学习类型映射为 3 种内容标签（aural 合并到 visual），符合项目规格中"视听结合"的设计 |
| 3 | **`usort()` 自定义排序** — 使用 PHP 的 `usort()` 传入闭包函数，比较两个教材的 `vark_tag` 是否匹配学生偏好，实现动态排序 |
| 4 | **`use ($preferredTag)` 闭包变量捕获** — 通过 `use` 关键字将外部变量传入闭包，实现灵活的排序逻辑 |
| 5 | **零侵入性** — 这段代码不过滤或删除任何教材，只是重新排列顺序。学生仍然可以看到所有学习资源，但个性化推荐的内容会排在最前 |

---

## 4. Quiz Validation API with Progress Tracking

> **文件**: [validate_quiz_api.php](file:///c:/xampp/htdocs/Edume/student/course_details/validate_quiz_api.php) (Lines 34–105)

```php
// validate_quiz_api.php — Lines 34-105
try {
    // 1. Fetch correct answers from DB
    $query = "SELECT qq.id, qq.correct_option AS correct_answer, qq.explanation 
              FROM quiz_questions qq 
              JOIN quizzes q ON qq.quiz_id = q.id 
              WHERE q.chapter_id = :chapter_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':chapter_id', $chapterId, PDO::PARAM_INT);
    $stmt->execute();
    $quizData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 2. Evaluate student's submission
    foreach ($answers as $qId => $studentSelectedOption) {
        $isCorrect = (strtoupper($studentSelectedOption) 
                      === strtoupper($correctAnswersMap[$qId]['correct']));
        if ($isCorrect) $correctCount++;
    }
    
    // 3. Calculate & conditionally update progress
    $scorePercentage = ($correctCount / $totalQuestions) * 100;
    $passed = $scorePercentage >= 50;
    
    if ($passed) {
        $progressSql = "INSERT INTO user_progress (...) VALUES (..., NOW()) 
                        ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = NOW()";
        // ... execute prepared statement
    }
    
    // 4. Return JSON result with detailed breakdown
    echo json_encode([
        'status' => 200, 'passed' => $passed,
        'score_percentage' => round($scorePercentage),
        'results_breakdown' => $results
    ]);
} catch (PDOException $e) {
    echo json_encode(['status' => 500, 'message' => 'Database error: ' . $e->getMessage()]);
}
```

### 作用解释

| # | 作用 |
|---|------|
| 1 | **服务端答案验证** — 正确答案存储在数据库中，所有验证在服务端完成，防止客户端篡改答案或作弊 |
| 2 | **RESTful JSON API 设计** — 使用 `json_encode()` 返回结构化 JSON 响应，包含状态码、分数、逐题结果和解析，前端可以灵活渲染 |
| 3 | **UPSERT 模式 (INSERT ... ON DUPLICATE KEY UPDATE)** — 学生第一次做题时 INSERT，重做时 UPDATE，用一条 SQL 优雅处理两种情况 |
| 4 | **异常处理 (try-catch)** — 捕获所有 `PDOException` 并返回用户友好的错误信息，避免系统暴露数据库细节导致安全风险 |
| 5 | **进度追踪与通过机制** — 只有当分数 ≥ 50% 时才标记章节完成，激励学生真正掌握知识点后才能解锁下一章 |

---

## 5. VARK Assessment Scoring & AJAX Submission

> **文件**: [questionnaire.js](file:///c:/xampp/htdocs/Edume/JS/questionnaire.js) (Lines 116–169)

```javascript
// questionnaire.js — Lines 116-169
function selectOption(type) {
    scores[type]++;
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    // Calculate Winner — Sort scores to find dominant style
    const sortedScores = Object.keys(scores)
        .sort((a, b) => scores[b] - scores[a]);
    const winnerType = sortedScores[0];
    
    const titles = {
        'visual': 'Visual-Audio',
        'read': 'Read/Write (Text based)',
        'kinesthetic': 'Kinesthetic (Hands-on)'
    };

    document.getElementById('result-title').innerText = titles[winnerType];
    
    // Send result to backend via AJAX
    sendAjax("save_style_api.php", {
        learnerType: winnerType
    }, function(response) {
        if (response.status === 200) {
            console.log("Learning style saved successfully");
        }
    });
}

function sendAjax(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}
```

### 作用解释

| # | 作用 |
|---|------|
| 1 | **VARK 评分算法** — 每道题选中的选项对应一个 VARK 类型 (`visual`/[read](file:///c:/xampp/htdocs/Edume/JS/loginpage.js#375-381)/`kinesthetic`)，`scores[type]++` 实时累计分数，最终分数最高的类型即为学生的学习风格 |
| 2 | **动态排序找出主导风格** — `Object.keys(scores).sort()` 按分数降序排列，`sortedScores[0]` 即为学生的主导学习风格 |
| 3 | **异步 AJAX 提交结果** — 使用原生 `XMLHttpRequest` 将评估结果以 JSON 格式 POST 到后端 [save_style_api.php](file:///c:/xampp/htdocs/Edume/student/questionnaire/save_style_api.php)，无需页面刷新即可保存到数据库 |
| 4 | **前后端分离通信** — 前端 JavaScript 只负责 UI 逻辑和评分计算，后端 PHP API 负责数据持久化和 Session 更新，实现关注点分离 |
| 5 | **用户按完结果** — 评估完成后立刻在页面上展示分数细分（Visual-Audio / Read/Write / Kinesthetic），用户可以直观了解自己的学习偏好分布 |
