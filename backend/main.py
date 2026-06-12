from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl
import random
import string

from database import engine, get_db
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="URL Shortener", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---

class ShortenRequest(BaseModel):
    url: HttpUrl

class ShortenResponse(BaseModel):
    original_url: str
    short_url: str
    short_code: str

class StatsResponse(BaseModel):
    original_url: str
    short_code: str
    clicks: int
    created_at: str

# --- Helpers ---

def generate_code(length: int = 6) -> str:
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=length))

# --- Routes ---

@app.get("/")
def root():
    return {"message": "URL Shortener API is running"}

@app.post("/shorten", response_model=ShortenResponse)
def shorten_url(body: ShortenRequest, db: Session = Depends(get_db)):
    original = str(body.url)

    # Проверяем, не сокращали ли уже эту ссылку
    existing = db.query(models.URL).filter(models.URL.original_url == original).first()
    if existing:
        return ShortenResponse(
            original_url=existing.original_url,
            short_url=f"http://localhost:8000/{existing.short_code}",
            short_code=existing.short_code,
        )

    # Генерируем уникальный код
    for _ in range(10):
        code = generate_code()
        if not db.query(models.URL).filter(models.URL.short_code == code).first():
            break

    url_obj = models.URL(original_url=original, short_code=code)
    db.add(url_obj)
    db.commit()
    db.refresh(url_obj)

    return ShortenResponse(
        original_url=url_obj.original_url,
        short_url=f"http://localhost:8000/{url_obj.short_code}",
        short_code=url_obj.short_code,
    )

@app.get("/stats/{code}", response_model=StatsResponse)
def get_stats(code: str, db: Session = Depends(get_db)):
    url_obj = db.query(models.URL).filter(models.URL.short_code == code).first()
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short URL not found")

    return StatsResponse(
        original_url=url_obj.original_url,
        short_code=url_obj.short_code,
        clicks=url_obj.clicks,
        created_at=url_obj.created_at.strftime("%d.%m.%Y %H:%M"),
    )

@app.get("/{code}")
def redirect(code: str, db: Session = Depends(get_db)):
    url_obj = db.query(models.URL).filter(models.URL.short_code == code).first()
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short URL not found")

    url_obj.clicks += 1
    db.commit()

    return RedirectResponse(url=url_obj.original_url)
