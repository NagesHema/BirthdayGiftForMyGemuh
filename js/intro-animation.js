(function () {
  "use strict";

  function render(content) {
    var app = document.getElementById("app");
    var intro = content.intro;
    var age = content.girlfriend.age;
    var e = window.BirthdayContent.escapeHTML;
    var labels = content.countdownUnits;
    app.innerHTML =
      '<main class="intro-scene page">' +
        '<canvas class="scene-canvas" aria-hidden="true"></canvas>' +
        '<div class="moon-scene" aria-hidden="true"><svg viewBox="0 0 360 380" role="presentation">' +
          '<defs><radialGradient id="moonFill" cx="38%" cy="35%"><stop offset="0" stop-color="#fff1d2"/><stop offset=".72" stop-color="#e2c28e"/><stop offset="1" stop-color="#b88773"/></radialGradient>' +
          '<linearGradient id="moonEdge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4d9"/><stop offset="1" stop-color="#b98a69"/></linearGradient>' +
          '<linearGradient id="dressFill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a44d68"/><stop offset=".56" stop-color="#6e2945"/><stop offset="1" stop-color="#3d182b"/></linearGradient>' +
          '<linearGradient id="dupattaFill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e7b6ac" stop-opacity=".95"/><stop offset="1" stop-color="#a45b72" stop-opacity=".84"/></linearGradient>' +
          '<linearGradient id="hairFill" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#1b1118"/><stop offset=".55" stop-color="#3a2028"/><stop offset="1" stop-color="#1d1118"/></linearGradient>' +
          '<radialGradient id="skinFill" cx=".35" cy=".28"><stop stop-color="#f0c4a4"/><stop offset="1" stop-color="#bd806b"/></radialGradient>' +
          '<filter id="moonGlow"><feGaussianBlur stdDeviation="13"/></filter></defs>' +
          '<circle cx="191" cy="190" r="152" fill="#eccb91" opacity=".2" filter="url(#moonGlow)"/>' +
          '<path class="moon-crescent" d="M258 39 A152 152 0 1 0 258 341 A116 116 0 0 1 258 39Z"/>' +
          '<path class="moon-rim" d="M258 39 A152 152 0 1 0 258 341"/>' +
          '<path class="moon-seat" d="M91 263 C137 246 190 259 254 290"/>' +
          '<g class="moon-sitter">' +
            '<path class="sitter-hair" d="M180 119 C166 120 163 138 170 153 C161 174 158 199 162 223 C165 235 176 240 183 228 L188 182 L199 157Z"/>' +
            '<path class="sitter-salwar" d="M190 199 C208 197 228 204 240 216 C247 223 246 231 239 235 C230 238 218 231 208 226 L184 221Z"/>' +
            '<path class="sitter-salwar" d="M236 225 C244 231 240 243 231 252 L218 263 C212 262 208 258 208 253 C217 244 220 235 220 228Z"/>' +
            '<path class="sitter-salwar" d="M183 210 C194 212 205 222 211 233 L204 244 C195 241 184 232 176 225Z"/>' +
            '<path class="sitter-salwar" d="M200 237 C210 243 218 253 221 264 L214 271 C206 265 200 255 191 245Z"/>' +
            '<path class="sitter-salwar-fold" d="M231 231 Q236 234 235 239 M225 244 Q230 247 228 252 M197 237 Q203 241 205 246 M204 252 L210 259"/>' +
            '<path class="sitter-foot" d="M207 255 C214 251 222 255 225 261 L222 266 C215 267 207 263 204 259Z"/>' +
            '<path class="sitter-foot" d="M214 266 C222 263 231 266 235 272 C231 277 220 277 213 272Z"/>' +
            '<path class="sitter-sandal" d="M206 261 Q214 258 223 262 M212 255 L216 261 M214 273 Q224 269 234 273 M220 266 L224 272"/>' +
            '<path class="sitter-toes" d="M208 261 l-1 3 M213 263 l-1 3 M218 263 l1 2 M219 273 l-1 3 M224 274 l1 3 M229 273 l2 2"/>' +
            '<path class="sitter-arm" d="M185 151 C174 161 169 177 166 195 L157 232"/>' +
            '<circle class="sitter-joint" cx="166" cy="195" r="3.2"/>' +
            '<path class="sitter-hand" d="M158 229 C152 228 148 232 147 237 L143 242 C146 246 150 244 153 248 C157 249 160 246 160 242 L165 238Z"/>' +
            '<path class="sitter-fingers" d="M147 239 L139 244 M151 242 L145 250 M156 243 L152 251"/>' +
            '<path class="sitter-kameez" d="M181 143 C190 136 204 138 212 149 C220 164 218 187 229 216 C220 226 197 231 179 218 C182 198 175 176 176 159Z"/>' +
            '<path class="sitter-dupatta" d="M191 142 C179 151 173 169 169 187 C166 204 159 220 151 232 C165 231 177 222 185 207 L201 158Z"/>' +
            '<path class="sitter-dupatta-fold" d="M193 145 C199 160 199 180 194 196 M161 219 C168 217 175 211 179 204"/>' +
            '<path class="sitter-arm" d="M207 153 C217 163 222 177 223 191 L231 210"/>' +
            '<circle class="sitter-joint" cx="223" cy="191" r="3.2"/>' +
            '<path class="sitter-hand" d="M228 206 C232 203 237 206 238 211 L239 217 C238 221 235 223 232 221 L227 217 L224 214 C224 210 225 208 228 206Z"/>' +
            '<path class="sitter-fingers" d="M230 217 L229 222 M234 218 L234 223 M237 216 L239 220"/>' +
            '<path class="sitter-trim" d="M180 217 C195 228 215 231 229 216 M190 149 C200 166 201 185 196 198"/>' +
            '<path class="sitter-embroidery" d="M190 169 l3 4 -3 4 -3 -4z M204 180 l3 4 -3 4 -3 -4z M194 192 l3 4 -3 4 -3 -4z"/>' +
            '<path class="sitter-hair" d="M177 118 C174 101 185 91 199 93 C214 94 220 107 215 122 C212 134 208 143 202 151 C197 143 188 139 180 135Z"/>' +
            '<path class="sitter-face" d="M183 113 C185 102 194 98 203 101 C212 104 215 114 212 124 C210 133 203 141 197 140 C189 138 183 127 182 119Z"/>' +
            '<path class="sitter-front-hair" d="M179 116 C178 103 186 95 198 95 C209 95 216 103 214 116 C210 111 204 108 198 108 C193 114 186 117 179 118Z"/>' +
            '<path class="sitter-lock" d="M181 115 C178 132 181 150 174 164 M211 114 C217 131 215 146 207 159"/>' +
            '<path class="sitter-brow" d="M190 115 q3 -2 6 0 M201 114 q3 -1 5 1"/>' +
            '<path class="sitter-eye" d="M191 119 q3 -2 5 0 M201 119 q3 -2 5 0"/>' +
            '<circle class="sitter-pupil" cx="194" cy="119" r="1.1"/><circle class="sitter-pupil" cx="204" cy="119" r="1.1"/>' +
            '<path class="sitter-face-line" d="M204 121 Q208 124 205 127 M197 132 Q201 134 205 132"/>' +
            '<circle class="sitter-cheek" cx="190" cy="126" r="2.1"/><circle class="sitter-jewel" cx="197" cy="103" r="2.2"/>' +
            '<circle class="sitter-earring" cx="184" cy="128" r="2.1"/>' +
          '</g><g class="moon-sparkles"><circle cx="71" cy="121" r="2"/><circle cx="294" cy="115" r="2.5"/><circle cx="91" cy="275" r="1.7"/></g>' +
        '</svg></div>' +
        '<section class="intro-content">' +
          '<p class="eyebrow intro-eyebrow">' + e(intro.eyebrow) + '</p>' +
          '<h1 class="intro-title">' + e(intro.heading) + '</h1>' +
          '<p class="intro-subtitle">' + e(intro.countdownLabel) + '</p>' +
          '<div class="countdown" aria-label="Birthday countdown">' +
            labels.map(function (label, i) {
              return '<div class="countdown-unit"><span class="countdown-value" data-count="' + i + '">00</span><span class="countdown-label">' + label + '</span></div>';
            }).join("") +
          '</div>' +
          '<p class="timezone-note" data-timezone></p>' +
          '<div class="journey" aria-label="' + e(intro.journeyLabel) + '">' +
            '<div class="journey-progress"></div>' +
            '<div class="journey-marker"><span>' + e(intro.milestones[0]) + '</span></div>' +
            '<div class="journey-marker"><span>' + e(intro.milestones[1]) + '</span></div>' +
            '<div class="journey-marker"><span>' + e(intro.milestones[2]) + '</span></div>' +
            '<div class="journey-marker"><span>' + e(intro.milestones[3]) + '</span></div>' +
            '<div class="girl" aria-hidden="true"><svg viewBox="0 0 48 78" role="presentation">' +
              '<path class="girl-hair-back" d="M17 7 C10 8 9 16 12 22 L10 31 L7 42 C10 47 16 46 19 39 L21 26 L30 23 L32 40 C35 46 40 44 41 39 L37 24 C39 15 34 7 27 5Z"/>' +
              '<path class="girl-neck" d="M21 19 L20 25 L28 26 L27 19Z"/>' +
              '<path class="girl-leg girl-leg-one" d="M19 58 C17 63 16 68 15 73"/><path class="girl-leg girl-leg-two" d="M28 58 C29 63 32 68 34 72"/>' +
              '<path class="girl-shoe" d="M11 72 Q15 70 18 73 L18 76 Q14 77 10 75Z"/><path class="girl-shoe" d="M31 71 Q35 71 37 74 L37 76 Q33 77 30 74Z"/>' +
              '<path class="girl-dress" d="M19 24 C22 21 28 21 31 25 C34 31 32 40 35 48 L40 61 C31 66 17 66 7 61 L13 48 L16 31Z"/>' +
              '<path class="girl-dress-trim" d="M16 49 Q24 53 34 49 M20 26 Q24 30 30 26"/>' +
              '<path class="girl-dupatta" d="M19 24 C16 31 15 38 11 44 L7 48 C13 48 18 43 21 37 L25 28Z"/>' +
              '<path class="girl-arm" d="M18 28 C15 32 13 37 12 42"/><path class="girl-hand" d="M12 41 Q9 42 9 46 L12 47 L14 43Z"/>' +
              '<path class="girl-arm" d="M31 29 C35 33 36 38 37 43"/><path class="girl-hand" d="M36 42 Q39 42 40 45 L38 48 L36 45Z"/>' +
              '<ellipse class="girl-face" cx="24" cy="13" rx="8" ry="9.5"/>' +
              '<path class="girl-hair-front" d="M16 13 C14 7 18 3 24 3 C31 3 35 8 33 15 C30 12 28 10 25 10 C22 14 19 15 16 15Z"/>' +
              '<path class="girl-hair-lock" d="M17 13 C17 20 18 24 16 29 M32 13 C33 19 32 24 34 29"/>' +
              '<path class="girl-hair-line" d="M20 6 Q23 4 26 5 M18 9 Q20 7 22 7"/>' +
              '<path class="girl-brow" d="M19 12 q2 -1 4 0 M26 12 q2 -1 4 0"/>' +
              '<circle class="girl-eye" cx="21" cy="14" r="1.15"/><circle class="girl-eye" cx="28" cy="14" r="1.15"/>' +
              '<circle class="girl-cheek" cx="18.5" cy="17" r="1.35"/><circle class="girl-cheek" cx="30" cy="17" r="1.35"/>' +
              '<path class="girl-face-line" d="M24 15 L23 17 L25 17 M21.5 19 Q24 21 27 19"/>' +
            '</svg></div>' +
            '<div class="age-destination soft-glow">' + e(age) + '<small>' + e(intro.milestones[4]) + '</small></div>' +
          '</div>' +
          '<div class="intro-actions"><button class="icon-button music-toggle" type="button" aria-label="' + e(content.labels.musicOn) + '" aria-pressed="false">♫</button>' +
            '<label class="volume-control"><span class="visually-hidden">' + e(content.labels.volume) + '</span><input class="volume-slider" type="range" min="0" max="1" step="0.01" value="0.55" aria-label="' + e(content.labels.volume) + '"></label>' +
            '<a class="button button-ghost enter-story" href="pages/home.html">' + e(intro.enterLabel) + '</a><span class="music-status visually-hidden" aria-live="polite"></span></div>' +
        '</section>' +
        '<section class="celebration" hidden aria-live="assertive">' +
          '<div class="celebration-inner"><p class="eyebrow">' + e(intro.eyebrow) + '</p>' +
            '<h2 class="celebration-title">' + e(intro.celebrationTitle) + '</h2>' +
            '<p class="celebration-subtitle">' + e(intro.celebrationSubtitle) + '</p>' +
            '<div class="celebration-actions"><a class="button enter-story" href="pages/home.html">' + e(intro.enterLabel) + '</a>' +
              '<button class="button button-ghost replay-celebration" type="button" hidden>' + e(intro.replayLabel) + '</button></div></div>' +
          '<div class="balloon" aria-hidden="true">♡</div><div class="arrow" aria-hidden="true">➶</div>' +
        '</section>' +
      '</main>';

    var canvas = app.querySelector(".scene-canvas");
    var atmosphere = window.CinematicEffects.startAtmosphere(canvas);
    var birthday = window.BirthdayCountdown.targetDate(content.girlfriend.birthday);
    var countdown = app.querySelector(".countdown");
    var countdownElements = Array.from(app.querySelectorAll("[data-count]"));
    var girl = app.querySelector(".girl");
    var progress = app.querySelector(".journey-progress");
    var replayButton = app.querySelector(".replay-celebration");
    var celebration = app.querySelector(".celebration");
    var introContent = app.querySelector(".intro-content");
    var moonScene = app.querySelector(".moon-scene");
    var timerStop;
    var walkTimer;
    var celebrationTimeout;
    var celebrationFallbackTimeout;
    var celebrationTimeline;
    var animationKey = "birthday-celebration:" + content.girlfriend.birthday;
    var query = new URLSearchParams(window.location.search);
    var navEntry = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    var intentionalReload = navEntry && navEntry.type === "reload";
    var alreadySeen = false;
    try { alreadySeen = window.sessionStorage.getItem(animationKey) === "played"; } catch (error) {
      console.warn("Session storage is unavailable; the birthday scene will play on each visit.", error);
    }

    var timezoneText = "Birthday moment · " + content.girlfriend.timezone;
    try {
      timezoneText = new Intl.DateTimeFormat(undefined, {
        dateStyle: "long", timeStyle: "short", timeZone: content.girlfriend.timezone
      }).format(birthday) + " · " + content.girlfriend.timezone;
    } catch (error) {
      console.warn("The configured birthday timezone could not be formatted.", error);
    }
    app.querySelector("[data-timezone]").textContent = timezoneText;

    function updateWalk() {
      var remaining = Math.max(0, birthday.getTime() - Date.now());
      var days = Number(content.intro.journeyWindowDays) || 30;
      var progressValue = Math.max(.035, Math.min(1, 1 - remaining / (days * 86400000)));
      progress.style.width = (progressValue * 91) + "%";
      girl.style.left = "calc(2% + " + (progressValue * 84) + "%)";
      girl.style.setProperty("--age-scale", (.42 + progressValue * .96).toFixed(3));
    }

    function updateClock(value) {
      if (value.reached) {
        countdownElements.forEach(function (element) { element.textContent = "00"; });
        launchCelebration(false);
        return;
      }
      [value.days, value.hours, value.minutes, value.seconds].forEach(function (number, index) {
        countdownElements[index].textContent = index === 0 ? String(number).padStart(2, "0") : window.BirthdayCountdown.pad(number);
      });
      updateWalk();
    }

    function playScene(replay) {
      girl.classList.remove("walking");
      introContent.hidden = true;
      moonScene.hidden = true;
      celebration.hidden = false;
      countdown.hidden = true;
      replayButton.hidden = true;
      if (replay) {
        celebration.querySelector(".celebration-title").classList.remove("is-visible");
      }
      if (window.CinematicEffects.reducedMotion || !window.gsap) {
        celebration.classList.add("is-visible");
        if (atmosphere) atmosphere.burst(window.innerWidth / 2, window.innerHeight / 2, 45);
        replayButton.hidden = false;
        return;
      }
      var arrow = celebration.querySelector(".arrow");
      var balloon = celebration.querySelector(".balloon");
      var title = celebration.querySelector(".celebration-title");
      var copy = celebration.querySelector(".celebration-subtitle");
      if (celebrationTimeline) celebrationTimeline.kill();
      window.gsap.set(arrow, { x: -window.innerWidth * .25, y: 80, rotation: -17, autoAlpha: 0 });
      window.gsap.set(balloon, { scale: .2, autoAlpha: 0, y: 80 });
      window.gsap.set([title, copy], { y: 30, autoAlpha: .65 });
      celebrationTimeline = window.gsap.timeline({
        onComplete: function () {
          window.clearTimeout(celebrationFallbackTimeout);
          replayButton.hidden = false;
        }
      })
        .to(balloon, { autoAlpha: 1, scale: 1, y: 0, duration: .7, ease: "back.out(1.7)" })
        .to(arrow, { autoAlpha: 1, duration: .12 }, "-=.1")
        .to(arrow, {
          x: window.innerWidth * .33, y: -window.innerHeight * .25, duration: .7, ease: "power3.in",
          onComplete: function () {
            if (atmosphere) atmosphere.burst(window.innerWidth / 2, window.innerHeight * .26, window.innerWidth < 700 ? 75 : 145);
            window.gsap.to(balloon, { scale: 1.65, autoAlpha: 0, duration: .18, ease: "power2.in" });
          }
        }, "-=.12")
        .to([title, copy], { autoAlpha: 1, y: 0, duration: .85, stagger: .13, ease: "power3.out" }, "-=.05");
      celebrationFallbackTimeout = window.setTimeout(function () {
        title.style.opacity = "1";
        title.style.visibility = "visible";
        title.style.transform = "none";
        copy.style.opacity = "1";
        copy.style.visibility = "visible";
        copy.style.transform = "none";
        replayButton.hidden = false;
      }, 3000);
    }

    function launchCelebration(replay) {
      if (timerStop) timerStop();
      window.clearInterval(walkTimer);
      window.clearTimeout(celebrationTimeout);
      girl.classList.remove("walking");
      try { window.sessionStorage.setItem(animationKey, "played"); } catch (error) {
        console.warn("The celebration could not be remembered for this browser session.", error);
      }
      playScene(replay);
    }

    function cleanup() {
      if (timerStop) timerStop();
      window.clearInterval(walkTimer);
      window.clearTimeout(celebrationTimeout);
      window.clearTimeout(celebrationFallbackTimeout);
      if (celebrationTimeline) celebrationTimeline.kill();
    }

    replayButton.addEventListener("click", function () { launchCelebration(true); });
    app.querySelectorAll(".enter-story").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.BirthdayApp.navigate(link.href);
      });
    });

    if (Date.now() >= birthday.getTime()) {
      countdown.hidden = true;
      if (alreadySeen && !intentionalReload && query.get("replay") !== "1") {
        introContent.hidden = true;
        moonScene.hidden = true;
        celebration.hidden = false;
        celebration.querySelector(".arrow").hidden = true;
        celebration.querySelector(".balloon").hidden = true;
        replayButton.hidden = false;
      } else {
        celebrationTimeout = window.setTimeout(function () { launchCelebration(query.get("replay") === "1"); }, 280);
      }
      return cleanup;
    }

    girl.classList.add("walking");
    timerStop = window.BirthdayCountdown.bind(birthday, updateClock);
    walkTimer = window.setInterval(updateWalk, 1000);
    if (window.gsap && !window.CinematicEffects.reducedMotion) {
      window.gsap.from(".intro-eyebrow, .intro-title, .intro-subtitle, .countdown, .journey, .intro-actions", {
        y: 18, autoAlpha: 0, duration: .75, stagger: .12, ease: "power2.out"
      });
    }
    return cleanup;
  }

  window.BirthdayIntro = { render: render };
})();
