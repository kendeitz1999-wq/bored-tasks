/* app.js - the SPA engine (runs on index.html only). Handles hash routing,
   per-route page titles/meta, the quiz engine (personality + trivia), quiz
   progress saving, vibe check, search, the random task generator and sharing.
   Content comes from the global BT_DATA defined in data.js. */
(function () {
  "use strict";

  var D = window.BT_DATA || { categories: [], quizzes: [], activities: [], blogPosts: [], vibes: [], dares: [], stories: [] };
  if (!D.vibes) D.vibes = [];
  if (!D.dares) D.dares = [];
  if (!D.stories) D.stories = [];
  var app = document.getElementById("bt-app");
  var BASE = (window.BTUI && window.BTUI.base) || "";
  var dareTimer = null; // active Daily Dare countdown interval (cleared on every render)

  /* ===== Small helpers =================================================== */
  function h(html) { return html; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return (n || 0).toLocaleString("en-US"); }
  function qById(id) { return D.quizzes.filter(function (q) { return q.id === id; })[0]; }
  function catById(id) { return D.categories.filter(function (c) { return c.id === id; })[0]; }
  function actById(id) { return D.activities.filter(function (a) { return a.id === id; })[0]; }
  function vibeById(k) { return D.vibes.filter(function (v) { return v.key === k; })[0]; }
  function blogBySlug(s) { return D.blogPosts.filter(function (p) { return p.slug === s; })[0]; }
  function byId(id) { return document.getElementById(id); }
  function imgUrl(u, w) { // normalize Unsplash sizing for performance
    if (!u) return "";
    if (u.indexOf("images.unsplash.com") > -1) return u + (u.indexOf("?") > -1 ? "&" : "?") + "auto=format&fit=crop&w=" + (w || 800) + "&q=70";
    return u;
  }

  /* ===== localStorage wrappers (safe in private mode) ==================== */
  var LS = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  // ---- PROGRESS SAVE schema -------------------------------------------------
  // key: "bt_quiz_progress_<quizId>"  value: { idx, answers:[optIndex|null,...], updatedAt }
  // key: "bt_quiz_result_<quizId>"    value: { key, at }  (last completed result)
  function progKey(id) { return "bt_quiz_progress_" + id; }
  function resultKey(id) { return "bt_quiz_result_" + id; }
  function getProgress(id) { return LS.get(progKey(id)); }
  function saveProgress(id, idx, answers) { LS.set(progKey(id), { idx: idx, answers: answers, updatedAt: Date.now() }); }
  function clearProgress(id) { LS.del(progKey(id)); }
  function hasProgress(id) { var p = getProgress(id); return !!(p && p.answers && p.answers.some(function (a) { return a != null; })); }
  // Saved + completed boredom-buster tasks (arrays of activity ids on the device).
  function savedList() { return LS.get("bt_saved_tasks") || []; }
  function completedList() { return LS.get("bt_completed_tasks") || []; }
  function isSaved(id) { return savedList().indexOf(id) > -1; }
  function isCompleted(id) { return completedList().indexOf(id) > -1; }
  function toggleInList(key, id) { var l = LS.get(key) || []; var i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id); LS.set(key, l); return l.indexOf(id) > -1; }

  /* ===== SEO: per-route meta ============================================ */
  function setMeta(title, desc, image) {
    document.title = title;
    setTag('meta[name="description"]', "content", desc);
    setTag('meta[property="og:title"]', "content", title);
    setTag('meta[property="og:description"]', "content", desc);
    setTag('meta[name="twitter:title"]', "content", title);
    setTag('meta[name="twitter:description"]', "content", desc);
    if (image) { setTag('meta[property="og:image"]', "content", image); setTag('meta[name="twitter:image"]', "content", image); }
    setTag('link[rel="canonical"]', "href", location.origin + location.pathname + location.hash);
  }
  function setTag(sel, attr, val) { var t = document.querySelector(sel); if (t && val != null) t.setAttribute(attr, val); }

  /* ===== Reusable card components ======================================= */
  function quizCard(q) {
    var cat = catById(q.category) || { name: "Quiz" };
    var resume = hasProgress(q.id);
    return '<a href="#/quiz/' + q.id + '" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">' +
      '<div class="relative aspect-[16/10] shrink-0 overflow-hidden">' +
        '<img loading="lazy" src="' + imgUrl(q.image, 700) + '" alt="' + esc(q.title) + '" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">' +
        '<span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-700 backdrop-blur dark:bg-slate-900/85 dark:text-slate-200">' + esc(cat.name) + '</span>' +
        (q.type === "trivia" ? '<span class="absolute right-3 top-3 rounded-full bg-coral-500 px-2.5 py-1 text-[11px] font-bold text-white">TRIVIA</span>' : "") +
        (resume ? '<span class="absolute bottom-3 left-3 rounded-full bg-teal-400 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow">▶ Resume</span>' : "") +
      '</div>' +
      '<div class="flex flex-1 flex-col p-4">' +
        '<h3 class="line-clamp-2 font-extrabold leading-snug text-slate-900 group-hover:text-coral-500 dark:text-white">' + esc(q.title) + '</h3>' +
        '<p class="mt-1.5 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">' + esc(q.description) + '</p>' +
        '<div class="mt-3 flex items-center gap-3 text-xs font-medium text-slate-400">' +
          '<span class="inline-flex items-center gap-1">' + icon("clock") + (q.estMinutes || 3) + ' min</span>' +
          '<span class="inline-flex items-center gap-1">' + icon("list") + (q.questions ? q.questions.length : 0) + ' Qs</span>' +
          '<span class="ml-auto inline-flex items-center gap-1 text-teal-500">' + icon("users") + fmt(q.takenCount) + '</span>' +
        '</div>' +
      '</div></a>';
  }

  function activityCard(a) {
    var done = isCompleted(a.id), saved = isSaved(a.id);
    var badge = done ? '<span class="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">Done</span>'
      : saved ? '<span class="absolute right-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow">Saved</span>' : "";
    return '<button type="button" data-activity="' + a.id + '" class="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">' +
      '<div class="relative aspect-[16/10] overflow-hidden">' +
        '<img loading="lazy" src="' + imgUrl(a.image, 600) + '" alt="' + esc(a.title) + '" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">' +
        badge +
        '<div class="absolute bottom-0 left-0 flex flex-wrap gap-1 p-2">' + a.moods.slice(0, 2).map(function (m) { return '<span class="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700 dark:bg-slate-900/85 dark:text-slate-200">' + esc(m) + '</span>'; }).join("") + '</div>' +
      '</div>' +
      '<div class="flex flex-1 flex-col p-4">' +
        '<h3 class="font-bold leading-snug text-slate-900 group-hover:text-indigo-600 dark:text-white">' + esc(a.title) + '</h3>' +
        '<p class="mt-1.5 flex-1 text-sm text-slate-500 dark:text-slate-400">' + esc(a.description) + '</p>' +
        '<div class="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-400">' +
          '<span class="inline-flex items-center gap-1">' + icon("clock") + esc(a.time) + '</span>' +
          '<span class="rounded-full px-2 py-0.5 ' + diffClass(a.difficulty) + '">' + esc(a.difficulty) + '</span>' +
          '<span class="ml-auto font-bold text-indigo-500">View</span>' +
        '</div>' +
      '</div></button>';
  }

  function blogCard(p) {
    return '<a href="' + BASE + "blog/" + p.slug + '.html" class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">' +
      '<div class="relative aspect-[16/9] overflow-hidden"><img loading="lazy" src="' + imgUrl(p.image, 700) + '" alt="' + esc(p.title) + '" class="h-full w-full object-cover transition duration-500 group-hover:scale-105"></div>' +
      '<div class="flex flex-1 flex-col p-5"><span class="text-xs font-bold uppercase tracking-wide text-coral-500">' + esc(p.category) + ' · ' + p.readMinutes + ' min read</span>' +
      '<h3 class="mt-2 font-extrabold leading-snug text-slate-900 group-hover:text-coral-500 dark:text-white">' + esc(p.title) + '</h3>' +
      '<p class="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">' + esc(p.excerpt) + '</p>' +
      '<span class="mt-3 text-sm font-bold text-teal-500">Read article →</span></div></a>';
  }

  function diffClass(d) {
    // Semantic difficulty colors (green/amber/rose) - a universal convention,
    // intentionally kept distinct from the indigo brand for scannability.
    return d === "Easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : d === "Hard" ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  }

  function icon(name) {
    var p = {
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
      users: '<path d="M16 20v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1"/><circle cx="9" cy="8" r="3.5"/><path d="M22 20v-1a4 4 0 00-3-3.8"/>',
      bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
      dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>'
    }[name] || "";
    return '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }

  function adSlot(label, h) {
    // ===== ADSENSE PLACEHOLDER ===== replace this placeholder with a real ad unit (see README)
    return '<div class="bt-ad my-8 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-medium uppercase tracking-widest text-slate-400 dark:border-slate-700" style="min-height:' + (h || 100) + 'px" data-ad-slot="' + label + '">Advertisement</div>';
  }

  function sectionHead(title, sub, link) {
    return '<div class="mb-5 flex items-end justify-between gap-4"><div><h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">' + title + '</h2>' + (sub ? '<p class="mt-1 text-slate-500 dark:text-slate-400">' + sub + '</p>' : "") + '</div>' + (link ? '<a href="' + link[1] + '" class="hidden shrink-0 text-sm font-bold text-teal-500 hover:text-teal-600 sm:block">' + link[0] + ' →</a>' : "") + '</div>';
  }

  /* ===== VIEWS =========================================================== */

  function viewHome() {
    var trending = D.quizzes.slice().sort(function (a, b) { return b.takenCount - a.takenCount; }).slice(0, 8);
    setMeta("Bored Tasks - Cure Your Boredom with Quizzes, Tasks & Epic Ideas",
      "Bored? Take addictive personality quizzes and trivia, or pick from hundreds of fun things to do when you're bored. The ultimate boredom-busting playground.",
      imgUrl(trending[0] && trending[0].image, 1200));

    return '' +
      // HERO
      '<section class="relative -mt-16 overflow-hidden">' + // pull up under the transparent header so the glow fills the top
        '<div class="bt-hero-glow pointer-events-none absolute inset-0"></div>' +
        '<div class="bt-dots pointer-events-none absolute inset-0 text-slate-300 opacity-20 dark:text-slate-700"></div>' +
        '<div class="relative mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28">' +
          '<div class="mx-auto max-w-3xl text-center bt-fade-up">' +
            '<span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">✨ ' + D.quizzes.length + ' quizzes · ' + D.activities.length + ' boredom busters · a new dare daily</span>' +
            '<h1 class="mt-5 font-black leading-[0.95] tracking-tight text-slate-900 dark:text-white">' +
              '<span class="block text-4xl sm:text-6xl">Cure Your</span>' +
              '<span class="block text-6xl bt-gradient-text sm:text-8xl">Boredom</span>' +
            '</h1>' +
            '<p class="mx-auto mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400">Hilariously accurate quizzes, brain-melting trivia, and hundreds of things to do right now. Pick one and stay un-bored.</p>' +
            // SEARCH
            '<form data-home-search class="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">' +
              '<svg viewBox="0 0 24 24" class="ml-2 h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
              '<input name="q" type="search" placeholder="Search quizzes, tasks, ideas..." class="w-full bg-transparent px-1 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white" aria-label="Search">' +
              '<button type="submit" class="rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-5 py-2.5 text-sm font-bold text-slate-900 shadow transition hover:shadow-lg">Go</button>' +
            '</form>' +
            '<div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">' +
              '<button data-random-quiz class="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-indigo-500/30 transition hover:scale-[1.03] sm:w-auto">Take a quiz <span class="text-xl transition-transform group-hover:translate-x-1">→</span></button>' +
              '<button data-random-task class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-indigo-400 bg-indigo-50 px-8 py-4 text-base font-extrabold text-indigo-600 shadow-sm transition hover:scale-[1.03] hover:bg-indigo-100 dark:border-indigo-400/70 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25 sm:w-auto">🎲 I\'m bored, surprise me</button>' +
            '</div>' +
            '<a href="#/categories" class="mt-4 inline-block text-sm font-bold text-slate-500 underline-offset-4 transition hover:text-indigo-500 hover:underline dark:text-slate-400">or browse all categories</a>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<div class="mx-auto max-w-7xl px-4 sm:px-6">' +
        // TRENDING carousel - big cards lead the page
        '<section class="py-6">' + sectionHead("🔥 Trending now", "What everyone\'s obsessing over today", ["See all", "#/quizzes"]) +
          '<div class="bt-carousel flex gap-4 overflow-x-auto pb-4">' +
            trending.map(function (q) { return '<div class="w-[74%] shrink-0 sm:w-[300px]">' + quizCard(q) + '</div>'; }).join("") +
          '</div>' +
        '</section>' +

        // TODAY'S DARE - daily hook, right under the trending cards
        homeDareBand() +

        adSlot("home-top", 90) +

        // EXPLORE - a clean "here's what we've got" menu below the trending cards
        '<section class="py-7">' + sectionHead("Explore", "Six ways to kill some time") +
          '<div class="bt-stagger grid grid-cols-1 gap-3 sm:grid-cols-2">' +
            pillar("🧠", "Quizzes", D.quizzes.length + " to take", "#/quizzes", "from-indigo-500 to-violet-500") +
            pillar("🎯", "Daily Dare", "Today's challenge", "#/daily-dare", "from-fuchsia-500 to-pink-500") +
            pillar("🎭", "Story Mode", D.stories.length + " adventures", "#/stories", "from-violet-500 to-indigo-500") +
            pillar("🔮", "Vibe Check", "Pick your mood", "#/vibe", "from-violet-500 to-fuchsia-500") +
            pillar("💡", "Boredom Busters", D.activities.length + " things to do", "#/boredom-busters", "from-purple-500 to-indigo-500") +
            pillar("📖", "Blog", "Long reads", BASE + "blog.html", "from-fuchsia-500 to-purple-600") +
          '</div>' +
        '</section>' +
      '</div>';
  }

  // Full-width gradient bar: emoji, label, arrow. Reads as a clean menu row on
  // mobile (1 col) and pairs up on desktop (2 col).
  function pillar(emoji, title, sub, href, grad) {
    return '<a href="' + href + '" class="group flex items-center gap-4 rounded-2xl bg-gradient-to-r ' + grad + ' p-5 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">' +
      '<span class="text-3xl sm:text-4xl">' + emoji + '</span>' +
      '<div class="min-w-0"><h3 class="text-lg font-extrabold leading-tight">' + title + '</h3><p class="truncate text-sm text-white/85">' + sub + '</p></div>' +
      '<span class="ml-auto text-2xl transition-transform group-hover:translate-x-1">→</span>' +
    '</a>';
  }

  function categoryTile(c) {
    var count = D.quizzes.filter(function (q) { return q.category === c.id; }).length;
    return '<a href="#/quizzes/' + c.id + '" class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">' +
      '<div class="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ' + c.color + ' opacity-20 blur-xl transition group-hover:opacity-40"></div>' +
      '<div class="relative"><span class="text-3xl">' + c.emoji + '</span>' +
      '<h3 class="mt-3 font-extrabold text-slate-900 dark:text-white">' + esc(c.name) + '</h3>' +
      '<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">' + esc(c.blurb) + '</p>' +
      '<span class="mt-2 inline-block text-xs font-bold text-teal-500">' + count + ' quizzes →</span></div></a>';
  }

  function viewQuizzes(catId) {
    var cat = catId ? catById(catId) : null;
    var list = catId ? D.quizzes.filter(function (q) { return q.category === catId; }) : D.quizzes;
    setMeta((cat ? cat.name + " Quizzes" : "All Quizzes") + " - Bored Tasks",
      "Browse " + list.length + " addictive " + (cat ? cat.name.toLowerCase() + " " : "") + "quizzes. Personality tests, trivia challenges and 'we\'ll guess your...' quizzes you can\'t stop taking.",
      imgUrl(list[0] && list[0].image, 1200));

    var chips = '<a href="#/quizzes" class="bt-chip ' + (!catId ? "is-active" : "") + '">All</a>' +
      D.categories.map(function (c) { return '<a href="#/quizzes/' + c.id + '" class="bt-chip ' + (catId === c.id ? "is-active" : "") + '">' + c.emoji + ' ' + esc(c.name) + '</a>'; }).join("");

    return '<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-teal-500">Home</a> / <span class="text-slate-600 dark:text-slate-300">Quizzes' + (cat ? " / " + esc(cat.name) : "") + '</span></nav>' +
      '<h1 class="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">' + (cat ? cat.emoji + " " + esc(cat.name) + " Quizzes" : "All Quizzes") + '</h1>' +
      '<p class="mt-2 text-slate-500 dark:text-slate-400">' + (cat ? esc(cat.blurb) : "Every quiz we\'ve got, in one addictive place.") + ' · <strong>' + list.length + '</strong> to try.</p>' +
      '<div class="bt-carousel -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">' + chips + '</div>' +
      adSlot("quizzes-top", 90) +
      '<div class="bt-stagger mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">' + list.map(quizCard).join("") + '</div>' +
      '</div>';
  }

  function viewQuizIntro(id) {
    var q = qById(id);
    if (!q) return viewNotFound();
    var cat = catById(q.category) || { name: "Quiz" };
    var resume = hasProgress(q.id);
    var p = getProgress(q.id);
    var pct = (p && q.questions.length) ? Math.round((p.idx / q.questions.length) * 100) : 0;
    setMeta(q.title + " - Bored Tasks Quiz", q.description, imgUrl(q.image, 1200));
    injectQuizJsonLd(q);

    return '<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-teal-500">Home</a> / <a href="#/quizzes/' + q.category + '" class="hover:text-teal-500">' + esc(cat.name) + '</a> / <span class="text-slate-600 dark:text-slate-300">Quiz</span></nav>' +
      '<div class="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">' +
        '<div class="relative aspect-[16/9]"><img src="' + imgUrl(q.image, 1100) + '" alt="' + esc(q.title) + '" class="h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>' +
          '<div class="absolute bottom-0 p-6"><span class="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase text-slate-700">' + esc(cat.name) + (q.type === "trivia" ? " · Trivia" : " · Personality") + '</span><h1 class="mt-2 text-2xl font-black text-white sm:text-4xl">' + esc(q.title) + '</h1></div>' +
        '</div>' +
        '<div class="p-6 sm:p-8">' +
          '<p class="text-lg text-slate-600 dark:text-slate-300">' + esc(q.tagline || q.description) + '</p>' +
          '<div class="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">' +
            '<span class="inline-flex items-center gap-1.5">' + icon("list") + q.questions.length + ' questions</span>' +
            '<span class="inline-flex items-center gap-1.5">' + icon("clock") + (q.estMinutes || 3) + ' min</span>' +
            '<span class="inline-flex items-center gap-1.5 text-teal-500">' + icon("users") + fmt(q.takenCount) + ' people took this</span>' +
          '</div>' +
          // social proof avatars
          '<div class="mt-4 flex items-center gap-2"><div class="flex -space-x-2">' + [0,1,2,3,4].map(function(i){return '<span class="inline-block h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br '+["from-indigo-400 to-indigo-600","from-violet-400 to-violet-600","from-purple-400 to-purple-600","from-fuchsia-400 to-fuchsia-600","from-indigo-400 to-violet-500"][i]+' dark:border-slate-900"></span>';}).join("")+'</div><span class="text-sm text-slate-500 dark:text-slate-400"><strong class="text-slate-700 dark:text-slate-200">' + (95 + (q.id.length % 5)) + '%</strong> said it was scarily accurate</span></div>' +

          (resume ? '<div class="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-500/30 dark:bg-teal-500/10"><p class="text-sm font-semibold text-teal-700 dark:text-teal-300">You\'re ' + pct + '% through this quiz. Pick up where you left off!</p><div class="mt-2 h-2 overflow-hidden rounded-full bg-teal-200 dark:bg-teal-500/20"><div class="h-full rounded-full bg-teal-500" style="width:' + pct + '%"></div></div></div>' : "") +

          '<div class="mt-6 flex flex-col gap-3 sm:flex-row">' +
            (resume
              ? '<a href="#/quiz/' + q.id + '?play=1" class="flex-1 rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-6 py-4 text-center text-base font-extrabold text-slate-900 shadow-lg transition hover:scale-[1.02]">▶ Resume Quiz</a><button data-reset-quiz="' + q.id + '" class="rounded-xl border border-slate-300 px-6 py-4 text-base font-bold text-slate-600 transition hover:border-coral-400 hover:text-coral-500 dark:border-slate-700 dark:text-slate-300">Start over</button>'
              : '<a href="#/quiz/' + q.id + '?play=1" class="flex-1 rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-6 py-4 text-center text-base font-extrabold text-slate-900 shadow-lg transition hover:scale-[1.02]">Start Quiz →</a>') +
          '</div>' +
          adSlot("quiz-intro", 100) +
        '</div>' +
      '</div>' +
      // related
      '<div class="mt-10">' + sectionHead("More like this", "", ["All quizzes", "#/quizzes"]) +
        '<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">' + D.quizzes.filter(function (x) { return x.category === q.category && x.id !== q.id; }).slice(0, 3).map(quizCard).join("") + '</div>' +
      '</div></div>';
  }

  /* ===== QUIZ PLAYER (one question at a time) ============================ */
  var QP = null; // active quiz player state
  var SP = null; // active Story Mode player state { story, node }
  function startQuiz(id) {
    var q = qById(id);
    if (!q) { location.hash = "#/quizzes"; return; } // invalid id -> bounce (avoids re-render loop)
    var p = getProgress(id);
    QP = {
      quiz: q,
      // Shuffle each question's options so the correct answer (trivia) isn't
      // always option A. Seeded by quiz id + index => stable across reloads, so
      // saved answer positions stay valid when resuming.
      qs: q.questions.map(function (qq, i) {
        return { q: qq.q, image: qq.image, options: seededShuffle(qq.options.slice(), id + ":" + i) };
      }),
      idx: (p && typeof p.idx === "number") ? Math.min(p.idx, q.questions.length - 1) : 0,
      answers: (p && p.answers && p.answers.length === q.questions.length) ? p.answers.slice() : q.questions.map(function () { return null; })
    };
    setMeta("Taking: " + q.title + " - Bored Tasks", q.description, imgUrl(q.image, 1200));
    renderPlayer();
  }

  // Deterministic shuffle (FNV-1a hash -> mulberry32 PRNG -> Fisher-Yates).
  function seededShuffle(arr, seed) {
    var h = 2166136261 >>> 0;
    for (var k = 0; k < seed.length; k++) { h ^= seed.charCodeAt(k); h = Math.imul(h, 16777619); }
    function rnd() { h |= 0; h = h + 0x6D2B79F5 | 0; var t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
    return arr;
  }

  // Renders one question. UX: tapping an answer auto-advances (one tap per
  // question). A single "Back" control returns to the previous question.
  function renderPlayer() {
    var q = QP.quiz, i = QP.idx, question = QP.qs[i]; // QP.qs holds shuffled options
    var last = q.questions.length - 1;
    var pct = Math.round((i / q.questions.length) * 100);
    var answered = QP.answers[i];
    QP._locked = false; // unlock taps for the freshly-rendered question
    var check = '<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

    app.innerHTML = '<div class="mx-auto max-w-2xl px-4 py-6 sm:px-6">' +
      // top bar: exit (X) + progress + reset
      '<div class="flex items-center gap-3">' +
        '<a href="#/quiz/' + q.id + '" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Exit quiz"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></a>' +
        '<div class="flex-1"><div class="flex justify-between text-xs font-bold text-slate-400"><span>Question ' + (i + 1) + ' of ' + q.questions.length + '</span><span>' + pct + '%</span></div>' +
        '<div class="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div class="h-full rounded-full bg-gradient-to-r from-teal-400 to-coral-500 transition-all duration-500" style="width:' + pct + '%"></div></div></div>' +
        '<button data-reset-quiz="' + q.id + '" class="text-xs font-semibold text-slate-400 hover:text-coral-500">Reset</button>' +
      '</div>' +

      '<div class="bt-fade-in mt-7">' +
        (question.image ? '<div class="mb-5 overflow-hidden rounded-2xl shadow-md"><img loading="lazy" src="' + imgUrl(question.image, 900) + '" alt="" class="h-48 w-full object-cover sm:h-60"></div>' : "") +
        '<h2 class="text-2xl font-black leading-tight text-slate-900 dark:text-white sm:text-3xl">' + esc(question.q) + '</h2>' +
        '<p class="mt-2 text-sm font-semibold text-slate-400">' + (i === last ? "Tap your answer to see your result ✨" : "Tap an answer to continue") + '</p>' +
        '<div class="mt-5 space-y-3">' +
          question.options.map(function (opt, oi) {
            var sel = answered === oi;
            return '<button data-opt="' + oi + '" class="bt-option group flex w-full items-center gap-3 rounded-2xl border-2 ' + (sel ? "is-selected border-teal-400" : "border-slate-200 dark:border-slate-700") + ' bg-white px-5 py-4 text-left transition hover:border-teal-400 hover:bg-slate-50 active:scale-[.99] dark:bg-slate-900 dark:hover:bg-slate-800">' +
              '<span data-letter class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ' + (sel ? "border-teal-400 bg-teal-400 text-white" : "border-slate-300 text-slate-400 dark:border-slate-600") + ' text-xs font-bold">' + String.fromCharCode(65 + oi) + '</span>' +
              '<span class="font-semibold text-slate-700 dark:text-slate-200">' + esc(opt.text) + '</span>' +
              '<span data-check class="ml-auto ' + (sel ? "text-teal-500" : "text-transparent") + '">' + check + '</span></button>';
          }).join("") +
        '</div>' +
      '</div>' +

      // single Back control (to previous question, or back to the intro on Q1)
      '<div class="mt-7">' +
        '<button data-prev class="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>' +
      '</div>' +
      '<p class="mt-2 text-center text-xs text-slate-400">💾 Progress saves automatically - close the tab and come back anytime.</p>' +
      '</div>';

    // Tap an answer -> brief confirmation flash -> auto-advance (or finish).
    app.querySelectorAll("[data-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (QP._locked) return;
        QP._locked = true;
        QP.answers[QP.idx] = parseInt(b.getAttribute("data-opt"), 10);
        saveProgress(QP.quiz.id, QP.idx, QP.answers);
        // immediate visual confirmation on the tapped option
        app.querySelectorAll("[data-opt]").forEach(function (x) {
          x.classList.remove("is-selected", "border-teal-400");
          var l = x.querySelector("[data-letter]"); if (l) { l.classList.remove("bg-teal-400", "border-teal-400", "text-white"); l.classList.add("border-slate-300", "text-slate-400"); }
          var c = x.querySelector("[data-check]"); if (c) { c.classList.add("text-transparent"); c.classList.remove("text-teal-500"); }
        });
        b.classList.add("is-selected", "border-teal-400");
        var bl = b.querySelector("[data-letter]"); if (bl) { bl.classList.add("bg-teal-400", "border-teal-400", "text-white"); bl.classList.remove("border-slate-300", "text-slate-400"); }
        var bc = b.querySelector("[data-check]"); if (bc) { bc.classList.remove("text-transparent"); bc.classList.add("text-teal-500"); }
        setTimeout(function () {
          if (QP.idx === QP.quiz.questions.length - 1) { finishQuiz(); }
          else { QP.idx++; saveProgress(QP.quiz.id, QP.idx, QP.answers); renderPlayer(); window.scrollTo(0, 0); }
        }, 260);
      });
    });
    var pv = app.querySelector("[data-prev]");
    if (pv) pv.addEventListener("click", function () {
      if (QP.idx > 0) { QP.idx--; saveProgress(QP.quiz.id, QP.idx, QP.answers); renderPlayer(); window.scrollTo(0, 0); }
      else { location.hash = "#/quiz/" + QP.quiz.id; } // on Q1, Back returns to the quiz intro
    });
    // Reset (wire here since renderPlayer re-renders without wireCommon)
    var rs = app.querySelector("[data-reset-quiz]");
    if (rs) rs.addEventListener("click", function () {
      var id = rs.getAttribute("data-reset-quiz");
      clearProgress(id); LS.del(resultKey(id)); QP = null; location.hash = "#/quiz/" + id; render();
    });
    window.scrollTo(0, 0);
  }

  function finishQuiz() {
    var q = QP.quiz, resKey;
    if (q.type === "trivia") {
      var correct = 0;
      QP.answers.forEach(function (a, i) { if (a != null && QP.qs[i].options[a] && QP.qs[i].options[a].correct) correct++; });
      var pct = Math.round((correct / q.questions.length) * 100);
      // results sorted desc by minPct; pick first tier we clear
      var tier = q.results.slice().sort(function (a, b) { return b.minPct - a.minPct; }).filter(function (r) { return pct >= r.minPct; })[0] || q.results[q.results.length - 1];
      resKey = tier.key;
      LS.set(resultKey(q.id), { key: resKey, score: correct, total: q.questions.length, pct: pct, at: Date.now() });
    } else {
      var tally = {};
      QP.answers.forEach(function (a, i) {
        if (a == null) return;
        var opt = QP.qs[i].options[a];
        if (opt && opt.points) Object.keys(opt.points).forEach(function (k) { tally[k] = (tally[k] || 0) + opt.points[k]; });
      });
      var best = null, bestN = -1;
      q.results.forEach(function (r) { var v = tally[r.key] || 0; if (v > bestN) { bestN = v; best = r; } });
      resKey = (best || q.results[0]).key;
      LS.set(resultKey(q.id), { key: resKey, tally: tally, at: Date.now() });
    }
    clearProgress(q.id); // finished - clear in-progress save
    location.hash = "#/results/" + q.id;
  }

  function viewResults(id) {
    var q = qById(id);
    if (!q) return viewNotFound();
    var saved = LS.get(resultKey(id));
    if (!saved) { location.hash = "#/quiz/" + id; return ""; }
    var res = q.results.filter(function (r) { return r.key === saved.key; })[0] || q.results[0];
    setMeta("My result: " + res.title + " - " + q.title, res.description, imgUrl(res.image, 1200));

    var scoreLine = (q.type === "trivia" && saved.score != null)
      ? '<div class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">You scored ' + saved.score + '/' + saved.total + ' · ' + saved.pct + '%</div>' : "";

    var shareLine = 'I got "' + res.title + '" on ' + q.title + ' 😂 - find out yours:';

    return '<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">' +
      '<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 bt-fade-up">' +
        '<div class="relative bg-gradient-to-br from-teal-400 via-coral-500 to-lime-400 p-1">' +
          '<div class="relative overflow-hidden rounded-t-[1.4rem]"><img src="' + imgUrl(res.image, 1100) + '" alt="' + esc(res.title) + '" class="h-60 w-full object-cover sm:h-72"><div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>' +
            '<div class="absolute bottom-0 w-full p-6 text-white"><p class="text-sm font-bold uppercase tracking-widest text-white/80">Your result</p><h1 class="mt-1 text-3xl font-black sm:text-4xl">' + res.emoji + ' ' + esc(res.title) + '</h1>' + scoreLine + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="p-6 sm:p-8">' +
          '<p class="text-lg leading-relaxed text-slate-600 dark:text-slate-300">' + esc(res.description) + '</p>' +
          (res.share ? '<blockquote class="mt-4 rounded-2xl bg-slate-100 p-4 text-center text-lg font-bold italic text-slate-700 dark:bg-slate-800 dark:text-slate-200">"' + esc(res.share) + '"</blockquote>' : "") +

          // SHARE - TikTok & Instagram have no public web share intent, so those
          // copy the link + prompt the user to paste it in-app (the realistic flow).
          '<div class="mt-6"><p class="mb-3 text-center text-sm font-bold text-slate-500 dark:text-slate-400">📣 Share your result &amp; tag a friend who needs this</p>' +
            shareRow(shareLine, location.href) +
          '</div>' +

          adSlot("results", 250) +

          '<div class="mt-2 flex flex-col gap-3 sm:flex-row">' +
            '<a href="#/quiz/' + q.id + '?play=1&restart=1" class="flex-1 rounded-xl border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 transition hover:border-teal-400 dark:border-slate-700 dark:text-slate-200">↻ Retake quiz</a>' +
            '<a href="#/quizzes" class="flex-1 rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-6 py-3 text-center font-extrabold text-slate-900 shadow-lg transition hover:scale-[1.02]">More quizzes →</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mt-10">' + sectionHead("Try these next") + '<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">' + D.quizzes.filter(function (x) { return x.id !== q.id; }).sort(function (a, b) { return b.takenCount - a.takenCount; }).slice(0, 3).map(quizCard).join("") + '</div></div>' +
      '</div>';
  }

  function shareBtn(href, label, cls, ico) {
    return '<a href="' + href + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow transition hover:scale-105 ' + cls + '">' + shareIco(ico) + label + '</a>';
  }
  // TikTok/Instagram: no web share intent exists, so copy the link + toast.
  function socialCopyBtn(label, cls, ico) {
    return '<button data-social-copy="' + label + '" class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow transition hover:scale-105 ' + cls + '">' + shareIco(ico) + label + '</button>';
  }
  function shareIco(name) {
    var p = {
      share: '<path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M12 16V3M8 7l4-4 4 4"/>',
      link: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
      x: '<path d="M4 4l16 16M20 4L4 20"/>',
      facebook: '<path d="M14 8h3V4h-3c-2 0-3 1.5-3 3.5V10H8v4h3v6h4v-6h3l1-4h-4V8z"/>',
      whatsapp: '<path d="M3 21l1.6-5A8 8 0 1112 20a8 8 0 01-4.4-1.3L3 21z"/>',
      reddit: '<circle cx="12" cy="13" r="7"/><circle cx="9.5" cy="13" r="1" fill="currentColor"/><circle cx="14.5" cy="13" r="1" fill="currentColor"/><path d="M9.5 16c1.5 1 3.5 1 5 0"/>',
      tiktok: '<path d="M15 4c.4 2 1.8 3.4 4 3.7v3c-1.5 0-2.9-.4-4-1.2V15a5 5 0 11-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 101.5 1.9V4z"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>'
    }[name];
    return p ? '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>' : "";
  }
  // The full social-share button row, shared by quiz results, Daily Dare and
  // story endings. Pass RAW (unencoded) text + url; encoding happens here.
  // Returns just the button row; callers supply their own heading/wrapper.
  function shareRow(rawText, rawUrl) {
    var shareText = encodeURIComponent(rawText);
    var shareUrl = encodeURIComponent(rawUrl);
    return '<div class="flex flex-wrap justify-center gap-2">' +
      '<button data-share class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-5 py-3 text-sm font-extrabold text-slate-900 shadow transition hover:scale-105">' + shareIco("share") + 'Share</button>' +
      socialCopyBtn("TikTok", "bg-black text-white", "tiktok") +
      socialCopyBtn("Instagram", "bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white", "instagram") +
      shareBtn("https://twitter.com/intent/tweet?text=" + shareText + "&url=" + shareUrl, "X", "bg-black text-white", "x") +
      shareBtn("https://api.whatsapp.com/send?text=" + shareText + "%20" + shareUrl, "WhatsApp", "bg-[#25d366] text-white", "whatsapp") +
      shareBtn("https://www.facebook.com/sharer/sharer.php?u=" + shareUrl, "Facebook", "bg-[#1877f2] text-white", "facebook") +
      shareBtn("https://www.reddit.com/submit?url=" + shareUrl + "&title=" + shareText, "Reddit", "bg-[#ff4500] text-white", "reddit") +
      '<button data-copy class="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-teal-400 dark:border-slate-700 dark:text-slate-300">' + shareIco("link") + 'Copy link</button>' +
    '</div>';
  }

  /* ===== BOREDOM BUSTERS ================================================= */
  var activeMood = "All";
  function viewBoredom() {
    setMeta("Things To Do When Bored - 50+ Boredom Busters | Bored Tasks",
      "Bored right now? Pick from 50+ fun things to do - indoor, outdoor, creative, lazy, social and 5-minute fixes. Or hit the random task button and let us decide.",
      imgUrl(D.activities[0] && D.activities[0].image, 1200));
    var moods = ["All", "5-Minute Fixes", "Indoor", "Outdoor", "Creative", "Lazy", "Social", "Energetic"];
    var list = activeMood === "All" ? D.activities : D.activities.filter(function (a) { return a.moods.indexOf(activeMood) > -1; });

    return '<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">' +
      '<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-8 text-white shadow-xl sm:p-12">' +
        '<div class="bt-blob-shape bt-blob right-0 top-0 h-56 w-56" style="background:#f0abfc"></div>' +
        '<div class="relative max-w-2xl"><span class="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider">The Boredom Busters Hub</span>' +
          '<h1 class="mt-3 text-3xl font-black sm:text-5xl">Bored? Not for long.</h1>' +
          '<p class="mt-3 max-w-lg text-white/90">' + D.activities.length + '+ fun, random things to do - sorted by mood and energy. Filter below, or smash the button and let fate decide.</p>' +
          '<button data-random-task class="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-600 shadow-lg transition hover:scale-105">' + icon("dice") + ' Give me a random task</button>' +
        '</div>' +
      '</div>' +
      '<div class="bt-carousel -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">' +
        moods.map(function (m) { return '<button data-mood="' + m + '" class="bt-chip ' + (activeMood === m ? "is-active" : "") + '">' + esc(m) + '</button>'; }).join("") +
      '</div>' +
      '<p class="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Showing <strong>' + list.length + '</strong> ideas' + (activeMood !== "All" ? ' for "' + esc(activeMood) + '"' : "") + '.</p>' +
      adSlot("boredom-top", 90) +
      '<div class="bt-stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">' + list.map(activityCard).join("") + '</div>' +
      '</div>';
  }

  /* ===== CATEGORIES (mixes quizzes + activity moods) ===================== */
  function viewCategories() {
    setMeta("All Categories - Quizzes & Activities | Bored Tasks",
      "Browse every Bored Tasks category - personality quizzes, trivia, love, pop culture and mood-based boredom busters. Find your next obsession.",
      imgUrl(D.quizzes[0] && D.quizzes[0].image, 1200));
    return '<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">' +
      '<h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Browse everything</h1>' +
      '<p class="mt-2 text-slate-500 dark:text-slate-400">Quizzes and activities, neatly sorted. Tap in and start curing boredom.</p>' +
      '<h2 class="mt-8 text-xl font-extrabold text-slate-900 dark:text-white">🧠 Quiz categories</h2>' +
      '<div class="bt-stagger mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">' + D.categories.map(categoryTile).join("") + '</div>' +
      adSlot("categories", 90) +
      '<h2 class="mt-10 text-xl font-extrabold text-slate-900 dark:text-white">💡 Activity moods</h2>' +
      '<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">' +
        ["5-Minute Fixes", "Indoor", "Outdoor", "Creative", "Lazy", "Social", "Energetic"].map(function (m) {
          var n = D.activities.filter(function (a) { return a.moods.indexOf(m) > -1; }).length;
          return '<button data-mood-go="' + m + '" class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"><h3 class="font-extrabold text-slate-900 dark:text-white">' + esc(m) + '</h3><p class="mt-1 text-xs font-bold text-teal-500">' + n + ' ideas →</p></button>';
        }).join("") +
      '</div></div>';
  }

  /* ===== VIBE CHECK ===================================================== */
  // Grid of big clickable mood cards (shared by the Vibe page + homepage).
  function vibeGrid() {
    return '<div class="bt-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">' +
      D.vibes.map(function (v) {
        return '<a href="#/vibe/' + v.key + '" class="group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br ' + v.grad + ' p-3 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">' +
          '<span class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-xl"></span>' +
          '<span class="text-4xl transition duration-300 group-hover:scale-125 sm:text-5xl">' + v.emoji + '</span>' +
          '<span class="text-sm font-extrabold leading-tight drop-shadow sm:text-base">' + esc(v.label) + '</span>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  function viewVibe() {
    setMeta("Vibe Check - What's Your Mood? | Bored Tasks",
      "Tell us how you're feeling and we'll match you with the perfect quiz, activity, read and a wildcard. The Bored Tasks mood machine.",
      imgUrl(D.vibes[0] && D.vibes[0] && (qById(D.vibes[0].quiz) || {}).image, 1200));
    var lastKey = LS.get("bt_last_vibe");
    var last = lastKey ? vibeById(lastKey) : null;
    return '<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-indigo-500">Home</a> / <span class="text-slate-600 dark:text-slate-300">Vibe Check</span></nav>' +
      '<div class="mt-4 text-center">' +
        '<span class="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">✨ The Mood Machine</span>' +
        '<h1 class="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">How are you <span class="bt-gradient-text">actually</span> feeling?</h1>' +
        '<p class="mx-auto mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">Tap your mood and we\'ll build you a little lineup: a quiz, a thing to do, something to read, and one wildcard. No overthinking. Just vibes.</p>' +
      '</div>' +
      (last ? '<div class="mx-auto mt-6 max-w-md text-center"><a href="#/vibe/' + last.key + '" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">' + last.emoji + ' Last time you felt <strong class="text-slate-800 dark:text-white">' + esc(last.label) + '</strong> - see it again →</a></div>' : "") +
      '<div class="mt-8">' + vibeGrid() + '</div>' +
      adSlot("vibe", 90) +
    '</div>';
  }

  function viewVibeResult(key) {
    var v = vibeById(key);
    if (!v) { location.hash = "#/vibe"; return ""; }
    LS.set("bt_last_vibe", key); // remember the user's last vibe
    var quiz = qById(v.quiz), act = actById(v.activity), post = blogBySlug(v.blog);
    var img = imgUrl((quiz && quiz.image) || (act && act.image), 1200);
    setMeta(v.title + " - Vibe Check | Bored Tasks", v.desc, img);
    var savedVibe = (LS.get("bt_saved_vibe") || {}).key === key;

    function labeled(label, inner) { return '<div><p class="mb-2 text-xs font-black uppercase tracking-wider text-indigo-500">' + label + '</p>' + inner + '</div>'; }

    return '<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-indigo-500">Home</a> / <a href="#/vibe" class="hover:text-indigo-500">Vibe Check</a> / <span class="text-slate-600 dark:text-slate-300">' + esc(v.label) + '</span></nav>' +

      // RESULT HERO
      '<div class="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br ' + v.grad + ' p-1 shadow-xl bt-fade-up">' +
        '<div class="relative overflow-hidden rounded-[1.35rem]">' +
          '<img src="' + img + '" alt="' + esc(v.title) + '" class="h-64 w-full object-cover sm:h-80">' +
          '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>' +
          '<div class="absolute bottom-0 w-full p-6 text-white sm:p-8">' +
            '<span class="text-5xl sm:text-6xl">' + v.emoji + '</span>' +
            '<h1 class="mt-2 text-3xl font-black leading-tight sm:text-4xl">' + esc(v.title) + '</h1>' +
            '<p class="mt-2 max-w-2xl text-white/90">' + esc(v.desc) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // RECOMMENDATIONS
      '<h2 class="mt-10 text-2xl font-extrabold text-slate-900 dark:text-white">Your personalised lineup</h2>' +
      '<p class="mt-1 text-slate-500 dark:text-slate-400">Hand-picked for exactly this mood.</p>' +
      '<div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">' +
        (quiz ? labeled("🧠 Take this quiz", quizCard(quiz)) : "") +
        (act ? labeled("💡 Try this task", activityCard(act)) : "") +
        (post ? labeled("📖 Read this", blogCard(post)) : "") +
      '</div>' +

      // WILDCARD
      '<div class="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br ' + v.grad + ' p-6 text-white shadow-lg sm:p-8">' +
        '<p class="text-xs font-black uppercase tracking-widest text-white/80">🃏 Your wildcard</p>' +
        '<p class="mt-2 text-xl font-extrabold leading-snug sm:text-2xl">' + esc(v.wildcard) + '</p>' +
      '</div>' +

      // ACTIONS
      '<div class="mt-8 flex flex-col gap-3 sm:flex-row">' +
        '<a href="#/vibe" class="flex-1 rounded-xl border border-slate-300 px-6 py-4 text-center font-bold text-slate-700 transition hover:border-indigo-400 dark:border-slate-700 dark:text-slate-200">↺ Try another vibe</a>' +
        '<button data-save-vibe="' + v.key + '" class="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-center font-extrabold text-white shadow-lg transition hover:scale-[1.02]">' + (savedVibe ? "★ Saved" : "☆ Save this recommendation") + '</button>' +
      '</div>' +
      adSlot("vibe-result", 100) +
    '</div>';
  }

  /* ===== SEARCH ========================================================= */
  function viewSearch(q) {
    q = (q || "").trim();
    setMeta((q ? '"' + q + '" - Search' : "Search") + " - Bored Tasks", "Search Bored Tasks quizzes, activities and articles.", "");
    var ql = q.toLowerCase();
    var quizzes = q ? D.quizzes.filter(function (x) { return (x.title + " " + x.description + " " + (catById(x.category) || {}).name).toLowerCase().indexOf(ql) > -1; }) : [];
    var acts = q ? D.activities.filter(function (x) { return (x.title + " " + x.description + " " + x.moods.join(" ")).toLowerCase().indexOf(ql) > -1; }) : [];
    var posts = q ? D.blogPosts.filter(function (x) { return (x.title + " " + x.excerpt).toLowerCase().indexOf(ql) > -1; }) : [];
    var total = quizzes.length + acts.length + posts.length;

    return '<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">' +
      '<h1 class="text-3xl font-black text-slate-900 dark:text-white">Search</h1>' +
      '<form data-search-form class="mt-4 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">' +
        '<svg viewBox="0 0 24 24" class="ml-2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<input name="q" value="' + esc(q) + '" autofocus placeholder="Try \'love\', \'trivia\', \'bored at home\'..." class="w-full bg-transparent px-1 py-2 text-slate-900 focus:outline-none dark:text-white" aria-label="Search">' +
        '<button class="rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-5 py-2.5 text-sm font-bold text-slate-900">Search</button>' +
      '</form>' +
      (q ? '<p class="mt-4 text-slate-500 dark:text-slate-400"><strong>' + total + '</strong> results for "' + esc(q) + '"</p>' : '<p class="mt-4 text-slate-500 dark:text-slate-400">Type above to search across quizzes, activities and articles.</p>') +
      (quizzes.length ? '<section class="mt-6"><h2 class="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">Quizzes (' + quizzes.length + ')</h2><div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">' + quizzes.map(quizCard).join("") + '</div></section>' : "") +
      (acts.length ? '<section class="mt-8"><h2 class="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">Activities (' + acts.length + ')</h2><div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">' + acts.map(activityCard).join("") + '</div></section>' : "") +
      (posts.length ? '<section class="mt-8"><h2 class="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">Articles (' + posts.length + ')</h2><div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">' + posts.map(blogCard).join("") + '</div></section>' : "") +
      (q && total === 0 ? '<div class="mt-10 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><p class="text-lg font-bold text-slate-700 dark:text-slate-200">No matches 😕</p><p class="mt-1 text-slate-500">Try a broader word - or just <a href="#/boredom-busters" class="font-bold text-teal-500">grab a random task</a>.</p></div>' : "") +
      '</div>';
  }

  function viewNotFound() {
    setMeta("Page not found - Bored Tasks", "That page wandered off. Here's something fun instead.", "");
    return '<div class="mx-auto max-w-xl px-4 py-24 text-center"><p class="text-7xl font-black bt-gradient-text">404</p><h1 class="mt-4 text-2xl font-black text-slate-900 dark:text-white">Well, this is boring.</h1><p class="mt-2 text-slate-500 dark:text-slate-400">The page you wanted doesn\'t exist - but boredom won\'t wait.</p><div class="mt-6 flex justify-center gap-3"><a href="#/" class="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white dark:bg-white dark:text-slate-900">Home</a><a href="#/quizzes" class="rounded-xl bg-gradient-to-r from-teal-400 to-coral-500 px-6 py-3 font-extrabold text-slate-900">Take a quiz</a></div></div>';
  }

  /* ===== Daily featured task (deterministic by date) ===================== */
  function dailyTask() {
    if (!D.activities.length) return { title: "", description: "", time: "", difficulty: "", moods: [], image: "" };
    var now = new Date();
    var seed = now.getFullYear() * 1000 + (now.getMonth() + 1) * 50 + now.getDate();
    return D.activities[seed % D.activities.length];
  }
  function totalTaken() { return D.quizzes.reduce(function (s, q) { return s + (q.takenCount || 0); }, 0); }

  /* ===== DAILY DARE ===================================================== */
  // Today's dare is chosen deterministically from the date (same for everyone,
  // refreshes at local midnight). Same seed math as dailyTask().
  function dareSeed() { var n = new Date(); return n.getFullYear() * 1000 + (n.getMonth() + 1) * 50 + n.getDate(); }
  function dareOfDay() { return D.dares.length ? D.dares[dareSeed() % D.dares.length] : null; }
  function isDareDone(id) { return (LS.get("bt_dares_done") || []).indexOf(id) > -1; }
  // Deterministic "completed today" count in [1000, 40000], stable for the day.
  // Math.imul keeps the multiply exact 32-bit (same trick as seededShuffle).
  function dareCount(seedNum) { var x = Math.imul(seedNum >>> 0, 2654435761) >>> 0; return 1000 + (x % 39001); }
  // Difficulty pill colors for dares. Separate from diffClass() (activities),
  // which only knows Easy/Hard - dares add Spicy + Legendary.
  function dareDiffClass(d) {
    return d === "Easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : d === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      : d === "Spicy" ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300"; // Legendary
  }

  function viewDailyDare() {
    var dare = dareOfDay();
    if (!dare) { location.hash = "#/"; return ""; }
    var done = isDareDone(dare.id);
    var count = dareCount(dareSeed());
    setMeta("Today's Daily Dare: " + dare.title + " | Bored Tasks",
      "Today's dare - " + dare.description + " A fresh, bold challenge every single day. Mark it done and dare a friend.",
      "");
    return '<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-indigo-500">Home</a> / <span class="text-slate-600 dark:text-slate-300">Daily Dare</span></nav>' +
      '<div class="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-1 shadow-xl bt-fade-up">' +
        '<div class="rounded-[1.35rem] bg-white p-6 dark:bg-slate-900 sm:p-8">' +
          '<div class="flex items-center justify-between gap-3">' +
            '<span class="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">🎯 Today\'s Dare</span>' +
            '<span class="rounded-full px-3 py-1 text-xs font-extrabold ' + dareDiffClass(dare.difficulty) + '">' + esc(dare.difficulty) + '</span>' +
          '</div>' +
          '<div class="mt-5 text-center">' +
            '<div class="text-6xl sm:text-7xl">' + dare.emoji + '</div>' +
            '<h1 class="mt-4 text-3xl font-black leading-tight text-slate-900 dark:text-white sm:text-4xl">' + esc(dare.title) + '</h1>' +
            '<p class="mx-auto mt-3 max-w-xl text-lg text-slate-500 dark:text-slate-400">' + esc(dare.description) + '</p>' +
          '</div>' +
          '<div class="mt-5 flex flex-wrap items-center justify-center gap-2">' +
            '<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">' + icon("clock") + esc(dare.time) + '</span>' +
            (dare.tags || []).map(function (t) { return '<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">#' + esc(t) + '</span>'; }).join("") +
          '</div>' +
          '<div class="mt-6 grid gap-3 sm:grid-cols-2">' +
            '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/50"><p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">Refreshes in</p><p class="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white" data-dare-countdown>00:00:00</p></div>' +
            '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/50"><p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">Completed today</p><p class="mt-1 text-2xl font-black bt-gradient-text">' + fmt(count) + '</p></div>' +
          '</div>' +
          '<button data-dare-done="' + dare.id + '" class="mt-5 w-full rounded-xl px-6 py-4 text-base font-extrabold shadow-lg transition hover:scale-[1.01] ' + (done ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white") + '">' + (done ? "✓ Completed - you legend" : "○ Mark as Completed") + '</button>' +
          '<div class="mt-5"><p class="mb-3 text-center text-sm font-bold text-slate-500 dark:text-slate-400">📣 Dare a friend to try it too</p>' + shareRow("Today's Bored Tasks dare: " + dare.title + " 🎯 Think you can do it?", location.href) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mt-6 text-center"><a href="#/daily-dare/archive" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">🗂️ Browse the full Dare Vault (' + D.dares.length + ')</a></div>' +
      adSlot("daily-dare", 90) +
    '</div>';
  }

  function viewDareArchive() {
    var todayId = (dareOfDay() || {}).id;
    setMeta("The Dare Vault - Every Daily Dare | Bored Tasks",
      "Browse all " + D.dares.length + " Bored Tasks dares - Easy, Medium, Spicy and Legendary challenges to crush boredom and dare your friends.",
      "");
    var cards = D.dares.map(function (dare) {
      var done = isDareDone(dare.id), isToday = dare.id === todayId;
      return '<div class="relative flex flex-col rounded-2xl border ' + (isToday ? "border-indigo-400 ring-2 ring-indigo-400/40" : "border-slate-200 dark:border-slate-800") + ' bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">' +
        (isToday ? '<span class="absolute -top-2 left-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow">Today</span>' : "") +
        (done ? '<span class="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">Done</span>' : "") +
        '<div class="flex items-start gap-3"><span class="text-3xl">' + dare.emoji + '</span>' +
          '<h3 class="min-w-0 font-extrabold leading-snug text-slate-900 dark:text-white">' + esc(dare.title) + '</h3></div>' +
        '<p class="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">' + esc(dare.description) + '</p>' +
        '<div class="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400">' +
          '<span class="rounded-full px-2 py-0.5 ' + dareDiffClass(dare.difficulty) + '">' + esc(dare.difficulty) + '</span>' +
          '<span class="inline-flex items-center gap-1">' + icon("clock") + esc(dare.time) + '</span>' +
        '</div>' +
      '</div>';
    }).join("");
    return '<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-indigo-500">Home</a> / <a href="#/daily-dare" class="hover:text-indigo-500">Daily Dare</a> / <span class="text-slate-600 dark:text-slate-300">The Vault</span></nav>' +
      '<div class="mt-4 text-center">' +
        '<h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">The <span class="bt-gradient-text">Dare Vault</span></h1>' +
        '<p class="mx-auto mt-3 max-w-xl text-lg text-slate-500 dark:text-slate-400">Every dare in the rotation. One gets the spotlight each day, but you can attempt any of them whenever boredom strikes.</p>' +
      '</div>' +
      adSlot("dare-archive", 90) +
      '<div class="bt-stagger mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">' + cards + '</div>' +
    '</div>';
  }

  // Homepage "Today's Dare" hook (returns "" if no dares are loaded).
  function homeDareBand() {
    var dare = dareOfDay();
    if (!dare) return "";
    return '<section class="pt-6">' +
      '<a href="#/daily-dare" class="group block overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-1 shadow-xl transition hover:shadow-2xl">' +
        '<div class="flex flex-col items-center gap-5 rounded-[1.35rem] bg-white p-6 dark:bg-slate-900 sm:flex-row sm:p-7">' +
          '<div class="shrink-0 text-6xl sm:text-7xl">' + dare.emoji + '</div>' +
          '<div class="min-w-0 flex-1 text-center sm:text-left">' +
            '<div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">' +
              '<span class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">🎯 Today\'s Dare</span>' +
              '<span class="rounded-full px-2.5 py-1 text-xs font-extrabold ' + dareDiffClass(dare.difficulty) + '">' + esc(dare.difficulty) + '</span>' +
            '</div>' +
            '<h3 class="mt-2 text-2xl font-black leading-tight text-slate-900 dark:text-white sm:text-3xl">' + esc(dare.title) + '</h3>' +
            '<p class="mt-1 line-clamp-2 text-slate-500 dark:text-slate-400">' + esc(dare.description) + '</p>' +
            '<p class="mt-2 text-sm font-bold text-indigo-500">' + fmt(dareCount(dareSeed())) + ' people are in today, tap to play →</p>' +
          '</div>' +
        '</div>' +
      '</a>' +
    '</section>';
  }

  /* ===== STORY MODE (choose your own adventure) ========================= */
  function storyById(id) { return D.stories.filter(function (s) { return s.id === id; })[0]; }
  function storyKey(id) { return "bt_story_" + id; }
  function getStory(id) { return LS.get(storyKey(id)); }
  function clearStory(id) { LS.del(storyKey(id)); }
  function storyEndingCount(s) { return Object.keys(s.nodes).filter(function (k) { return s.nodes[k].ending; }).length; }
  // Deterministic ending "rarity" (2-29%), stable per story + ending node.
  function storyRarity(seedStr) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return 2 + ((h >>> 0) % 28);
  }

  function storyCard(s) {
    var prog = getStory(s.id), node = prog && s.nodes[prog.node];
    var status = node ? (node.ending ? "✓ Finished" : "▶ In progress") : "";
    return '<a href="#/story/' + s.id + '" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">' +
      '<div class="relative aspect-[16/10] shrink-0 overflow-hidden">' +
        '<img loading="lazy" src="' + imgUrl(s.image, 700) + '" alt="' + esc(s.title) + '" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">' +
        '<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>' +
        '<span class="absolute left-3 top-3 rounded-full bg-gradient-to-r ' + (s.accent || "from-indigo-500 to-violet-500") + ' px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow">Story</span>' +
        (status ? '<span class="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow dark:bg-slate-900/85 dark:text-slate-100">' + status + '</span>' : "") +
      '</div>' +
      '<div class="flex flex-1 flex-col p-4">' +
        '<h3 class="line-clamp-2 font-extrabold leading-snug text-slate-900 group-hover:text-indigo-600 dark:text-white">' + esc(s.title) + '</h3>' +
        '<p class="mt-1.5 line-clamp-3 flex-1 text-sm text-slate-500 dark:text-slate-400">' + esc(s.blurb) + '</p>' +
        '<div class="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-400">' +
          '<span class="inline-flex items-center gap-1">🪢 ' + storyEndingCount(s) + ' endings</span>' +
          '<span class="ml-auto font-bold text-indigo-500">Play →</span>' +
        '</div>' +
      '</div></a>';
  }

  function viewStories() {
    setMeta("Story Mode - Interactive Choose Your Own Adventure | Bored Tasks",
      "Dive into " + D.stories.length + " chaotic choose your own adventure stories. Make the choices, unlock multiple endings, and share your fate.",
      imgUrl(D.stories[0] && D.stories[0].image, 1200));
    return '<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-indigo-500">Home</a> / <span class="text-slate-600 dark:text-slate-300">Story Mode</span></nav>' +
      '<div class="mt-4 text-center">' +
        '<span class="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">🎭 Story Mode</span>' +
        '<h1 class="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">Pick a path, <span class="bt-gradient-text">live the chaos</span></h1>' +
        '<p class="mx-auto mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">Every story bends to your choices. Multiple endings, zero rules, maximum drama. Your decisions, your fate, your screenshot.</p>' +
      '</div>' +
      adSlot("stories-top", 90) +
      '<div class="bt-stagger mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">' + D.stories.map(storyCard).join("") + '</div>' +
    '</div>';
  }

  function viewStoryIntro(id) {
    var s = storyById(id);
    if (!s) return viewNotFound();
    var prog = getStory(id);
    var hasProg = !!(prog && s.nodes[prog.node]);
    var finished = hasProg && !!s.nodes[prog.node].ending;
    setMeta(s.title + " - Story Mode | Bored Tasks", s.blurb, imgUrl(s.image, 1200));
    return '<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">' +
      '<nav class="text-sm text-slate-400"><a href="#/" class="hover:text-indigo-500">Home</a> / <a href="#/stories" class="hover:text-indigo-500">Story Mode</a> / <span class="text-slate-600 dark:text-slate-300">Story</span></nav>' +
      '<div class="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">' +
        '<div class="relative aspect-[16/9]"><img src="' + imgUrl(s.image, 1100) + '" alt="' + esc(s.title) + '" class="h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>' +
          '<div class="absolute bottom-0 p-6"><span class="rounded-full bg-gradient-to-r ' + (s.accent || "from-indigo-500 to-violet-500") + ' px-3 py-1 text-xs font-black uppercase tracking-wide text-white">Interactive Story</span><h1 class="mt-2 text-2xl font-black text-white sm:text-4xl">' + esc(s.title) + '</h1></div>' +
        '</div>' +
        '<div class="p-6 sm:p-8">' +
          '<p class="text-lg text-slate-600 dark:text-slate-300">' + esc(s.blurb) + '</p>' +
          '<div class="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">' +
            '<span class="inline-flex items-center gap-1.5">🪢 ' + storyEndingCount(s) + ' possible endings</span>' +
            '<span class="inline-flex items-center gap-1.5">🎭 Choices that actually matter</span>' +
          '</div>' +
          (finished ? '<div class="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10"><p class="text-sm font-semibold text-indigo-700 dark:text-indigo-300">You reached an ending last time. Replay to chase a different one.</p></div>'
            : hasProg ? '<div class="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10"><p class="text-sm font-semibold text-indigo-700 dark:text-indigo-300">You have a story in progress. Pick up right where you left off.</p></div>' : "") +
          '<div class="mt-6 flex flex-col gap-3 sm:flex-row">' +
            (hasProg
              ? '<a href="#/story/' + s.id + '?play=1" class="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-center text-base font-extrabold text-white shadow-lg transition hover:scale-[1.02]">▶ ' + (finished ? "See your ending" : "Resume story") + '</a><a href="#/story/' + s.id + '?restart=1&play=1" class="rounded-xl border border-slate-300 px-6 py-4 text-center text-base font-bold text-slate-600 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300">Start over</a>'
              : '<a href="#/story/' + s.id + '?play=1" class="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-center text-base font-extrabold text-white shadow-lg transition hover:scale-[1.02]">Begin story →</a>') +
          '</div>' +
          adSlot("story-intro", 100) +
        '</div>' +
      '</div></div>';
  }

  function startStory(id) {
    var s = storyById(id);
    if (!s) { location.hash = "#/stories"; return; }
    var prog = getStory(id);
    var startNode = (prog && s.nodes[prog.node]) ? prog.node : s.start;
    SP = { story: s, node: startNode, path: (prog && prog.path) ? prog.path.slice() : [] };
    setMeta("Playing: " + s.title + " - Story Mode | Bored Tasks", s.blurb, imgUrl(s.image, 1200));
    renderStoryNode();
  }

  // Renders one story node. Decision nodes show choices (direct listeners, like
  // the quiz player); ending nodes show a shareable summary screen.
  function renderStoryNode() {
    var s = SP.story, node = s.nodes[SP.node];
    if (!node) { location.hash = "#/stories"; return; }
    var img = imgUrl(node.image || s.image, 1100);
    var topBar = '<div class="flex items-center gap-3">' +
      '<a href="#/stories" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Exit story"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></a>' +
      '<div class="min-w-0 flex-1"><p class="truncate text-sm font-extrabold text-slate-900 dark:text-white">' + esc(s.title) + '</p></div>' +
      '<a href="#/story/' + s.id + '?restart=1&play=1" class="shrink-0 text-xs font-semibold text-slate-400 hover:text-indigo-500">↺ Restart</a>' +
    '</div>';

    if (node.ending) {
      var e = node.ending, rare = storyRarity(s.id + ":" + SP.node);
      setMeta(e.title + " - " + s.title + " | Bored Tasks", e.description, img);
      app.innerHTML = '<div class="mx-auto max-w-2xl px-4 py-6 sm:px-6">' + topBar +
        '<div class="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 bt-fade-up">' +
          '<div class="relative bg-gradient-to-br ' + (s.accent || "from-indigo-500 to-violet-500") + ' p-1">' +
            '<div class="relative overflow-hidden rounded-t-[1.4rem]"><img src="' + img + '" alt="' + esc(e.title) + '" class="h-56 w-full object-cover sm:h-64"><div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>' +
              '<div class="absolute bottom-0 w-full p-6 text-white"><p class="text-sm font-bold uppercase tracking-widest text-white/80">Your ending</p><h1 class="mt-1 text-3xl font-black sm:text-4xl">' + e.emoji + ' ' + esc(e.title) + '</h1></div>' +
            '</div>' +
          '</div>' +
          '<div class="p-6 sm:p-8">' +
            (node.text ? '<p class="text-xs font-bold uppercase tracking-wide text-indigo-500">The final scene</p><p class="mt-1 italic text-slate-500 dark:text-slate-400">' + esc(node.text) + '</p>' : "") +
            '<p class="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">' + esc(e.description) + '</p>' +
            (e.share ? '<blockquote class="mt-4 rounded-2xl bg-slate-100 p-4 text-center text-lg font-bold italic text-slate-700 dark:bg-slate-800 dark:text-slate-200">"' + esc(e.share) + '"</blockquote>' : "") +
            '<p class="mt-4 text-center text-sm font-bold text-slate-500 dark:text-slate-400">🪢 Only <span class="bt-gradient-text">' + rare + '%</span> of players reach this ending</p>' +
            '<div class="mt-5"><p class="mb-3 text-center text-sm font-bold text-slate-500 dark:text-slate-400">📣 Share your fate</p>' + shareRow("I got the " + e.title + " ending in " + s.title + " " + e.emoji + " on Bored Tasks. What would you get?", location.href) + '</div>' +
            adSlot("story-ending", 100) +
            '<div class="mt-2 flex flex-col gap-3 sm:flex-row">' +
              '<a href="#/story/' + s.id + '?restart=1&play=1" class="flex-1 rounded-xl border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 transition hover:border-indigo-400 dark:border-slate-700 dark:text-slate-200">↻ Play again</a>' +
              '<a href="#/stories" class="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-center font-extrabold text-white shadow-lg transition hover:scale-[1.02]">Try another story →</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
      window.scrollTo(0, 0);
      wireCommon(); // enable the share/copy/social buttons on the ending screen
      return;
    }

    // Decision node
    app.innerHTML = '<div class="mx-auto max-w-2xl px-4 py-6 sm:px-6">' + topBar +
      '<div class="bt-fade-in mt-5">' +
        '<div class="overflow-hidden rounded-3xl shadow-md"><div class="relative"><img src="' + img + '" alt="" class="h-52 w-full object-cover sm:h-64"><div class="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div></div></div>' +
        '<p class="mt-6 text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 sm:text-2xl">' + esc(node.text) + '</p>' +
        '<p class="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">What do you do?</p>' +
        '<div class="mt-3 space-y-3">' +
          node.choices.map(function (c, ci) {
            return '<button data-choice="' + ci + '" class="bt-option group flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left transition hover:border-indigo-400 hover:bg-slate-50 active:scale-[.99] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">' +
              '<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-bold text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 dark:border-slate-600">' + String.fromCharCode(65 + ci) + '</span>' +
              '<span class="font-semibold text-slate-700 dark:text-slate-200">' + esc(c.label) + '</span>' +
              '<span class="ml-auto text-indigo-400 transition group-hover:translate-x-1">→</span>' +
            '</button>';
          }).join("") +
        '</div>' +
        '<p class="mt-5 text-center text-xs text-slate-400">💾 Your story saves automatically as you go.</p>' +
      '</div>' +
    '</div>';

    app.querySelectorAll("[data-choice]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ci = parseInt(b.getAttribute("data-choice"), 10);
        var choice = node.choices[ci];
        if (!choice || !s.nodes[choice.to]) return;
        SP.path.push(SP.node);
        SP.node = choice.to;
        LS.set(storyKey(s.id), { node: SP.node, path: SP.path, at: Date.now() });
        renderStoryNode();
      });
    });
    window.scrollTo(0, 0);
  }

  /* ===== Activity detail modal (Boredom Busters) ======================== */
  // Opens a rich modal for one activity. isRandom shows the "random task" label.
  function openActivity(id, isRandom) {
    var a = actById(id); if (!a) return;
    var saved = isSaved(id), done = isCompleted(id);
    var label = isRandom ? "🎲 Your random task" : "💡 Boredom buster";
    var corner = done ? '<span class="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">Completed</span>'
      : saved ? '<span class="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow">Saved</span>' : "";
    byId("bt-modal").innerHTML = modalShell(
      '<div class="relative aspect-[16/9] overflow-hidden"><img src="' + imgUrl(a.image, 1000) + '" alt="' + esc(a.title) + '" class="h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"></div>' +
        '<span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase text-slate-700">' + label + '</span>' + corner + '</div>' +
      '<div class="p-6">' +
        '<h3 class="text-2xl font-black text-slate-900 dark:text-white">' + esc(a.title) + '</h3>' +
        '<p class="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">' + esc(a.description) + '</p>' +
        '<div class="mt-4 grid grid-cols-3 gap-2 text-center">' +
          metaBox("Time", a.time) + metaBox("Difficulty", a.difficulty) + metaBox("Category", a.moods[0]) +
        '</div>' +
        '<div class="mt-3 flex flex-wrap gap-1.5">' + a.moods.map(function (m) { return '<span class="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">' + esc(m) + '</span>'; }).join("") + '</div>' +
        '<div class="mt-5 grid grid-cols-2 gap-2">' +
          '<button data-save-task class="rounded-xl px-4 py-3 text-sm font-bold transition hover:scale-[1.02] ' + (saved ? "bg-amber-400 text-slate-900" : "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200") + '">' + (saved ? "★ Saved" : "☆ Save this task") + '</button>' +
          '<button data-complete-task class="rounded-xl px-4 py-3 text-sm font-bold transition hover:scale-[1.02] ' + (done ? "bg-emerald-500 text-white" : "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200") + '">' + (done ? "✓ Completed" : "○ Mark as Completed") + '</button>' +
        '</div>' +
        '<button data-reroll class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01]">' + icon("dice") + ' Get another random task</button>' +
      '</div>', "max-w-lg"
    );
    showModal();
    var wrap = byId("bt-modal");
    wrap.querySelector("[data-save-task]").addEventListener("click", function () { var on = toggleInList("bt_saved_tasks", id); refreshActivityCard(id); toast(on ? "Saved to your tasks ★" : "Removed from saved"); openActivity(id, isRandom); });
    wrap.querySelector("[data-complete-task]").addEventListener("click", function () { var on = toggleInList("bt_completed_tasks", id); refreshActivityCard(id); toast(on ? "Nice! Marked as completed ✓" : "Marked as not done"); openActivity(id, isRandom); });
    wrap.querySelector("[data-reroll]").addEventListener("click", function () { openRandomTask(); });
  }
  function metaBox(label, val) {
    return '<div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">' + label + '</p><p class="mt-0.5 text-sm font-extrabold text-slate-800 dark:text-slate-100">' + esc(val) + '</p></div>';
  }
  // Update one activity card in place so saved/completed badges refresh without a full re-render.
  function refreshActivityCard(id) { var a = actById(id), el = document.querySelector('[data-activity="' + id + '"]'); if (a && el) el.outerHTML = activityCard(a); }

  function openRandomTask() {
    var pool = activeMood && activeMood !== "All" ? D.activities.filter(function (a) { return a.moods.indexOf(activeMood) > -1; }) : D.activities;
    if (!pool.length) pool = D.activities;
    var a = pool[Math.floor(Math.random() * pool.length)];
    openActivity(a.id, true);
  }
  function modalShell(inner, size) {
    return '<div data-modal-backdrop class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>' +
      '<div class="relative z-10 flex max-h-[90vh] w-full ' + (size || "max-w-md") + ' flex-col overflow-hidden rounded-3xl bg-white shadow-2xl bt-pop dark:bg-slate-900">' +
        '<button data-close-modal class="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow dark:bg-slate-800 dark:text-slate-200" aria-label="Close"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<div class="overflow-y-auto">' + inner + '</div></div>';
  }
  function showModal() { var m = byId("bt-modal"); m.classList.remove("hidden"); document.body.classList.add("bt-no-scroll"); }
  function hideModal() { var m = byId("bt-modal"); m.classList.add("hidden"); m.innerHTML = ""; document.body.classList.remove("bt-no-scroll"); }

  /* ===== Quiz JSON-LD (SEO rich result) ================================= */
  function injectQuizLdRemove() { var e = byId("bt-quiz-ld"); if (e) e.remove(); }
  function injectQuizJsonLd(q) {
    injectQuizLdRemove();
    var s = document.createElement("script");
    s.type = "application/ld+json"; s.id = "bt-quiz-ld";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Quiz",
      "name": q.title, "about": q.description, "educationalLevel": "beginner",
      "numberOfQuestions": q.questions.length
    });
    document.head.appendChild(s);
  }

  /* ===== ROUTER ========================================================= */
  function parseHash() {
    var raw = location.hash.replace(/^#\/?/, "");
    var qIndex = raw.indexOf("?");
    var query = "";
    if (qIndex > -1) { query = raw.slice(qIndex + 1); raw = raw.slice(0, qIndex); }
    return { parts: raw.split("/").filter(Boolean), query: new URLSearchParams(query) };
  }

  function render() {
    injectQuizLdRemove();
    clearInterval(dareTimer); dareTimer = null; // stop any Daily Dare countdown from the previous view
    var r = parseHash();
    var p = r.parts;
    var html;
    if (p.length === 0) html = viewHome();
    else if (p[0] === "quizzes") html = viewQuizzes(p[1] || null);
    else if (p[0] === "quiz") {
      if (r.query.get("restart") === "1") clearProgress(p[1]);
      if (r.query.get("play") === "1") { startQuiz(p[1]); wireCommon(); return; }
      html = viewQuizIntro(p[1]);
    }
    else if (p[0] === "results") html = viewResults(p[1]);
    else if (p[0] === "boredom-busters") html = viewBoredom();
    else if (p[0] === "vibe") html = p[1] ? viewVibeResult(p[1]) : viewVibe();
    else if (p[0] === "daily-dare") html = (p[1] === "archive") ? viewDareArchive() : viewDailyDare();
    else if (p[0] === "stories") html = viewStories();
    else if (p[0] === "story") {
      if (r.query.get("restart") === "1") clearStory(p[1]);
      if (r.query.get("play") === "1") { startStory(p[1]); wireCommon(); return; }
      html = viewStoryIntro(p[1]);
    }
    else if (p[0] === "categories") html = viewCategories();
    else if (p[0] === "search") html = viewSearch(r.query.get("q") || "");
    else html = viewNotFound();

    if (html === "") return; // a redirect happened
    app.innerHTML = html;
    window.scrollTo(0, 0);
    if (window.BTUI) window.BTUI.applyThemeIcon();
    wireCommon();
    animateCounters();
  }

  /* ===== Daily Dare countdown (ticks to local midnight) ================= */
  // Self-heals: if the element is gone (navigated away) it stops itself, and at
  // midnight it re-renders so the new day's dare swaps in.
  function updateDareCountdown() {
    var el = app.querySelector("[data-dare-countdown]");
    if (!el) { clearInterval(dareTimer); dareTimer = null; return; }
    var now = new Date();
    var ms = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
    if (ms <= 0) { clearInterval(dareTimer); dareTimer = null; render(); return; }
    var s = Math.floor(ms / 1000), pad = function (n) { return n < 10 ? "0" + n : "" + n; };
    el.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60);
  }

  /* ===== Wire delegated events for whatever just rendered =============== */
  function wireCommon() {
    // Home / search forms
    var hs = app.querySelector("[data-home-search]");
    if (hs) hs.addEventListener("submit", function (e) { e.preventDefault(); var v = e.target.q.value.trim(); location.hash = "#/search?q=" + encodeURIComponent(v); });
    var sf = app.querySelector("[data-search-form]");
    if (sf) sf.addEventListener("submit", function (e) { e.preventDefault(); location.hash = "#/search?q=" + encodeURIComponent(e.target.q.value.trim()); });
    var nl = app.querySelector("[data-newsletter]");
    if (nl) nl.addEventListener("submit", function (e) { e.preventDefault(); var m = app.querySelector("[data-newsletter-msg]"); if (m) m.textContent = "🎉 You're in! Check your inbox to confirm."; e.target.reset(); });

    // mood chips (boredom busters)
    app.querySelectorAll("[data-mood]").forEach(function (b) { b.addEventListener("click", function () { activeMood = b.getAttribute("data-mood"); app.innerHTML = viewBoredom(); wireCommon(); }); });
    app.querySelectorAll("[data-mood-go]").forEach(function (b) { b.addEventListener("click", function () { activeMood = b.getAttribute("data-mood-go"); location.hash = "#/boredom-busters"; }); });

    // reset quiz buttons
    app.querySelectorAll("[data-reset-quiz]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-reset-quiz");
        clearProgress(id); LS.del(resultKey(id));
        if (QP && QP.quiz.id === id) { QP = null; }
        location.hash = "#/quiz/" + id; render();
      });
    });

    // share / copy on results
    var sb = app.querySelector("[data-share]");
    if (sb) sb.addEventListener("click", function () {
      if (navigator.share) navigator.share({ title: document.title, text: "Check out my result!", url: location.href }).catch(function () {});
      else { copyLink(); toast("Link copied to clipboard ✓"); }
    });
    var cb = app.querySelector("[data-copy]");
    if (cb) cb.addEventListener("click", function () { copyLink(); toast("Link copied to clipboard ✓"); });
    // Vibe Check: save recommendation
    var sv = app.querySelector("[data-save-vibe]");
    if (sv) sv.addEventListener("click", function () {
      var k = sv.getAttribute("data-save-vibe");
      LS.set("bt_saved_vibe", { key: k, at: Date.now() });
      sv.textContent = "★ Saved"; toast("Vibe saved! We'll keep this one for you ★");
    });
    // TikTok / Instagram: copy + helpful prompt (no web share intent exists)
    app.querySelectorAll("[data-social-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var net = b.getAttribute("data-social-copy");
        copyLink();
        toast("Link copied! Paste it into your " + net + " bio, story or caption 💫");
      });
    });
    // Daily Dare: mark today's dare complete (in place, like the vibe save)
    var dd = app.querySelector("[data-dare-done]");
    if (dd) dd.addEventListener("click", function () {
      var on = toggleInList("bt_dares_done", dd.getAttribute("data-dare-done"));
      dd.className = "mt-5 w-full rounded-xl px-6 py-4 text-base font-extrabold shadow-lg transition hover:scale-[1.01] " + (on ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white");
      dd.textContent = on ? "✓ Completed - you legend" : "○ Mark as Completed";
      toast(on ? "Dare completed. Absolute legend ✓" : "Marked as not done");
    });
    // Daily Dare: start the countdown when the dare page is showing
    if (app.querySelector("[data-dare-countdown]")) { updateDareCountdown(); dareTimer = setInterval(updateDareCountdown, 1000); }
  }

  function copyLink() {
    try { if (navigator.clipboard) navigator.clipboard.writeText(location.href); } catch (e) {}
  }

  // Lightweight toast (bottom-center), used for copy/share feedback.
  function toast(msg) {
    var t = byId("bt-toast");
    if (!t) { t = document.createElement("div"); t.id = "bt-toast"; t.className = "fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-2xl transition-all duration-300 dark:bg-white dark:text-slate-900"; document.body.appendChild(t); }
    t.textContent = msg;
    t.style.opacity = "1"; t.style.transform = "translate(-50%, 0)";
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.style.opacity = "0"; t.style.transform = "translate(-50%, 12px)"; }, 2600);
  }

  /* ===== Count-up animation for social-proof numbers ==================== */
  function animateCounters() { /* numbers are pre-formatted; reserved hook for future live counters */ }

  /* ===== Global floating Random Task button + modal host =============== */
  function mountChrome() {
    if (!byId("bt-modal")) { var m = document.createElement("div"); m.id = "bt-modal"; m.className = "fixed inset-0 z-[60] hidden flex items-center justify-center p-4"; document.body.appendChild(m); }
    if (!byId("bt-fab")) {
      var fab = document.createElement("button");
      fab.id = "bt-fab"; fab.setAttribute("data-random-task", "");
      fab.className = "group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-coral-500 to-teal-400 px-4 py-3.5 font-extrabold text-slate-900 shadow-2xl shadow-coral-500/30 transition hover:scale-105 sm:px-5";
      fab.innerHTML = icon("dice") + '<span class="hidden sm:inline">Random task</span>';
      fab.setAttribute("aria-label", "Get a random task");
      document.body.appendChild(fab);
    }
    // delegated handlers (work for FAB + any in-view buttons + modal)
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-random-task]")) { e.preventDefault(); openRandomTask(); }
      else if (e.target.closest("[data-random-quiz]")) { e.preventDefault(); if (D.quizzes.length) location.hash = "#/quiz/" + D.quizzes[Math.floor(Math.random() * D.quizzes.length)].id; }
      else if (e.target.closest("[data-activity]")) { e.preventDefault(); openActivity(e.target.closest("[data-activity]").getAttribute("data-activity"), false); }
      else if (e.target.closest("[data-close-modal]") || e.target.closest("[data-modal-backdrop]")) hideModal();
    });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") hideModal(); });
  }

  /* ===== Boot ============================================================ */
  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", function () { mountChrome(); render(); });
  if (document.readyState !== "loading") { mountChrome(); render(); }
})();
