// КиноКритик - API (без токенов, через cookies)

const API_URL = '/api';

// Простой запрос к API
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        credentials: 'include'  // Важно для cookies!
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Ошибка');
    }
    
    return data;
}

// Авторизация
async function register(username, email, password) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    });
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

async function login(username, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

function logout() {
    apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function isAuthenticated() {
    return !!getUser();
}

// Фильмы
async function getMovies(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    const q = params.toString();
    return await apiRequest(q ? `/movies?${q}` : '/movies');
}

async function getRecentMovies() {
    return await apiRequest('/movies/recent');
}

async function addMovie(data) {
    return await apiRequest('/movies', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function deleteMovie(id) {
    return await apiRequest(`/movies/${id}`, { method: 'DELETE' });
}

// Статистика
async function getGeneralStats() {
    return await apiRequest('/stats/general');
}

async function getMonthlyStats() {
    return await apiRequest('/stats/monthly');
}

async function getRatingsDistribution() {
    return await apiRequest('/stats/ratings');
}

async function getTopMovies() {
    return await apiRequest('/stats/top');
}

// UI
function updateHeader() {
    const el = document.getElementById('usernameDisplay');
    const icon = document.getElementById('accountIcon');
    const user = getUser();
    
    if (el) el.textContent = user?.username || '';
    
    if (icon && user) {
        icon.href = '#';
        icon.onclick = (e) => {
            e.preventDefault();
            if (confirm('Выйти?')) logout();
        };
    }
}
