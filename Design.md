# SCORE — Semantic Design System (Design.md)

> **Design Constitution for Google Stitch & Frontend Engineering:**  
> This specification defines the visual language, design tokens, component interaction states, and typographic hierarchy for the **SCORE** mobile app, referenced from the decompiled *MARKS* Android application (`com.scoremarks.marks`) and refined using modern, anti-generic UI principles.

---

## 1. Atmosphere & Visual Philosophy

- **Density**: `Balanced Daily App` (Score: 6/10). Ample touch targets ($$\ge 48\times 48\text{ dp}$$) for rapid thumb interaction, tight math formula padding to prevent vertical drift.
- **Tone**: Focused, academic, athletic, and distraction-free. Like a high-precision athletic timer crossed with an editorial textbook.
- **Lighting**: Native dual-engine theme support (**Crisp Daylight** & **OLED Midnight Dark**).
- **Prohibited Clichés**: No purple AI neon glow, no generic glassmorphism blur that hinders reading equations, no pure `#000000` pitch blacks.

---

## 2. Color Calibration

### 2.1. Primary & Functional Palette
| Token Name | Hex Value | Role & Description |
| :--- | :--- | :--- |
| `score-brand-blue` | `#2563EB` | **Singular Accent**. High-contrast energetic cobalt blue used for primary CTAs, active tab indicators, and progress bars. |
| `score-brand-subtle` | `#EFF6FF` (Light) / `#1E293B` (Dark) | Soft tint background for option badges and active filter pills. |
| `state-correct-green` | `#10B981` | Emerald green for correct answer confirmation, mastery badges, and positive score deltas. |
| `state-correct-surface`| `#ECFDF5` (Light) / `#064E3B` (Dark) | Background fill for verified correct choices. |
| `state-error-red` | `#EF4444` | Crisp coral red for incorrect option selection and mistake tags. |
| `state-error-surface` | `#FEF2F2` (Light) / `#7F1D1D` (Dark) | Background fill for attempted incorrect choices. |
| `state-review-amber` | `#F59E0B` | Warm golden amber for "Marked for Review", bookmarks, and streak flames. |

### 2.2. Neutral Canvas & Surfaces
| Surface Token | Light Mode Hex | Dark Mode (OLED Midnight) Hex |
| :--- | :--- | :--- |
| `canvas-bg` | `#F8FAFC` (Slate 50) | `#0B0F17` (Deep Obsidian) |
| `card-surface` | `#FFFFFF` | `#161F30` (Rich Navy Slate) |
| `card-stroke` | `#E2E8F0` (Slate 200) | `#23324D` (Subtle boundary stroke) |
| `text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) |
| `text-secondary` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) |

---

## 3. Typographic Architecture

To provide an elite editorial feel while maintaining crystal-clear formula legibility, SCORE utilizes a tri-font system:

1. **Headings & Badges (`Outfit`)**:
   - Modern, geometric, tightly tracked (`letter-spacing: -0.02em`).
   - Weights: `SemiBold (600)` and `Bold (700)`.
2. **Body & Interface (`Geist`)**:
   - Neutral, high-x-height sans-serif for question descriptions, labels, and explanations.
   - Weights: `Regular (400)` and `Medium (500)`. Max 65 characters per line for reading comfort.
3. **Numbers & Timers (`JetBrains Mono`)**:
   - Monospaced numerals for the live exam countdown timer, question palette indices, and accuracy percentages. Prevents UI jitter.
4. **Mathematical & Chemical Equations ($\KaTeX$)**:
   - Standardized MathJax/KaTeX font engine with adaptive color tokens (`#0F172A` in light mode, `#F8FAFC` in dark mode).

---

## 4. Component Design Specifications

### 4.1. Option Card (Single & Multiple Choice)
The primary interaction element of the application. Rendered with custom squircle geometry (smooth corner curvature, radius: `12dp`):

```text
┌────────────────────────────────────────────────────────┐
│  [A]   Option Text or KaTeX Formula Goes Here          │
└────────────────────────────────────────────────────────┘
```

- **State 1: Default (Unselected)**:
  - Border: `1.5dp` solid `card-stroke`. Background: `card-surface`.
  - Option Letter Bubble `[A]`: Background `#F1F5F9`, Text `#64748B`.
- **State 2: Selected (Before Submission)**:
  - Border: `2dp` solid `score-brand-blue`. Background: `score-brand-subtle`.
  - Option Letter Bubble `[A]`: Background `score-brand-blue`, Text `#FFFFFF`.
- **State 3: Correct (Evaluated)**:
  - Border: `2dp` solid `state-correct-green`. Background: `state-correct-surface`.
  - Trailing icon: Green checkmark SVG.
- **State 4: Incorrect (Evaluated)**:
  - Border: `2dp` solid `state-error-red`. Background: `state-error-surface`.
  - Trailing icon: Red cross SVG.

### 4.2. Live Exam Header & Timer Widget
- Pinned at top of test screen:
  - Left: Target Section Switcher pill (`Physics | Chem | Math`).
  - Center: Countdown clock in `JetBrains Mono` with soft pulsing border when $$< 5\text{ mins}$$.
  - Right: Question Palette Drawer trigger icon (grid representation).

### 4.3. Question Palette Matrix (Bottom Sheet / Drawer)
- Matrix of circular badges representing question indices ($$1 \dots 75$$):
  - **Green**: Answered.
  - **Amber / Purple**: Marked for Review.
  - **Red / Grey**: Not Answered / Visited.
  - **Border Only**: Not Visited.

### 4.4. Mistake Tag Pill
- Compact pill attached to solution view:
  - `[ Silly Mistake ▾ ]` | `[ Calculation Error ▾ ]` | `[ Concept Gap ▾ ]`
  - Allows instant 1-tap categorization that sends the question directly into the student's revision queue.

---

## 5. Micro-Motion & Haptic Feedback

- **Button Press & Card Select**: `200ms` scale spring ($$1.0 \rightarrow 0.97 \rightarrow 1.0$$) with light tactile haptic buzz (`HapticFeedback.lightImpact()`).
- **Answer Validation**: Subtle `350ms` ease-out slide for the solution panel from the bottom.
- **Timer Warning**: Soft ambient glow pulsing at $$0.5\text{ Hz}$$ when remaining time drops below 5 minutes.
- **Page Transitions**: Shared axis vertical slide (`CupertinoPageRoute` feel on iOS, smooth fade-through on Android).
