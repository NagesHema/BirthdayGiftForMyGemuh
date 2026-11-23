# A Little Universe

A romantic, responsive birthday story built with React, Vite, Motion, and GSAP. Personal details and story copy live in `data/birthday-content.json`; photographs and music are stored locally in `assets/`.

## Run locally

Install dependencies and start the development server from the project folder:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`, or preview it locally with `npm run preview`. The build keeps the existing page URLs as separate HTML entry points, so direct links and refreshes continue to work.

## Personalize the story

Open `data/birthday-content.json` and change the values there:

- **Name and age:** `girlfriend.name` and `girlfriend.age`.
- **Birthday time:** `girlfriend.birthday` should be an ISO 8601 date/time with its UTC offset, for example `2026-12-15T00:00:00+05:30`. Set `girlfriend.timezone` to an IANA zone such as `Asia/Kolkata`; it controls the displayed local time. Update the offset in `birthday` to match the birthday's exact local time and timezone.
- **Countdown and celebration copy:** `intro`, `countdownUnits`, and `labels`.
- **Home and final scenes:** `home` and `forever`.
- **Story chapters and reasons:** `journey.milestones` and `thingsILove.reasons`. Each entry supports an image filename.
- **Gallery:** edit `gallery.photos` to set each image filename, caption, and date. Like journey milestones, each photo can set `position` (CSS `object-position`) and `fit` (`"cover"` or `"contain"`). Optional `width` and `height` values set that photo's heart frame size; use CSS sizes such as `"280px"` or `"90%"`.
- **Small notes and letter:** `littleThings` and `letter`.
- **Images:** `images.directory` and image filenames in `images`, `home`, `forever`, `journey`, `thingsILove`, and `gallery`. The directory is relative to the local `assets/` folder; for example, `"images/"` serves files from `assets/images/`. For a photo that needs reframing, set its `position` to a CSS object-position value such as `"center 30%"`; set `fit` to `"contain"` or `"cover"`. `home.backgroundPosition` and `forever.backgroundPosition` adjust the large scene photos.
- **Music:** set `music.file` to a path relative to `assets/` (the supplied track is `"music/Rathinamo.mp3"`). Music starts only after a visitor interacts with the site; the toggle remembers its preference, and the adjacent slider adjusts volume.

## Add or replace photographs

Put image files in `assets/images/`, then update the matching filename in `data/birthday-content.json`. Existing photographs were copied from the original `images/` folder into `assets/images/`; the originals are left untouched. Vite copies the local `assets/` folder into production output, and the memories gallery displays these photos in heart-shaped frames. Gallery frames use `object-fit: cover` by default, so adjust each photo's `position` when a subject needs reframing. Per-photo `width` and `height` resize its heart frame in both the gallery and fullscreen viewer.

To add another gallery item, add an object to `gallery.photos`:

```json
{
  "image": "our-new-photo.jpg",
  "caption": "A moment I want to remember.",
  "date": "December 2026",
  "position": "70% 30%",
  "width": "280px",
  "height": "320px"
}
```

## Pages

- `index.html` — birthday countdown and celebration
- `pages/home.html` — opening scene
- `pages/our-story.html` — relationship timeline
- `pages/things-i-love.html` — reasons page
- `pages/memories.html` — photo gallery and fullscreen viewer
- `pages/little-things.html` — notes and interactive surprise
- `pages/letter.html` — interactive letter
- `pages/forever.html` — final scene and replay link

The intro celebrates immediately after the configured birthday timestamp; before then it shows the countdown. Story navigation swaps pages without reloading the document, so music continues until it is turned off or the tab is closed. Gallery photos open in a keyboard-accessible viewer, and animations respect the visitor's reduced-motion preference.

The opening countdown follows the birthday timestamp and configured timezone. A walking character grows with the journey to age 22; when the birthday arrives, a one-per-session arrow-and-heart celebration leads into the story. Refreshing the intro or using its replay button plays the celebration again.
