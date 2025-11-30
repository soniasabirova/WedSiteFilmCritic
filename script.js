// ============================================
// КиноКритик - JavaScript
// ============================================

// ============================================
// Утилиты для форм
// ============================================

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button?.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.src = 'EyeSlash.png';
            icon.alt = 'Скрыть пароль';
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.src = 'Eye.png';
            icon.alt = 'Показать пароль';
        }
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const group = input?.closest('.input-group');
    if (!group) return;
    
    group.classList.add('error');
    
    let errorMsg = group.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        group.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

function clearError(input) {
    const group = input?.closest('.input-group');
    if (!group) return;
    
    group.classList.remove('error');
    const errorMsg = group.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

function showFormError(form, message) {
    let errorDiv = form.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideFormError(form) {
    const errorDiv = form.querySelector('.form-error');
    if (errorDiv) errorDiv.style.display = 'none';
}

// ============================================
// Форма входа
// ============================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideFormError(loginForm);
        
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        let valid = true;
        
        if (!username.value.trim() || username.value.length < 3) {
            showError(username, 'Минимум 3 символа');
            valid = false;
        } else {
            clearError(username);
        }
        
        if (!password.value || password.value.length < 8) {
            showError(password, 'Минимум 8 символов');
            valid = false;
        } else {
            clearError(password);
        }
        
        if (!valid) return;
        
        try {
            await login(username.value.trim(), password.value);
            window.location.href = '/index.html';
        } catch (error) {
            showFormError(loginForm, error.message);
        }
    });
    
    // Очистка ошибок при вводе
    loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
}

// ============================================
// Форма регистрации
// ============================================

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideFormError(registerForm);
        
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        let valid = true;
        
        if (!username.value.trim() || username.value.length < 3) {
            showError(username, 'Минимум 3 символа');
            valid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
            showError(username, 'Только латиница, цифры и _');
            valid = false;
        } else {
            clearError(username);
        }
        
        if (!email.value.trim() || !validateEmail(email.value)) {
            showError(email, 'Введите корректный email');
            valid = false;
        } else {
            clearError(email);
        }
        
        if (!password.value || password.value.length < 8) {
            showError(password, 'Минимум 8 символов');
            valid = false;
        } else {
            clearError(password);
        }
        
        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Пароли не совпадают');
            valid = false;
        } else {
            clearError(confirmPassword);
        }
        
        if (!valid) return;
        
        try {
            await register(username.value.trim(), email.value.trim(), password.value);
            window.location.href = '/index.html';
        } catch (error) {
            showFormError(registerForm, error.message);
        }
    });
    
    registerForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
}

// ============================================
// Форма добавления фильма
// ============================================

const addMovieForm = document.getElementById('addMovieForm');
if (addMovieForm) {
    addMovieForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('movieTitle');
        const type = document.getElementById('movieType');
        const genre = document.getElementById('movieGenre');
        const date = document.getElementById('movieDate');
        const rating = document.querySelector('input[name="rating"]:checked');
        const review = document.getElementById('movieReview');
        let valid = true;
        
        if (!title.value.trim()) {
            showError(title, 'Заполните поле');
            valid = false;
        } else {
            clearError(title);
        }
        
        if (!type.value) {
            showError(type, 'Выберите тип');
            valid = false;
        } else {
            clearError(type);
        }
        
        if (!genre.value) {
            showError(genre, 'Выберите жанр');
            valid = false;
        } else {
            clearError(genre);
        }
        
        if (!date.value) {
            showError(date, 'Выберите дату');
            valid = false;
        } else {
            clearError(date);
        }
        
        const ratingGroup = document.querySelector('.rating-input')?.closest('.input-group');
        if (!rating) {
            if (ratingGroup) {
                ratingGroup.classList.add('error');
                let msg = ratingGroup.querySelector('.error-message');
                if (!msg) {
                    msg = document.createElement('span');
                    msg.className = 'error-message';
                    ratingGroup.appendChild(msg);
                }
                msg.textContent = 'Выберите оценку';
            }
            valid = false;
        } else if (ratingGroup) {
            ratingGroup.classList.remove('error');
            const msg = ratingGroup.querySelector('.error-message');
            if (msg) msg.remove();
        }
        
        if (!valid) return;
        
        try {
            await addMovie({
                title: title.value.trim(),
                type: type.value,
                genre: genre.value,
                rating: parseInt(rating.value),
                watch_date: date.value,
                review: review?.value.trim() || ''
            });
            
            alert('Фильм добавлен!');
            window.location.href = '/index.html';
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    });
    
    addMovieForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => clearError(el));
        el.addEventListener('change', () => clearError(el));
    });
}

