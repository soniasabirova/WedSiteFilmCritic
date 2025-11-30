// ============================================
// КиноКритик - JavaScript для авторизации
// ============================================

// Переключение видимости пароля
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.src = 'EyeSlash.png';
        icon.alt = 'Скрыть пароль';
    } else {
        input.type = 'password';
        icon.src = 'Eye.png';
        icon.alt = 'Показать пароль';
    }
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Показать ошибку для поля
function showError(input, message) {
    const group = input.closest('.input-group');
    group.classList.add('error');
    group.classList.remove('success');
    
    // Удалить старое сообщение об ошибке
    const oldError = group.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    // Добавить новое сообщение об ошибке
    const errorDiv = document.createElement('span');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    group.appendChild(errorDiv);
}

// Убрать ошибку
function clearError(input) {
    const group = input.closest('.input-group');
    group.classList.remove('error');
    
    const errorMessage = group.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
}

// Показать успех
function showSuccess(input) {
    const group = input.closest('.input-group');
    group.classList.remove('error');
    group.classList.add('success');
    
    const errorMessage = group.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
}

// Обработка формы входа
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        let isValid = true;
        
        // Валидация имени пользователя
        if (!username.value.trim()) {
            showError(username, 'Введите имя пользователя');
            isValid = false;
        } else if (username.value.length < 3) {
            showError(username, 'Имя пользователя должно быть не менее 3 символов');
            isValid = false;
        } else {
            clearError(username);
        }
        
        // Валидация пароля
        if (!password.value) {
            showError(password, 'Введите пароль');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(password, 'Минимальное допустимое количество символов - 8');
            isValid = false;
        } else {
            clearError(password);
        }
        
        if (isValid) {
            // Здесь будет отправка данных на сервер
            console.log('Форма входа отправлена:', {
                username: username.value,
                password: password.value
            });
            
            // Показать сообщение об успехе (временно)
            alert('Вход выполнен успешно!');
        }
    });
    
    // Очистка ошибок при вводе
    loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
}

// Обработка формы регистрации
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        let isValid = true;
        
        // Валидация имени пользователя
        if (!username.value.trim()) {
            showError(username, 'Введите имя пользователя');
            isValid = false;
        } else if (username.value.length < 3) {
            showError(username, 'Имя пользователя должно быть не менее 3 символов');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
            showError(username, 'Только латинские буквы, цифры и _');
            isValid = false;
        } else {
            clearError(username);
        }
        
        // Валидация email
        if (!email.value.trim()) {
            showError(email, 'Введите email');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showError(email, 'Введите корректный email');
            isValid = false;
        } else {
            clearError(email);
        }
        
        // Валидация пароля
        if (!password.value) {
            showError(password, 'Введите пароль');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(password, 'Минимальное допустимое количество символов - 8');
            isValid = false;
        } else {
            clearError(password);
        }
        
        // Валидация подтверждения пароля
        if (!confirmPassword.value) {
            showError(confirmPassword, 'Подтвердите пароль');
            isValid = false;
        } else if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Пароли не совпадают');
            isValid = false;
        } else {
            clearError(confirmPassword);
        }
        
        if (isValid) {
            // Здесь будет отправка данных на сервер
            console.log('Форма регистрации отправлена:', {
                username: username.value,
                email: email.value,
                password: password.value
            });
            
            // Показать сообщение об успехе (временно)
            alert('Регистрация прошла успешно! Теперь вы можете войти.');
            window.location.href = 'login.html';
        }
    });
    
    // Очистка ошибок при вводе
    registerForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.closest('.input-group')) {
                clearError(input);
            }
        });
    });
}

// Анимация при фокусе на input
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.closest('.input-group').classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.closest('.input-group').classList.remove('focused');
    });
});

// ============================================
// Форма добавления фильма
// ============================================

const addMovieForm = document.getElementById('addMovieForm');
if (addMovieForm) {
    addMovieForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('movieTitle');
        const type = document.getElementById('movieType');
        const genre = document.getElementById('movieGenre');
        const date = document.getElementById('movieDate');
        const rating = document.querySelector('input[name="rating"]:checked');
        let isValid = true;
        
        // Валидация названия
        if (!title.value.trim()) {
            showError(title, 'Заполните поле');
            isValid = false;
        } else {
            clearError(title);
        }
        
        // Валидация типа
        if (!type.value) {
            showError(type, 'Заполните поле');
            isValid = false;
        } else {
            clearError(type);
        }
        
        // Валидация жанра
        if (!genre.value) {
            showError(genre, 'Заполните поле');
            isValid = false;
        } else {
            clearError(genre);
        }
        
        // Валидация даты
        if (!date.value) {
            showError(date, 'Заполните поле');
            isValid = false;
        } else {
            clearError(date);
        }
        
        // Валидация рейтинга
        const ratingGroup = document.querySelector('.rating-input').closest('.input-group');
        if (!rating) {
            ratingGroup.classList.add('error');
            let errorMsg = ratingGroup.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Выберите оценку';
                ratingGroup.appendChild(errorMsg);
            }
            isValid = false;
        } else {
            ratingGroup.classList.remove('error');
            const errorMsg = ratingGroup.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
        
        if (isValid) {
            // Здесь будет сохранение данных
            console.log('Фильм добавлен:', {
                title: title.value,
                type: type.value,
                genre: genre.value,
                date: date.value,
                rating: rating.value,
                review: document.getElementById('movieReview').value
            });
            
            alert('Фильм успешно добавлен!');
            window.location.href = 'index.html';
        }
    });
    
    // Очистка ошибок при вводе
    addMovieForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.closest('.input-group')) {
                clearError(input);
            }
        });
        input.addEventListener('change', () => {
            if (input.closest('.input-group')) {
                clearError(input);
            }
        });
    });
}

// ============================================
// Главная страница - модальное окно
// ============================================

function openModal() {
    const modal = document.getElementById('allMoviesModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('allMoviesModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Клик по красной области для открытия модального окна
const moviesContainer = document.getElementById('moviesContainer');
if (moviesContainer) {
    moviesContainer.addEventListener('click', function(e) {
        // Не открывать модальное окно при клике на кнопку "Подробнее"
        if (!e.target.closest('.btn-details')) {
            openModal();
        }
    });
}

// Закрытие модального окна при клике вне его
const modalOverlay = document.getElementById('allMoviesModal');
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Закрытие модального окна по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
