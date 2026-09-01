# Debloat Pinoy

> Daily habit tracker for Filipino teens to reduce facial water retention and manage genetic under-eye circles.

## Quick Start

### Option 1: Open Directly
Just open `index.html` in any browser. No server needed.

### Option 2: Deploy Online
Drag these 4 files to [Netlify](https://netlify.com), [Vercel](https://vercel.com), or [GitHub Pages](https://pages.github.com):
- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`

### Option 3: Build APK (Android App)
See [APK Instructions](#building-the-apk) below.

---

## Features

### Home Screen
- **Streak tracker** with animated fire icon and best streak
- **Progress ring** — animated SVG showing task completion %
- **6 daily habit cards** with animated checkboxes
  - Drink 2-3L water
  - 3-min facial massage
  - Sleep with 2 pillows
  - Cold compress / under-eye care
  - Half-rice or less
  - Potassium food / extra water
- **Rice Log** — track breakfast/lunch/dinner (Normal/Half/None/Alt)
- **Water tracker** — 8 interactive glasses
- **Daily notes** with auto-save
- **Emergency buttons** — Reset Today, Mark All Complete

### Calendar View
- Monthly grid with **color-coded dots** (green/yellow/red/gray)
- **Tap any day** → detailed breakdown (AM/Day/Night tasks)
- Monthly statistics
- Month navigation

### Care Guide (4 tabs)
1. **Massage Timer** — 3-min countdown with 6 step-by-step instructions
2. **Under-Eye Guide** — 6 cold compress methods, daily habits, what to avoid
3. **Food Guide** — Avoid list (8 categories) + Eat list (7 categories, Pinoy ulam)
4. **Nanay Mode** — 7 parent management strategies with Tagalog dialogue

### Stats
- 4 summary cards (streak, best, days, completion %)
- **30-day bar chart** (canvas-drawn)
- **Rice trend chart**
- **5 achievement badges** (unlockable)
- **Weight tracker** with line chart

### Settings
- Profile (name, age, weight)
- Notification toggles (6 times)
- Font size selector
- **Export data** (JSON download)
- **Clear all data** (with confirmation)

---

## Tech Stack

- **HTML/CSS/JS** — Vanilla, no frameworks
- **FontAwesome 6** — All icons (CDN)
- **localStorage** — Data persistence
- **Canvas API** — Charts
- **PWA manifest** — Installable on mobile
- Zero external dependencies

---

## Building the APK

### Prerequisites
1. **Node.js** 18+ — [Download](https://nodejs.org/)
2. **Android Studio** — [Download](https://developer.android.com/studio)
3. **JDK 17** — [Download](https://adoptium.net/)

### Build Steps (Windows)
```batch
BUILD_APK.bat
```

### Build Steps (Mac/Linux)
```bash
chmod +x BUILD_APK.sh
./BUILD_APK.sh
```

### Build Steps (Manual)
```bash
# 1. Install dependencies
npm install

# 2. Initialize Capacitor
npx cap init DebloatPinoy com.debulatpinoy.app --web-dir .

# 3. Add Android platform
npx cap add android

# 4. Sync web assets to Android project
npx cap sync android

# 5. Open in Android Studio
npx cap open android

# 6. In Android Studio: Build > Build APK
# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Alternative: PWABuilder (No coding)
1. Deploy to Netlify/Vercel first
2. Go to [pwabuilder.com](https://www.pwabuilder.com)
3. Enter your deployed URL
4. Click "Package for stores"
5. Download the APK

---

## Color Palette
| Color | Hex |
|-------|-----|
| Background | #0F172A |
| Card | #1E293B |
| Text | #F1F5F9 |
| Subtitle | #94A3B8 |
| Primary | #1A8B5A |
| Secondary | #FF6B35 |
| Accent | #FCD34D |
| Success | #34D399 |
| Danger | #F87171 |

---

## Sample Data
The app comes pre-loaded with 7 days of sample data:
- 3 consecutive complete days (streak = 3)
- Weight history: 61 → 59.8 kg
- Varying rice logs and water intake

---

## License
Made with heart for Filipino teens.
