// Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password strength indicator
        const passwordInput = document.getElementById('regPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;
    
    // Validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Simulate API call
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Mock authentication
        const user = {
            email: email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 'user'
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        if (remember) {
            localStorage.setItem('rememberEmail', email);
        }
        
        showSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'profile.html';
            }
        }, 1000);
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms')?.checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
        showError('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        showError('Password must be at least 8 characters');
        return;
    }
    
    if (!terms) {
        showError('Please accept the terms and conditions');
        return;
    }
    
    // Simulate API call
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const user = {
            email: email,
            name: `${firstName} ${lastName}`,
            role: 'user'
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        showSuccess('Account created successfully! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }, 2000);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function toggleRegPassword() {
    const passwordInput = document.getElementById('regPassword');
    const icon = document.querySelectorAll('.toggle-password')[0];
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('regPassword').value;
    const strengthBar = document.querySelector('.strength-bar');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
    const widths = ['25%', '50%', '75%', '100%'];
    
    if (strengthBar) {
        strengthBar.style.width = widths[strength - 1] || '0%';
        strengthBar.style.background = colors[strength - 1] || '#ef4444';
    }
}

function showError(message) {
    // Remove existing error
    const existing = document.querySelector('.auth-error');
    if (existing) existing.remove();
    
    const error = document.createElement('div');
    error.className = 'auth-error';
    error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    error.style.cssText = `
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    `;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(error, form.firstChild);
    
    setTimeout(() => error.remove(), 5000);
}

function showSuccess(message) {
    const success = document.createElement('div');
    success.className = 'auth-success';
    success.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    success.style.cssText = `
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    `;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(success, form.firstChild);
}