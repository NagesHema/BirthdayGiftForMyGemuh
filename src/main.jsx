import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import content from "../data/birthday-content.json";
import "../css/style.css";
import "../css/animations.css";
import "../css/responsive.css";
import "../css/react-app.css";

const NavigationContext = createContext(() => {});
const pagePaths = {
  intro: "/",
  home: "/pages/home.html",
  journey: "/pages/our-story.html",
  thingsILove: "/pages/things-i-love.html",
  memories: "/pages/memories.html",
  littleThings: "/pages/little-things.html",
  letter: "/pages/letter.html",
  forever: "/pages/forever.html",
};
const pageFromPath = Object.fromEntries(Object.entries(pagePaths).map(([page, path]) => [path, page]));
const imageUrl = (file) => `/${content.images.directory.replace(/^\/+|\/+$/g, "")}/${encodeURIComponent(file || "")}`;
const imageStyle = (item, fit) => ({
  objectFit: item.fit || fit || content.images.galleryFit || "contain",
  objectPosition: item.position || "center",
});
const galleryFrameStyle = (item) => ({
  ...(item.width != null ? { width: item.width } : {}),
  ...(item.height != null ? { height: item.height } : {}),
});
const musicKey = "birthday-music-enabled";

function PageLink({ to, children, className, onClick, ...props }) {
  const navigate = useContext(NavigationContext);
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank") return;
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function useMusic() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const stored = localStorage.getItem("birthday-music-volume");
      if (stored === null) return 0.55;
      const saved = Number(stored);
      return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.55;
    } catch (error) {
      console.warn("Music volume could not be read from local storage.", error);
      return 0.55;
    }
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    let shouldResume = false;
    try {
      shouldResume = content.music.rememberPreference && localStorage.getItem(musicKey) === "true";
    } catch (error) {
      console.warn("Music preference could not be read from local storage.", error);
    }
    if (!shouldResume) return undefined;
    const resume = () => {
      void startMusic();
      window.removeEventListener("pointerdown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    return () => window.removeEventListener("pointerdown", resume);
  }, []);

  async function startMusic() {
    const audio = audioRef.current;
    if (!audio || enabled) return;
    try {
      await audio.play();
      setEnabled(true);
      setStatus(content.music.title);
    } catch (error) {
      setEnabled(false);
      setStatus("Music could not be played. Check the music file and browser permissions.");
      console.error("Background music could not be started.", error);
      return;
    }
    try {
      if (content.music.rememberPreference) localStorage.setItem(musicKey, "true");
    } catch (error) {
      console.warn("Music preference could not be saved.", error);
    }
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!enabled) {
      void startMusic();
      return;
    }
    audio.pause();
    setEnabled(false);
    setStatus("");
    try {
      if (content.music.rememberPreference) localStorage.setItem(musicKey, "false");
    } catch (error) {
      console.warn("Music preference could not be saved.", error);
    }
  }

  function changeVolume(value) {
    const next = Number(value);
    setVolume(next);
    try {
      localStorage.setItem("birthday-music-volume", String(next));
    } catch (error) {
      console.warn("Music volume could not be saved.", error);
    }
  }

  return { audioRef, enabled, volume, status, toggleMusic, changeVolume };
}

function MusicControls({ music, compact = false }) {
  return (
    <div className={`music-controls${compact ? " music-controls-compact" : ""}`}>
      <button
        className="icon-button music-toggle"
        type="button"
        onClick={music.toggleMusic}
        aria-label={music.enabled ? content.labels.musicOff : content.labels.musicOn}
        aria-pressed={music.enabled}
      >
        {music.enabled ? "♫" : "♪"}
      </button>
      <label className="volume-control">
        <span className="visually-hidden">{content.labels.volume}</span>
        <input
          className="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={music.volume}
          onChange={(event) => music.changeVolume(event.target.value)}
          aria-label={content.labels.volume}
        />
      </label>
      <span className="music-status visually-hidden" aria-live="polite">{music.status}</span>
    </div>
  );
}

function Atmosphere() {
  return (
    <div className="petal-field" aria-hidden="true">
      {Array.from({ length: 20 }, (_, index) => (
        <span
          className="floating-petal"
          key={index}
          style={{
            "--petal-x": `${(index * 47 + 7) % 100}%`,
            "--petal-delay": `${(index % 8) * -1.7}s`,
            "--petal-duration": `${14 + (index % 7) * 2}s`,
            "--petal-size": `${5 + (index % 4) * 2}px`,
          }}
        />
      ))}
    </div>
  );
}

