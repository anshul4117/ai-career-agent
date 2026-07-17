# Branded Loader System Architecture

This document details the architecture, design aesthetic, animation parameters, and accessibility integrations of the premium branded loading system in the AI Career Agent platform.

---

## 1. Design & Core Philosophy

Instead of relying on a generic rotating spinner, the platform utilizes a tailored **Brand Loader** designed to reflect the platform's core identity—an AI-driven professional career agent.

```
                    ( Rocket )
              ( Code )       ( Target )
                     \       /
        ( Laptop ) --  [ACA]  -- ( Sparkles )
                     /       \
           ( Resume )       ( Office )
                   ( Briefcase )
```

### Aesthetic Properties
- **Centerpiece**: The official AI Career Agent icon is housed within a circular brutalist container that features a soft, pulsating primary color glow backdrop (`blur-xl` filter).
- **Orbiting Icons**: 8 key career-related icons (Briefcase, Laptop, Code, Resume, Building, Rocket, Target, and Sparkles) rotate clockwise in a circular orbit around the central logo.
- **Upright Constancy**: A counter-rotation of `-360deg` is applied to each icon wrapper to keep them upright relative to the viewport while they orbit.
- **Secondary Actions**: A staggered, reverse-breathe scale/floating motion is applied to each icon to produce organic movement.
- **Color Sync**: Operates entirely with CSS variables, allowing seamless matching with light and dark modes.

---

## 2. Component Variations

The loader is exported in four reusable layouts via `src/components/ui/brand-loader.tsx`:

| Subcomponent | Size Default | Layout Context | Usage Scenario |
| :--- | :--- | :--- | :--- |
| `BrandLoader` | `md` | Base element | Custom implementations |
| `LoadingScreen` | `lg` | Fixed fullscreen | Initial auth checking / global routes |
| `LoadingOverlay` | `md` | Absolute parent bounds | Kanban actions / Form submissions |
| `PageLoader` | `md` | Block element | Tab workspace switches / Page queries |
| `InlineLoader` | `sm` | Button nested inline | Saving configuration / Retry button states |

---

## 3. Orbit Dimensions & Metrics

| Dimension Parameter | `sm` Size | `md` Size | `lg` Size |
| :--- | :--- | :--- | :--- |
| **Container Width/Height** | `80px` | `144px` | `240px` |
| **Center Logo Width/Height** | `24px` | `40px` | `64px` |
| **Orbit Radius ($R$)** | `28px` | `52px` | `90px` |
| **Icon Width/Height** | `12px` | `16px` | `22px` |
| **Stroke Width** | `2.5` | `2.2` | `2` |

---

## 4. Accessibility & Animation Performance

### Transform Restraints
To maximize performance and prevent layout thrashing:
- All animations use GPU-accelerated CSS properties only: `transform` (for translation, rotation, and scaling) and `opacity`.
- The central blur element utilizes simple scale transitions instead of heavy filters.

### Respecting User Motion Preferences
We utilize Framer Motion's `useReducedMotion()` hook to inspect system preferences:
- If a user has enabled "Reduce Motion", rotation and floating motions are disabled.
- The centerpiece is restricted to a very slow, subtle opacity breathing animation.
- Explicit `role="status"`, `aria-busy="true"`, and `aria-live="polite"` tags are maintained on all loading shells.
