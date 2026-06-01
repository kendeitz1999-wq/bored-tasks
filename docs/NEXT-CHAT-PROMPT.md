# Kickoff prompt for the next chat

> Copy everything in the box below and paste it as your first message in the new chat.
> (It tells the agent to fully study the existing codebase and plan before writing any code,
> then build the two new sections in keeping with the existing patterns.)

---

You are continuing work on an existing, real, production website called **Bored Tasks**
located in this project folder. It is a Gen-Z (ages 18-25) quiz + boredom-busting site:
plain HTML + Tailwind (via CDN) + vanilla JS, no build step, served statically.

## STEP 1 - Understand the codebase first (do NOT write any code yet)
Before doing anything, read and fully understand the existing project:
1. Read `docs/PROJECT-OVERVIEW.md` and `docs/SESSION-LOG.md` (full context, conventions, data model, decisions).
2. Then read the actual code to confirm the patterns:
   - `assets/data.js` (the `window.BT_DATA` shape + the QUIZ/ACTIVITY/BLOG templates),
   - `assets/app.js` (the hash router `render()`, the view functions like `viewVibe`/`viewBoredom`/`viewResults`, the helpers `pillar/sectionHead/icon/adSlot/toast/shareBtn/socialCopyBtn/modalShell/LS`, and `wireCommon()`/`mountChrome()`),
   - `assets/ui.js` (the `NAV` array, header, footer, theme, mobile menu),
   - `assets/styles.css` (custom classes), `assets/tw.js` (brand color remap),
   - `index.html` (script load order) and how `assets/quizzes/*.js` packs push into `BT_DATA`.
3. Use the existing Vibe Check feature (`viewVibe`/`viewVibeResult`, `BT_DATA.vibes`, the `#/vibe` route, the nav entry, the homepage feature section) as your reference template for how a "new pillar" is wired end to end.

## STEP 2 - Make a plan
Produce a concise implementation plan that reuses existing helpers, components, routes, localStorage
conventions, brand styling, and the no-build pattern. List the files you will add/change. Get it right
before writing code.

## Hard conventions you MUST follow (these already hold across the whole site)
- **No em dashes, en dashes, or ellipsis characters anywhere** (use plain hyphens or commas).
- **Dark mode is the default**; theme via `localStorage.bt_theme`. Brand = indigo `#6366f1` -> violet `#8b5cf6` -> fuchsia `#d946ef` (use existing Tailwind classes / `.bt-gradient-text`).
- All persistence uses namespaced `localStorage` keys (`bt_*`).
- Reuse existing components: cards, `pillar()`, `sectionHead()`, `modalShell()`, `toast()`, `shareBtn()`/`socialCopyBtn()` (TikTok/Instagram = copy-link + toast), `adSlot()`, `icon()`.
- Add each new section as a **top-nav pillar** (edit `NAV` in `ui.js`), a **homepage feature**, and **routes** in `app.js` `render()`. Match the SPA pattern (views render into `#bt-app`; update `setMeta`).
- Mobile-first and fully responsive; works with the scroll-aware header and dark/light themes.
- Images: reuse Unsplash + the `picsum.photos/seed/...` pattern (unique seeds); the global image-error fallback already prevents broken images. Keep content clean (no profanity/NSFW), Gen-Z voice, coherent.
- Ad placeholders use `<!-- ADSENSE PLACEHOLDER -->`; keep them conservative (never inside an interactive flow).
- Verify your work the way prior work was verified: `node --check` the JS, eval `data.js` + packs in node to validate data/counts, and (optionally) render with jsdom/puppeteer. Keep all data valid.

## STEP 3 - Build these two new major sections

### Section 1: Daily Dare
A full Daily Dare section giving users one fresh, fun, bold or ridiculous challenge every day (drives daily returning traffic). The "today" dare must be chosen **deterministically from the date** (see the existing `dailyTask()` for the pattern) so everyone sees the same dare each day and it refreshes at local midnight.
Features:
- Prominent "Today's Dare" card on the **homepage** and a dedicated **`#/daily-dare`** page.
- **Countdown timer** to when the next dare refreshes (local midnight).
- **"Mark as Completed"** button (saved in `localStorage`).
- **Social-proof counter** ("X,XXX people completed today's dare") - realistic/believable, can be derived deterministically per dare (keep it in the 1,000-40,000 range; do not exaggerate).
- **Difficulty:** Easy / Medium / Spicy / Legendary.
- **Estimated time** and **category tags**.
- Strong **share buttons** (reuse the existing share helpers: TikTok, Instagram, X, etc.).
- **Archive / Past Dares** page (e.g. `#/daily-dare/archive`).
- High-energy design matching the site's indigo/violet/fuchsia aesthetic.
Content: include **30 ready-made Daily Dares** in the JS data (`BT_DATA.dares`) so there is a full first month. Fun, creative, safe-but-edgy, targeted at 18-25 year olds. Keep it clean (no NSFW, nothing dangerous/illegal).

### Section 2: Story Mode (Choose Your Own Adventure)
A full interactive-fiction section.
Features:
- **5-6 complete, high-quality interactive stories** to start.
- Each story has **meaningful branching choices** and **4-8 different endings**.
- Smooth, immersive **one-choice-at-a-time** reading experience.
- **Progress saving within each story** via `localStorage` (current node + path so it resumes).
- **Background images that change** with story progression where possible.
- **"Restart Story"** plus an end **summary screen with shareable results**.
- **Hub page** (`#/stories`) listing all stories with thumbnails + short descriptions; individual story at `#/story/:id`.
Tone: humorous, chaotic, relatable, entertaining for 18-25 year olds. Example premises: "You woke up as a millionaire for one day", "You accidentally became TikTok famous", "Your situationship got extremely weird".
Suggested data shape: `BT_DATA.stories = [{ id, title, blurb, image, start, nodes: { nodeId: { text, image?, choices:[{ label, to }], ending?:{ title, emoji, description, share } } } }]`. Make it well-commented and easy to expand (clear instructions for adding more dares and stories).

### Both sections
- Clean, modern, premium design that perfectly matches the existing site.
- Fully responsive / mobile-optimized; integrate smoothly with the existing nav, dark/light mode, and layout.
- Well-commented, easy to expand.

When done, run the full verification suite and report what you changed.
