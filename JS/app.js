const video1 = document.getElementById('VARKVideo1');
const video2 = document.getElementById('VARKVideo2');
const video3 = document.getElementById('VARKVideo3');
const faqQuestions = document.querySelectorAll('.faq-question');
const hoverSign = document.querySelector('.hover-sign');

const videoList = [video1, video2, video3];

videoList.forEach(function(video){
    video.addEventListener('mouseover', function() {
        video.play();
        hoverSign.classList.add('active')
    })
    video.addEventListener('mouseout', function() {
        video.pause();
        hoverSign.classList.remove('active')
    })
})

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        item.classList.toggle('active');
    });
});

