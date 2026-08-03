/* ============================================================================
   kd-website — original site logic (no libraries, no build step)
   Reads everything from content.js (window.SITE) and wires up the page.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};

  /* ---- Helpers ------------------------------------------------------------ */

  // Pull a Vimeo id (and optional privacy hash) from a link or bare id.
  function parseVimeo(entry) {
    var raw = typeof entry === "string" ? entry : (entry.url || entry.id || "");
    var s = String(raw).trim();
    var id = "";
    var hash = (entry && typeof entry === "object" && entry.hash) ? entry.hash : "";

    if (/^\d+$/.test(s)) {
      id = s;
    } else {
      var idMatch = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (idMatch) id = idMatch[1];
      // hash forms: /video/ID?h=HASH   or   vimeo.com/ID/HASH
      var hashMatch = s.match(/[?&]h=([a-zA-Z0-9]+)/) ||
                      s.match(/vimeo\.com\/(?:video\/)?\d+\/([a-zA-Z0-9]+)/);
      if (hashMatch && !hash) hash = hashMatch[1];
    }
    return { id: id, hash: hash };
  }

  // Muted, looping, chrome-less "background" player for the feed.
  function backgroundSrc(v) {
    var h = v.hash ? "&h=" + v.hash : "";
    return "https://player.vimeo.com/video/" + v.id +
           "?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1&app_id=58479" + h;
  }

  // Full player (sound + controls) for the lightbox.
  function fullSrc(v) {
    var h = v.hash ? "&h=" + v.hash : "";
    return "https://player.vimeo.com/video/" + v.id +
           "?autoplay=1&title=0&byline=0&portrait=0&dnt=1&app_id=58479" + h;
  }

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

  function buildFeed() {
    var feed = document.getElementById("reel-feed");
    if (!feed) return;

    var videos = (SITE.videos || []).filter(function (v) {
      return parseVimeo(v).id;
    });

    // update the count in the section header
    var count = document.querySelector("[data-count]");
    if (count) count.textContent = videos.length ? "(" + videos.length + ")" : "";

    if (!videos.length) {
      feed.appendChild(el("p", "muted",
        "No videos yet — add your Vimeo links in <code>content.js</code>."));
      return;
    }

    videos.forEach(function (item, i) {
      var parsed = parseVimeo(item);
      var orient = (item.orientation || "landscape").toLowerCase();
      if (["landscape", "portrait", "square"].indexOf(orient) === -1) orient = "landscape";

      var reel = el("article", "reel is-" + orient + (i % 2 ? " alt" : ""));

      // media
      var media = el("div", "reel__media");
      media.setAttribute("role", "button");
      media.setAttribute("tabindex", "0");
      media.setAttribute("aria-label", "Play “" + (item.title || "video") + "” with sound");

      var frame = el("div", "reel__frame");
      var placeholder = el("div", "placeholder", PLAY_ICON);
      frame.appendChild(placeholder);
      frame.dataset.src = backgroundSrc(parsed);   // loaded when scrolled into view
      media.appendChild(frame);
      media.appendChild(el("span", "zoom-hint", ENLARGE_ICON + " Tap to enlarge"));

      // clicking opens the full player with sound
      function open() { openLightbox(parsed, orient); }
      media.addEventListener("click", open);
      media.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });

      // text
      var text = el("div", "reel__text");
      text.appendChild(el("span", "kicker", "Reel " + String(i + 1).padStart(2, "0")));
      text.appendChild(el("h3", null, escapeHtml(item.title || "Untitled")));
      if (item.description) text.appendChild(el("p", null, escapeHtml(item.description)));

      reel.appendChild(media);
      reel.appendChild(text);
      feed.appendChild(reel);
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
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
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
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
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

  /* ---- Go ----------------------------------------------------------------- */

  function init() {
    fillContent();
    buildFeed();
    buildAbout();
    initChrome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
