# Dark Mode Polish & Architecture
 
## Overview
The AI Career Agent uses a premium, high-contrast Dark Mode strategy inspired by modern developer tools (GitHub, Linear, Vercel) while strictly maintaining the core Brutalist design system.
 
## Core Implementation Strategy
 
### 1. Theme Hydration (No FOUC)
We use a robust `ThemeProvider` injected into `app-providers.tsx` which subscribes to the Zustand store (`useSettingsStore`).
- The `appearance.theme` state is the source of truth (`light`, `dark`, or `system`).
- The provider applies the `.dark` class to the `document.documentElement` (`<html>` tag).
- For `system` preference, we use `window.matchMedia("(prefers-color-scheme: dark)")` and listen for real-time OS preference changes.
 
### 2. CSS Variable Overrides
Instead of rewriting thousands of Tailwind utility classes (e.g. adding `dark:bg-slate-900` to every surface), we heavily rely on Tailwind v4's CSS variable overriding capability.
 
In `globals.css`, the `.dark` class block overrides core variables:
```css
.dark {
  --color-background: #0d1117;
  --color-surface: #161b22;
  --color-surface-secondary: #21262d;
  --color-surface-hover: #30363d;
 
  --color-foreground: #c9d1d9;
  --color-foreground-secondary: #8b949e;
  --color-foreground-muted: #6e7681;
 
  --color-border: #30363d;
  --color-border-secondary: #21262d;
 
  --shadow-brutal: 4px 4px 0px #000000;
  --shadow-brutal-hover: 6px 6px 0px #000000;
}
```
*Note: We opted to use `#000000` for Brutalist Shadows to retain the high-contrast "pop" effect against the `#161b22` surface, preventing the shadows from muddying the background.*
 
### 3. Hardcoded Light Colors Audit
All components utilizing hardcoded utility classes that do not automatically map to the semantic theme variables have been refactored.
- Classes like `bg-slate-50` were mapped to `dark:bg-surface-secondary bg-slate-50`.
- Classes like `bg-blue-100` and `text-blue-700` were softened using `dark:bg-blue-500/20` and `dark:text-blue-400` respectively.
- This ensures WCAG AA compliance across interactive states (e.g., hover styles, focus rings, disabled badges).
 
## Best Practices for Developers
1. **Always use semantic variables**: Stick to `bg-surface`, `bg-background`, `border-border`, and `text-foreground` to ensure native compatibility with both themes.
2. **Handle Accents carefully**: If you must use a hardcoded color (e.g., `text-emerald-700`), always provide a `dark:` variant (e.g., `dark:text-emerald-400`) to guarantee legibility on `#0d1117` backgrounds.
3. **Keep Shadows Pure**: Always use the `.brutal-shadow` and `.brutal-card` utility classes rather than constructing manual Tailwind shadow arrays, so they correctly inherit the theme shadow color.
