/* ui.js - shared header, footer, theme toggle and mobile menu. Loaded on
   every page (the SPA shell and the standalone blog/legal pages). Each page
   sets data-base="" (root) or data-base="../" (blog posts) so links resolve.
   Theme: Tailwind darkMode 'class'; preference saved in localStorage bt_theme,
   default light. The inline <head> snippet re-applies it before paint. */
(function () {
  "use strict";

  var BASE = document.documentElement.getAttribute("data-base") || "";
  var APP = BASE + "index.html";

  var NAV = [
    { label: "Home",            href: APP + "#/" },
    { label: "Vibe Check",      href: APP + "#/vibe" },
    { label: "Quizzes",         href: APP + "#/quizzes" },
    { label: "Boredom Busters", href: APP + "#/boredom-busters" },
    { label: "Categories",      href: APP + "#/categories" },
    { label: "Blog",            href: BASE + "blog.html" },
    { label: "About",           href: BASE + "about.html" }
  ];

  /* ---- SVG bits ---------------------------------------------------------- */
  var LOGO = '' +
    '<a href="' + APP + '#/" class="flex items-center gap-2 group shrink-0" aria-label="Bored Tasks home">' +
      '<span class="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-coral-500 to-lime-400 shadow-lg shadow-coral-500/20 transition-transform group-hover:rotate-6">' +
        // Bored girl slumped at a desk - "bored at school" vibe (scales cleanly at any size)
        '<svg viewBox="0 0 64 64" class="h-6 w-6 text-slate-900" fill="currentColor"><rect x="8" y="51" width="48" height="4.5" rx="2.2"/><path d="M13 51c0-8 6-13 15-13h11c6 2 9 7 9 13Z"/><path d="M22 16c-12-3-15 5-11 13 2 3 7 3 11 0-4-5-4-9 1-13Z"/><circle cx="34" cy="23" r="11"/><path d="M44 51c1-7-2-13-8-17l-5 4c5 3 7 8 6 13Z"/><path d="M29 30c0 4 4 5 7 2 2-2 1-5-1-5Z"/></svg>' +
      '</span>' +
      '<span class="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">Bored<span class="bt-gradient-text">Tasks</span></span>' +
    '</a>';

  var SUN = '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"/></svg>';

  function isDark() { return document.documentElement.classList.contains("dark"); }

  function themeBtn(idSuffix) {
    return '<button type="button" data-bt-theme-toggle class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300" aria-label="Toggle dark mode" title="Toggle light / dark">' +
      '<span data-bt-theme-icon>' + (isDark() ? SUN : MOON) + '</span>' +
    '</button>';
  }

  /* ---- Header ------------------------------------------------------------ */
  function renderHeader() {
    var el = document.getElementById("bt-header");
    if (!el) return;
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-bt-nav class="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition">' + n.label + '</a>';
    }).join("");

    var mobileLinks = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-bt-nav data-bt-mobile-link class="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition">' + n.label + '</a>';
    }).join("");

    // #bt-header IS the sticky bar. Its containing block is <body> (full height)
    // so it pins correctly and reserves its 64px of space in flow.
    el.className = "bt-bar sticky top-0 z-40";
    el.setAttribute("data-bt-bar", "");
    el.innerHTML =
      '<div class="relative mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:px-6">' +
        // Hamburger (mobile only) on the LEFT - borderless ghost button
        '<button type="button" data-bt-menu-toggle class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="Open menu" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
        '</button>' +
        // Logo: centered on mobile (absolute), left-aligned on desktop (static)
        '<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">' + LOGO + '</div>' +
        '<nav class="ml-1 hidden items-center gap-0.5 lg:flex">' + links + '</nav>' +
        '<div class="ml-auto flex items-center gap-1">' +
          '<a href="' + APP + '#/search" class="hidden sm:inline-flex h-10 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Search">' +
            '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span>Search</span>' +
          '</a>' +
          themeBtn() +
        '</div>' +
      '</div>';

    // Mobile menu lives at <body> level (NOT inside the transformed header) so its
    // fixed full-screen overlay isn't trapped by the header's slide transform.
    var host = document.getElementById("bt-menu-host");
    if (!host) { host = document.createElement("div"); host.id = "bt-menu-host"; document.body.appendChild(host); }
    host.innerHTML =
      '<div data-bt-mobile-menu class="fixed inset-0 z-[60] hidden lg:hidden">' +
        '<div data-bt-menu-backdrop class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>' +
        '<div class="absolute left-0 top-0 h-full w-[82%] max-w-sm -translate-x-full bg-white p-5 shadow-2xl transition-transform duration-300 dark:bg-slate-900" data-bt-menu-panel>' +
          '<div class="flex items-center justify-between">' + LOGO +
            '<button type="button" data-bt-menu-close class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu">' +
              '<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="mt-6 space-y-1">' + mobileLinks + '</div>' +
          '<a href="' + APP + '#/search" data-bt-mobile-link class="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>Search everything</a>' +
          '<a href="' + APP + '#/quizzes" data-bt-mobile-link class="mt-3 block rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-center text-base font-bold text-white shadow-lg">Take a Quiz →</a>' +
        '</div>' +
      '</div>';
  }

  /* ---- Footer ------------------------------------------------------------ */
  function renderFooter() {
    var el = document.getElementById("bt-footer");
    if (!el) return;
    var year = document.documentElement.getAttribute("data-year") || "2026";
    function col(title, items) {
      return '<div><h4 class="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">' + title + '</h4><ul class="space-y-2">' +
        items.map(function (i) { return '<li><a href="' + i[1] + '" class="text-sm text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-300 transition">' + i[0] + '</a></li>'; }).join("") +
        '</ul></div>';
    }
    el.innerHTML =
      '<footer class="mt-20 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">' +
        // ===== ADSENSE PLACEHOLDER (footer leaderboard) - see README to swap in real unit =====
        '<div class="mx-auto max-w-7xl px-4 pt-10 sm:px-6"><div class="bt-ad flex h-[90px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-medium uppercase tracking-widest text-slate-400 dark:border-slate-700" data-ad-slot="footer">Advertisement</div></div>' +
        '<div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5">' +
          '<div class="lg:col-span-2">' + LOGO +
            '<p class="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">Bored Tasks is your antidote to boredom: addictive personality quizzes, brain-tickling trivia, and hundreds of fun things to do when you have nothing to do. Curing boredom, one tap at a time.</p>' +
            '<p class="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Follow <span class="font-bold text-slate-700 dark:text-slate-200">@boredtasks</span></p>' +
            '<div class="mt-2 flex gap-3">' +
              social("https://www.tiktok.com/@boredtasks", "TikTok @boredtasks", '<path d="M15 4c.4 2 1.8 3.4 4 3.7v3c-1.5 0-2.9-.4-4-1.2V15a5 5 0 11-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 101.5 1.9V4z"/>') +
              social("https://www.instagram.com/boredtasks", "Instagram @boredtasks", '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>') +
              social("https://x.com/boredtasks", "X @boredtasks", '<path d="M4 4l16 16M20 4L4 20"/>') +
            '</div>' +
          '</div>' +
          col("Explore", [["All Quizzes", APP + "#/quizzes"], ["Boredom Busters", APP + "#/boredom-busters"], ["Categories", APP + "#/categories"], ["Random Task", APP + "#/boredom-busters"], ["Search", APP + "#/search"]]) +
          col("Read", [["Blog", BASE + "blog.html"], ["Why Quizzes Are Addictive", BASE + "blog/why-personality-quizzes-are-addictive.html"], ["100 Ways to Cure Boredom", BASE + "blog/100-ways-to-cure-boredom.html"], ["Beat Procrastination", BASE + "blog/psychology-of-procrastination.html"]]) +
          col("Company", [["About", BASE + "about.html"], ["Contact", BASE + "contact.html"], ["Privacy Policy", BASE + "privacy.html"], ["Terms of Use", BASE + "terms.html"]]) +
        '</div>' +
        '<div class="border-t border-slate-200 py-6 dark:border-slate-800"><div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">' +
          '<p class="text-xs text-slate-400">© ' + year + ' Bored Tasks. All rights reserved. Made to cure boredom everywhere.</p>' +
          '<p class="text-xs text-slate-400">Quizzes are for entertainment only - not psychological advice.</p>' +
        '</div></div>' +
      '</footer>';
  }

  function social(href, label, path) {
    return '<a href="' + href + '" target="_blank" rel="noopener noreferrer nofollow" aria-label="' + label + '" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-500 dark:border-slate-700 dark:text-slate-400 dark:hover:text-teal-300"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg></a>';
  }

  /* ---- Theme toggle ------------------------------------------------------ */
  function applyThemeIcon() {
    document.querySelectorAll("[data-bt-theme-icon]").forEach(function (s) { s.innerHTML = isDark() ? SUN : MOON; });
  }
  function toggleTheme() {
    var next = isDark() ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("bt_theme", next); } catch (e) {}
    applyThemeIcon();
    // Let the SPA know (e.g. to recolor any canvas/charts if added later).
    window.dispatchEvent(new CustomEvent("bt:themechange", { detail: { theme: next } }));
  }

  /* ---- Mobile menu ------------------------------------------------------- */
  function wireMenu() {
    var menu = document.querySelector("[data-bt-mobile-menu]");
    if (!menu) return;
    var panel = menu.querySelector("[data-bt-menu-panel]");
    function open() {
      menu.classList.remove("hidden");
      document.body.classList.add("bt-no-scroll");
      requestAnimationFrame(function () { panel.classList.remove("-translate-x-full"); });
      var t = document.querySelector("[data-bt-menu-toggle]"); if (t) t.setAttribute("aria-expanded", "true");
    }
    function close() {
      panel.classList.add("-translate-x-full");
      document.body.classList.remove("bt-no-scroll");
      var t = document.querySelector("[data-bt-menu-toggle]"); if (t) t.setAttribute("aria-expanded", "false");
      setTimeout(function () { menu.classList.add("hidden"); }, 300);
    }
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-bt-menu-toggle]")) open();
      else if (e.target.closest("[data-bt-menu-close]") || e.target.closest("[data-bt-menu-backdrop]") || e.target.closest("[data-bt-mobile-link]")) close();
    });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---- Boot -------------------------------------------------------------- */
  /* ---- Image fallback ---------------------------------------------------
     If any stock image 404s (e.g. a stale Unsplash id), swap to a guaranteed
     placeholder so the UI never shows a broken image. Capture phase so it
     catches <img> errors that don't bubble. */
  function wireImageFallback() {
    document.addEventListener("error", function (e) {
      var t = e.target;
      if (!t || t.tagName !== "IMG" || t.dataset.btFallback) return;
      t.dataset.btFallback = "1";
      var seed = encodeURIComponent((t.getAttribute("alt") || "bored") .slice(0, 24) || "bored");
      t.src = "https://picsum.photos/seed/" + seed + "/800/500";
    }, true);
  }

  /* ---- Scroll-aware header (transparent at top, glass once scrolled) ----- */
  function wireBar() {
    var bar = document.querySelector("[data-bt-bar]");
    if (!bar) return;
    var lastY = window.scrollY;
    function upd() {
      var y = window.scrollY < 0 ? 0 : window.scrollY;
      bar.classList.toggle("is-scrolled", y > 8);
      // hide when scrolling down past the header, reveal the moment you scroll up
      if (y > 90 && y > lastY + 4) bar.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 90) bar.classList.remove("is-hidden");
      lastY = y;
    }
    upd();
    window.addEventListener("scroll", upd, { passive: true });
  }

  function boot() {
    renderHeader();
    renderFooter();
    wireMenu();
    wireBar();
    wireImageFallback();
    applyThemeIcon();
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-bt-theme-toggle]")) { e.preventDefault(); toggleTheme(); }
    });
    document.documentElement.classList.remove("bt-preload");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // Expose a tiny API for the SPA (index.html) to re-sync icons after re-render.
  window.BTUI = { applyThemeIcon: applyThemeIcon, isDark: isDark, base: BASE, appUrl: APP };
})();
