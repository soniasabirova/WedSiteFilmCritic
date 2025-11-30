// Обработка формы входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    console.log('Данные для входа:', { login, password, remember });
    
    // Анимация загрузки
    const btn = this.querySelector('.auth-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Вход...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Вход выполнен! (заглушка)');
    }, 1500);
});