// 生成爱心动画
function createHearts() {
    const heartsContainer = document.getElementById('hearts');
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.5;
        heart.style.transform = `translateY(100vh) rotate(45deg) scale(${Math.random() * 0.5 + 0.5})`;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, 300);
}

// 倒计时功能
function startCountdown() {
    // 配置生日日期（可修改这里的月份和日期）
    // 月份使用日常习惯的格式：1月=1，2月=2，...，12月=12
    const BIRTHDAY_MONTH = 12; // 生日月份（示例：12代表12月）
    const BIRTHDAY_DAY = 8;     // 生日日期（示例：8号）
    
    // 检查当天是否为生日
    function isTodayBirthday() {
        const now = new Date();
        // JavaScript的月份是从0开始的，所以需要减1转换
        return now.getMonth() === (BIRTHDAY_MONTH - 1) && now.getDate() === BIRTHDAY_DAY;
    }
    
    // 计算下一个生日日期
    function getNextBirthday() {
        const now = new Date();
        const currentYear = now.getFullYear();
        // JavaScript的月份是从0开始的，所以需要减1转换
        const birthday = new Date(currentYear, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
        
        // 如果今年的生日已经过了，就计算明年的
        if (birthday < now) {
            birthday.setFullYear(currentYear + 1);
        }
        
        return birthday;
    }
    
    function updateCountdown() {
        // 获取DOM元素
        const countdownTitle = document.getElementById('countdownTitle');
        const daysContainer = document.getElementById('daysContainer');
        const birthdayWish = document.getElementById('birthdayWish');
        const daysElement = document.getElementById('days');
        
        // 检查当天是否为生日
        if (isTodayBirthday()) {
            // 今天是生日，显示祝福信息
            countdownTitle.textContent = '🎂 生日快乐 🎂';
            daysContainer.style.display = 'none';
            birthdayWish.style.display = 'block';
        } else {
            // 不是生日，显示倒计时
            countdownTitle.textContent = '距离生日还有';
            daysContainer.style.display = 'block';
            birthdayWish.style.display = 'none';
            
            // 计算剩余天数（只按日期计算，不考虑具体时间）
            const now = new Date();
            const nextBirthday = getNextBirthday();
            const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const birthdayDate = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());
            const diffTime = birthdayDate - nowDate;
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            daysElement.textContent = days.toString().padStart(2, '0');
        }
    }
    
    updateCountdown();
    // 每天更新一次即可，不需要每秒更新
    setInterval(updateCountdown, 86400000); // 24小时 * 60分钟 * 60秒 * 1000毫秒 = 86400000毫秒
}

// 图片预览功能配置
const SHOW_IMAGE_CAPTION = false; // 设置为false可隐藏图片描述文字

// 图片预览功能
function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("imageCaption");
    
    modal.style.display = "flex";
    modalImg.src = img.src;
    
    // 根据配置决定是否显示图片描述
    if (SHOW_IMAGE_CAPTION) {
        captionText.innerHTML = img.alt;
        captionText.style.display = "block";
    } else {
        captionText.innerHTML = "";
        captionText.style.display = "none";
    }
}

// 关闭图片预览
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// 图片加载完成后的过渡效果
function initImageEffects() {
    const images = document.querySelectorAll('.photo img');
    images.forEach(img => {
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        // 处理图片加载失败情况
        img.onerror = function() {
            this.style.opacity = '0.5';
            console.log(`图片加载失败: ${this.src}`);
        };
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
    startCountdown();
    initImageEffects();
    
    const music = document.getElementById('birthdayMusic');
    const playHint = document.getElementById('playHint');
    let hasPlayed = false; // 标记音乐是否已经成功播放过
    
    // 音乐播放完成后停止
    music.addEventListener('ended', () => {
        music.pause();
        music.currentTime = 0;
    });
    
    // 尝试自动播放音乐，处理浏览器限制
    function tryPlayMusic() {
        // 如果音乐已经在播放或已经成功播放过，不再重复尝试
        if (music.paused && !hasPlayed) {
            music.play().then(() => {
                // 播放成功，隐藏提示并标记为已播放
                if (playHint) {
                    playHint.style.display = 'none';
                }
                hasPlayed = true;
                
                // 移除事件监听器，避免重复触发
                document.removeEventListener('click', tryPlayMusic);
                document.removeEventListener('keydown', tryPlayMusic);
                document.removeEventListener('touchstart', tryPlayMusic);
            }).catch(error => {
                // 播放失败，等待用户交互
                console.log('自动播放失败，需要用户交互:', error);
            });
        }
    }
    
    // 尝试自动播放
    tryPlayMusic();
    
    // 添加用户交互事件，当用户点击页面时自动播放
    document.addEventListener('click', tryPlayMusic);
    
    // 添加键盘事件，当用户按键时自动播放
    document.addEventListener('keydown', tryPlayMusic);
    
    // 添加触摸事件，当用户触摸页面时自动播放（移动端）
    document.addEventListener('touchstart', tryPlayMusic);
    
    // 绑定模态框关闭事件
    document.getElementById("closeModal").onclick = closeModal;
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        const modal = document.getElementById("imageModal");
        if (event.target == modal) {
            closeModal();
        }
    };
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});