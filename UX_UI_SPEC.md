# Polygram — UX/UI спецификация инвесторского лендинга

Статус: готово к вёрстке. Верстать один в один по значениям ниже.
Язык сайта: русский. Шрифты: системные + SF Pro Display / SF Pro Text (fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).

---

## 1. Дизайн-система

### 1.1 Цветовая палитра (CSS переменные)

```css
:root {
  /* База — тёмная, от текущего сайта */
  --bg: #000000;
  --bg-secondary: #0a0a0a;
  --bg-tertiary: #121212;
  --bg-elevated: rgba(10, 10, 10, 0.85);

  /* Границы и разделители */
  --border: #1a1a1a;
  --border-hover: #333333;
  --border-focus: #2997ff;

  /* Текст */
  --text: #f5f5f7;
  --text-secondary: #86868b;
  --text-tertiary: #4b4b4f;
  --text-inverse: #000000;

  /* Акцент инвестора — глубокий синий (Tesla/SpaceX линейка), не неоновый */
  --accent: #2997ff;
  --accent-hover: #5ac8fa;
  --accent-glow: rgba(41, 151, 255, 0.15);

  /* Инвестиционный акцент — золото для ключевых метрик и первичной CTA */
  --invest-gold: #c5a059;
  --invest-gold-hover: #d4b07a;

  /* Семантические цвета */
  --success: #34d399;
  --danger: #ff3b30;
  --warning: #ffb020;

  /* Радиусы */
  --radius: 24px;
  --radius-lg: 32px;
  --radius-md: 16px;
  --radius-sm: 12px;
  --radius-xs: 8px;
  --radius-pill: 9999px;

  /* Тени */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  --shadow-md: 0 10px 20px rgba(0,0,0,0.3);
  --shadow-lg: 0 20px 40px rgba(0,0,0,0.4);
  --shadow-xl: 0 30px 60px rgba(0,0,0,0.5);

  /* Анимации */
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --fast: 0.2s var(--ease);
  --base: 0.4s var(--ease);
  --slow: 0.6s var(--ease);

  /* Контейнер */
  --container-max: 1024px;
  --header-height: 56px;
  --anchor-offset: 80px; /* высота хедера + отступ */
}
```

### 1.2 Типографика

| Элемент | Семейство | Размер | Жирность | interline | letter-spacing | Цвет |
|---|---|---|---|---|---|---|
| Hero H1 | SF Pro Display | clamp(3rem, 8vw, 5rem) | 600 | 1.02 | -0.03em | var(--text) |
| Section H2 | SF Pro Display | clamp(2rem, 3vw, 3rem) | 600 | 1.1 | -0.02em | var(--text) |
| Section H3 | SF Pro Display | clamp(1.5rem, 2vw, 1.75rem) | 600 | 1.2 | -0.01em | var(--text) |
| Eyebrow | SF Pro Text | 0.85rem | 600 | 1.4 | 0.08em | var(--text-secondary) |
| Body | SF Pro Text | 1rem | 400 | 1.6 | 0 | var(--text-secondary) |
| Small | SF Pro Text | 0.85rem | 400 | 1.5 | 0 | var(--text-tertiary) |
| Label form | SF Pro Text | 0.85rem | 500 | 1.4 | 0.05em | var(--text) |
| Metric number | SF Pro Display | clamp(2rem, 4vw, 3rem) | 700 | 1.05 | -0.02em | var(--text) |
| Metric label | SF Pro Text | 0.85rem | 500 | 1.4 | 0.1em | var(--text-secondary) |

CSS классы:

```css
.text-eyebrow {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
}
.text-h1 { font-family: 'SF Pro Display', sans-serif; font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.text-h2 { font-family: 'SF Pro Display', sans-serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; }
.text-h3 { font-family: 'SF Pro Display', sans-serif; font-weight: 600; line-height: 1.2; letter-spacing: -0.01em; }
.text-body { font-size: 1rem; line-height: 1.6; font-weight: 400; }
.text-metric { font-family: 'SF Pro Display', sans-serif; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; }
```

### 1.3 Отступы (spacing scale)

