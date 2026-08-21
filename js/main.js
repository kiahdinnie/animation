/* ============================================================================
   kd-website — original site logic (no libraries, no build step)
   Reads everything from content.js (window.SITE) and wires up the page.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};

  /* ---- Helpers ------------------------------------------------------------ */

  // Detect the provider and pull the id (+ Vimeo privacy hash) from a link or id.
  // Supports Vimeo and YouTube (including Shorts).
  function parseVideo(entry) {
    var raw = typeof entry === "string" ? entry : (entry.url || entry.id || "");
    var s = String(raw).trim();

    var yt = s.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return { provider: "youtube", id: yt[1], hash: "" };

    var hash = (entry && typeof entry === "object" && entry.hash) ? entry.hash : "";
    var id = "";
    if (/^\d+$/.test(s)) {
      id = s;
    } else {
      var idMatch = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (idMatch) id = idMatch[1];
      var hashMatch = s.match(/[?&]h=([a-zA-Z0-9]+)/) ||
                      s.match(/vimeo\.com\/(?:video\/)?\d+\/([a-zA-Z0-9]+)/);
      if (hashMatch && !hash) hash = hashMatch[1];
    }
    return { provider: "vimeo", id: id, hash: hash };
  }

  // Muted, looping, chrome-less "background" player for the feed/grid.
  function backgroundSrc(v) {
    if (v.provider === "youtube") {
      return "https://www.youtube.com/embed/" + v.id +
        "?autoplay=1&mute=1&loop=1&playlist=" + v.id +
        "&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3";
    }
    var h = v.hash ? "&h=" + v.hash : "";
    return "https://player.vimeo.com/video/" + v.id +
           "?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1&app_id=58479" + h;
  }

  // Full player (sound + controls) for the lightbox.
  function fullSrc(v) {
    if (v.provider === "youtube") {
      return "https://www.youtube.com/embed/" + v.id +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    }
    var h = v.hash ? "&h=" + v.hash : "";
    return "https://player.vimeo.com/video/" + v.id +
           "?autoplay=1&title=0&byline=0&portrait=0&dnt=1&app_id=58479" + h;
  }

  var EMBED_ALLOW = "autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; clipboard-write";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "•";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  var PLAY_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M8 5v14l11-7z"/></svg>';

  var ENLARGE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>' +
    '<line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';

  /* ---- Fill text placeholders (name, tagline, contact) -------------------- */

  function fillContent() {
    document.querySelectorAll('[data-site="name"]').forEach(function (n) {
      n.textContent = SITE.name || "Your Name";
    });
    document.querySelectorAll('[data-site="tagline"]').forEach(function (n) {
      n.textContent = SITE.tagline || "";
    });
    document.querySelectorAll('[data-site="initials"]').forEach(function (n) {
      n.textContent = initials(SITE.name);
    });
    document.querySelectorAll('[data-site="year"]').forEach(function (n) {
      // content.js can't know "today"; the footer year is fine as a static build stamp.
      n.textContent = n.getAttribute("data-year") || "";
    });

    // Email links
    var email = SITE.email || "";
    document.querySelectorAll('[data-site="email"]').forEach(function (n) {
      if (email) { n.href = "mailto:" + email; n.textContent = n.dataset.label || email; }
      else { n.style.display = "none"; }
    });
    document.querySelectorAll('[data-site="email-text"]').forEach(function (n) {
      n.textContent = email;
    });
    // href-only: set the mailto link but keep the element's existing markup
    document.querySelectorAll('[data-site="email-href"]').forEach(function (n) {
      if (email) { n.href = "mailto:" + email; n.removeAttribute("hidden"); }
      else { n.setAttribute("hidden", ""); }
    });

    // Social links — show only the ones that are filled in.
    var socials = SITE.socials || {};
    document.querySelectorAll("[data-social]").forEach(function (n) {
      var key = n.getAttribute("data-social");
      var url = socials[key];
      if (url) { n.href = url; n.removeAttribute("hidden"); }
      else { n.setAttribute("hidden", ""); }
    });

    // Location (optional)
    document.querySelectorAll('[data-site="location"]').forEach(function (n) {
      if (SITE.location) n.textContent = SITE.location;
      else n.style.display = "none";
    });
  }

  /* ---- Build the video feed ---------------------------------------------- */

  var lightbox, lightboxFrame;

  function normOrient(o) {
    o = (o || "").toLowerCase();
    return ["landscape", "portrait", "square"].indexOf(o) === -1 ? "landscape" : o;
  }

  // The clickable video card: an autoplay muted preview + click-to-enlarge.
  function buildMedia(item, parsed, orient, wantHint) {
    var media = el("div", "reel__media");
    media.setAttribute("role", "button");
    media.setAttribute("tabindex", "0");
    media.setAttribute("aria-label", "Play " + (item.title || "video") + " with sound");

    var frame = el("div", "reel__frame");
    frame.appendChild(el("div", "placeholder", PLAY_ICON));
    frame.dataset.src = backgroundSrc(parsed);   // lazy-loaded when scrolled near
    media.appendChild(frame);
    if (wantHint) media.appendChild(el("span", "zoom-hint", ENLARGE_ICON + " Tap to enlarge"));

    function open() { openLightbox(parsed, orient); }
    media.addEventListener("click", open);
    media.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    return media;
  }

  // A large "feature" row: video with title + description beside it.
  function buildReel(item, i) {
    var parsed = parseVideo(item);
    var orient = normOrient(item.orientation);
    var reel = el("article", "reel is-" + orient + (i % 2 ? " alt" : ""));
    var text = el("div", "reel__text");
    if (item.description) text.appendChild(el("p", null, escapeHtml(item.description)));
    reel.appendChild(buildMedia(item, parsed, orient, true));
    reel.appendChild(text);
    return reel;
  }

  // A small grid clip (greyed until hover), with an optional label beneath.
  function buildClip(item) {
    var parsed = parseVideo(item);
    var orient = normOrient(item.orientation || "portrait");
    var clip = el("article", "mg-clip is-" + orient);
    clip.appendChild(buildMedia(item, parsed, orient, false));
    if (item.title) clip.appendChild(el("span", "mg-clip__label", escapeHtml(item.title)));
    return clip;
  }

  function buildFeed() {
    var host = document.getElementById("work-sections");
    if (!host) return;

    var sections = SITE.sections;
    if (!sections && SITE.videos) {                 // backward compatibility
      sections = [{ title: "Selected Work", style: "feature", videos: SITE.videos }];
    }
    if (!sections || !sections.length) {
      host.appendChild(el("p", "muted",
        "No work yet — add sections in <code>content.js</code>."));
      return;
    }

    sections.forEach(function (section) {
      var vids = (section.videos || []).filter(function (v) { return parseVideo(v).id; });
      if (!vids.length) return;

      var sec = el("section", "work-cat");
      var head = el("div", "section-head");
      head.appendChild(el("h2", null, escapeHtml(section.title || "")));
      head.appendChild(el("span", "count", "(" + vids.length + ")"));
      sec.appendChild(head);

      if ((section.style || "feature").toLowerCase() === "grid") {
        var grid = el("div", "mg-grid");
        vids.forEach(function (item) { grid.appendChild(buildClip(item)); });
        sec.appendChild(grid);
      } else {
        var feed = el("div", "feed");
        vids.forEach(function (item, i) { feed.appendChild(buildReel(item, i)); });
        sec.appendChild(feed);
      }
      host.appendChild(sec);
    });

    lazyLoadFrames();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- Lazy-load / autoplay only what's on screen ------------------------- */

  function lazyLoadFrames() {
    var frames = document.querySelectorAll(".reel__frame[data-src]");
    if (!("IntersectionObserver" in window)) {
      // very old browser: just load them all
      frames.forEach(loadFrame);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadFrame(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "300px 0px" });   // start loading just before it scrolls in
    frames.forEach(function (f) { io.observe(f); });
  }

  function loadFrame(frame) {
    if (!frame || frame.dataset.loaded) return;
    frame.dataset.loaded = "1";
    var iframe = document.createElement("iframe");
    iframe.src = frame.dataset.src;
    iframe.loading = "lazy";
    iframe.allow = EMBED_ALLOW;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("tabindex", "-1");
    iframe.setAttribute("aria-hidden", "true");
    frame.appendChild(iframe);
  }

  /* ---- Lightbox ----------------------------------------------------------- */

  function ensureLightbox() {
    if (lightbox) return;
    lightbox = el("div", "lightbox");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    var inner = el("div", "lightbox__inner");
    var close = el("button", "lightbox__close", "&times;");
    close.setAttribute("aria-label", "Close video");
    lightboxFrame = el("div", "lightbox__frame");
    inner.appendChild(close);
    inner.appendChild(lightboxFrame);
    lightbox.appendChild(inner);
    document.body.appendChild(lightbox);

    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(parsed, orient) {
    ensureLightbox();
    lightboxFrame.className = "lightbox__frame" +
      (orient === "portrait" ? " portrait" : orient === "square" ? " square" : "");
    lightboxFrame.innerHTML = "";
    var iframe = document.createElement("iframe");
    iframe.src = fullSrc(parsed);
    iframe.allow = EMBED_ALLOW;
    iframe.setAttribute("frameborder", "0");
    lightboxFrame.appendChild(iframe);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightboxFrame.innerHTML = "";     // stops playback
    document.body.style.overflow = "";
  }

  /* ---- About page --------------------------------------------------------- */

  function buildAbout() {
    var body = document.getElementById("about-body");
    if (body && SITE.about && SITE.about.paragraphs) {
      SITE.about.paragraphs.forEach(function (p) {
        body.appendChild(el("p", null, escapeHtml(p)));
      });
      if (SITE.about.skills && SITE.about.skills.length) {
        var tags = el("div", "tags");
        SITE.about.skills.forEach(function (s) {
          tags.appendChild(el("span", "tag", escapeHtml(s)));
        });
        body.appendChild(tags);
      }
    }
    var photo = document.getElementById("about-photo");
    if (photo && SITE.about && SITE.about.photo) {
      var img = new Image();
      img.alt = (SITE.name || "") + " — portrait";
      img.src = SITE.about.photo;
      img.onload = function () { photo.innerHTML = ""; photo.appendChild(img); };
      // if the photo isn't there yet, leave the friendly fallback in place
    }
  }

  /* ---- Nav + banner behaviour -------------------------------------------- */

  function initChrome() {
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("scrolled", window.scrollY > 40);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var banner = document.getElementById("cbanner");
    if (banner) {
      if (sessionStorage.getItem("kd-banner-dismissed") === "1") {
        banner.classList.add("hidden");
        document.body.classList.add("banner-hidden");
      }
      var closeBtn = banner.querySelector(".cbanner__close");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          banner.classList.add("hidden");
          document.body.classList.add("banner-hidden");
          try { sessionStorage.setItem("kd-banner-dismissed", "1"); } catch (e) {}
        });
      }
    }
  }

  /* ---- Theme + hero asset ------------------------------------------------- */

  function applyTheme() {
    var theme = (SITE.theme === "dark") ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }

  // Is this an embed link/id (Vimeo or YouTube) rather than a local file?
  function isEmbed(src) {
    return /vimeo\.com|player\.vimeo|youtube\.com|youtu\.be/.test(src) || /^\d{6,}$/.test(String(src).trim());
  }

  // A muted, looping, autoplay background element — a local <video> or an embed.
  function makeBgMedia(src) {
    if (isEmbed(src)) {
      var v = parseVideo(src);
      if (!v.id) return null;
      var wrap = document.createElement("div");
      wrap.className = "bg-embed";
      var iframe = document.createElement("iframe");
      iframe.src = backgroundSrc(v);
      iframe.allow = EMBED_ALLOW;
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("tabindex", "-1");
      wrap.appendChild(iframe);
      return wrap;
    }
    var video = document.createElement("video");
    video.src = src;
    video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    return video;
  }

  // A video (or Vimeo) that plays behind the entire site. From SITE.pageVideo.
  function buildPageBackground() {
    if (!SITE.pageVideo) return;
    var el = makeBgMedia(SITE.pageVideo);
    if (!el) return;
    var layer = document.createElement("div");
    layer.className = "page-video" + (el.className === "bg-embed" ? " page-video--embed" : "");
    layer.appendChild(el);
    document.body.appendChild(layer);
  }

  // The hero: an optional animated title video (its black bg is dropped via a CSS
  // screen blend), plus — only when there's no full-page video — a panel background.
  function buildHero() {
    var h = SITE.hero || {};

    var titleHost = document.getElementById("hero-title");
    if (titleHost && h.title) {
      var tv = makeBgMedia(h.title);
      if (tv) {
        tv.classList.add("hero__title-video");
        titleHost.appendChild(tv);
        var heroEl = document.querySelector(".hero");
        if (heroEl) heroEl.classList.add("has-title");
      }
    }

    var bg = document.getElementById("hero-bg");
    if (bg && !SITE.pageVideo) {
      var type = (h.background || "gradient").toLowerCase();
      var dim = (h.dim != null) ? h.dim : 0.4;
      if (type === "image" && h.image) {
        bg.classList.add("hero__bg--media");
        bg.style.backgroundImage = "url('" + h.image + "')";
        bg.style.setProperty("--hero-dim", dim);
      } else if (type === "video" && h.video) {
        var el = makeBgMedia(h.video);
        if (el) { bg.appendChild(el); bg.style.setProperty("--hero-dim", dim); }
      }
    }
  }

  /* ---- Go ----------------------------------------------------------------- */

  function init() {
    applyTheme();
    buildPageBackground();
    fillContent();
    buildFeed();
    buildHero();
    buildAbout();
    initChrome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
