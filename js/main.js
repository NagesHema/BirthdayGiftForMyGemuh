(function () {
  "use strict";

  var e = window.BirthdayContent.escapeHTML;
  var content;
  var app;
  var currentPage;
  var audio;
  var musicButton;
  var volumeTimer;
  var storedVolume = .55;
  var musicEnabled = false;
  var musicStarting = false;
  var musicResumePending = false;
  var introCleanup;
  var musicKey = "birthday-music-enabled";

  function imageURL(filename) {
    return "../" + content.images.directory + encodeURIComponent(filename || "");
  }

  function imagePresentation(item, fallbackFit) {
    return ' data-fit="' + e(item.fit || fallbackFit || content.images.galleryFit) + '" data-position="' + e(item.position || "center") + '"';
  }

  function header() {
    var navLinks = content.navigation.map(function (item) {
      return '<a href="' + e(item.href) + '"' + (item.page === currentPage ? ' aria-current="page"' : "") + '>' + e(item.label) + '</a>';
    }).join("");
    return '<header class="site-header">' +
      '<a class="wordmark" href="home.html">' + e(content.girlfriend.name) + ' <span aria-hidden="true">✦</span></a>' +
      '<div class="header-actions"><nav class="desktop-nav" aria-label="Story navigation">' + navLinks + '</nav>' +
      '<button class="icon-button music-toggle" type="button" aria-label="' + e(content.labels.musicOn) + '" aria-pressed="false">♫</button>' +
      '<label class="volume-control"><span class="visually-hidden">' + e(content.labels.volume) + '</span><input class="volume-slider" type="range" min="0" max="1" step="0.01" value="0.55" aria-label="' + e(content.labels.volume) + '"></label>' +
      '<span class="music-status visually-hidden" aria-live="polite"></span>' +
      '<button class="nav-toggle" type="button" aria-label="' + e(content.labels.menu) + '" aria-expanded="false">☰</button></div>' +
      '<nav class="mobile-nav" aria-label="Story navigation" hidden>' + navLinks + '</nav></header>';
  }

  function footer() {
    return '<footer class="site-footer"><span>' + e(content.intro.eyebrow) + '</span></footer>';
  }

  function hero(eyebrow, title, lead, image, cta, href, position) {
    var action = cta ? '<a class="button button-ghost hero-action" href="' + e(href || "our-story.html") + '">' + e(cta) + '</a>' : "";
    return '<section class="page-hero" data-background="' + e(image || "") + '" data-background-position="' + e(position || content.images.heroPosition) + '">' +
      '<div class="hero-copy"><p class="eyebrow reveal">' + e(eyebrow || "") + '</p>' +
      '<h1 class="display-title reveal">' + e(title || "") + '</h1>' +
      (lead ? '<p class="lead reveal">' + e(lead) + '</p>' : "") + action +
      '<a class="scroll-cue reveal" href="#chapter-content">' + e(content.home.scrollLabel) + '</a></div></section>';
  }

  function sectionHeading(eyebrow, title, description) {
    return '<div class="section-heading reveal"><p class="eyebrow">' + e(eyebrow || "") + '</p><h2>' + e(title || "") + '</h2>' +
      (description ? '<p>' + e(description) + '</p>' : "") + '</div>';
  }

  function homePage() {
    var home = content.home;
    return '<main class="site-page">' + header() +
      hero(home.eyebrow, home.title, home.subtitle, home.background || content.images.home, home.cta, "our-story.html", home.backgroundPosition) +
      '<section class="content-section" id="chapter-content">' + sectionHeading(content.journey.eyebrow, content.journey.title, content.journey.intro) +
      '<div class="home-invitation reveal"><a class="button" href="our-story.html">' + e(content.labels.continue) + '</a></div></section>' +
      footer() + '</main>';
  }

  function journeyPage() {
    var journey = content.journey;
    var items = journey.milestones.map(function (item, index) {
      return '<article class="timeline-item reveal"><span class="timeline-node" aria-hidden="true"></span>' +
        '<figure class="timeline-media"><img loading="lazy" src="' + e(imageURL(item.image)) + '" alt="' + e(item.title) + '"' + imagePresentation(item, content.images.timelineFit) + '></figure>' +
        '<div class="timeline-copy"><p class="timeline-date">' + e(item.date) + '</p><h3>' + e(item.title) + '</h3><p>' + e(item.description) + '</p></div></article>';
    }).join("");
    return '<main class="site-page">' + header() +
      hero(journey.eyebrow, journey.title, journey.intro, content.images.home, null) +
      '<section class="content-section" id="chapter-content">' + sectionHeading(journey.firstMeetingDate, journey.title, journey.intro) +
      '<div class="timeline">' + items + '</div><p class="story-ending reveal">' + e(journey.ending) + '</p>' +
      '<div class="home-invitation reveal"><a class="button" href="things-i-love.html">' + e(content.labels.continue) + '</a></div></section>' +
      footer() + '</main>';
  }

  function reasonsPage() {
    var things = content.thingsILove;
    var items = things.reasons.map(function (item, index) {
      return '<article class="reason reveal"><div class="reason-text"><span class="reason-number">0' + (index + 1) + '</span>' +
        '<h3>' + e(item.title) + '</h3><p>' + e(item.description) + '</p></div>' +
        '<figure class="reason-photo"><img loading="lazy" src="' + e(imageURL(item.image)) + '" alt="' + e(item.title) + '"' + imagePresentation(item, content.images.reasonFit) + '></figure></article>';
    }).join("");
    return '<main class="site-page">' + header() +
      hero(things.eyebrow, things.title, null, content.images.letter, null) +
      '<section class="content-section" id="chapter-content">' + sectionHeading(things.eyebrow, things.title) +
      '<div class="reasons">' + items + '</div><p class="reason-ending reveal">' + e(things.ending) + '</p>' +
      '<div class="home-invitation reveal"><a class="button" href="memories.html">' + e(content.labels.viewMemories) + '</a></div></section>' +
      footer() + '</main>';
  }

  function galleryPage() {
    var gallery = content.gallery;
    var slides = gallery.photos.map(function (photo, index) {
      var alt = photo.alt || photo.caption || content.images.defaultAlt;
      return '<article class="swiper-slide"><figure class="memory-photo"><img loading="lazy" src="' + e(imageURL(photo.image)) + '" alt="' + e(alt) + '"' + imagePresentation(photo, content.images.galleryFit) + '>' +
        '<button type="button" data-open-photo aria-label="' + e(content.labels.openPhoto) + ' ' + (index + 1) + '"></button></figure>' +
        '<div class="memory-caption"><span>' + e(photo.date || "") + '</span><h3>' + e(photo.caption || "") + '</h3></div></article>';
    }).join("");
    return '<main class="site-page">' + header() +
      hero(gallery.eyebrow, gallery.title, gallery.intro, content.images.home, null) +
      '<section class="content-section" id="chapter-content">' + sectionHeading(gallery.eyebrow, gallery.title, gallery.intro) +
      '<div class="gallery-wrap"><div class="swiper memory-swiper"><div class="swiper-wrapper">' + slides + '</div>' +
      '<div class="gallery-controls"><button class="icon-button" type="button" data-prev aria-label="' + e(content.labels.previous) + '">←</button>' +
      '<div class="swiper-pagination" aria-live="polite"></div><button class="icon-button" type="button" data-next aria-label="' + e(content.labels.next) + '">→</button></div>' +
      '<div class="gallery-tools"><button class="button button-ghost" type="button" data-slideshow data-play-label="' + e(content.labels.playSlideshow) + '" data-pause-label="' + e(content.labels.pauseSlideshow) + '" aria-pressed="false">' + e(content.labels.playSlideshow) + '</button></div></div></div>' +
      '<div class="photo-viewer" role="dialog" aria-modal="true" aria-label="' + e(gallery.title) + '" hidden>' +
      '<button class="icon-button viewer-close" type="button" aria-label="' + e(content.labels.close) + '">×</button>' +
      '<button class="icon-button viewer-prev" type="button" aria-label="' + e(content.labels.previous) + '">←</button>' +
      '<img class="viewer-image" src="" alt=""><button class="icon-button viewer-next" type="button" aria-label="' + e(content.labels.next) + '">→</button>' +
      '<p class="viewer-caption"></p></div><div class="home-invitation reveal"><a class="button" href="little-things.html">' + e(content.labels.continue) + '</a></div></section>' +
      footer() + '</main>';
  }

  function littleThingsPage() {
    var little = content.littleThings;
    var notes = little.messages.map(function (message, index) {
      return '<article class="note reveal"><p>' + e(message) + '</p></article>';
    }).join("");
    return '<main class="site-page">' + header() +
      hero(little.eyebrow, little.title, little.intro, content.images.letter, null) +
      '<section class="content-section" id="chapter-content">' + sectionHeading(little.eyebrow, little.title, little.intro) +
      '<div class="notes-grid">' + notes + '</div><div class="surprise-wrap reveal">' +
      '<button class="surprise-card" type="button" aria-expanded="false"><span class="eyebrow">' + e(little.surpriseClosedLabel) + '</span>' +
      '<h3>' + e(little.surpriseTitle) + '</h3><p>' + e(little.surpriseMessage) + '</p></button></div>' +
      '<div class="home-invitation reveal"><a class="button" href="letter.html">' + e(content.labels.viewLetter) + '</a></div></section>' +
      footer() + '</main>';
  }

  function letterPage() {
    var letter = content.letter;
    return '<main class="site-page">' + header() +
      '<section class="letter-scene">' +
      '<div class="letter-glow"></div><div class="section-heading reveal"><p class="eyebrow">' + e(letter.eyebrow) + '</p><h1 class="display-title">' + e(letter.title) + '</h1></div>' +
      '<button class="letter-envelope" type="button" aria-label="' + e(content.labels.openLetter) + '">' +
      '<span class="wax-seal" aria-hidden="true">♡</span><span class="eyebrow">' + e(letter.openPrompt) + '</span></button>' +
      '<article class="letter-sheet" aria-hidden="true"><h2>' + e(content.girlfriend.name) + ',</h2><div class="letter-copy"></div><p class="letter-closing">' + e(letter.closing) + '</p></article></section>' +
      footer() + '</main>';
  }

  function foreverPage() {
    var forever = content.forever;
    return '<main class="site-page">' + header() +
      '<section class="page-hero forever-hero" data-background="' + e(forever.background || content.images.forever) + '" data-background-position="' + e(forever.backgroundPosition || content.images.heroPosition) + '">' +
      '<div class="hero-copy forever-copy"><p class="eyebrow reveal">' + e(forever.eyebrow) + '</p>' +
      '<h1 class="display-title reveal">' + e(forever.title) + '</h1><p class="forever-birthday reveal">' + e(forever.birthdayMessage) + '</p>' +
      '<p class="lead reveal">' + e(forever.subtitle) + '</p><span class="final-heart heart-beat" aria-hidden="true">♡</span>' +
      '<p class="eyebrow reveal">' + e(forever.finalLine) + '</p>' +
      '<a class="button reveal" href="../index.html?replay=1">' + e(content.labels.relive) + '</a></div></section>' +
      footer() + '</main>';
  }

  function fadeMusicTo(volume) {
    if (!audio) return;
    window.clearInterval(volumeTimer);
    var start = audio.volume;
    var steps = 12;
    var step = 0;
    volumeTimer = window.setInterval(function () {
      step += 1;
      audio.volume = Math.max(0, Math.min(1, start + (volume - start) * step / steps));
      if (step >= steps) window.clearInterval(volumeTimer);
    }, 45);
  }

  function syncMusicControls() {
    document.querySelectorAll(".music-toggle").forEach(function (button) {
      button.setAttribute("aria-pressed", String(musicEnabled));
      button.setAttribute("aria-label", musicEnabled ? content.labels.musicOff : content.labels.musicOn);
    });
    document.querySelectorAll(".volume-slider").forEach(function (slider) {
      slider.value = String(storedVolume);
    });
    document.querySelectorAll(".music-status").forEach(function (status) {
      status.textContent = musicEnabled ? content.music.title : "";
    });
  }

  async function turnMusicOn() {
    if (!audio || musicEnabled || musicStarting) return;
    musicStarting = true;
    try {
      audio.volume = 0;
      await audio.play();
      musicEnabled = true;
      musicStarting = false;
      fadeMusicTo(storedVolume);
      syncMusicControls();
      if (content.music.rememberPreference) {
        try { window.localStorage.setItem(musicKey, "true"); } catch (error) {
          console.warn("Music preference could not be saved.", error);
        }
      }
    } catch (error) {
      musicEnabled = false;
      musicStarting = false;
      syncMusicControls();
      document.querySelectorAll(".music-status").forEach(function (status) {
        status.textContent = "Music could not be played. Check the music file and browser permissions.";
      });
      console.error("Background music could not be started.", error);
      try { window.localStorage.removeItem(musicKey); } catch (storageError) {
        console.warn("The saved music preference could not be cleared.", storageError);
      }
    }
  }

  function toggleMusic() {
    if (!audio) return;
    if (!musicEnabled) {
      turnMusicOn();
      return;
    }
    musicEnabled = false;
    fadeMusicTo(0);
    syncMusicControls();
    window.setTimeout(function () {
      if (!musicEnabled && audio) audio.pause();
    }, 560);
    if (content.music.rememberPreference) {
      try { window.localStorage.setItem(musicKey, "false"); } catch (error) {
        console.warn("Music preference could not be saved.", error);
      }
    }
  }

  function initializeMusic() {
    if (audio || !content.music.file) return;
    audio = document.getElementById("birthday-audio") || new Audio();
    audio.src = new URL("../" + content.music.file, document.baseURI).href;
    audio.preload = "none";
    audio.loop = true;
    var saved = false;
    try {
      saved = content.music.rememberPreference && window.localStorage.getItem(musicKey) === "true";
      var volumeValue = Number(window.localStorage.getItem("birthday-music-volume"));
      if (Number.isFinite(volumeValue) && volumeValue >= 0 && volumeValue <= 1) storedVolume = volumeValue;
    } catch (error) {
      console.warn("Music preference could not be read from local storage.", error);
    }
    audio.volume = storedVolume;
    if (saved && !musicResumePending) {
      musicResumePending = true;
      document.addEventListener("pointerdown", function enableRememberedMusic() {
        musicResumePending = false;
        turnMusicOn();
      }, { once: true });
    }
  }

  function attachHeaderEvents() {
    var toggle = document.querySelector(".nav-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        mobileNav.hidden = !open;
      });
    }
    initializeMusic();
    musicButton = document.querySelector(".music-toggle");
    if (!musicButton) return;
    syncMusicControls();
    musicButton.addEventListener("click", toggleMusic);
    var volumeSlider = document.querySelector(".volume-slider");
    if (volumeSlider) {
      volumeSlider.addEventListener("input", function () {
        storedVolume = Number(volumeSlider.value);
        if (audio && musicEnabled) audio.volume = storedVolume;
        try { window.localStorage.setItem("birthday-music-volume", String(storedVolume)); } catch (error) {
          console.warn("Music volume could not be saved.", error);
        }
      });
    }
  }

  function attachTransitions() {
    document.querySelectorAll('a[href$=".html"], a[href*=".html?"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
        var destination = new URL(link.href, window.location.href);
        if (destination.origin !== window.location.origin) return;
        event.preventDefault();
        window.BirthdayApp.navigate(destination.href);
      });
    });
  }

  function initImages() {
    document.querySelectorAll("img").forEach(function (image) {
      if (image.dataset.fit) image.style.objectFit = image.dataset.fit;
      if (image.dataset.position) image.style.objectPosition = image.dataset.position;
      if (image.dataset.position) image.parentElement.style.setProperty("--image-position", image.dataset.position);
      if (image.dataset.fit) image.parentElement.style.setProperty("--photo-image", 'url("' + image.src.replace(/"/g, "%22") + '")');
      image.addEventListener("error", function () {
        image.classList.add("image-unavailable");
        image.parentElement.classList.add("image-missing");
        image.parentElement.setAttribute("data-fallback", content.images.defaultAlt);
      }, { once: true });
    });
    document.querySelectorAll("[data-background]").forEach(function (element) {
      var filename = element.dataset.background;
      if (filename) {
        element.style.setProperty("--hero-image", 'url("' + imageURL(filename).replace(/"/g, "%22") + '")');
        element.style.setProperty("--hero-image-position", element.dataset.backgroundPosition || content.images.heroPosition);
        element.style.setProperty("--hero-image-fit", content.images.heroFit || "contain");
      }
    });
  }

  function bindPageInteractions() {
    var surprise = document.querySelector(".surprise-card");
    if (surprise) {
      surprise.addEventListener("click", function () {
        var open = surprise.classList.toggle("is-open");
        surprise.setAttribute("aria-expanded", String(open));
        surprise.querySelector(".eyebrow").textContent = open ? content.littleThings.surpriseOpenLabel : content.littleThings.surpriseClosedLabel;
      });
    }

    var envelope = document.querySelector(".letter-envelope");
    var sheet = document.querySelector(".letter-sheet");
    if (envelope && sheet) {
      envelope.addEventListener("click", function () {
        if (sheet.classList.contains("is-open")) return;
        envelope.classList.add("opened");
        sheet.classList.add("is-open");
        sheet.setAttribute("aria-hidden", "false");
        var target = sheet.querySelector(".letter-copy");
        var text = content.letter.content;
        if (window.CinematicEffects.reducedMotion) {
          target.textContent = text;
          return;
        }
        var index = 0;
        var typeTimer = window.setInterval(function () {
          target.textContent = text.slice(0, index + 1);
          index += 1;
          if (index >= text.length) window.clearInterval(typeTimer);
        }, 19);
      });
    }

    if (currentPage === "memories") window.BirthdayCarousel.init();
  }

  function cleanupCurrentPage() {
    if (typeof introCleanup === "function") {
      introCleanup();
      introCleanup = null;
    }
    if (currentPage === "memories") window.BirthdayCarousel.destroy();
    window.CinematicEffects.cleanup();
  }

  function pageFromURL(url) {
    var pathname = new URL(url, window.location.href).pathname;
    var file = pathname.slice(pathname.lastIndexOf("/") + 1).toLowerCase();
    if (!file || file === "index.html") return "intro";
    var route = content.navigation.find(function (item) { return item.href.toLowerCase() === file; });
    return route ? route.page : null;
  }

  function transitionToPage(url, historyAction) {
    var destination = new URL(url, window.location.href);
    if (destination.origin !== window.location.origin) return;
    var nextPage = pageFromURL(destination.href);
    if (!nextPage) {
      window.location.href = destination.href;
      return;
    }
    if (nextPage === currentPage &&
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash === window.location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    var layer = document.querySelector(".page-transition");
    function renderDestination() {
      if (historyAction === "push") window.history.pushState({}, "", destination.href);
      if (historyAction === "replace") window.history.replaceState({}, "", destination.href);
      document.body.dataset.page = nextPage;
      window.scrollTo(0, 0);
      mount(nextPage);
      if (layer && window.gsap && !window.CinematicEffects.reducedMotion) {
        window.gsap.set(layer, { scaleY: 1, transformOrigin: "top" });
        window.gsap.to(layer, {
          scaleY: 0,
          duration: .48,
          ease: "power3.inOut",
          onComplete: function () { window.gsap.set(layer, { transformOrigin: "bottom" }); }
        });
      }
    }

    if (layer && window.gsap && !window.CinematicEffects.reducedMotion) {
      window.gsap.to(layer, {
        scaleY: 1,
        duration: .42,
        ease: "power3.inOut",
        transformOrigin: "bottom",
        onComplete: renderDestination
      });
    } else {
      renderDestination();
    }
  }

  function mount(page) {
    cleanupCurrentPage();
    currentPage = page;
    app = document.getElementById("app");
    if (page === "intro") {
      introCleanup = window.BirthdayIntro.render(content);
      document.title = content.girlfriend.name + " · " + content.intro.eyebrow;
      attachHeaderEvents();
      window.CinematicEffects.initCursor();
      return;
    }
    var renderers = {
      home: homePage,
      journey: journeyPage,
      thingsILove: reasonsPage,
      memories: galleryPage,
      littleThings: littleThingsPage,
      letter: letterPage,
      forever: foreverPage
    };
    if (!renderers[page]) {
      window.BirthdayContent.showError("This story page does not exist. Use the navigation to return to the beginning.");
      return;
    }
    app.innerHTML = '<canvas class="ambient-canvas" aria-hidden="true"></canvas>' + renderers[page]();
    var title = content.navigation.filter(function (item) { return item.page === page; })[0];
    document.title = (title ? title.label : content.girlfriend.name) + " · " + content.girlfriend.name;
    window.CinematicEffects.startAtmosphere(app.querySelector(".ambient-canvas"), { count: window.innerWidth < 700 ? 22 : 38 });
    initImages();
    attachHeaderEvents();
    attachTransitions();
    bindPageInteractions();
    window.CinematicEffects.initReveals();
    window.CinematicEffects.initCursor();
  }

  async function start() {
    try {
      content = await window.BirthdayContent.load();
      window.BirthdayApp = {
        navigate: function (url) { transitionToPage(url, "push"); }
      };
      window.addEventListener("popstate", function () {
        transitionToPage(window.location.href, "none");
      });
      mount(document.body.dataset.page || pageFromURL(window.location.href) || "home");
    } catch (error) {
      console.error("The birthday story could not be initialized.", error);
      window.BirthdayContent.showError(error.message);
    }
  }

  document.addEventListener("DOMContentLoaded", start);
})();
