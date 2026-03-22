var loginForm = document.getElementById("login-form");
var registerForm = document.getElementById("register-form");
var forgotPasswordEmailForm = document.getElementById(
  "forgot-password-email-form",
);
var forgotPasswordResetForm = document.getElementById(
  "forgot-password-reset-form",
);
var indicator = document.getElementById("btn-highlight");
var toggleBtns = document.querySelectorAll(".toggle-btn");
var formBox = document.querySelector(".form-box");

// Store the email for forgot password flow
var forgotPasswordEmail = "";

// 切换到注册的函数
function register() {
  // 1. 移动表单
  loginForm.style.left = "-400px"; // 登录表单移到左侧屏幕外
  registerForm.style.left = "50px"; // 注册表单移入可视区域

  // 2. 移动顶部高亮条
  indicator.style.left = "130px"; // 移动到右侧按钮位置

  // 3. 切换按钮文字激活状态
  toggleBtns[0].classList.remove("active");
  toggleBtns[1].classList.add("active");

  // Remove forgot password mode
  formBox.classList.remove("forgot-password-mode");
}

// 切换到登录的函数
function login() {
  // 1. 移动表单
  loginForm.style.left = "50px"; // 登录表单移回可视区域
  registerForm.style.left = "450px"; // 注册表单移到右侧屏幕外

  // 2. 移动顶部高亮条
  indicator.style.left = "0px"; // 移动回左侧按钮位置

  // 3. 切换按钮文字激活状态
  toggleBtns[1].classList.remove("active");
  toggleBtns[0].classList.add("active");

  // Reset forgot password forms
  forgotPasswordEmailForm.style.left = "450px";
  forgotPasswordResetForm.style.left = "450px";

  // Remove forgot password mode
  formBox.classList.remove("forgot-password-mode");
}

// Forgot Password Flow
function forgotPassword(event) {
  event.preventDefault();

  // Hide button-box and show forgot password email form
  formBox.classList.add("forgot-password-mode");

  // Move login form out
  loginForm.style.left = "-400px";

  // Show forgot password email form
  forgotPasswordEmailForm.style.left = "50px";
  forgotPasswordResetForm.style.left = "450px";
}

function backToLogin(event) {
  event.preventDefault();

  // Reset form
  forgotPasswordEmailForm.reset();
  forgotPasswordResetForm.reset();
  forgotPasswordEmail = "";

  // Show login form
  login();
}

// Handle forgot password email form submission
document
  .getElementById("forgot-password-email-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("forgot-email").value.trim();

    // Validate email format
    if (!isValidEmail(email)) {
      showNotification(
        "Invalid Email",
        "Please enter a valid email address.",
        "error",
      );
      return;
    }

    // Store email for next step
    forgotPasswordEmail = email;

    // Simulate backend API call to verify email
    // In real implementation, this would call your backend API
    // verifyEmailWithBackend(email);
    sendAjax(
      "/Edume/public/registration/AuthController.php?action=forget_password",
      { email: email },
      function (response) {
        if (response.status === 200) {
          forgotPasswordEmailForm.style.left = "-400px";
          forgotPasswordResetForm.style.left = "50px";
          document.getElementById("email-display").textContent =
            "Reset password for: " + email;
        } else {
          showNotification("Error", response.message, "error");
        }
      },
    );
  });

function verifyEmailWithBackend(email) {
  // Disable submit button during verification
  var submitBtn = document
    .getElementById("forgot-password-email-form")
    .querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Verifying...";

  // Simulate API call with timeout
  setTimeout(function () {
    // For demo purposes, we'll accept any email
    // In real implementation, the backend would verify the email exists

    // Mock: Check if email exists (you would replace this with actual backend call)
    // Example: If email is empty or fake format, show error
    if (email.includes("test") && email.includes("fake")) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Verify Email";
      showNotification(
        "Email Not Found",
        "This email hasn't signed in. Please sign up first.",
        "error",
      );
    } else {
      // Email verified successfully
      submitBtn.disabled = false;
      submitBtn.textContent = "Verify Email";

      // Move to reset password form
      document.getElementById("forgot-password-email-form").style.left =
        "-400px";
      document.getElementById("forgot-password-reset-form").style.left = "50px";

      // Display email in reset form
      document.getElementById("email-display").textContent =
        "Reset password for: " + email;
    }
  }, 1500);
}

// Handle forgot password reset form submission
document
  .getElementById("forgot-password-reset-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var newPassword = document.getElementById("new-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    // Validate passwords
    if (newPassword.length < 6) {
      showNotification(
        "Weak Password",
        "Password must be at least 6 characters long.",
        "error",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification(
        "Password Mismatch",
        "Passwords do not match. Please try again.",
        "error",
      );
      return;
    }

    // Disable submit button during reset
    var submitBtn = document
      .getElementById("forgot-password-reset-form")
      .querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Resetting...";

    // Simulate backend API call to reset password
    /**setTimeout(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';**/

    // Show success message
    /**showNotification(
            'Password Reset Successfully',
            'Your password has been reset. Please log in with your new password.',
            'success',
            function() {
                // Return to login form after confirmation
                backToLogin({preventDefault: function(){}});
            }
        );
    }, 1500);**/
    sendAjax(
      "/Edume/public/registration/AuthController.php?action=reset_password",
      {
        email: forgotPasswordEmail,
        newPassword: newPassword,
      },
      function (response) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Reset Password";
        if (response.status === 200) {
          showNotification(
            "Password Reset Successfully",
            response.message,
            "success",
            function () {
              // Return to login form after confirmation
              backToLogin({ preventDefault: function () {} });
            },
          );
        } else {
          showNotification("Error", response.message, "error");
        }
      },
    );
  });

