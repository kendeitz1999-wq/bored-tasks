# Bored Tasks 🎲

**Cure Your Boredom - Quizzes, Tasks & Epic Ideas.**

A fast, beautiful, mobile-first quiz + boredom-busting website built with plain
HTML, Tailwind CSS (via CDN) and vanilla JavaScript. No build step, no framework,
no npm install - just open it and it works. Designed to be AdSense-ready, deeply
shareable, and trivially easy to expand with hundreds more quizzes, activities
and articles.

---

## ⚡️ Quick start

Because the app loads JavaScript files, you should serve it over HTTP rather than
opening `index.html` directly from the file system (some browsers block local
file `file://` script loading). Any static server works:

```bash
# Python 3 (already on most machines)
python -m http.server 8000
# then open http://localhost:8000

# or Node
npx serve .

# or the VS Code "Live Server" extension → "Go Live"
```

To deploy, upload the whole folder to any static host - **Netlify, Vercel,
GitHub Pages, Cloudflare Pages, Firebase Hosting**, or classic shared hosting.
There is nothing to compile. Before going live, find-and-replace
`https://boredtasks.example/` with your real domain in `index.html`,
`sitemap.xml`, `robots.txt`, and the blog/legal pages' canonical/OG tags.

---

## 🗂 Project structure

```
index.html                 SPA shell. Renders home, quiz listings, the quiz
                           player, results, boredom-busters, categories &
                           search into <main id="bt-app"> via the hash router.
about.html                 Real, crawlable pages that share the header/footer
contact.html               (rendered by ui.js) but are standalone HTML for SEO.
privacy.html               Full, professional legal copy (AdSense/GDPR/CCPA).
terms.html
blog.html                  Blog index - renders cards from BT_DATA.blogPosts.
blog/<slug>.html           10 full, 800+ word articles (real crawlable pages).
robots.txt, sitemap.xml    SEO.

assets/
  styles.css               Custom CSS beyond Tailwind: animations, chips, prose,
                           scrollbars, hero blobs, quiz option states.
  tw.js                    Shared Tailwind (Play CDN) config - brand palette +
                           dark mode. Loaded on every page after the CDN script.
  ui.js                    Shared header + footer + theme toggle + mobile menu +
                           image fallback. Runs on EVERY page.
  app.js                   The SPA engine (index.html only): router, quiz engine,
                           progress-save, random task, search, share, SEO meta.
  data.js                  ALL content: categories, 56 activities, blog metadata,
                           and the QUIZ / ACTIVITY / BLOG templates. quizzes start
                           empty and are filled by the packs below.
  quizzes/
    q-age-lovelang.js      16 quizzes split across themed packs. Each file just
    q-talent-redflag.js    does BT_DATA.quizzes.push({...}). Load order is set in
    q-decade-toxic.js      index.html (data.js → packs → app.js).
    q-emoage-job.js
    q-attach-party.js
    q-aesthetic.js
    q-trivia-pop-meme.js
    q-trivia-gk-adult.js
    q-trivia-disney.js
```

---

## 🌗 How the dark / light mode system works

- Tailwind is configured with `darkMode: 'class'` (in `assets/tw.js` and inline in
  `index.html`). Dark mode = the class `dark` on the `<html>` element.
- The user's choice is stored in `localStorage` under the key **`bt_theme`**
  (value `"light"` or `"dark"`).
- **Default is light** on a first visit.
- Every page has a tiny inline script in `<head>` that runs *before paint* and
  adds the `dark` class if the saved preference is dark - this prevents the
  "flash of wrong theme" (FOUC).
- The visible **sun/moon toggle** (top-right of the header, on every page) is
  wired up in `assets/ui.js` (`toggleTheme()`). It flips the class, saves the
  preference, and swaps the icon.

To change the default to dark, edit the inline `<head>` scripts to add the class
unless the saved value is explicitly `"light"`.

---

## 💾 How quiz progress saving works (auto-resume)

Progress is saved to `localStorage` **in real time as the user answers**, so they
can close the tab and pick up exactly where they left off.

- **Key:** `bt_quiz_progress_<quizId>`
  **Value:** `{ idx: <current question index>, answers: [<optionIndex|null>, ...], updatedAt: <timestamp> }`
- Written on every answer and every Next/Back (`saveProgress()` in `app.js`).
- On load, if a saved progress exists with at least one answer, the quiz card and
  the quiz intro page show a **▶ Resume** button (and a progress bar); otherwise a
  **Start** button. A **Reset / Start over** button clears the key.
- Completing a quiz **clears** the in-progress key and stores the final result
  under `bt_quiz_result_<quizId>` so the results page can be revisited/shared.

All of this lives on the user's device - nothing is sent to a server.

