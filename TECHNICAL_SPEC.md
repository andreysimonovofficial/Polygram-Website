# Техническая спецификация: лендинг Polygram (инвесторская направленность)

**Статус:** черновик / план реализации  
**Источник:** монолит `C:\Dev\Polygram-Website/index.html` (HTML+CSS+JS inline)  
**Цель:** продакшен-лендинг, PageSpeed >90 (мобильная), FCP < 2 сек, редактируемый контент, OG/фavicon/аналитика.

---

## 1. Выбор стека (обоснование)

### Рекомендуемый стек: Astro (static islands) + Cloudflare Pages + Workers

| Критерий | Astro + CF Pages | Чистый стат. HTML/JS | 11ty / Hugo | Next.js (SSR) |
|---|---|---|---|---|
| PageSpeed мобильный | ????? (0 JS по умолчанию) | ????? | ????? | ????? |
| Загрузка < 2 сек | Да (острова гидратации) | Да | Да | Требует оптимизации |
| Деплой | `git push` > CF Pages (авто) | `git push` > CF Pages | `git push` > CF Pages | Node adapter, тяжелее |
| Контент без пересборки | Workers KV / D1 + edge | Нет | Нет | Edge/ISR, сложно |
| OG / теги / favicon | Нативно в Layout | Вручную | Вручную | `next/head` |

**Почему не Next.js:** лендинг без динамических маршрутов и авторизации. SSR избыточен, увеличивает бандл и усложняет деплой на Cloudflare Pages. Astro даёт тот же HTML-first результат с меньшим JS.

**Почему не чистый HTML/JS:** 798 строк в одном файле не поддерживать. Astro даёт компонентную декомпозицию без ущерба для PageSpeed.

**Контент без пересборки:** базовый вариант — контент в `src/content/*.json` + MDX (коммит > Pages пересобирается за секунды). Для истинного «без пересборки» — Cloudflare Workers KV/D1 + edge-функция, фронтенд подтягивает JSON. Начать с JSON в репо, KV добавить позже.

**Версии (пример):** `astro: ^4.15.0`, `@astrojs/cloudflare: ^10.0.0`, `lucide: 0.408.0` (точно, не `@latest`).

---

## 2. Структура файлов проекта

```
polygram/
+-- astro.config.mjs
+-- package.json
+-- wrangler.toml
+-- tailwind.config.mjs        # опционально
+-- postcss.config.mjs
+-- src/
¦   +-- content/
¦   ¦   +-- config.ts
¦   ¦   +-- investors.json
¦   ¦   L-- sections/
¦   ¦       +-- hero.json / about.json / faq.json
¦   +-- components/
¦   ¦   +-- BaseLayout.astro   # <html>, OG, favicon, шрифты
¦   ¦   +-- Header.astro       # липкий хэдер, лого, навигация, CTA
¦   ¦   +-- MobileMenu.astro   # гамбургер + оверлей
¦   ¦   +-- Hero.astro / Cards.astro / VsGrid.astro / Footer.astro
¦   ¦   +-- InvestorForm.astro # форма заявки инвестора
¦   ¦   L-- LucideIcon.astro   # обёртка над lucide (fixed version)
¦   +-- pages/
¦   ¦   L-- index.astro
¦   +-- styles/
¦   ¦   L-- global.css         # токены, сброс, breakpoints
¦   L-- scripts/
¦       +-- scroll.js          # плавный скролл + оффсет якоря
¦       +-- nav.js             # хэдер скролл, мобильное меню
¦       L-- form.js            # отправка формы инвестора (fetch)
+-- public/
¦   +-- favicon/
¦   ¦   +-- favicon.ico / favicon-16x16.png / favicon-32x32.png
¦   ¦   +-- apple-touch-icon.png (180x180) / site.webmanifest
¦   +-- images/
¦   ¦   +-- hero.webp (1920x1080, q85) / og-image.webp (1200x630, q85)
¦   ¦   L-- *.webp / *.webm
¦   +-- fonts/
¦   ¦   +-- inter-var.woff2 / inter.css
¦   +-- sitemap.xml / robots.txt
+-- .wrangler/
L-- README.md
```

**Breakpoints (CSS):** `--bp-mobile: 767px; --bp-tablet: 1023px; --bp-desktop: 1024px;`  
`.container { max-width: 1024px; padding: 0 20px; margin: 0 auto; }`  
Мобильный-first: 1 колонка < 768px, 2 колонки 768–1023px, 3–4 > 1024px.

---

## 3. План миграции из монолитного index.html

