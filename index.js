document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const hint = document.getElementById('hint');
    const body = document.body;

    function showLoading() {
        const startupSound = new Audio('startup.mp3');
        startupSound.volume = 0.7;
        startupSound.play().catch(e => console.log('Audio play failed:', e));
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">🐸</div>
                <h1 class="loading-title">FrogOS</h1>
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p class="loading-text">Starting FrogOS...</p>
            </div>
        `;
        
        body.appendChild(loadingOverlay);
        
        const loadingText = loadingOverlay.querySelector('.loading-text');
        
        const messages = [
            'Starting FrogOS...',
            'Loading pond environment...',
            'Initializing lily pads...',
            'Connecting to swamp network...',
            'Preparing applications...',
            'Ready to ribbit!'
        ];
        
        let messageIndex = 0;
        
        const messageInterval = setInterval(() => {
            if (messageIndex < messages.length - 1) {
                messageIndex++;
                loadingText.textContent = messages[messageIndex];
            }
        }, 800);
        
        setTimeout(() => {
            clearInterval(messageInterval);
            window.location.href = 'os.html';
        }, 5000);
    }

    function handleLogin() {
        const password = passwordInput.value;
        if (password.toLowerCase() === 'croak') {
            showLoading();
        } else {
            passwordInput.style.borderColor = 'rgba(255, 0, 0, 0.6)';
            passwordInput.style.background = 'rgba(255, 0, 0, 0.1)';
            passwordInput.value = '';
            hint.textContent = 'Wrong password! Try again... 🐸';
            hint.style.color = 'red';
            setTimeout(() => {
                passwordInput.style.borderColor = 'rgba(255,255,255,0.3)';
                passwordInput.style.background = 'rgba(255,255,255,0.1)';
                hint.textContent = 'Hint: The password is "croak"';
                hint.style.color = '';
            }, 2000);
        }
    }

    loginBtn.addEventListener('click', handleLogin);
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.style.border = '';
        hint.textContent = 'Hint: The password is "croak"';
        hint.style.color = '';
    });
});