---

## ➕ Adding content

There is **no database and no build step**. All content is plain JS objects in
`assets/data.js` and the `assets/quizzes/*.js` packs. `data.js` contains
fully-commented `QUIZ_TEMPLATE`, `ACTIVITY_TEMPLATE` and `BLOG_TEMPLATE` objects
you can copy. These are clean enough to hand to an AI: *"generate 10 more quizzes
in this exact format."*

### Add a quiz

1. Open any file in `assets/quizzes/` (or make a new one and add a `<script>` tag
   for it in `index.html`, after `data.js`).
2. Copy `QUIZ_TEMPLATE` from `data.js` and `BT_DATA.quizzes.push({ ... })`.
3. Two scoring modes:
   - **`type: "personality"`** - each option has `points: { resultKey: n }`. The
     result whose key accumulates the most points wins. `results[].key` must match
     the point keys.
   - **`type: "trivia"`** - each option has `correct: true/false`. Score = % of
     correct answers. `results[]` have `minPct` bands (e.g. `85`, `60`, `35`, `0`);
     the highest band the user clears is shown.
4. Give every result a `key`, `title`, `emoji`, `image`, `description` (and
   optionally a `share` line). `category` must match a `categories[].id`.

That's it - refresh and the quiz appears in listings, search, carousels and
related sections automatically.

### Add an activity (boredom buster)

Copy `ACTIVITY_TEMPLATE` and push to `BT_DATA.activities`. Reuse existing `moods`
labels (`"5-Minute Fixes"`, `"Indoor"`, `"Outdoor"`, `"Creative"`, `"Lazy"`,
`"Social"`, `"Energetic"`) so it groups correctly under the mood filters and the
random-task generator.

### Add a blog post

1. Duplicate any file in `blog/` (they're a self-contained template) and rename it
   `blog/<your-slug>.html`. Update the `<title>`, meta, canonical, JSON-LD, and the
   article body.
2. Add a matching metadata entry to `BT_DATA.blogPosts` in `data.js` with the
   **same `slug`**. It will then appear on the blog index, homepage and search.
3. Add the new URL to `sitemap.xml`.

### Images

`data.js` uses a helper `U("<unsplash-photo-id>")` to build Unsplash URLs;
`app.js` auto-appends sizing/quality params for performance, and `ui.js` swaps in
a placeholder if any image ever 404s - so you never get a broken image. Use any
free stock photo URL you like.

---

## 💰 Enabling real Google AdSense

The site is pre-wired with clearly-marked ad placeholders. Search the codebase for
`ADSENSE PLACEHOLDER` and `data-ad-slot` - you'll find slots in the header, in listing
feeds, inside every blog article, on the results page, and in the footer.

To go live with real ads:

1. Get approved for [Google AdSense](https://www.google.com/adsense/) and grab your
   publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`).
2. Add the AdSense loader script once, in the `<head>` of every page:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. Replace each placeholder `<div class="bt-ad" ...>Advertisement</div>` with a real
   ad unit, e.g.:
   ```html
   <ins class="adsbygoogle" style="display:block"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto" data-full-width-responsive="true"></ins>
   <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
   ```
4. For ad units that `app.js` injects dynamically into the SPA, call
   `(adsbygoogle = window.adsbygoogle || []).push({})` after the view renders.

**AdSense approval tip:** approval favours sites with substantial original content
and proper structure. This project ships with 16 full quizzes, 56 activities, 10
long-form articles, plus About / Contact / Privacy / Terms pages for exactly that
reason. Keep adding original content before and after applying.

---

## 🔍 SEO notes

- Per-route `<title>` + meta description + Open Graph / Twitter tags are updated by
  `app.js` on every SPA navigation; standalone pages set them statically.
- JSON-LD structured data: `WebSite` + `SearchAction` on the homepage, `Quiz` on
  quiz pages, `Article` on every blog post.
- `sitemap.xml` + `robots.txt` are included. Submit the sitemap in Google Search
  Console after deploying.
- Images use `loading="lazy"`; the layout is fully responsive and mobile-first.

---

## ♿️ Accessibility & performance

- Semantic headings, `alt` text, visible focus rings, and `prefers-reduced-motion`
  support (animations are disabled for users who request it).
- Keyboard- and tap-friendly quiz interface.
- Lazy-loaded, size-capped images and a tiny JS footprint keep it fast on mobile.

---

## 📄 License & content note

Quizzes and results are for **entertainment only** - they are not psychological,
medical or professional assessments (see `terms.html`). All written content here is
original to Bored Tasks. Stock images are loaded from Unsplash under its free
license; swap in your own assets as preferred.

Made to cure boredom everywhere, one tap at a time. 💛