```css
.section { padding: 120px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.section:last-child { border-bottom: none; }
.section-head { text-align: center; margin-bottom: 80px; }
.section-head h2 { margin-bottom: 16px; }
.section-head p { max-width: 560px; margin: 0 auto; color: var(--text-secondary); font-size: 1.15rem; font-weight: 400; }

.container { max-width: var(--container-max); margin: 0 auto; padding: 0 20px; position: relative; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
```

### 1.4 Радиусы и тени (уже в переменных выше)

Карточка по умолчанию:

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  transition: var(--base);
  position: relative;
}
```

### 1.5 Анимации

- Все переходы: `var(--base)` или `var(--fast)`.
- Вход секции: `opacity: 0 → 1`, `transform: translateY(20px) → 0`, duración `0.6s var(--ease)`, старт при пересечении viewport (Intersection Observer, `threshold: 0.1`).
- Без шума, без скачков, без лишних эффектов. Плавно и приглушённо.

---

## 2. Wireframe-описание секций (по порядку)

Все секции обёрнуты в `<section class="section" id="...">` с `<div class="container">`.

### 2.1 Hero (id="hero")

Above the fold. Текстовый герой без изображения (bold typography по тренду 2026).

**Элементы:**
- Eyebrow: `.hero-eyebrow` — "Версия 1.0 • polygram.id", цвет `var(--text-tertiary)`, размер 0.85rem, жирность 500, `letter-spacing: 0.08em`, `text-transform: uppercase`, `margin-bottom: 16px`.
- H1: `.hero h1` — `clamp(3rem, 8vw, 5rem)`, жирность 600, `line-height: 1.02`, `letter-spacing: -0.03em`, цвет `var(--text)`. По одной строке, без переноса посередине фразы. Акцентная часть оборачивается в `<span class="accent">` с градиентом текста `linear-gradient(to bottom, var(--text) 60%, var(--text-secondary) 100%)`, `-webkit-background-clip: text`, `-webkit-text-fill-color: transparent`.
- Subheadline: `.hero p` — `clamp(1.1rem, 1.5vw, 1.35rem)`, цвет `var(--text-secondary)`, `max-width: 640px`, `margin: 0 auto 40px`, жирность 400, `line-height: 1.6`.
- CTA группа: `.hero-actions`, `display: flex`, `gap: 12px`, `justify-content: center`, `flex-wrap: wrap`.
  - Первичная CTA: `.btn-invest` — `padding: 0 32px`, `height: 52px`, `border-radius: var(--radius-md)`, фон `linear-gradient(to bottom, #1d1d1d, #0a0a0a)`, `border: 1px solid var(--border)`, цвет `var(--text)`, жирность 500, размер 0.95rem, `text-decoration: none`, `box-shadow: var(--shadow-md)`. Ховер: `border-color: var(--border-hover)`, фон `#2a2a2a → #121212`, `transform: translateY(-2px)`.
  - Вторичная: `.btn-demo` — прозрачный, `border: 1px solid var(--border)`, цвет `var(--text-secondary)`, ховер: `border-color: var(--text-secondary)`, `color: var(--text)`.

**CTA:** одна первичная `.btn-invest` ("Получить pitch-deck" / "Инвестировать"), повторяется при скролле в липком блоке.

### 2.2 Problem / Solution (id="problem")

Два блока рядом (десктоп), один столбец (мобилка).

**Левая половина — Проблема** (`.vs-half.problem`):
- Eyebrow красный: `color: var(--danger)` — "Проблема".
- H3: "Статичность и фрагментация", цвет `var(--text)`.
- 3 абзаца `.text-body`, цвет `var(--text-tertiary)`:
  1. "Обычные диаграммы остаются «просто рисунками», не связанными с реальными процессами и исполнителями."
  2. "Команды переключаются между 5–10 сервисами (Miro, Notion, Jira, No-code платформы)."
  3. "Классические дашборды и ERP копят усталость, а не дают ясность."

**Правая половина — Решение** (`.vs-half.solution`):
- Eyebrow акцент: `color: var(--accent)` — "Решение".
- H3: "Живая визуальная карта", цвет `var(--text)`.
- 2 абзаца `.text-body`:
  1. "Пользователь собирает понятную визуальную карту, которая сразу становится реальной системой с агентами и автоматизациями."
  2. "Результат — снижение фрагментации, увеличение КПД, полная автоматизация."

CSS: `.vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }`

### 2.3 Product / CAD+MCP diagram (id="product")

Интерактивный продуктовый демо прямо на странице — не абстрактные иллюстрации, а скриншот/видео реального интерфейса Polygram (граф, холст, узлы).

**Структура:**
- Section head центрирован (eyebrow "Продукт", H2 "CAD-ядро + MCP: как это работает", p).
- Видеоблок `.product-video` на 60% ширины контейнера слева, текст справа (десктоп). На мобилке — видео сверху на всю ширину, текст снизу.
- Видео: `<video class="demo-video" controls preload="metadata" poster="...">`, `<source src="..." type="video/webm">`, `width: 100%`, `height: auto`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-xl)`, `background: #000`.
- Постер: кадр с графом/холстом, WebP, 1200×675.
- Правая колонка `.product-copy`: 3 коротких пункта с иконками Lucide (размер 20px, цвет `var(--text-secondary)`), каждый — H4 (0.95rem, жирность 600, цвет `var(--text)`) + описание (0.95rem, цвет `var(--text-secondary)`).
- Ниже — маленький CTA `.btn-demo` "Посмотреть демо".

