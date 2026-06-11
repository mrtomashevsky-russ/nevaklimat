# НеваКлимат

Production-версия лендинга по продаже и установке кондиционеров в Санкт-Петербурге.

## Стек

- Next.js App Router + TypeScript
- React client components только там, где нужна интерактивность
- CSS перенесён из прототипа в `src/app/globals.css`
- Шрифты Onest и Unbounded через `next/font`
- PostgreSQL для заявок
- Telegram/email/CRM-интеграции через ENV

## Запуск локально

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run db:migrate
npm run dev
```

Если локально нет `psql`, используйте:

```bash
npm run db:migrate:docker
```

Сайт откроется на `http://localhost:3000`.

Варианты hero:

- `/?v=v1` — акция и таймер
- `/?v=v2` — квиз-подбор
- `/?v=v3` — скорость установки

Квиз: `http://localhost:3000/quiz`.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Postgres автоматически применит `migrations/001_init.sql` при первом создании volume.

## ENV

Основные переменные:

- `NEXT_PUBLIC_BRAND_PHONE`, `NEXT_PUBLIC_BRAND_PHONE_HREF`
- `NEXT_PUBLIC_BRAND_TG`, `NEXT_PUBLIC_BRAND_MAX`
- `NEXT_PUBLIC_HERO_IMAGE`
- `NEXT_PUBLIC_DEFAULT_VARIANT`
- `NEXT_PUBLIC_YM_ID`, `NEXT_PUBLIC_GA_ID`
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `LEAD_EMAIL_TO`
- `LEAD_RATE_LIMIT_PER_MIN`, `LEAD_MIN_FILL_MS`
- `CAPTCHA_PROVIDER`, `CAPTCHA_SECRET`, `CAPTCHA_THRESHOLD`
- `CRM_PROVIDER`, `BITRIX_WEBHOOK_URL`, `AMOCRM_WEBHOOK_URL`

## Заявки

Все формы отправляют `POST /api/lead`.

Минимальное тело:

```json
{ "phone": "+7 (812) 123-45-67" }
```

Расширенное тело включает `source`, `payload`, `rec`, `utm`, `page`, `referrer`, `ts`, honeypot-поле `website` и `startedAt`.

Сервер:

1. Ограничивает частоту по IP.
2. Отсекает honeypot и слишком быструю отправку.
3. Опционально проверяет reCAPTCHA v3 или Yandex SmartCaptcha.
4. Нормализует российский телефон и возвращает `422` для невалидного номера.
5. Сохраняет заявку в PostgreSQL.
6. Отправляет уведомления в Telegram/email.
7. Вызывает CRM-адаптер и заготовку офлайн-конверсий.

## Контент

Контент и конфиг находятся в одном месте: `src/config/site.ts`.

Там меняются:

- телефон и ссылки связи
- бренды техники
- пакеты и цены
- отзывы
- FAQ
- hero-изображение
- варианты лендинга

## Production-проверка

```bash
npm run build
npm run start
```

После запуска проверьте Lighthouse на mobile. Для performance важно заменить placeholder `NEXT_PUBLIC_HERO_IMAGE` на оптимизированное реальное фото монтажа и держать изображения в WebP/AVIF.
