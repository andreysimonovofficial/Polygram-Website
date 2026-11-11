# Деплой Polygram на Cloudflare Pages

## Предварительные требования
- Node.js >= 18 (рекомендуется 20+)
- Akкаунт Cloudflare с доступом к Pages и Workers
- Домен `polygram.id` (DNS на Cloudflare)

## 1. Установка зависимостей
```bash
npm ci
```

## 2. Переменные окружения
Создайте файл `.env` (не коммититс¤) или задайте переменные в dashboard Cloudflare Pages:

| Переменная | Описание | Пример |
|---|---|---|
| `SMTP_HOST` | SMTP сервер для уведомлений (опционально) | `smtp.sendgrid.net` |
| `SMTP_PORT` | Порт SMTP | `587` |
| `SMTP_USER` | Логин SMTP | `apikey` |
| `SMTP_PASS` | Пароль/API-ключ SMTP | `SG.xxxx` |
| `SENDGRID_API_KEY` | Альтернатива SMTP — SendGrid | `SG.xxxx` |
| `RESEND_API_KEY` | Альтернатива — Resend | `re_xxxx` |
| `CF_PAGES_TOKEN` | Токен для CI/CD деплоя | из профиля Cloudflare |

Если SMTP не настроен, endpoint `/api/investor-lead` работает в режиме заглушки: лид печатается в `console.log` Workers.

## 3. Локальная разработка
```bash
npm run dev       # http://localhost:4321
npm run build     # сборка в dist/
npm run preview   # предпросмотр сборки
npm run typecheck # astro check (типы)
```

## 4. Сборка
```bash
npm run build
```
Результат: `dist/` (статика) + `dist/_worker.js` (server-функции, включая `/api/investor-lead`).

## 5. Деплой на Cloudflare Pages

### Способ А — через Git (рекомендуется)
1. Запушьте репозиторий на GitHub/GitLab.
2. В Cloudflare Dashboard → Pages → «Create a project» → подключите репозиторий.
3. Настройки сборки:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (или имя папки проекта)
4. Добавьте переменные окружения в «Settings → Environment variables» и «Production».
5. Подключите домен `polygram.id` в «Domains», включите TLS/HSTS.

### Способ Б — через Wrangler (CLI)
```bash
npm install -g wrangler
wrangler login
npx wrangler pages deploy dist --project-name=polygram
```

## 6. Cloudflare Worker (форма инвестора)
Endpoint `/api/investor-lead` реализован как Astro API-маршрут (`src/pages/api/investor-lead.ts`), который адаптер `@astrojs/cloudflare` превращает в Cloudflare Pages Function.

- Принимает `POST` с JSON `{ name, email, investmentAmount }`
- Валидирует все три поля (имя не пустое, email по regex, сумма >= 10000)
- Отправляет email-уведомление, если настроен SMTP/SendGrid/Resend, иначе `console.log`
- Возвращает JSON `{ success, message }` или `{ success: false, error, fields }`
- CORS-заголовки: `Access-Control-Allow-Origin: *`, `Allow-Methods: POST, OPTIONS`

## 7. Статические ассеты
- `public/_headers` — кэширование ассетов (1 год, immutable), HTML — перепроверка.
- `public/sitemap.xml`, `public/robots.txt` — в корне.
- `public/favicon/*` — иконки 16/32/180 px + ICO.
- `public/fonts/sf-pro-variable.woff2` — самхостинг шрифта, `font-display: swap` (замените на настоящие файлы SF Pro).
- `public/images/hero.webp`, `og-image.webp`, `poster.webp` — заглушки; замените на реальные изображения (hero 1920×1080, OG 1200×630, постер 1200×675, WebP, q85).
- `public/pitch-deck.pdf` — заглушка; положите настоящий pitch-deck.

## 8. Чек-лист перед публикацией
- [ ] Заменить placeholder-изображения на реальные WebP (герой, OG, постер видео).
- [ ] Положить настоящий `public/pitch-deck.pdf`.
- [ ] Заменить `public/fonts/sf-pro-variable.woff2` на реальные файлы SF Pro (или оставить системный фолбэк).
- [ ] Настроить SMTP/SendGrid/Resend для уведомлений от формы инвестора (иначе только console.log).
- [ ] Проверить `npm run build` и `npm run typecheck` без ошибок.
- [ ] Проверить Lighthouse: Performance, Accessibility, SEO > 90.
- [ ] Проверить форму инвестора: валидация, disabled-кнопка, подтверждение отправки.
- [ ] Проверить мобильное гамбургер-меню (< 768px).
- [ ] Проверить OG/Twitter картинки в соцсетях.
- [ ] Подключить домен `polygram.id` и включить HTTPS/HSTS.

## 9. Команда за один раз
```bash
npm ci
npm run build
# затем загрузить dist/ в Cloudflare Pages (через Git или wrangler)
'