1. **Этап 0 — сохранить контент.** Скопировать весь текст из `index.html` в `src/content/sections/*.json` (hero, about, problem, extensions, model, refs, cta, footer). Исходник не удалять до пуша релиза.
2. **Этап 1 — скелет Astro.** `npm create astro@latest -- --template minimal`, добавить `@astrojs/cloudflare`, перенести токены `:root` в `src/styles/global.css`.
3. **Этап 2 — компоненты.** Вынести хэдер, навигацию, секции, футер в `src/components/*.astro`, собрать `pages/index.astro`. Сохранить те же классы CSS.
4. **Этап 3 — мета и ассеты.** Перенести title, description, OG, Twitter, favicon, theme-color в `BaseLayout.astro`. Добавить `sitemap.xml`, `robots.txt` в `public/`.
5. **Этап 4 — скрипты.** Инлайновый JS > `src/scripts/*.astro` (`defer`). Заменить `unpkg.com/lucide@latest` на `lucide` с фиксированной версией.
6. **Этап 5 — форма.** `InvestorForm.astro` с `fetch` на Workers endpoint / Formspree.
7. **Этап 6 — сборка и diff.** `npm run build`, сравнить старый и новый `index.html` по тексту. Проверить PageSpeed.
8. **Этап 7 — деплой.** Подключить репозиторий к Cloudflare Pages, переменные окружения (FORM_ENDPOINT, ANALYTICS_ID), релиз.

Старый `index.html` оставить в ветке `legacy/monolith` до подтверждения работоспособности.

---

## 4. Реализация фич (примеры кода)

### 4.1 BaseLayout (OG, Twitter, favicon, theme-color, шрифты)

```astro
---
export interface Props { title?: string; description?: string; ogImage?: string; }
const { title = 'Polygram', description = '...', ogImage = '/images/og-image.webp' } = Astro.props;
const canonical = `https://polygram.id${Astro.url.pathname}`;
---
<!DOCTYPE html>
<html lang="ru" class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | polygram.id</title>
    <meta name="description" content={description} />
    <meta name="theme-color" content="#000000" />
    <link rel="canonical" href={canonical} />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="Polygram" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Polygram" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@polygram" />
    <meta name="twitter:creator" content="@polygram" />
    <meta name="twitter:image" content={ogImage} />
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <!-- Preconnect + preload шрифта (self-hosted, font-display: swap) -->
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossorigin="anonymous" />
    <noscript><link rel="stylesheet" href="/fonts/inter.css" /></noscript>
    <link rel="stylesheet" href="/styles/global.css" />
    <script>
      document.documentElement.classList.remove('no-js');
      document.documentElement.classList.add('js');
    </script>
  </head>
  <body>
    <slot />
    <script defer src="/scripts/main.js"></script>
  </body>
</html>
```

`public/fonts/inter.css`:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}
```

### 4.2 Липкий хэдер + оффсет якоря + плавный скролл

CSS:
```css
header { position: sticky; top: 0; z-index: 1000; height: 56px; backdrop-filter: blur(20px); background: rgba(0,0,0,0.8); border-bottom: 1px solid rgba(255,255,255,0.08); }
header.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
```

JS (`src/scripts/scroll.js`):
```js
const OFFSET = 80;
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) window.scrollTo({ top: target.offsetTop - OFFSET, behavior: 'smooth' });
  });
});
window.addEventListener('scroll', () => {
  document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 10);
});
```

### 4.3 Мобильное меню (гамбургер)
Кнопка гамбургер скрыта на десктопе, показана < 768px. При клике открывается оверлей со списком; клик по ссылке / клик вне меню / ESC закрывают menu (обработка в `nav.js`).

### 4.4 lucide иконки (фиксированная версия)
Не подключать `unpkg.com/lucide@latest`. Установить `lucide@0.408.0` и рендерить через компонент `LucideIcon.astro` (импорт `lucide-static/icons/<name>`), гидратировать островом `client:load` только там, где нужна интерактивность.

### 4.5 Форма заявки инвестора
```astro
<form id="investor-form" action="/api/investor-lead" method="POST" novalidate>
  <label><input type="text" name="name" placeholder="Имя" required /></label>
  <label><input type="email" name="email" placeholder="Рабочий email" required /></label>
  <label><input type="text" name="company" placeholder="Компания / фонд" /></label>
  <label><textarea name="message" placeholder="Кратко о проекте / инвестиции"></textarea></label>
  <button type="submit">Отправить заявку</button>
  <p id="form-status" class="sr-only" aria-live="polite"></p>
</form>
```
`src/scripts/form.js` отправляет `fetch` с `FormData`, показывает статус в `aria-live` region, сбрасывает форму при succes.

---

## 5. План производительности (Core Web Vitals)

| Мера | Реализация | Эффект |
|---|---|---|
| Критический CSS inline | Astro инлайнит `<style>` из `.astro` файлов автоматически | FCP v |
| Отложенный JS | `<script defer src="/scripts/main.js">`, нет блокирующих скриптов в `<head>` | TBT v |
| Предзагрузка шрифта | `<link rel="preload" as="font" ...>` + `font-display: swap` | LCP/CLS v |
| Картинки WebP + размеры | hero `1920x1080`, og `1200x630`, карточки до `480x360`; `loading="lazy"` ниже хедера, `width/height` | LCP/CLS v |
| astro:assets | `<Image ... widths={[480,768,1024]} format="webp" quality={85} />` | Адаптив + сжатие |
| Видео WebM | `.webm`, `<video preload="none" poster="...webp">` | Трафик v |
| Кэширование Cloudflare | Pages CDN; `_headers`: ассеты `max-age=31536000, immutable`; HTML `max-age=0, must-revalidate` | Повторные загрузки v |
| Preconnect | шрифты, API, аналитика | Подключение v |

