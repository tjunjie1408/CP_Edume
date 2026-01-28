var loginForm = document.getElementById("login-form");
var registerForm = document.getElementById("register-form");
var indicator = document.getElementById("btn-highlight");
var toggleBtns = document.querySelectorAll('.toggle-btn');

// 切换到注册的函数
function register() {
    // 1. 移动表单
    loginForm.style.left = "-400px";   // 登录表单移到左侧屏幕外
    registerForm.style.left = "50px";  // 注册表单移入可视区域
    
    // 2. 移动顶部高亮条
    indicator.style.left = "130px";    // 移动到右侧按钮位置
    
    // 3. 切换按钮文字激活状态
    toggleBtns[0].classList.remove('active');
    toggleBtns[1].classList.add('active');
}

// 切换到登录的函数
function login() {
    // 1. 移动表单
    loginForm.style.left = "50px";     // 登录表单移回可视区域
    registerForm.style.left = "450px"; // 注册表单移到右侧屏幕外
    
    // 2. 移动顶部高亮条
    indicator.style.left = "0px";      // 移动回左侧按钮位置
    
    // 3. 切换按钮文字激活状态
    toggleBtns[1].classList.remove('active');
    toggleBtns[0].classList.add('active');
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

// 监听窗口大小变化 (可选，为了更完美的体验)
window.addEventListener('resize', responsiveAdjust);

// 把这段加在 login-app.js 的最后面
window.onload = function() {
    // 检查网址有没有带 #register
    if(window.location.hash === '#register') {
        register(); // 调用切换函数
    }
};


/*Background animation*/
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('paper-container');
    const shapeCount = 15; // Number of shapes to generate

    for (let i = 0; i < shapeCount; i++) {
        createShape(container);
    }
});

function createShape(container) {
    const shape = document.createElement('div');
    shape.classList.add('paper-shape');

    // Random Size (between 200px and 500px)
    // We make them large to mimic the "sheets of paper" look
    const size = Math.random() * 300 + 200; 
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;

    // Random Position
    // We allow them to go slightly off-screen (-10% to 100%)
    const left = Math.random() * 110 - 10;
    const top = Math.random() * 110 - 10;
    shape.style.left = `${left}%`;
    shape.style.top = `${top}%`;

    // Random CSS Variables for the Animation
    // --rotation: initial angle
    // --moveX / --moveY: how far it drifts
    const rotation = Math.random() * 360;
    const moveX = Math.random() * 50 - 25; // Drift between -25px and 25px
    const moveY = Math.random() * 50 - 25;
    
    shape.style.setProperty('--rotation', `${rotation}deg`);
    shape.style.setProperty('--moveX', `${moveX}px`);
    shape.style.setProperty('--moveY', `${moveY}px`);

    // Random Animation Duration (Slow float: 10s to 20s)
    const duration = Math.random() * 10 + 10;
    shape.style.animationDuration = `${duration}s`;

    // Random Delay so they don't all start at once
    const delay = Math.random() * 5;
    shape.style.animationDelay = `-${delay}s`; // Negative delay starts animation immediately

    container.appendChild(shape);
}