// ============================================
// Главная страница
// ============================================

async function loadMainPage() {
    if (!isAuthenticated()) return;
    
    try {
        const [recent, stats, monthly, ratings, top] = await Promise.all([
            getRecentMovies().catch(() => ({ movies: [] })),
            getGeneralStats().catch(() => ({})),
            getMonthlyStats().catch(() => ({ monthly: [] })),
            getRatingsDistribution().catch(() => ({ ratings: [], total: 0 })),
            getTopMovies().catch(() => ({ top_movies: [] }))
        ]);
        
        renderRecentMovies(recent.movies || []);
        renderGeneralStats(stats);
        renderMonthlyChart(monthly.monthly || []);
        renderRatingsChart(ratings);
        renderTopMovies(top.top_movies || []);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

function renderRecentMovies(movies) {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, i) => {
        const movie = movies[i];
        if (movie) {
            card.classList.remove('empty');
            card.classList.add('filled');
            card.innerHTML = `
                <div class="movie-title">${movie.title}</div>
                <div class="movie-type">${movie.type_name}</div>
                <div class="movie-genre">${movie.genre_name}</div>
                <div class="movie-rating">${'★'.repeat(movie.rating)}${'☆'.repeat(5 - movie.rating)}</div>
                <div class="movie-date">${formatDate(movie.watch_date)}</div>
                ${movie.review ? `<div class="movie-review">${movie.review}</div>` : ''}
            `;
        } else {
            card.classList.add('empty');
            card.classList.remove('filled');
            card.innerHTML = '<span>Нет данных</span>';
        }
    });
}

function renderGeneralStats(stats) {
    const el = (id, val) => {
        const e = document.getElementById(id);
        if (e) e.textContent = val || 'Нет данных';
    };
    el('totalMovies', stats.total_movies ? `${stats.total_movies} фильмов` : null);
    el('avgRating', stats.average_rating?.toString());
    el('favGenre', stats.favorite_genre);
}

function renderMonthlyChart(monthly) {
    const chart = document.getElementById('monthlyChart');
    if (!chart) return;
    
    const barChart = chart.querySelector('.bar-chart');
    const noData = chart.querySelector('.no-data-text');
    const hasData = monthly.some(m => m.count > 0);
    
    if (noData) noData.style.display = hasData ? 'none' : 'block';
    if (barChart) barChart.style.display = hasData ? 'flex' : 'none';
    
    if (hasData && barChart) {
        const max = Math.max(...monthly.map(m => m.count), 1);
        const bars = barChart.querySelectorAll('.bar');
        bars.forEach((bar, i) => {
            const data = monthly[i];
            if (data) {
                bar.style.setProperty('--height', `${(data.count / max) * 100}%`);
                const span = bar.querySelector('span');
                if (span) span.textContent = data.count;
            }
        });
    }
}

function renderRatingsChart(data) {
    const chart = document.getElementById('ratingsChart');
    if (!chart) return;
    
    const noData = chart.querySelector('.no-data-text');
    const pieChart = chart.querySelector('.pie-chart');
    
    if (noData) noData.style.display = data.total ? 'none' : 'block';
    if (pieChart) pieChart.style.display = data.total ? 'flex' : 'none';
    
    if (data.total && pieChart) {
        const colors = ['#ff4646', '#ff7b7b', '#ffa0a0', '#ffc5c5', '#ffe5e5'];
        let gradient = '', angle = 0;
        
        data.ratings.forEach((item, i) => {
            if (item.count > 0) {
                const a = (item.percentage / 100) * 360;
                gradient += `${colors[4 - i]} ${angle}deg ${angle + a}deg, `;
                angle += a;
            }
        });
        
        const placeholder = pieChart.querySelector('.pie-placeholder');
        if (placeholder && gradient) {
            placeholder.style.background = `conic-gradient(${gradient.slice(0, -2)})`;
            placeholder.style.border = 'none';
        }
    }
}

