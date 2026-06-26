# AI Career Agent — Design System

## Design Philosophy

AI Career Agent is not a traditional job board.

We are building a premium AI-powered career operating system.

**Design goals:**

- Bold
- Memorable
- Professional
- Fast
- Accessible
- AI-first

**Design style:** Modern Brutalism

**Inspired by:**

- Linear
- Vercel
- Notion
- Modern editorial design

**Avoid:**

- Glassmorphism
- Neumorphism
- Excessive gradients
- Excessive shadows
- Generic SaaS UI

---

## Core Principles

1. Clarity over decoration
2. Strong typography
3. Strong borders
4. Visible hierarchy
5. Minimal visual noise
6. Quality over quantity

---

## Color System

### Primary Background

Solarized Light

| Token | Value |
| ----- | ----- |
| Background | `#FDF6E3` |

### Surface

| Token | Value |
| ----- | ----- |
| Cards | `#FFF9EC` |
| Secondary surface | `#F7F1E1` |

### Text Colors

| Token | Value |
| ----- | ----- |
| Primary text | `#111111` |
| Secondary text | `#4B5563` |
| Muted text | `#6B7280` |

### Border Colors

| Token | Value |
| ----- | ----- |
| Primary border | `#111111` |
| Secondary border | `#374151` |

### Brand Colors

| Token | Value | Notes |
| ----- | ----- | ----- |
| Primary | `#0F766E` | Teal 700 |
| Accent | `#7C3AED` | Purple 600 |
| Success | `#16A34A` | |
| Warning | `#EA580C` | |
| Error | `#DC2626` | |
| Info | `#2563EB` | |

---

## Typography

### Headings

| Property | Value |
| -------- | ----- |
| Font | Space Grotesk |
| Fallback | sans-serif |

### Body

| Property | Value |
| -------- | ----- |
| Font | Inter |
| Fallback | sans-serif |

### Typography Scale

| Token | Size | Weight |
| ----- | ---- | ------ |
| H1 | 64px | 700 |
| H2 | 48px | 700 |
| H3 | 36px | 700 |
| H4 | 28px | 600 |
| H5 | 24px | 600 |
| Body large | 18px | — |
| Body | 16px | — |
| Small | 14px | — |
| Caption | 12px | — |

---

## Border System

**Core brutalism rule:** All important UI elements must have visible borders.

| Token | Value |
| ----- | ----- |
| Primary border | `3px solid #111111` |
| Secondary border | `2px solid #111111` |

---

## Border Radius

Avoid overly rounded components.

| Token | Value |
| ----- | ----- |
| Small | 6px |
| Medium | 8px |
| Large | 12px |
| Maximum | 16px |

Never use `rounded-full` for major containers.

---

## Shadow System

Minimal usage only.

| Token | Value |
| ----- | ----- |
| Card shadow | `4px 4px 0px #111111` |
| Hover shadow | `6px 6px 0px #111111` |

Avoid blur-heavy shadows.

---

## Spacing System

**Base unit:** 4px

**Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

Use consistent spacing.

---

## Buttons

### Primary Button

| Property | Value |
| -------- | ----- |
| Background | `#111111` |
| Text | `#FFFFFF` |
| Border | `3px solid #111111` |
| Radius | 8px |
| Hover | `translate(-2px, -2px)` |

### Secondary Button

| Property | Value |
| -------- | ----- |
| Background | transparent |
| Text | `#111111` |
| Border | `3px solid #111111` |
| Hover | Background `#111111`, text white |

### Success Button

| Property | Value |
| -------- | ----- |
| Background | `#16A34A` |
| Text | white |

---

## Inputs

| Property | Value |
| -------- | ----- |
| Height | 48px |
| Border | `3px solid #111111` |
| Radius | 8px |
| Background | `#FFF9EC` |
| Focus | 2px outline using brand color |

---

## Cards

### Standard Card

| Property | Value |
| -------- | ----- |
| Background | `#FFF9EC` |
| Border | `3px solid #111111` |
| Radius | 8px |
| Padding | 24px |
| Shadow | `4px 4px 0px #111111` |

---

## Dashboard Layout

**Structure:**

```
Sidebar | Header
        | Main Content
```

### Sidebar

| Property | Value |
| -------- | ----- |
| Width | 280px |
| Position | Fixed |
| Background | `#FFF9EC` |
| Border right | `3px solid #111111` |

**Navigation item:**

| Property | Value |
| -------- | ----- |
| Height | 48px |
| Radius | 8px |

**Active item:**

| Property | Value |
| -------- | ----- |
| Background | `#111111` |
| Text | `#FFFFFF` |

### Header

| Property | Value |
| -------- | ----- |
| Height | 72px |
| Border bottom | `3px solid #111111` |

**Contains:** Search · Notifications · Theme toggle · Profile menu

---

## Job Cards

**Must display:**

- Job title
- Company
- Location
- Employment type
- Match score
- Quality score

**Actions:** View · Save

---

## Match Score

| Property | Value |
| -------- | ----- |
| Score range | 0–100 |
| Display | Large number (e.g. `92%`) |
| ≥ 80 | Success green |
| < 60 | Warning |

---

## Tables

| Property | Value |
| -------- | ----- |
| Border | `2px solid #111111` |
| Header background | `#F7F1E1` |
| Row hover | `#F3EEDB` |

---

## Empty States

Must include:

- Illustration
- Message
- Action button

Never leave blank screens.

---

## Loading States

**Use:**

- Skeleton loaders

**Avoid:**

- Infinite spinners

---

## Icons

| Property | Value |
| -------- | ----- |
| Library | Lucide React |
| Sizes | 16 · 20 · 24 |

Use consistent sizing.

---

## Animations

Keep minimal.

**Allowed:**

- Hover lift
- Button press
- Fade in

**Avoid:**

- Complex motion
- Floating effects
- Heavy transitions

---

## Accessibility

| Requirement | Standard |
| ----------- | -------- |
| Minimum contrast | WCAG AA |
| Keyboard navigation | Required |
| Focus states | Required |
| Screen reader labels | Required |

---

## Mobile Rules

**Breakpoint priority:** Mobile first

**Supported:** 320px+ · 768px+ · 1024px+ · 1440px+

---

## Component Standards

Every component must support:

- Loading state
- Error state
- Empty state

---

## Design Anti-Patterns

Do **not** use:

- Glassmorphism
- Neumorphism
- Excessive blur
- Excessive gradients
- Overly rounded cards
- Hidden actions
- Tiny typography

---

## Product Feel

The interface should feel like:

> *"A premium AI operating system for careers."*

**Not:**

> *"A traditional job board."*

Users should immediately feel:

- Confidence
- Trust
- Professionalism
- Intelligence
- Speed