function Reveal({ children, className = "", ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Header({ page, music }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <PageLink className="wordmark" to={pagePaths.home}>{content.girlfriend.name}<span aria-hidden="true"> ✦</span></PageLink>
      <div className="header-actions">
        <nav className="desktop-nav" aria-label="Story navigation">
          {content.navigation.map((item) => (
            <PageLink key={item.page} to={pagePaths[item.page]} aria-current={page === item.page ? "page" : undefined}>
              {item.label}
            </PageLink>
          ))}
        </nav>
        <MusicControls music={music} compact />
        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? content.labels.close : content.labels.menu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Story navigation">
          {content.navigation.map((item) => (
            <PageLink key={item.page} to={pagePaths[item.page]} aria-current={page === item.page ? "page" : undefined} onClick={() => setMenuOpen(false)}>
              {item.label}
            </PageLink>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><span>{content.intro.eyebrow}</span><span className="footer-heart" aria-hidden="true">♡</span></footer>;
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

function Hero({ eyebrow, title, lead, image, children, position = "center" }) {
  return (
    <section
      className="page-hero"
      style={{
        "--hero-photo": `url("${imageUrl(image)}")`,
        "--hero-position": position,
        "--hero-fit": content.images.heroFit || "cover",
      }}
    >
      <div className="hero-copy">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-title">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </Reveal>
      </div>
      <span className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <span className="hero-orbit hero-orbit-two" aria-hidden="true" />
    </section>
  );
}

function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {Array.from({ length: 48 }, (_, index) => (
        <span
          className="sky-star"
          key={index}
          style={{
            "--star-x": `${(index * 67 + 13) % 100}%`,
            "--star-y": `${(index * 41 + 9) % 92}%`,
            "--star-delay": `${(index % 9) * -0.7}s`,
            "--star-size": `${index % 7 === 0 ? 3 : 1 + (index % 2)}px`,
          }}
        />
      ))}
    </div>
  );
}

function MoonScene() {
  return (
    <div className="moon-scene" aria-hidden="true">
      <svg viewBox="0 0 420 350" role="presentation">
        <defs>
          <radialGradient id="storybookMoon" cx="38%" cy="35%">
            <stop stopColor="#fff5dc" />
            <stop offset=".68" stopColor="#e9c995" />
            <stop offset="1" stopColor="#bc8a77" />
          </radialGradient>
          <linearGradient id="storybookDress" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#b66c80" />
            <stop offset="1" stopColor="#61334d" />
          </linearGradient>
          <linearGradient id="storybookHair" x1="0" x2="1">
            <stop stopColor="#21131d" />
            <stop offset=".55" stopColor="#4a2d37" />
            <stop offset="1" stopColor="#1c1119" />
          </linearGradient>
          <radialGradient id="moonGirlSkin" cx="32%" cy="25%">
            <stop stopColor="#f4d0b1" />
            <stop offset=".72" stopColor="#dda78b" />
            <stop offset="1" stopColor="#b8786d" />
          </radialGradient>
          <radialGradient id="moonSeatShade">
            <stop stopColor="#795865" stopOpacity=".5" />
            <stop offset="1" stopColor="#795865" stopOpacity="0" />
          </radialGradient>
          <filter id="storybookGlow"><feGaussianBlur stdDeviation="13" /></filter>
          <filter id="moonGirlDepth" x="-25%" y="-25%" width="150%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#120d16" floodOpacity=".42" />
          </filter>
        </defs>
        <circle cx="205" cy="178" r="151" fill="#eccb91" opacity=".18" filter="url(#storybookGlow)" />
        <path className="storybook-moon" d="M288 32a148 148 0 1 0 0 296A112 112 0 0 1 288 32Z" />
        <path className="storybook-moon-rim" d="M288 32a148 148 0 1 0 0 296" />
        <g className="moon-craters">
          <ellipse cx="70" cy="169" rx="13" ry="6" />
          <ellipse cx="103" cy="224" rx="9" ry="4" />
          <ellipse cx="125" cy="132" rx="7" ry="3" />
          <ellipse cx="77" cy="260" rx="5" ry="2.5" />
        </g>
        <ellipse className="moon-seat-shadow" cx="207" cy="177" rx="46" ry="8" />
        <path className="storybook-seat" d="M88 184c34-31 75-37 111-20 18 8 35 20 55 29" />
        <g className="moon-girl" filter="url(#moonGirlDepth)">
          <path className="moon-girl-hair" fill="url(#storybookHair)" d="M143 74c-12-19-4-42 17-49 22-8 43 7 39 30-2 14-8 27-16 37l-34 2Z" />
          <path className="moon-girl-face" d="M151 64c1-18 12-29 26-28 15 1 23 14 19 29-3 14-13 25-24 23-12-2-22-12-21-24Z" />
          <path className="moon-girl-fringe" fill="url(#storybookHair)" d="M151 65c-3-18 8-32 25-32 15 0 24 11 22 26-7-7-15-9-23-8-6 7-14 11-24 14Z" />
          <path className="moon-girl-lock" d="M151 63c-3 18 2 38-9 54m52-55c8 17 2 32-5 42" />
          <path className="moon-girl-dress" fill="url(#storybookDress)" d="M165 91c15-7 32-2 39 12 7 14 5 31 16 44-17 13-39 14-59 5 8-20 1-37-4-48Z" />
          <path className="moon-girl-dress-fold" d="M178 101c5 11 8 24 6 36m13-33c4 11 8 21 17 30" />
          <path className="moon-girl-sleeve" d="M169 101c-15 13-21 27-25 43m57-37c10 9 15 21 19 34" />
          <path className="moon-girl-arm" d="M147 143c15-2 27 1 37 10" />
          <path className="moon-girl-arm" d="M212 135c9 7 15 14 24 20" />
          <path className="moon-girl-hand" d="M178 151c8-2 14 3 19 8m39-4 6 5" />
          <path className="moon-girl-skirt" fill="url(#storybookDress)" d="M163 145c15 7 35 9 56 1 12 10 24 17 38 20l-4 10c-21 0-40-6-57-14-14 7-30 8-45 3Z" />
          <path className="moon-girl-skirt-fold" d="M184 151c6 8 12 13 20 17m10-19c7 5 14 9 23 12" />
          <path className="moon-girl-leg" d="M214 162c11 7 20 14 30 13 8 0 12-4 18-3m-59-8c8 6 14 13 17 21 3 6 8 9 14 12" />
          <path className="moon-girl-foot" d="M250 169c8-2 14 1 19 5m-39 13c7-2 13 0 18 4" />
          <path className="moon-girl-face-line" d="M165 66q4-3 7 0m8 0q4-3 7 0m-16 14q8 6 15 0" />
          <circle className="moon-girl-eye" cx="169" cy="68" r="1.5" /><circle className="moon-girl-eye" cx="184" cy="68" r="1.5" />
          <circle className="moon-girl-cheek" cx="163" cy="76" r="3" /><circle className="moon-girl-cheek" cx="190" cy="76" r="3" />
          <path className="moon-girl-embroidery" d="m177 112 3 4-3 4-3-4z" />
        </g>
        <g className="moon-constellation">
          <path d="m76 116 13-12 11 17 13-13" />
          <circle cx="76" cy="116" r="2" /><circle cx="89" cy="104" r="2" /><circle cx="100" cy="121" r="2" /><circle cx="113" cy="108" r="2" />
        </g>
      </svg>
    </div>
  );
}

function WalkingGirl({ className = "" }) {
  return (
    <svg className={`girl-svg ${className}`} viewBox="0 0 70 122" role="presentation">
      <defs>
        <linearGradient id="walkerHair" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1b121a" />
          <stop offset=".55" stopColor="#49303a" />
          <stop offset="1" stopColor="#241720" />
        </linearGradient>
        <linearGradient id="walkerDress" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c27c8c" />
          <stop offset=".52" stopColor="#8c5068" />
          <stop offset="1" stopColor="#593349" />
        </linearGradient>
        <radialGradient id="walkerSkin" cx=".35" cy=".2">
          <stop stopColor="#f5d2b1" />
          <stop offset="1" stopColor="#cc9078" />
        </radialGradient>
      </defs>
      <path className="walker-hair-back" d="M25 14c-11 0-16 9-13 20l-5 24c3 7 11 7 15 0l6-20 18 2 5 20c4 6 12 4 13-3l-8-25c3-12-4-21-15-21Z" />
      <path className="walker-neck" d="m29 35-1 9 12 1-1-11Z" />
      <g className="walker-leg walker-leg-left"><path d="M28 86c-4 10-6 19-8 28" /><path className="walker-shoe" d="m16 112 13-1 2 5-15 1Z" /></g>
      <g className="walker-leg walker-leg-right"><path d="M41 86c4 9 8 17 12 24" /><path className="walker-shoe" d="m48 108 12 1 3 5-14-1Z" /></g>
      <path className="walker-dress" d="M27 42c7-6 16-5 22 2 5 11 3 21 8 32l8 13c-17 9-37 9-57 0l9-15 4-23Z" />
      <path className="walker-dress-fold" d="M35 55c-2 12-6 22-13 31m19-29c2 13 7 23 16 31" />
      <path className="walker-dress-trim" d="M18 77q17 8 37 0M29 46q7 6 15 0" />
      <path className="walker-scarf" d="M29 43c-8 10-10 22-17 31 8 0 16-5 21-15l6-11Z" />
      <g className="walker-arm walker-arm-left"><path d="M26 48c-7 7-9 16-12 25" /><path className="walker-hand" d="m12 71-4 7 6 2 4-7Z" /></g>
      <g className="walker-arm walker-arm-right"><path d="M48 48c8 7 10 15 12 24" /><path className="walker-hand" d="m58 70 6 6-5 4-5-7Z" /></g>
      <ellipse className="walker-face" cx="35" cy="26" rx="10" ry="12" />
      <path className="walker-hair-front" d="M24 28c-4-14 3-23 13-23 12 0 17 9 14 22-6-6-12-9-17-7-2 4-6 7-10 8Z" />
      <path className="walker-lock" d="M25 28c-1 13 2 22-3 29m29-29c2 11-1 19 5 26" />
      <path className="walker-face-line" d="M30 27q3-2 5 0m6 0q3-2 5 0m-13 8q5 4 10 0" />
      <circle className="walker-eye" cx="33" cy="29" r="1.4" /><circle className="walker-eye" cx="43" cy="29" r="1.4" />
      <circle className="walker-cheek" cx="29" cy="34" r="2.3" /><circle className="walker-cheek" cx="47" cy="34" r="2.3" />
      <path className="walker-hair-glint" d="M30 9q7-5 14-1" />
    </svg>
  );
}

function BirthdayCelebration({ phase, setPhase, onReplay, celebrationKey }) {
  const sceneRef = useRef(null);
  const characterRef = useRef(null);
  const balloonRef = useRef(null);
  const arrowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const actionsRef = useRef(null);
  const particlesRef = useRef([]);
  const reducedMotion = useReducedMotion();
  const particles = useMemo(() => Array.from({ length: 220 }, (_, index) => ({
    symbol: index % 4 === 0 ? "♥" : index % 3 === 0 ? "✦" : "",
    kind: index % 4 === 0 ? "heart" : index % 3 === 0 ? "spark" : "petal",
  })), []);

  useEffect(() => {
    if (phase !== "playing" || !sceneRef.current) return undefined;
    const scene = sceneRef.current;
    const character = characterRef.current;
    const balloon = balloonRef.current;
    const arrow = arrowRef.current;
    const archerArm = character.querySelector(".walker-arm-right");
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const actions = actionsRef.current;
    const burst = particlesRef.current.filter(Boolean);

    if (reducedMotion) {
      gsap.set([character, balloon, title, subtitle, actions], { autoAlpha: 1, clearProps: "transform" });
      setPhase("done");
      return undefined;
    }

    const arrowBounds = arrow.getBoundingClientRect();
    const balloonBounds = balloon.getBoundingClientRect();
    const sceneBounds = scene.getBoundingClientRect();
    const dx = balloonBounds.left + balloonBounds.width / 2 - arrowBounds.left - arrowBounds.width / 2;
    const dy = balloonBounds.top + balloonBounds.height / 2 - arrowBounds.top - arrowBounds.height / 2;
    let burstTween;

    gsap.set(character, { autoAlpha: 0, x: -40 });
    gsap.set(balloon, { autoAlpha: 0, scale: 0.25, y: 35, transformOrigin: "50% 70%" });
    gsap.set(arrow, { autoAlpha: 0, x: 0, y: 0, rotation: -18 });
    gsap.set(archerArm, { rotation: 0, transformOrigin: "20% 15%" });
    gsap.set([title, subtitle, actions], { autoAlpha: 0, y: 24 });
    gsap.set(burst, { autoAlpha: 0, scale: 0, x: 0, y: 0, transformOrigin: "50% 50%" });

    const timeline = gsap.timeline({
      onComplete: () => setPhase("done"),
    });

    timeline
      .to(scene, { backgroundColor: "rgba(22, 9, 20, .97)", duration: 0.55, ease: "power2.inOut" })
      .to(character, { autoAlpha: 1, x: 0, duration: 0.68, ease: "power3.out" })
      .to(balloon, { autoAlpha: 1, scale: 1, y: 0, duration: 0.72, ease: "back.out(1.7)" }, "-=.2")
      .to(archerArm, { rotation: -28, duration: 0.28, ease: "power1.inOut" }, "-=.1")
      .to(arrow, { autoAlpha: 1, duration: 0.12 })
      .to(arrow, {
        x: dx,
        y: dy,
        rotation: 22,
        duration: 0.82,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(burst, {
            left: `${balloonBounds.left + balloonBounds.width / 2 - sceneBounds.left}px`,
            top: `${balloonBounds.top + balloonBounds.height / 2 - sceneBounds.top}px`,
          });
          burstTween = gsap.to(burst, {
            x: (index) => Math.cos(index * 2.399) * (120 + (index % 9) * 28),
            y: (index) => Math.sin(index * 2.399) * (100 + (index % 7) * 34),
            rotation: (index) => (index % 2 ? 1 : -1) * (160 + index % 220),
            scale: (index) => 0.65 + (index % 5) * 0.16,
            autoAlpha: 0,
            duration: (index) => 1.4 + (index % 8) * 0.12,
            stagger: 0.0015,
            ease: "power2.out",
          });
          gsap.to(balloon, { scale: 1.9, autoAlpha: 0, duration: 0.2, ease: "power2.in" });
        },
      })
      .to(archerArm, { rotation: 12, duration: 0.24, ease: "power2.in" }, "-=.55")
      .to(arrow, { autoAlpha: 0, duration: 0.14 }, "-=.1")
      .to([title, subtitle], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.16, ease: "power3.out" }, "-=.12")
      .to(actions, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=.1");

    return () => {
      timeline.kill();
      burstTween?.kill();
    };
  }, [phase, reducedMotion, setPhase]);

  return (
    <section className="birthday-celebration" ref={sceneRef} data-phase={phase} aria-live="assertive">
      <div className="celebration-glow" aria-hidden="true" />
      <div className="celebration-copy">
        <p className="eyebrow">{content.intro.eyebrow}</p>
        <h1 className="celebration-title" ref={titleRef}>{content.intro.celebrationTitle.replace(/[.!?]+$/, "").toUpperCase()}!</h1>
        <p className="celebration-subtitle" ref={subtitleRef}>{content.intro.celebrationSubtitle}</p>
        <div className="celebration-actions" ref={actionsRef}>
          <PageLink className="button intro-enter" to={pagePaths.home}>{content.intro.enterLabel}<span aria-hidden="true">↗</span></PageLink>
          <button className="button button-ghost replay-button" type="button" onClick={onReplay}>{content.intro.replayLabel}</button>
        </div>
      </div>
      <div className="celebration-character" ref={characterRef} aria-hidden="true"><WalkingGirl className="celebration-girl-svg" /></div>
      <div className="heart-balloon" ref={balloonRef} aria-hidden="true">
        <svg viewBox="0 0 120 155" role="presentation">
          <defs><radialGradient id={`balloonFill-${celebrationKey}`} cx=".35" cy=".25"><stop stopColor="#ffe4d7" /><stop offset=".6" stopColor="#db8299" /><stop offset="1" stopColor="#9b456d" /></radialGradient></defs>
          <path d="M60 111C39 94 13 75 13 48 13 25 42 17 60 39 78 17 107 25 107 48c0 27-26 46-47 63Z" fill={`url(#balloonFill-${celebrationKey})`} />
          <path d="M59 111q4 17 0 27m0-27q-4 17 0 27" fill="none" stroke="#e9c98e" strokeWidth="1.5" />
          <path d="M33 44c2-9 9-14 18-14" fill="none" stroke="#fff1e8" strokeLinecap="round" strokeWidth="3" opacity=".8" />
        </svg>
      </div>
      <div className="celebration-arrow" ref={arrowRef} aria-hidden="true">➶</div>
      <div className="celebration-particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            className={`celebration-particle particle-${particle.kind}`}
            key={index}
            ref={(element) => { particlesRef.current[index] = element; }}
          >
            {particle.symbol}
          </span>
        ))}
      </div>
      <span className="celebration-orbit celebration-orbit-one" aria-hidden="true" />
      <span className="celebration-orbit celebration-orbit-two" aria-hidden="true" />
    </section>
  );
}

