# Bored Tasks - Project Overview & Architecture

> Authoritative reference for how the site is built. Read this fully before changing anything.

## What it is
A viral, AdSense-oriented quiz + boredom-busting site for Gen Z (ages 18-25, skews female).
Plain HTML + Tailwind (via CDN) + vanilla JS. **No build step.** Serve statically:
`python -m http.server 8000` then open `http://127.0.0.1:8000`. (Tailwind loads from CDN, so
keep internet on.) **Hosting: Cloudflare Pages** - deploy by drag-and-dropping the folder in the
Cloudflare dashboard (Workers & Pages > Create > Pages > Upload assets) or by connecting a git repo.
It is fully static: **no build command**, and the output/root directory is the project root.

## Current inventory (as of this handoff)
- **35 quizzes** (~880 questions). Mix of `type:"personality"` (point tally) and `type:"trivia"` (score bands).
- **15 blog posts** (real crawlable pages in `blog/`, 800-1300+ words each).
- **56 activities** (Boredom Busters).
- **10 Vibe Check moods**.
- **7 categories:** personality, love, popculture, challenges, life, trivia, memes.

## File structure
```
index.html              SPA shell. Hash-routed views render into <main id="bt-app"> via app.js.
about/contact/privacy/terms.html   Standalone real pages (share header/footer via ui.js).
blog.html               Blog index (renders cards from BT_DATA.blogPosts).
blog/<slug>.html        15 standalone article pages (Article JSON-LD, in-article ad slot).
robots.txt, sitemap.xml SEO.
assets/
  data.js     window.BT_DATA = { categories, activities, blogPosts, vibes, quizzes:[] } + U() helper + TEMPLATES.
  app.js      SPA engine (index.html ONLY): router, all views, quiz engine, vibe, search, share, modals.
  ui.js       Shared header + footer + theme toggle + mobile menu + image fallback. Loaded on EVERY page.
  tw.js       Tailwind Play CDN config (brand color remap + darkMode:'class'). Loaded on every page.
  styles.css  Custom CSS: animations, chips, hero glow, scroll-aware header (.bt-bar), prose, option states.
  quizzes/    Quiz "packs" - each file does BT_DATA.quizzes.push({...}). Loaded after data.js in index.html:
    q-age-lovelang.js  q-talent-redflag.js  q-decade-toxic.js  q-emoage-job.js
    q-attach-party.js  q-aesthetic.js  q-trivia-pop-meme.js  q-trivia-gk-adult.js
    q-trivia-disney.js  q-new-pack.js (10 personality)  q-trivia-pack2.js (9 trivia/meme/challenge)
docs/                   This folder.
```
Script load order in `index.html`: `data.js` -> all `quizzes/*.js` -> `ui.js` -> `app.js`.

## Brand & design system ("Electric Indigo")
- Single accent family: **indigo `#6366f1` -> violet `#8b5cf6` -> fuchsia `#d946ef`**.
- `tw.js` REMAPS legacy Tailwind names so existing classes keep working:
  `teal-* => indigo`, `coral-* => violet`, `lime-* => fuchsia`. (So `from-teal-400 to-coral-500` renders indigo->violet.)
  To rebrand: change the three ramps in `tw.js` + the `--bt-*` vars in `styles.css`.
- `.bt-gradient-text` = the indigo->violet->fuchsia text gradient. `.bt-chip`, `.bt-option`, `.bt-hero-glow`, `.bt-bar` are custom classes in `styles.css`.
- **Dark mode is the DEFAULT.** No-FOUC inline `<head>` script on every page adds `class="dark"` to `<html>` UNLESS `localStorage.bt_theme === "light"`. Toggle (sun/moon) lives in `ui.js`.
- **Logo = text wordmark only** ("Bored" + gradient "Tasks"), no icon square. Favicon = gradient "B" monogram. (in `ui.js` `LOGO` const + favicon data-URI in every HTML head.)
- **Header** (`ui.js`): `#bt-header` itself is the sticky bar (`.bt-bar`). It is transparent at the top of the page, fades to frosted glass on scroll, and hides on scroll-down / reveals on scroll-up. Mobile: hamburger left, logo centered, theme right; the slide-in menu is mounted at body level (`#bt-menu-host`) and opens from the LEFT.

## Writing-style rules (IMPORTANT)
- **No em dashes (—), en dashes (–), or ellipsis (…) anywhere.** Use plain hyphens or commas. (Whole site is currently clean; keep it that way.)
- Voice: fun, casual, Gen-Z, clean (no profanity/NSFW, no heavy alcohol/drugs). Questions must be coherent (every option must logically answer its stem) and use ~20-something lingo.

## Data model
`assets/data.js` defines `window.BT_DATA`. `data.js` also has commented `QUIZ_TEMPLATE`, `ACTIVITY_TEMPLATE`, `BLOG_TEMPLATE` at the bottom.

- **categories[]**: `{ id, name, emoji, blurb, color }` (color = a `from-x to-y` gradient in the indigo family).
- **activities[]**: `{ id, title, description, difficulty:"Easy|Medium|Hard", time, moods:[...], image }`.
  moods: `"5-Minute Fixes" | "Indoor" | "Outdoor" | "Creative" | "Lazy" | "Social" | "Energetic"`.
