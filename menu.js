// ==========================================
// НАСТРОЙКИ И СОСТОЯНИЕ
// ==========================================
const settings = {
    music: {
        enabled: true,
        volume: 70
    },
    sfx: {
        enabled: true,
        volume: 80
    },
    graphics: {
        quality: 'medium',
        particles: true
    }
};

// ==========================================
// МОДАЛЬНЫЕ ОКНА
// ==========================================

// Получаем элементы
const modals = {
    login: document.getElementById('loginModal'),
    settings: document.getElementById('settingsModal'),
    about: document.getElementById('aboutModal')
};

const buttons = {
    play: document.getElementById('playBtn'),
    login: document.getElementById('loginBtn'),
    settings: document.getElementById('settingsBtn'),
    about: document.getElementById('aboutBtn')
};

const closeButtons = {
    login: document.getElementById('closeLogin'),
    settings: document.getElementById('closeSettings'),
    about: document.getElementById('closeAbout')
};

// Открытие модальных окон
buttons.login.onclick = () => openModal('login');
buttons.settings.onclick = () => openModal('settings');
buttons.about.onclick = () => openModal('about');

// Закрытие модальных окон
closeButtons.login.onclick = () => closeModal('login');
closeButtons.settings.onclick = () => closeModal('settings');
closeButtons.about.onclick = () => closeModal('about');

// Закрытие по клику вне окна
window.onclick = (event) => {
    Object.keys(modals).forEach(key => {
        if (event.target === modals[key]) {
            closeModal(key);
        }
    });
};

function openModal(modalName) {
    modals[modalName].style.display = 'block';
    playSound('menuOpen');
}

function closeModal(modalName) {
    modals[modalName].style.display = 'none';
    playSound('menuClose');
}

// ==========================================
// КНОПКА ИГРАТЬ
// ==========================================
buttons.play.onclick = () => {
    showLoading();
    playSound('gameStart');

    // Симуляция загрузки игры
    setTimeout(() => {
        hideLoading();
        // Здесь будет переход к игре
        window.location.href = 'game.html';
    }, 2000);
};

// ==========================================
// АВТОРИЗАЦИЯ
// ==========================================
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Login attempt:', { username, password });

    // Заглушка авторизации
    showNotification('🔧 Авторизация пока не работает (в разработке)', 'warning');

    // В будущем здесь будет запрос к серверу:
    /*
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('✅ Вход выполнен!', 'success');
            closeModal('login');
        }
    });
    */
};

document.getElementById('registerLink').onclick = (e) => {
    e.preventDefault();
    showNotification('🔧 Регистрация в разработке', 'warning');
};

// ==========================================
// НАСТРОЙКИ ЗВУКА
// ==========================================

// Музыка
const musicToggle = document.getElementById('musicToggle');
const musicVolume = document.getElementById('musicVolume');
const musicValue = document.getElementById('musicValue');

musicToggle.onchange = () => {
    settings.music.enabled = musicToggle.checked;
    showNotification(
        settings.music.enabled ? '🔊 Музыка включена' : '🔇 Музыка выключена',
        'info'
    );
};

musicVolume.oninput = () => {
    settings.music.volume = musicVolume.value;
    musicValue.textContent = musicVolume.value + '%';
};

// Звуковые эффекты
const sfxToggle = document.getElementById('sfxToggle');
const sfxVolume = document.getElementById('sfxVolume');
const sfxValue = document.getElementById('sfxValue');

sfxToggle.onchange = () => {
    settings.sfx.enabled = sfxToggle.checked;
    showNotification(
        settings.sfx.enabled ? '🔊 Звуки включены' : '🔇 Звуки выключены',
        'info'
    );
};

sfxVolume.oninput = () => {
    settings.sfx.volume = sfxVolume.value;
    sfxValue.textContent = sfxVolume.value + '%';
};

// Качество графики
const qualitySelect = document.getElementById('quality');
qualitySelect.onchange = () => {
    settings.graphics.quality = qualitySelect.value;
    showNotification(`🎨 Качество: ${qualitySelect.value}`, 'info');
};

// Частицы
const particlesToggle = document.getElementById('particlesToggle');
particlesToggle.onchange = () => {
    settings.graphics.particles = particlesToggle.checked;
    const particles = document.querySelector('.particles');
    particles.style.display = particlesToggle.checked ? 'block' : 'none';
};

// Сохранение настроек
document.getElementById('saveSettings').onclick = () => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    showNotification('✅ Настройки сохранены!', 'success');
    closeModal('settings');
    console.log('Settings saved:', settings);
};

// ==========================================
// ЗАГРУЗКА НАСТРОЕК ИЗ localStorage
// ==========================================
function loadSettings() {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
        const loadedSettings = JSON.parse(saved);
        Object.assign(settings, loadedSettings);

        // Применяем настройки к элементам
        musicToggle.checked = settings.music.enabled;
        musicVolume.value = settings.music.volume;
        musicValue.textContent = settings.music.volume + '%';

        sfxToggle.checked = settings.sfx.enabled;
        sfxVolume.value = settings.sfx.volume;
        sfxValue.textContent = settings.sfx.volume + '%';

        qualitySelect.value = settings.graphics.quality;
        particlesToggle.checked = settings.graphics.particles;

        document.querySelector('.particles').style.display =
            settings.graphics.particles ? 'block' : 'none';
    }
}

// ==========================================
// УТИЛИТЫ
// ==========================================

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('mainMenu').style.opacity = '0.3';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('mainMenu').style.opacity = '1';
}

function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'warning' ? '#ff6b35' : '#00d4ff'};
        color: #0a0e27;
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function playSound(soundName) {
    if (!settings.sfx.enabled) return;

    // Заглушка для звуков
    console.log('🔊 Playing sound:', soundName, 'volume:', settings.sfx.volume);

    // В будущем здесь будет воспроизведение реальных звуков:
    /*
    const audio = new Audio(`assets/sounds/${soundName}.mp3`);
    audio.volume = settings.sfx.volume / 100;
    audio.play();
    */
}

// Симуляция онлайн игроков
function updatePlayerCount() {
    const count = Math.floor(Math.random() * 50) + 10;
    document.getElementById('playerCount').textContent = `Online: ${count}`;
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updatePlayerCount();
    setInterval(updatePlayerCount, 30000); // Обновляем каждые 30 сек

    console.log('🎮 SKYHILL Menu loaded');
    console.log('Settings:', settings);
});

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
