(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var activeLoops = [];
  var cursorInitialized = false;

  function startAtmosphere(canvas, options) {
    if (!canvas) return null;
    var context = canvas.getContext("2d");
    if (!context) return null;
    var width = 0;
    var height = 0;
    var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    var particles = [];
    var burstParticles = [];
    var amount = options && options.count ? options.count : (window.innerWidth < 700 ? 28 : 64);
    var running = true;

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = [];
      for (var i = 0; i < amount; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + .35,
          opacity: Math.random() * .52 + .16,
          speed: Math.random() * .22 + .05,
          phase: Math.random() * Math.PI * 2,
          petal: Math.random() > .83
        });
      }
    }

    function frame(time) {
      if (!running) return;
      context.clearRect(0, 0, width, height);
      particles.forEach(function (particle) {
        var twinkle = reduceMotion ? 1 : .68 + Math.sin(time * .001 + particle.phase) * .32;
        context.globalAlpha = particle.opacity * twinkle;
        context.fillStyle = particle.petal ? "#e4a6b1" : "#f4dfbb";
        if (particle.petal) {
          context.save();
          context.translate(particle.x, particle.y);
          context.rotate(time * .00012 + particle.phase);
          context.beginPath();
          context.ellipse(0, 0, particle.radius * 1.15, particle.radius * 2.4, 0, 0, Math.PI * 2);
          context.fill();
          context.restore();
          particle.y += reduceMotion ? 0 : particle.speed;
          if (particle.y > height + 5) { particle.y = -5; particle.x = Math.random() * width; }
        } else {
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        }
      });
      context.globalAlpha = 1;
      burstParticles = burstParticles.filter(function (particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += .018;
        particle.life -= .012;
        context.globalAlpha = Math.max(0, particle.life);
        context.fillStyle = particle.color;
        if (particle.shape === "heart") {
          context.save();
          context.translate(particle.x, particle.y);
          context.rotate(Math.atan2(particle.vy, particle.vx) + Math.PI / 2);
          context.scale(particle.radius * 1.8, particle.radius * 1.8);
          context.beginPath();
          context.moveTo(0, .35);
          context.bezierCurveTo(-1, -.2, -1, -1, -.4, -1);
          context.bezierCurveTo(-.08, -1, 0, -.62, 0, -.48);
          context.bezierCurveTo(0, -.62, .08, -1, .4, -1);
          context.bezierCurveTo(1, -1, 1, -.2, 0, .35);
          context.closePath();
          context.fill();
          context.restore();
        } else if (particle.shape === "petal") {
          context.save();
          context.translate(particle.x, particle.y);
          context.rotate(Math.atan2(particle.vy, particle.vx));
          context.beginPath();
          context.ellipse(0, 0, particle.radius * 1.2, particle.radius * 2.8, 0, 0, Math.PI * 2);
          context.fill();
          context.restore();
        } else {
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        }
        return particle.life > 0;
      });
      context.globalAlpha = 1;
      if (!reduceMotion) window.requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (reduceMotion) frame(0);
    else window.requestAnimationFrame(frame);
    var controller = {
      burst: function (x, y, count) {
        var colors = ["#f1d29a", "#e7a5b6", "#f7e9d1", "#c9869b"];
        for (var i = 0; i < count; i += 1) {
          var angle = Math.random() * Math.PI * 2;
          var speed = Math.random() * 4.2 + 1.1;
          burstParticles.push({
            x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              life: 1, radius: Math.random() * 2.4 + .8, color: colors[i % colors.length],
              shape: Math.random() > .68 ? "heart" : (Math.random() > .5 ? "petal" : "spark")
          });
        }
      },
      destroy: function () {
        running = false;
        window.removeEventListener("resize", resize);
        context.clearRect(0, 0, width, height);
      }
    };
    activeLoops.push(controller);
    return controller;
  }

  function initReveals() {
    var elements = document.querySelectorAll(".reveal");
    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      elements.forEach(function (element) {
        window.gsap.fromTo(element, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: .85, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true }
        });
      });
    } else {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
    }
  }

  function initCursor() {
    if (cursorInitialized || reduceMotion || window.matchMedia("(hover: none)").matches) return;
    cursorInitialized = true;
    var last = 0;
    document.addEventListener("pointermove", function (event) {
      var now = Date.now();
      if (now - last < 90 || Math.random() > .7) return;
      last = now;
      var dot = document.createElement("span");
      dot.className = "cursor-spark";
      dot.setAttribute("aria-hidden", "true");
      dot.style.left = event.clientX + "px";
      dot.style.top = event.clientY + "px";
      document.body.appendChild(dot);
      window.setTimeout(function () { dot.remove(); }, 650);
    }, { passive: true });
  }

  function cleanup() {
    activeLoops.forEach(function (loop) { loop.destroy(); });
    activeLoops = [];
    if (window.ScrollTrigger && window.ScrollTrigger.getAll) {
      window.ScrollTrigger.getAll().forEach(function (trigger) { trigger.kill(); });
    }
  }

  window.CinematicEffects = {
    startAtmosphere: startAtmosphere,
    initReveals: initReveals,
    initCursor: initCursor,
    cleanup: cleanup,
    reducedMotion: reduceMotion
  };
})();