function renderTopMovies(movies) {
    const container = document.getElementById('topMovies');
    if (!container) return;
    
    if (!movies.length) {
        container.innerHTML = '<p class="no-data-text">Нет данных</p>';
        return;
    }
    
    container.innerHTML = movies.map(m => `
        <div class="top-movie-item">
            <span class="rank">${m.rank}.</span>
            <span class="name">${m.title}</span>
            <span class="rating">${m.stars}</span>
        </div>
    `).join('');
}

function formatDate(str) {
    return new Date(str).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: '2-digit'
    });
}

// ============================================
// Страница всех фильмов
// ============================================

async function loadMoviesPage() {
    if (!isAuthenticated()) return;
    
    const filters = {
        type: document.getElementById('filterType')?.value || '',
        genre: document.getElementById('filterGenre')?.value || '',
        rating: document.getElementById('filterRating')?.value || '',
        sort: document.getElementById('sortBy')?.value || '',
        search: document.getElementById('searchInput')?.value || ''
    };
    
    try {
        const data = await getMovies(filters);
        renderMoviesList(data.movies || []);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function renderMoviesList(movies) {
    const container = document.getElementById('moviesList');
    if (!container) return;
    
    if (!movies.length) {
        container.innerHTML = '<p class="no-data-text">Нет фильмов</p>';
        return;
    }
    
    container.innerHTML = movies.map(m => `
        <div class="movie-card filled" data-id="${m.id}">
            <div class="movie-title">${m.title}</div>
            <div class="movie-type">${m.type_name}</div>
            <div class="movie-genre">${m.genre_name}</div>
            <div class="movie-rating">${'★'.repeat(m.rating)}${'☆'.repeat(5 - m.rating)}</div>
            <div class="movie-date">${formatDate(m.watch_date)}</div>
            ${m.review ? `<div class="movie-review">${m.review}</div>` : ''}
            <button class="btn-delete-movie" onclick="handleDeleteMovie(${m.id})">Удалить</button>
        </div>
    `).join('');
}

async function handleDeleteMovie(id) {
    if (!confirm('Удалить фильм?')) return;
    try {
        await deleteMovie(id);
        loadMoviesPage();
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
}

// ============================================
// Модальное окно
// ============================================

function openModal() {
    const modal = document.getElementById('allMoviesModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadAllMoviesModal();
    }
}

function closeModal() {
    const modal = document.getElementById('allMoviesModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function loadAllMoviesModal() {
    const grid = document.getElementById('allMoviesGrid');
    if (!grid) return;
    
    try {
        const data = await getMovies({});
        if (!data.movies?.length) {
            grid.innerHTML = '<p class="no-data-text">Нет фильмов</p>';
            return;
        }
        grid.innerHTML = data.movies.map(m => `
            <div class="movie-card filled">
                <div class="movie-title">${m.title}</div>
                <div class="movie-rating">${'★'.repeat(m.rating)}${'☆'.repeat(5 - m.rating)}</div>
            </div>
        `).join('');
    } catch {
        grid.innerHTML = '<p class="no-data-text">Ошибка загрузки</p>';
    }
}

// ============================================
// Инициализация
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Обновить header
    if (typeof updateHeader === 'function') {
        updateHeader();
    }
    
    // Главная страница
    if (document.getElementById('moviesContainer')) {
        loadMainPage();
        
        // Клик по красной области
        document.getElementById('moviesContainer')?.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-details')) openModal();
        });
    }
    
    // Страница фильмов
    if (document.getElementById('moviesList')) {
        loadMoviesPage();
        
        ['filterType', 'filterGenre', 'filterRating', 'sortBy'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', loadMoviesPage);
        });
        
        let timeout;
        document.getElementById('searchInput')?.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(loadMoviesPage, 300);
        });
    }
});

// Закрытие модального окна
document.getElementById('allMoviesModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'allMoviesModal') closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
