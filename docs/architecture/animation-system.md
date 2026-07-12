# Animation System Architecture

This document outlines the principles, technical implementation, and accessibility considerations of the premium motion design system used across the AI Career Agent.

## Animation Principles

Our animation philosophy is inspired by world-class, premium desktop and web applications (e.g., Linear, Vercel, Raycast). Motion should feel tactile, responsive, and out of the way.

1. **Keep it Snappy:** Animations should finish quickly so they never block user flow.
2. **GPU First:** Animate only `transform` and `opacity`. Avoid animating layout properties like `width`, `height`, or `margin` unless utilizing Framer Motion's `layout` engine.
3. **Tactile Feedback:** Interactive elements (buttons, cards) should physically depress or lift instantly to confirm user intent.
4. **Accessible Defaults:** Respect system `prefers-reduced-motion` settings automatically.

## Standard Durations & Easing

We use a custom, unified easing curve across both CSS and Framer Motion for brand consistency:

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Micro-interactions (Hover, Press, Toggles):** `150ms`
- **Macro-interactions (Page Transitions, Dialogs, Lists):** `200ms` - `250ms`

## Technical Layers

### 1. CSS / Tailwind Layer (Micro-interactions)
Used for elements that require maximum performance and instant feedback without React re-renders.

- **Button Press (`active:scale-[0.98]`):** Gives a tactile "push" effect to all buttons globally.
- **Radix UI Primitives:** Dropdowns, Dialogs, and Accordions utilize custom `@keyframes` in `@theme` tied to `data-[state=open]`.
- **Card Hovers:** Driven by standard `transition-transform` and custom shadow offsets.

### 2. Framer Motion Layer (Macro-interactions)
Used for complex exit animations, list reordering, and global page transitions.

- **Page Transitions (`template.tsx`):** Every route transition within the dashboard triggers a subtle `200ms` fade and `8px` slide up.
- **Dynamic Grids (Kanban, Jobs, Resumes):** Wrapped in `<AnimatePresence>` and `<motion.div layout>`. This allows staggered entrances, smooth exits, and fluid reordering when dragging, dropping, or filtering without CSS layout hacking.
- **Custom Drawers & Tooltips:** Custom modals use `<motion.div>` variants for smooth slides and scale-ins that pure CSS struggles with conditionally.

## Accessibility (a11y)

The system automatically respects `prefers-reduced-motion: reduce`.
- Pure CSS animations are suppressed using `@media (prefers-reduced-motion: no-preference)`.
- Framer Motion checks OS settings automatically in modern configurations, disabling layout animations for users who request minimal motion.