### 2.4 Business Model (id="model")

Bento grid из 6 карточек (2×3 десктоп, 1 столбец мобилка).

Карточки:
1. "ИИ серверы" — продажа, аренда и обслуживание.
2. "ИИ корпорация из коробки" — готовое решение + персональная поддержка.
3. "Облачная версия Премиум" — трансляция интерактивной картинки в реальном времени.
4. "Инвестиционная платформа" — прямые инвестиции в ИИ корпорации пользователей.
5. "Валюта Polys" — ИИ кредиты, комиссия за переводы.
6. "Расширения и спонсорство" — роялти за коммерческий форк.

Каждая карточка: иконка Lucide в `.icon-box` (48×48, `border-radius: var(--radius-md)`, фон `linear-gradient(135deg, #161616, #0e0e0e)`, `border: 1px solid var(--border)`), H3 1.25rem жирность 600, описание 0.95rem цвет `var(--text-secondary)`.

Ниже блока — honesty note: "Все цифры актуальны на дату релиза сайта. Подробности — в pitch-deck."

### 2.5 Traction & Metrics (id="traction")

Блок тракции раннее, для доверия.

**Структура:**
- Section head: eyebrow "Тракция", H2 "Рост и метрики", p.
- Сетка метрик `.metric-grid` (4 колонки десктоп, 2 мобилка):
  - ARR — число (например, $1.2M), подпись "Годовая повторяемая выручка".
  - NRR — процент (например, 125%), подпись "Чистое удержание выручки".
  - Клиенты — число (например, 480+), подпись "Активных корпоративных клиентов".
  - Рост — процент/раз (например, 3× QoQ), подпись "Квартальный рост пользователей".
- Каждая метрика: `.metric-card` — фон `var(--bg-tertiary)`, `border: 1px solid var(--border)`, `border-radius: var(--radius)`, padding 24px, число `var(--text)` крупное (clamp(2rem, 4vw, 3rem), жирность 700), подпись `var(--text-secondary)` 0.85rem жирность 500 `letter-spacing: 0.1em text-transform: uppercase`.
- Ниже — 3 горизонтальных кейса `.case-row`: логотип клиента (или инициалы в круге), заголовок кейса, resultado (цифра), стрелка вправо.

### 2.6 Unfair Advantage (id="advantage")

Одна колонка, центрированный текст + 3 иконки в ряд.

- H2: "Несправедливое преимущество".
- Текст 1.15rem цвет `var(--text-secondary)`, max-width 640px.
- Три принципа:
  1. CAD-ядро не меняется при добавлении расширений (изоляция кода).
  2. Мышь, клавиатура и MCP используют один механизм команд.
  3. Расширения живут в отдельных репозиториях, не влияют на ванильный CAD.

### 2.7 Team (id="team")