`public/_headers`:
```
/assets/*   Cache-Control: public, max-age=31536000, immutable
/fonts/*    Cache-Control: public, max-age=31536000, immutable
/images/*   Cache-Control: public, max-age=31536000, immutable
/sitemap.xml Cache-Control: public, max-age=3600
/robots.txt Cache-Control: public, max-age=86400
```

---

## 6. Рекомендация по хостингу и домену

**Основной:** Cloudflare Pages (уже есть `.wrangler`, аккаунт `641b36eab520bb85caa5b19d0e7277d4`, проект `polygram`). Авто-деплой из Git, глобальный CDN, Edge-Workers для формы и динамического контента, бесплатный тариф.

**Альтернативы:** Vercel (хороший DX, но платный для коммерческих проектов), Netlify (удобные формы, меньше интеграции с Workers KV), GitHub Pages (бесплатно, но нет edge-функций для формы без стороннего сервиса).

**Домен:** `polygram.id` — DNS на Cloudflare, A/CNAME на Pages, TLS автоматически, HSTS включить в dashboard.

---

## 7. Аналитика и обработка формы

**Аналитика (выбрать одну):**
- Plausible — лёгкий (~1 KB), куки-less, GDPR-friendly (рекомендуется для инвесторского лендинга).
- Umami — самохостинг, полный контроль над данными.
- GA4 — тяжёлый, много JS, хуже для PageSpeed (только если уже есть аккаунт и Google Ads).

Пример Plausible:
```html
<script defer data-domain="polygram.id" src="https://plausible.io/js/script.js"></script>
```

**Форма заявки инвестора:**
1. Собственный Cloudflare Workers endpoint `/api/investor-lead` — приём лида, email через SendGrid/Resend/Mailgun, запись в KV/D1 (рекомендуется).
2. Formspree — быстрый старт, HTML `<form action="https://formspree.io/f/...">`, бесплатный тариф ограничен.
3. Netlify Forms — только при хостинге на Netlify.

---

## 8. Чек-лист запуска

**SEO**
- [ ] ???? и meta description уникальны на страницу
- [ ] OG + Twitter Card с og-image 1200x630 WebP
- [ ] `sitemap.xml`, `robots.txt` в корне
- [ ] Canonical URL, `lang="ru"`, `og:locale="ru_RU"`
- [ ] Семантика: `<header>`, `<section>`, `<footer>`, один `<h1>`

**GEO (AI-search оптимизация)**
- [ ] Чёткие H1/H2/H3, списки, FAQ-блок
- [ ] JSON-LD: `Organization`, `WebSite`, `FAQPage`
- [ ] Человекочитаемые URLs, контент в чистом HTML (без JS-рендеринга)

**Аналитика**
- [ ] Счётчик установлен и срабатывает (режим отладки)
- [ ] Цель «отправка формы инвестора» настроена

**Мобильное тестирование**
- [ ] Lighthouse мобильный: Performance ? 90, Accessibility ? 90, SEO ? 90, Best Practices ? 90
- [ ] FCP < 2 сек на Slow 3G
- [ ] Гамбургер открывается/закрывается, ESC закрывает, клик вне меню закрывает
- [ ] Тапы ? 44x44 px, нет случайных hover на тач

**Accessibility (a11y)**
- [ ] Контраст ? 4.5:1 (WCAG AA)
- [ ] Фокус-выделение видно (`:focus-visible`)
- [ ] `aria-label`, `aria-live="polite"` у статуса формы
- [ ] `<label>` для каждого `<input>`, `required` с валидацией
- [ ] Ссылка «skip to content» для клавиатуры

---

## package.json (пример)

```json
{
  "name": "polygram-website",
  "version": "1.0.0",
  "private": true,
  "packageManager": "npm@10.8.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint --ext .astro,.js src/",
    "typecheck": "astro check"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/cloudflare": "^10.0.0",
    "lucide": "0.408.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.17.0"
  }
}
```

## astro.config.mjs (пример)

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://polygram.id',
  trailingSlash: 'never',
  prefetch: { defaultStrategy: 'hover' },
  image: { quality: 85, sizes: [480, 768, 1024, 1280, 1920] },
});
```

## wrangler.toml (пример)

```toml
name = "polygram"
compatibility_date = "2026-11-01"
workers_dev = false

[site]
bucket = "./dist"
entry-point = "workers/pages"

[env.production]
account_id = "641b36eab520bb85caa5b19d0e7277d4"
project_name = "polygram"
routes = { include = "polygram.id/*" }

[observability]
enabled = true
```

Далее: инициализировать Astro, перенести контент, собрать `pages/index.astro`, подключить к Cloudflare Pages, прогнать Lighthouse.