function Intro({ music }) {
  const birthday = useMemo(() => new Date(content.girlfriend.birthday), []);
  const birthdayTime = birthday.getTime();
  const [now, setNow] = useState(Date.now());
  const [celebrationPhase, setCelebrationPhase] = useState(
    birthdayTime <= Date.now() ? "loading" : "countdown",
  );
  const remaining = Math.max(0, birthdayTime - now);
  const reached = remaining === 0;
  const journeyWindowDays = Math.max(1, Number(content.intro.journeyWindowDays) || 30);
  const journeyStart = birthdayTime - journeyWindowDays * 86400000;
  const journeyProgress = Math.max(0, Math.min(1, (now - journeyStart) / (journeyWindowDays * 86400000)));
  const ageAtProgress = 1 + Math.round(journeyProgress * (content.girlfriend.age - 1));
  const seconds = Math.floor(remaining / 1000);
  const countdown = [
    Math.floor(seconds / 86400),
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ];
  const birthdayText = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: content.girlfriend.timezone,
  }).format(birthday);
  const celebrationKey = `birthday-celebration:${content.girlfriend.birthday}`;
  const markerPositions = [5, 27, 49, 71, 95];
  const markerAges = [
    1,
    Math.max(2, Math.round(content.girlfriend.age * 0.23)),
    Math.max(3, Math.round(content.girlfriend.age * 0.5)),
    Math.max(4, Math.round(content.girlfriend.age * 0.77)),
    content.girlfriend.age,
  ];
  const replayCelebration = () => {
    try {
      window.sessionStorage.setItem(celebrationKey, "played");
    } catch (error) {
      console.warn("The celebration could not be remembered for this browser session.", error);
    }
    setCelebrationPhase("playing");
  };

  useEffect(() => {
    if (reached) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [reached]);

  useEffect(() => {
    if (!reached) {
      setCelebrationPhase("countdown");
      return;
    }
    let alreadyPlayed = false;
    try {
      alreadyPlayed = window.sessionStorage.getItem(celebrationKey) === "played";
    } catch (error) {
      console.warn("The celebration could not be checked for this browser session.", error);
    }
    const navigation = performance.getEntriesByType?.("navigation")?.[0];
    const isIntentionalReload = navigation?.type === "reload";
    const replayRequested = new URLSearchParams(window.location.search).get("replay") === "1";
    if (!alreadyPlayed || isIntentionalReload || replayRequested) {
      try {
        window.sessionStorage.setItem(celebrationKey, "played");
      } catch (error) {
        console.warn("The celebration could not be remembered for this browser session.", error);
      }
      setCelebrationPhase("playing");
    } else {
      setCelebrationPhase("done");
    }
  }, [reached, celebrationKey]);

  return (
    <main className={`intro-scene page${celebrationPhase === "playing" ? " is-celebrating" : ""}`}>
      <Starfield />
      <Atmosphere />
      <MoonScene />
      <div className="intro-topline">
        <span className="intro-wordmark">{content.girlfriend.name}<span aria-hidden="true"> ✦</span></span>
        <MusicControls music={music} />
      </div>
      {celebrationPhase === "countdown" ? (
        <>
          <section className="intro-layout">
            <motion.div
              className="intro-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="eyebrow intro-eyebrow">{content.intro.eyebrow}</p>
              <p className="intro-kicker">A little story, just for you</p>
              <h1 className="intro-title">{content.intro.heading}</h1>
              <p className="intro-subtitle">{content.intro.countdownLabel}</p>
              <div className="countdown" aria-label="Birthday countdown">
                {countdown.map((value, index) => (
                  <div className="countdown-unit" key={content.countdownUnits[index]}>
                    <span className="countdown-value">{String(value).padStart(2, "0")}</span>
                    <span className="countdown-label">{content.countdownUnits[index]}</span>
                  </div>
                ))}
              </div>
              <p className="timezone-note">{birthdayText} · {content.girlfriend.timezone}</p>
            </motion.div>
          </section>
          <section className="journey-scene" aria-label={content.intro.journeyLabel}>
            <div className="journey-intro-label">A life in little chapters <span aria-hidden="true">✦</span></div>
            <div className="journey-track">
              <span className="journey-base" />
              <span className="journey-lit" style={{ width: `${journeyProgress * 90}%` }} />
              {content.intro.milestones.slice(0, 4).map((milestone, index) => (
                <span className={`journey-marker${journeyProgress >= index / (content.intro.milestones.length - 1) ? " is-lit" : ""}`} key={milestone} style={{ left: `${markerPositions[index]}%` }}>
                  <span className="marker-age">Age {markerAges[index]}</span>
                  <span className="marker-label">{milestone}</span>
                </span>
              ))}
              <span className="journey-destination soft-glow" style={{ left: "95%" }}><span>{content.girlfriend.age}</span><small>Age {content.girlfriend.age}</small></span>
              <span
                className="walking-girl"
                style={{
                  left: `${5 + journeyProgress * 88}%`,
                  "--girl-height": `${48 + journeyProgress * 74}px`,
                }}
                aria-hidden="true"
              >
                <span className="girl-age">age {ageAtProgress}</span>
                <WalkingGirl />
              </span>
            </div>
            <div className="journey-caption">Ages {markerAges.join(" → ")}</div>
          </section>
        </>
      ) : (
        <BirthdayCelebration
          phase={celebrationPhase}
          setPhase={setCelebrationPhase}
          onReplay={replayCelebration}
          celebrationKey={celebrationKey}
        />
      )}
    </main>
  );
}