Сетка 3×2 карточек участников (или столько, сколько есть).

Каждая карточка `.team-card`:
- Аватар: квадрат 120×120, `border-radius: var(--radius-lg)`, `object-fit: cover`, `border: 1px solid var(--border)`, фон `var(--bg-secondary)`.
- Имя: H3 1.25rem цвет `var(--text)`.
- Должность: 0.9rem цвет `var(--text-secondary)`.
- Краткое описание: 0.9rem цвет `var(--text-secondary)`, max-width 260px.

Если фото нет — инициалы в круге (фон `var(--accent-glow)`, текст `var(--accent)`, размер 48px, жирность 700).

### 2.8 Инвесторам (id="investors")

Отдельная секция, которая должна быть доступна из навигации и липкой CTA.

**Above the fold для инвестора:**
- H2: "Инвестиции в Polygram", жирность 600, размер `clamp(2rem, 3vw, 3rem)`.
- Sub: "Раунд А, стадия Post-MVP, целевой размер $3–5M. Pitch-deck по запросу."
- Три метрики в строку: размер раунда, стадия, ожидаемая доходность (IRR) — `.invest-stats`.
- Первичная CTA: `.btn-invest` "Отправить заявку инвестора" (ведёт к форме ниже или на отдельную страницу).

**Блок тракции для инвестора:** ссылка на секцию `#traction` или дубликат ключевых метрик (ARR, NRR, клиенты, рост).

**Блок команды:** ссылка на `#team` или краткий список основателей с LinkedIn.

**Форма заявки инвестора (3 поля):**
```html
<form class="invest-form" action="#" method="POST" novalidate>
  <div class="form-field">
    <label for="invest-name">Имя и фамилия</label>
    <input type="text" id="invest-name" name="name" required autocomplete="name">
  </div>
  <div class="form-field">
    <label for="invest-email">Рабочий email</label>
    <input type="email" id="invest-email" name="email" required autocomplete="email">
  </div>
  <div class="form-field">
    <label for="invest-intent">Сумма инвестиции ($)</label>
    <input type="number" id="invest-intent" name="amount" required min="10000" step="1000">
  </div>
  <button type="submit" class="btn-invest btn-invest-block">Отправить заявку</button>
</form>
```
CSS формы:
- `.form-field { margin-bottom: 16px; }`
- `label { display: block; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; margin-bottom: 6px; color: var(--text); }`
- `input { width: 100%; padding: 12px 16px; height: 44px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg-tertiary); color: var(--text); font-size: 0.95rem; transition: var(--fast); }`
- `input:focus { outline: none; border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-glow); }`
- `input:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }`
- Кнопка submit: `.btn-invest-block { width: 100%; padding: 0; height: 52px; border-radius: var(--radius-md); background: var(--invest-gold); color: #000000; font-weight: 600; font-size: 1rem; border: none; cursor: pointer; transition: var(--fast); }`
- Ховер кнопки: `background: var(--invest-gold-hover); transform: translateY(-1px);`
- Сообщение об успешной отправке: `.form-success` — скрыто по умолчанию, показывается вместо формы, текст "Заявка отправлена. Мы свяжемся с вами в течение 24 часов." цвет `var(--success)`.

### 2.9 FAQ (id="faq")

Аккордеон. 6–8 вопросов.

- H2: "Часто задаваемые вопросы".
- Каждый вопрос `.faq-item`:
  - Кнопка `.faq-question`: `width: 100%; text-align: left; background: none; border: none; padding: 20px 0; border-bottom: 1px solid var(--border); font-size: 1rem; font-weight: 600; color: var(--text); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: var(--fast);`
  - Иконка "−" / "+" (Lucide minus/plus) размер 20px.
  - Ответ `.faq-answer`: `max-height: 0; overflow: hidden; transition: max-height 0.3s var(--ease); padding: 0 0 20px; color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;`
  - При открытии: `.faq-item.open .faq-answer { max-height: 400px; }`

### 2.10 Footer

