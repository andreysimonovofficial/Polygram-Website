After every response, make an atomic commit of all changes made during that response.

У Тебя есть wrangler Cloudflare CLI.
У Нас уже подключён домен polygram.id (CNAME polygram-36o.pages.dev) в Cloudflare.
Правила деплоя Cloudflare Pages:
- Деплой всегда на ветку `main` (production, обслуживает polygram.id): npx wrangler pages deploy dist --project-name=polygram --branch `main`
- Не деплоить на `master` — это preview, не попадает на продакшен.
- Перед деплоем: npm run build (собирает dist/)
- Если изменения не отображаются: Purge Cache в Cloudflare Dashboard (Caching → Configuration → Purge Everything)
- wrangler.toml должен содержать: pages_build_output_dir = "dist"
- AGENTS.md требует атомарный коммит после каждого ответа.
