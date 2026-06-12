# 🔗 URL Shortener

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Fullstack сервис для сокращения ссылок — аналог bit.ly

</div>

---

## ✨ Возможности

- 🔗 Сокращение любых URL одним кликом
- 📊 Статистика переходов по каждой ссылке
- 🔁 Повторный запрос той же ссылки возвращает уже существующий код
- 🕓 История последних 5 ссылок в браузере
- ⚡ Мгновенный редирект

---

## 🛠️ Стек

| Слой | Технологии |
|------|-----------|
| Backend | Python, FastAPI, SQLAlchemy, SQLite |
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| API | REST, JSON |

---

## 🚀 Запуск

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API будет доступен на `http://localhost:8000`

Документация: `http://localhost:8000/docs` (Swagger UI — автоматически)

### Frontend

Открой `frontend/index.html` в браузере — и готово, никаких сборщиков.

---

## 📡 API

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/shorten` | Сократить ссылку |
| `GET` | `/{code}` | Редирект на оригинальную ссылку |
| `GET` | `/stats/{code}` | Статистика переходов |

### Пример запроса

```bash
curl -X POST http://localhost:8000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/xmiroxxx142"}'
```

### Ответ

```json
{
  "original_url": "https://github.com/xmiroxxx142",
  "short_url": "http://localhost:8000/aB3xYz",
  "short_code": "aB3xYz"
}
```

---

## 📁 Структура проекта

```
url-shortener/
├── backend/
│   ├── main.py          — FastAPI приложение, роуты
│   ├── models.py        — SQLAlchemy модели
│   ├── database.py      — подключение к БД
│   └── requirements.txt
├── frontend/
│   ├── index.html       — разметка
│   ├── style.css        — стили
│   └── script.js        — логика, fetch запросы
└── README.md
```

---

## 👨‍💻 Автор

**Леонид** — [@xmiroxxx142](https://github.com/xmiroxxx142)