- `border-top: 1px solid var(--border)`, padding 80px 0 40px.
- Grid: 4 колонки (2/1/1/1 десктоп, 1 мобилка).
- Колонка 1: логоп Polygram (mark + polygram.id), описание 0.95rem цвет `var(--text-secondary)`, домен `.domain` жирность 500.
- Колонки 2–4: ссылки на секции и ресурсы. Внешние ссылки (GitHub, соцсети) — с иконкой выхода `.external-link` (Lucide external-link, размер 14px, слева от текста или справа).
- Copyright: `© 2026 Polygram. «Созидай. Управляй. Пожинай.» Домен: polygram.id`, цвет `var(--text-tertiary)`, размер 0.85rem, `border-top: 1px solid var(--border)`, padding-top 24px, `text-align: center`.

---

## 3. Мобильная версия (max-width: 768px)

### 3.1 Навигация
- Скрыть `.nav-links` полностью.
- Гамбургер-меню: `.nav-hamburger` — кнопка 36×36, `border-radius: var(--radius-sm)`, `border: 1px solid var(--border)`, фон прозрачный, иконка Lucide menu размер 22px цвет `var(--text-secondary)`.
- При клике — выезжающее меню справа (`position: fixed; top: 0; right: 0; width: 280px; height: 100vh; background: var(--bg-elevated); backdrop-filter: blur(20px); border-left: 1px solid var(--border); transform: translateX(100%); transition: transform 0.3s var(--ease);`).
- В открытом состоянии: `.nav-drawer.open { transform: translateX(0); }`.
- Внутри drawer: ссылки секций + первичная CTA `.btn-invest` на всю ширину, `height: 52px`, `margin: 24px`.
- Overlay: `.nav-overlay` — фиксированный на весь экран, фон `rgba(0,0,0,0.6)`, `z-index: 999`, виден только когда drawer открыт.

### 3.2 Секции
- Hero: H1 `clamp(2.5rem, 10vw, 4rem)`, кнопки `.hero-actions` — `flex-direction: column`, каждая `width: 100%`, `max-width: 280px`, `justify-content: center`.
- `.section`: padding `80px 0` (вместо 120).
- `.section-head`: margin-bottom `56px`.
- `.two-col`, `.vs-grid`, `.grid-2`: `grid-template-columns: 1fr`, gap 40px.
- `.grid-bento`: `grid-template-columns: 1fr`, gap 20px.
- Карточки: `padding: 24px 20px`.
- Видео продукта: на всю ширину контейнера, текст под ним.
- Footer grid: 1 колонка, gap 40px.

### 3.3 Хэдер
- Высота 56px сохраняется.
- Логотип слева, гамбургер и первичная CTA (кнопка "Инвестировать" или "Попробовать") справа.

---

## 4. Поведение интерфейса

### 4.1 Ховеры карточек

```css
.card:hover {
  border-color: var(--border-hover);
  background: var(--bg-tertiary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.card:hover::before { opacity: 1; } /* верхняя подсветка */
```

### 4.2 Focus-состояния (a11y, WCAG AA)

```css
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
a:focus, button:focus, input:focus {
  outline: none;
}
```

### 4.3 Плавный скролл с оффсетом под хэдер

```css
html { scroll-behavior: smooth; }
:target { scroll-margin-top: var(--anchor-offset); }
```

JS: при клике на якорную ссылку — `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` с поправкой на высоту хедера (80px), если нативный `:target` не покрывает все браузеры.

### 4.4 Внешние ссылки

```css
a[target="_blank"] {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
a[target="_blank"]::after {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  /* иконка выхода через SVG или Lucide external-link */
  mask: url("data:image/svg+xml...") no-repeat center;
  -webkit-mask: url("...") no-repeat center;
  background: currentColor;
}
```

Все внешние ссылки: `rel="noopener noreferrer"`.

### 4.5 Липкая первичная CTA при скролле

После прокрутки больше 400px от верха — появляется липкая кнопка внизу экрана (мобилка) или в углу (десктоп):

```css
.sticky-cta {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s var(--ease);
}
.sticky-cta.visible { opacity: 1; pointer-events: auto; }
```

### 4.6 Репликация первичной CTA

Одна первичная CTA в герое, одна в финале, одна в секции инвесторов, одна липкая при скролле. Вторичные CTA (GitHub, документация) визуально тише: прозрачный фон, цвет `var(--text-secondary)`.

