document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const hint = document.getElementById('hint');

    const attemptLogin = () => {
        const password = passwordInput.value.toLowerCase().trim();
        
        if (password === 'croak') {
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'os.html';
            }, 500);
        } else {
            passwordInput.style.border = '2px solid red';
            passwordInput.value = '';
            hint.textContent = 'Wrong password! Try again... 🐸';
            hint.style.color = 'red';
            
            setTimeout(() => {
                passwordInput.style.border = '';
                hint.textContent = 'Hint: The password is "croak"';
                hint.style.color = '';
            }, 2000);
        }
    };

    loginBtn.addEventListener('click', attemptLogin);
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.style.border = '';
        hint.textContent = 'Hint: The password is "croak"';
        hint.style.color = '';
    });
});