function HomePage() {
  return (
    <main className="site-page">
      <Hero
        eyebrow={content.home.eyebrow}
        title={content.home.title}
        lead={content.home.subtitle}
        image={content.home.background}
        position={content.home.backgroundPosition}
      >
        <PageLink className="button button-ghost hero-action" to={pagePaths.journey}>{content.home.cta}<span aria-hidden="true">↗</span></PageLink>
      </Hero>
      <section className="content-section home-note">
        <SectionHeading eyebrow={content.journey.eyebrow} title="A thousand little reasons. One very big love." description="A small collection of the moments, magic, and little things that make you my favorite." />
        <div className="home-cards">
          {[
            { number: "01", label: "Our story", text: "Every little moment led me here.", to: pagePaths.journey },
            { number: "02", label: "All the reasons", text: "A few of a million reasons I adore you.", to: pagePaths.thingsILove },
            { number: "03", label: "Our memories", text: "Little moments I would live again.", to: pagePaths.memories },
          ].map((card) => (
            <PageLink className="home-card" to={card.to} key={card.number}>
              <span className="home-card-number">{card.number}</span><h3>{card.label}</h3><p>{card.text}</p><span className="card-arrow" aria-hidden="true">↗</span>
            </PageLink>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function JourneyPage() {
  const journey = content.journey;
  return (
    <main className="site-page">
      <Hero eyebrow={journey.eyebrow} title={journey.title} lead={journey.intro} image={content.images.home} />
      <section className="content-section">
        <SectionHeading eyebrow={journey.firstMeetingDate} title="The moments that became us" description={journey.intro} />
        <div className="timeline">
          {journey.milestones.map((item, index) => (
            <Reveal className={`timeline-item${index % 2 ? " timeline-item-reverse" : ""}`} key={item.title}>
              <figure className="timeline-media"><img src={imageUrl(item.image)} alt={item.title} loading="lazy" style={imageStyle(item, content.images.timelineFit)} /></figure>
              <span className="timeline-node" aria-hidden="true" />
              <div className="timeline-copy"><p className="timeline-date">{item.date}</p><h3>{item.title}</h3><p>{item.description}</p></div>
            </Reveal>
          ))}
        </div>
        <p className="story-ending">{journey.ending}</p>
        <div className="home-invitation"><PageLink className="button" to={pagePaths.thingsILove}>{content.labels.continue}<span aria-hidden="true">↗</span></PageLink></div>
      </section>
      <Footer />
    </main>
  );
}

function ReasonsPage() {
  const things = content.thingsILove;
  return (
    <main className="site-page">
      <Hero eyebrow={things.eyebrow} title={things.title} image={content.images.letter} />
      <section className="content-section">
        <SectionHeading eyebrow={things.eyebrow} title="A few of a million reasons" />
        <div className="reason-grid">
          {things.reasons.map((item, index) => (
            <Reveal className="reason-card" key={item.title}>
              <figure className="reason-photo"><img src={imageUrl(item.image)} alt={item.title} loading="lazy" style={imageStyle(item, content.images.reasonFit)} /></figure>
              <div className="reason-card-copy"><span className="reason-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></div>
            </Reveal>
          ))}
        </div>
        <p className="reason-ending">{things.ending}</p>
        <div className="home-invitation"><PageLink className="button" to={pagePaths.memories}>{content.labels.viewMemories}<span aria-hidden="true">↗</span></PageLink></div>
      </section>
      <Footer />
    </main>
  );
}

function MemoriesPage() {
  const gallery = content.gallery;
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(false);
  const closeButton = useRef(null);

  useEffect(() => {
    if (active === null) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % gallery.photos.length);
      if (event.key === "ArrowLeft") setActive((index) => (index - 1 + gallery.photos.length) % gallery.photos.length);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, gallery.photos.length]);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setActive((index) => ((index ?? -1) + 1) % gallery.photos.length), 3400);
    return () => window.clearInterval(timer);
  }, [playing, gallery.photos.length]);

  const openPhoto = (index) => setActive(index);
  const photo = active === null ? null : gallery.photos[active];

  return (
    <>
    <main className="site-page">
      <Hero eyebrow={gallery.eyebrow} title={gallery.title} lead={gallery.intro} image={content.images.home} />
      <section className="content-section">
        <SectionHeading eyebrow={gallery.eyebrow} title="Collected with love which shared by you" description={gallery.intro} />
        <div className="gallery-toolbar">
          <span>{gallery.photos.length} little moments</span>
          <button className="button button-ghost" type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)}>
            {playing ? content.labels.pauseSlideshow : content.labels.playSlideshow}
          </button>
        </div>
        <div className="memory-grid">
          {gallery.photos.map((item, index) => (
            <Reveal className={`memory-tile memory-tile-${index % 5}`} key={`${item.image}-${index}`}>
              <button type="button" onClick={() => openPhoto(index)} aria-label={`${content.labels.openPhoto} ${index + 1}: ${item.caption}`}>
                <span className="memory-heart-frame" style={galleryFrameStyle(item)}>
                  <img src={imageUrl(item.image)} alt={item.alt || item.caption || content.images.defaultAlt} loading="lazy" style={imageStyle(item, content.images.galleryFit || "scale-down")} />
                </span>
                <span className="memory-tile-caption"><small>{item.date}</small><span>{item.caption}</span></span>
                <span className="memory-expand" aria-hidden="true">↗</span>
              </button>
            </Reveal>
          ))}
        </div>
        <div className="home-invitation"><PageLink className="button" to={pagePaths.littleThings}>{content.labels.continue}<span aria-hidden="true">↗</span></PageLink></div>
      </section>
      <Footer />
    </main>
    {createPortal(
      <AnimatePresence>
        {photo && (
          <motion.div
            className="photo-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={gallery.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setActive(null); }}
          >
            <button ref={closeButton} className="icon-button viewer-close" type="button" onClick={() => setActive(null)} aria-label={content.labels.close}>×</button>
            <button className="icon-button viewer-prev" type="button" onClick={() => setActive((active - 1 + gallery.photos.length) % gallery.photos.length)} aria-label={content.labels.previous}>←</button>
            <motion.div key={photo.image} className="viewer-heart-frame" style={galleryFrameStyle(photo)} initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
              <img className="viewer-image" src={imageUrl(photo.image)} alt={photo.alt || photo.caption} style={imageStyle(photo, content.images.galleryFit || "scale-down")} />
            </motion.div>
            <button className="icon-button viewer-next" type="button" onClick={() => setActive((active + 1) % gallery.photos.length)} aria-label={content.labels.next}>→</button>
            <p className="viewer-caption">{photo.date} · {photo.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    )}
    </>
  );
}

function LittleThingsPage() {
  const little = content.littleThings;
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  return (
    <main className="site-page">
      <Hero eyebrow={little.eyebrow} title={little.title} lead={little.intro} image={content.images.letter} />
      <section className="content-section">
        <SectionHeading eyebrow={little.eyebrow} title="A few things I hope you never forget" description={little.intro} />
        <div className="notes-grid">
          {little.messages.map((message, index) => (
            <Reveal className={`note note-${index % 4}`} key={message}>
              <span className="note-star" aria-hidden="true">✦</span><p>{message}</p><span className="note-number">0{index + 1}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="surprise-wrap">
          <button className={`surprise-card${surpriseOpen ? " is-open" : ""}`} type="button" aria-expanded={surpriseOpen} onClick={() => setSurpriseOpen(!surpriseOpen)}>
            <span className="eyebrow">{surpriseOpen ? little.surpriseOpenLabel : little.surpriseClosedLabel}</span>
            <span className="surprise-seal" aria-hidden="true">{surpriseOpen ? "♡" : "✦"}</span>
            <h3>{little.surpriseTitle}</h3>
            <p>{surpriseOpen ? little.surpriseMessage : "Tap to open your little reminder"}</p>
          </button>
        </Reveal>
        <div className="home-invitation"><PageLink className="button" to={pagePaths.letter}>{content.labels.viewLetter}<span aria-hidden="true">↗</span></PageLink></div>
      </section>
      <Footer />
    </main>
  );
}

function LetterPage() {
  const letter = content.letter;
  const writeMode = letter.writeMode;
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!opened) return undefined;
    if (reduceMotion || !writeMode.enabled) {
      setTyped(letter.content);
      return undefined;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += writeMode.charactersPerStep;
      setTyped(letter.content.slice(0, index));
      if (index >= letter.content.length) window.clearInterval(timer);
    }, writeMode.intervalMs);
    return () => window.clearInterval(timer);
  }, [opened, reduceMotion, letter.content, writeMode.enabled, writeMode.charactersPerStep, writeMode.intervalMs]);

  return (
    <main className="site-page">
      <section className={`letter-scene${opened ? " is-letter-open" : ""}`}>
        <Reveal className="letter-heading">
          <p className="eyebrow">{letter.eyebrow}</p><h1 className="display-title">{letter.title}</h1>
        </Reveal>
        {!opened ? (
          <motion.button className="letter-envelope" type="button" onClick={() => setOpened(true)} whileHover={{ y: -7, rotate: -1 }} whileTap={{ scale: 0.98 }} aria-label={content.labels.openLetter}>
            <span className="letter-flap" />
            <span className="wax-seal" aria-hidden="true">♡</span>
            <span className="eyebrow">{letter.openPrompt}</span>
            <span className="envelope-name">For {content.girlfriend.name}</span>
          </motion.button>
        ) : (
          <motion.article className="letter-sheet is-open" initial={{ opacity: 0, y: 35, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.75 }}>
            <p className="letter-dear">{content.girlfriend.name},</p>
            <div className={`letter-copy${writeMode.enabled && typed.length < letter.content.length ? " is-writing" : ""}`}>
              {typed}
              {writeMode.enabled && typed.length < letter.content.length && (
                <span className="letter-writing-caret" aria-hidden="true">
                  <svg className="letter-writing-pen" viewBox="0 0 32 32" focusable="false">
                    <path d="M21 2.8a3.1 3.1 0 0 1 4.4 0l3.8 3.8a3.1 3.1 0 0 1 0 4.4L9.4 30.8H1.2v-8.2L21 2.8Z" fill="#74404f" stroke="#36222b" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="m19.4 5.2 7.4 7.4" fill="none" stroke="#e0bf85" strokeWidth="1.6" />
                    <path d="m1.2 30.8 2.5-8.2 5.7 5.7-8.2 2.5Z" fill="#36222b" />
                  </svg>
                </span>
              )}
            </div>
            {typed.length === letter.content.length && <><p className="letter-closing">Always yours ♡</p><p className="letter-postscript">{letter.closing}</p></>}
          </motion.article>
        )}
      </section>
      <Footer />
    </main>
  );
}

function ForeverPage() {
  const forever = content.forever;
  return (
    <main className="site-page">
      <section className="forever-scene" style={{ "--hero-photo": `url("${imageUrl(forever.background || content.images.forever)}")`, "--hero-position": forever.backgroundPosition || "center", "--hero-fit": content.images.heroFit || "cover" }}>
        <Reveal className="forever-copy">
          <p className="eyebrow">{forever.eyebrow}</p>
          <h1 className="display-title">{forever.title}</h1>
          <p className="forever-birthday">{forever.birthdayMessage}</p>
          <p className="lead">{forever.subtitle}</p>
          <span className="final-heart heart-beat" aria-hidden="true">♡</span>
          <p className="eyebrow">{forever.finalLine}</p>
          <PageLink className="button button-ghost" to={`${pagePaths.intro}?replay=1`}>{content.labels.relive}<span aria-hidden="true">↗</span></PageLink>
        </Reveal>
      </section>
      <Footer />
    </main>
  );
}

function App() {
  const [path, setPath] = useState(`${window.location.pathname}${window.location.search}`);
  const page = pageFromPath[window.location.pathname] || "intro";
  const music = useMusic();

  useEffect(() => {
    const onPopState = () => setPath(`${window.location.pathname}${window.location.search}`);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) return;
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (next === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const pageComponents = {
    intro: <Intro key="intro" music={music} />,
    home: <><Header page="home" music={music} /><HomePage /></>,
    journey: <><Header page="journey" music={music} /><JourneyPage /></>,
    thingsILove: <><Header page="thingsILove" music={music} /><ReasonsPage /></>,
    memories: <><Header page="memories" music={music} /><MemoriesPage /></>,
    littleThings: <><Header page="littleThings" music={music} /><LittleThingsPage /></>,
    letter: <><Header page="letter" music={music} /><LetterPage /></>,
    forever: <><Header page="forever" music={music} /><ForeverPage /></>,
  };

  useEffect(() => {
    document.title = page === "intro"
      ? `${content.girlfriend.name} · ${content.intro.eyebrow}`
      : `${content.navigation.find((item) => item.page === page)?.label || content.girlfriend.name} · ${content.girlfriend.name}`;
  }, [page]);

  return (
    <NavigationContext.Provider value={navigate}>
      <div className="app-shell">
        <audio ref={music.audioRef} src={`/${content.music.file}`} loop preload="none" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.div
            className="page-transition-shell"
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            {pageComponents[page]}
          </motion.div>
        </AnimatePresence>
        {page !== "intro" && <Atmosphere />}
      </div>
    </NavigationContext.Provider>
  );
}

createRoot(document.getElementById("app")).render(<App />);