- **blogPosts[]**: `{ slug, title, category, readMinutes, date, excerpt, image }` (full content lives in `blog/<slug>.html`).
- **vibes[]**: `{ key, label, emoji, grad, title, desc, quiz, activity, blog, wildcard }` (recommends an existing quiz id, activity id, blog slug).
- **quizzes[]** (filled by packs): `{ id, slug, title, category, type, image, description, tagline, estMinutes, takenCount, results[], questions[] }`.
  - personality: `options:[{ text, points:{ resultKey:n } }]`; results `{ key, title, emoji, image, description, share }`. Winner = highest tally.
  - trivia: `options:[{ text, correct:bool }]` (exactly ONE correct per question); results have `minPct` bands (e.g. 85/60/35/0). Highest band cleared wins.

## Quiz engine (app.js)
- One question at a time, animated progress bar, **tap an answer to auto-advance** (~260ms), single **Back** control (no Next button).
- **Options are shuffled** per question via `seededShuffle(arr, quizId+":"+i)` - deterministic so the order is STABLE across reloads (Resume stays valid) but the correct answer is NOT always option A. Stored in `QP.qs`; `finishQuiz()` scores against `QP.qs`.
- **Progress save:** `localStorage["bt_quiz_progress_"+id] = { idx, answers:[optIndex|null], updatedAt }`, written on every answer. Final result -> `localStorage["bt_quiz_result_"+id]`, in-progress cleared on finish. Resume/Reset buttons on cards + intro.
- Scoring is verified so **every personality result is reachable** (balanced quizzes use one clean option per result).

## Key app.js helpers (reuse these)
- Lookups: `qById`, `catById`, `actById`, `vibeById`, `blogBySlug`.
- `imgUrl(url,w)` adds Unsplash sizing params (no-op for picsum). `esc(s)` HTML-escapes. `fmt(n)` thousands.
- `LS.get/set/del` (safe JSON localStorage wrappers).
- Cards: `quizCard(q)`, `activityCard(a)`, `blogCard(p)`, `pillar(emoji,title,sub,href,grad)` (full-width gradient bar).
- UI: `sectionHead(title,sub,[linkLabel,href])`, `icon(name)`, `adSlot(label,minH)`, `toast(msg)`.
- Share: `shareBtn(href,label,cls,ico)`, `socialCopyBtn(label,cls,ico)` (TikTok/Instagram = copy+toast), `shareIco(name)`.
- Modals: `modalShell(inner,size)`, `showModal()`, `hideModal()`; `#bt-modal` host + `#bt-fab` random-task button mounted by `mountChrome()`.

## Router (app.js `render()` + `parseHash()`)
Routes: `#/` (home), `#/quizzes`, `#/quizzes/:cat`, `#/quiz/:id` (`?play=1`,`?restart=1`), `#/results/:id`,
`#/boredom-busters`, `#/vibe`, `#/vibe/:key`, `#/categories`, `#/search?q=`, else 404.
On each route: set innerHTML, scroll top, update `<title>`/meta/OG (`setMeta`), call `wireCommon()`.
Event wiring: per-render listeners in `wireCommon()`; global delegated listeners (random-task, activity cards, modal close) in `mountChrome()`.

## Navigation (ui.js `NAV`)
`Home, Vibe Check, Quizzes, Boredom Busters, Categories, Blog, About`. Edit the `NAV` array to add a top-level pillar (it appears in desktop nav + mobile menu automatically).

## Images
- Quiz **covers** = topical Unsplash (all HTTP-verified to load). Quiz **result** images = unique `picsum.photos/seed/...` photos (guaranteed unique + always load). Activities = Unsplash. Blog featured = unique Unsplash.
- `ui.js` has a global `<img>` error handler that swaps any failed image to a `picsum.photos` placeholder, so the site never shows a broken image.
- No two pieces of content share an image (cross-content unique).

## localStorage keys in use
`bt_theme`, `bt_quiz_progress_<id>`, `bt_quiz_result_<id>`, `bt_saved_tasks`, `bt_completed_tasks`, `bt_last_vibe`, `bt_saved_vibe`. (Pick new, namespaced `bt_*` keys for new features.)

## AdSense / SEO
- Ad placeholders marked `<!-- ADSENSE PLACEHOLDER -->` + `.bt-ad` divs with `data-ad-slot`. Conservative spacing; NONE inside the quiz question flow (only intro/results/listings/blog/footer).
- Per-route titles/meta/OG, JSON-LD (WebSite+SearchAction, Quiz, Article), `robots.txt`, `sitemap.xml`, lazy images, realistic counters (4k-35k).
- Replace `https://boredtasks.example/` with the real domain in `index.html`, blog/legal canonicals, `sitemap.xml`, `robots.txt` before launch.

## How to extend (quick)
- **Quiz:** copy `QUIZ_TEMPLATE` in `data.js`, push it in a new/existing `assets/quizzes/*.js`, add the `<script>` to `index.html` if new file. Personality: balance options 1-per-result so all results are reachable.
- **Activity / Blog / Vibe:** push to the matching `BT_DATA` array (blog also needs a `blog/<slug>.html` page + sitemap entry).
- New **section/pillar:** add a `view...()` in app.js, a route in `render()`, a `NAV` entry in ui.js, a homepage feature (in `viewHome`), data in `data.js`, and `bt_*` localStorage keys. Match existing card/modal/gradient patterns.
