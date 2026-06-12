const API = 'http://localhost:8000';

const urlInput   = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const errorMsg   = document.getElementById('errorMsg');
const result     = document.getElementById('result');
const shortLink  = document.getElementById('shortLink');
const copyBtn    = document.getElementById('copyBtn');
const statsClicks = document.getElementById('statsClicks');
const statsBtn   = document.getElementById('statsBtn');
const history    = document.getElementById('history');
const historyList = document.getElementById('historyList');

let currentCode = null;
const localHistory = JSON.parse(localStorage.getItem('urlHistory') || '[]');

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

function renderHistory() {
  if (localHistory.length === 0) return;
  history.classList.remove('hidden');
  historyList.innerHTML = '';
  [...localHistory].reverse().slice(0, 5).forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <span class="history-original" title="${item.original}">${item.original}</span>
      <a class="history-short" href="${item.short}" target="_blank">${item.code}</a>
    `;
    historyList.appendChild(li);
  });
}

async function shorten() {
  const url = urlInput.value.trim();
  if (!url) { showError('Введи ссылку'); return; }
  if (!url.startsWith('http')) { showError('Ссылка должна начинаться с http:// или https://'); return; }

  hideError();
  shortenBtn.disabled = true;
  shortenBtn.textContent = '...';

  try {
    const res = await fetch(`${API}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) throw new Error('Ошибка сервера');
    const data = await res.json();

    currentCode = data.short_code;
    shortLink.href = data.short_url;
    shortLink.textContent = data.short_url;
    result.classList.remove('hidden');

    // Обновляем статистику
    await updateStats();

    // Сохраняем в историю
    const exists = localHistory.find(i => i.original === data.original_url);
    if (!exists) {
      localHistory.push({ original: data.original_url, short: data.short_url, code: data.short_code });
      localStorage.setItem('urlHistory', JSON.stringify(localHistory));
    }
    renderHistory();

  } catch (e) {
    showError('Не удалось подключиться к серверу. Запущен ли backend?');
  } finally {
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Сократить';
  }
}

async function updateStats() {
  if (!currentCode) return;
  try {
    const res = await fetch(`${API}/stats/${currentCode}`);
    if (!res.ok) return;
    const data = await res.json();
    statsClicks.textContent = `👆 ${data.clicks} переходов`;
  } catch {}
}

// Копировать ссылку
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortLink.href).then(() => {
    copyBtn.textContent = '✓ Скопировано';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'Копировать';
      copyBtn.classList.remove('copied');
    }, 2000);
  });
});

// Обновить статистику
statsBtn.addEventListener('click', updateStats);

// Сократить по кнопке
shortenBtn.addEventListener('click', shorten);

// Сократить по Enter
urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') shorten();
});

// Инициализация истории
renderHistory();