// Modal notification functions
function showNotification(title, message, type = "info", onClose = null) {
  var modal = document.getElementById("notification-modal");
  var modalTitle = document.getElementById("modal-title");
  var modalMessage = document.getElementById("modal-message");
  var modalIcon = document.getElementById("modal-icon");

  // Remove all type classes
  modalIcon.classList.remove("success", "error", "warning");

  // Set icon based on type
  switch (type) {
    case "success":
      modalIcon.textContent = "check_circle";
      modalIcon.classList.add("success");
      break;
    case "error":
      modalIcon.textContent = "error";
      modalIcon.classList.add("error");
      break;
    case "warning":
      modalIcon.textContent = "warning";
      modalIcon.classList.add("warning");
      break;
    default:
      modalIcon.textContent = "info";
  }

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.style.display = "block";

  // Store callback for when modal closes
  if (onClose) {
    modal.closeCallback = onClose;
  }
}

function closeModal() {
  var modal = document.getElementById("notification-modal");
  modal.style.display = "none";

  // Call callback if it exists
  if (modal.closeCallback) {
    modal.closeCallback();
    modal.closeCallback = null;
  }
}

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  var modal = document.getElementById("notification-modal");
  if (event.target == modal) {
    closeModal();
  }
});

// Utility function to validate email format
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 响应式修正 (确保在手机上也能正确对齐)
function responsiveAdjust() {
  var screenWidth = window.innerWidth;
  if (screenWidth <= 480) {
    if (registerForm.style.left === "50px") {
      registerForm.style.left = "7.5%";
    } else {
      loginForm.style.left = "7.5%";
    }
  } else {
    // PC端重置
    if (loginForm.style.left !== "-400px") loginForm.style.left = "50px";
    if (registerForm.style.left !== "450px") registerForm.style.left = "50px";
  }
}

// 监听窗口大小变化 (可选，为了更完美的体��)
window.addEventListener("resize", responsiveAdjust);

// 把这段加在 login-app.js 的最后面
window.onload = function () {
  // 检查网址有没有带 #register
  if (window.location.hash === "#register") {
    register(); // 调用切换函数
  }
};

/*Background animation*/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("paper-container");
  const shapeCount = 15; // Number of shapes to generate

  for (let i = 0; i < shapeCount; i++) {
    createShape(container);
  }
});

function createShape(container) {
  const shape = document.createElement("div");
  shape.classList.add("paper-shape");

  // Random Size (between 200px and 500px)
  const size = Math.random() * 300 + 200;
  shape.style.width = `${size}px`;
  shape.style.height = `${size}px`;

  // Random Position
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  shape.style.left = `${x}%`;
  shape.style.top = `${y}%`;

  // Random Animation Duration
  const duration = Math.random() * 10 + 5;
  shape.style.animationDuration = `${duration}s`;

  // Random Movement
  const moveX = (Math.random() - 0.5) * 100;
  const moveY = (Math.random() - 0.5) * 100;
  shape.style.setProperty("--moveX", `${moveX}px`);
  shape.style.setProperty("--moveY", `${moveY}px`);

  // Random Rotation
  const rotation = Math.random() * 360;
  shape.style.setProperty("--rotation", `${rotation}deg`);

  container.appendChild(shape);
}

// AJAX helper function
function sendAjax(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(JSON.stringify(data));
}

//SignUp
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  sendAjax(
    "/Edume/public/registration/AuthController.php?action=signup",
    {
      name: document.getElementById("registerName").value,
      email: document.getElementById("registerEmail").value,
      password: document.getElementById("registerPassword").value,
    },
    function (response) {
      if (response.status === 201) {
        showNotification("Success", response.message, "success", function () {
          // Direct users to the VARK questionnaire immediately after signing up
          window.location.href = "/Edume/student/questionnaire/questionnaire.php";
        });
      } else {
        showNotification("Error", response.message, "error");
      }
    },
  );
});

//Login
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  sendAjax(
    "/Edume/public/registration/AuthController.php?action=login",
    {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    },
    function (response) {
      if (response.status === 200) {
        showNotification("Success", response.message, "success", function () {
          if (response.role === 1) {
            //Admin
            window.location.href = "/Edume/admin/dashboard/dashboard.php";
          } else {
            if (response.primary_vark_style !== null && response.primary_vark_style !== undefined) {
              window.location.href = "/Edume/student/dashboard/dashboard.php";
            } else {
              window.location.href = "/Edume/student/questionnaire/questionnaire.php";
            }
          }
        });
      } else {
        showNotification("Error", response.message, "error");
      }
    },
  );
});