---

## 5. Спецификация раздела «Инвесторам»

### 5.1 Above the fold для инвестора

При попадании на `#investors` инвестор должен видеть без скролла:
1. H2 "Инвестиции в Polygram".
2. Стадия и размер раунда: "Раунд А • Post-MVP • $3–5M".
3. Ключевая метрика: ARR или месячный рост (крупное число).
4. Первичная CTA: кнопка "Получить pitch-deck" / "Отправить заявку".

### 5.2 Блок тракции с метриками

Дублирует или ссылается на `#traction`. Показываются:
- ARR (годовая повторяемая выручка) — число.
- NRR (чистое удержание выручки) — процент.
- Клиенты — число активных корпоративных клиентов.
- Рост — квартальный рост пользователей (раз/процент).
Все цифры с подписями, без надутых логотипов (honest social proof).

### 5.3 Блок команды

Основатели с фото (или инициалами), должности, краткий bio, ссылки на LinkedIn. Акцент на опыт в SaaS/инфраструктуре/ИИ.

### 5.4 Форма заявки инвестора (3 поля)

Имя, рабочий email, сумма инвестиции ($). Описание см. п. 2.8. После отправки — сообщение об успехе вместо формы.

---

## 6. Рекомендации по изображениям и видео

- Реальный интерфейс Polygram: граф, холст, узлы. Не абстрактные иллюстрации.
- Видео: лайв-демо или запись экрана 60fps, формат WebM (кодек VP9), fallback MP4 (H.264).
- Постер для видео: кадр с графом/холстом, формат WebP, размер 1200×675, оптимизирован (качество 85).
- Аватары команды: WebP, 400×400, круглые или квадратные с радиусом `var(--radius-lg)`.
- Логотипы клиентов (если есть): SVG или WebP, монохромные, в оттенках серого, на фоне `var(--bg-tertiary)`.
- Все изображения: `loading="lazy"`, кроме героя и постера видео (`loading="eager"`).
- `width` и `height` атрибуты для всех img, чтобы избежать CLS.

---

## 7. Доступность (a11y, WCAG AA)

- Контраст текста на фоне: минимум 4.5:1 (обычный текст), 3:1 (крупный текст ≥18px или 14px bold).
- `focus-visible` на всех интерактивных элементах (см. п. 4.2).
- Skip-to-content ссылка в начале body:

```html
<a href="#main" class="skip-to-content">Перейти к основному содержимому</a>
```

CSS:

```css
.skip-to-content {
  position: absolute;
  top: -10000px;
  left: 0;
  background: var(--accent);
  color: #000000;
  padding: 8px 16px;
  z-index: 10000;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
}
.skip-to-content:focus { top: 16px; left: 16px; }
```

- `aria-label` на иконках кнопок (search, menu, external link).
- `role="button"` или правильные `<button>` теги для аккордеона FAQ.
- `aria-expanded="false/true"` на кнопках аккордеона.
- `aria-required="true"` на обязательных полях формы.
- `<main id="main">` оборачивает основной контент.
- Огрызок: `prefers-reduced-motion` — отключить анимации:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- OG / Twitter Card теги, фавикон 32×32, `theme-color: #000000` в `<meta name="theme-color">`.

---

## 8. Готовые CSS-классы (краткая шпаргалка)

```css
/* Layout */
.container, .section, .section-head, .grid-2, .grid-3, .grid-bento, .two-col, .vs-grid

/* Buttons */
.btn-invest, .btn-demo, .btn-get, .btn-more, .btn-outline, .btn-primary, .btn-invest-block

/* Cards */
.card, .icon-box, .metric-card, .team-card, .faq-item

/* Forms */
.invest-form, .form-field, .form-success

/* Nav */
.nav-hamburger, .nav-drawer, .nav-overlay, .sticky-cta

/* Utilities */
.text-eyebrow, .text-h1, .text-h2, .text-h3, .text-body, .text-metric
.skip-to-content, .sr-only
```

Все значения выше — финальные для вёрстки. Отступы, размеры, цвет и поведение не меняются без согласования с дизайнером.
