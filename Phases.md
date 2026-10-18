# SCORE — Implementation Roadmap & Phases

---

## Roadmap Overview

The development of **SCORE** is partitioned into 7 sequential, testable phases. Each phase delivers a working, testable increment that can be verified and compiled directly into `Score.apk`.

```text
Phase 1: Scaffolding & DB  ──▶  Phase 2: KaTeX & Question UI  ──▶  Phase 3: Chapter PYQ Engine
                                                                               │
Phase 6: Formulas & Media  ◀──  Phase 5: DPP & Mistake Tracker ◀──  Phase 4: Custom Test Engine
           │
           ▼
Phase 7: Paywall & Store Release
```

---

## Detailed Phase Breakdown

### Phase 1: Project Scaffolding, Core Models & Local Database
**Objective**: Establish the Flutter cross-platform mobile foundation, Clean Architecture structure, and the reactive local database mirroring the reverse-engineered MARKS schemas.

- **Milestones**:
  - [x] Initial reverse-engineering analysis using REA on `com.scoremarks.marks_2.0.8.xapk`.
  - [ ] Initialize clean Flutter project in `Score/` with Android SDK 21-35 and iOS deployment targets.
  - [ ] Configure `drift` SQLite database with `questions`, `test_attempts`, `bookmarks`, and `mistake_notebook` tables.
  - [ ] Set up `flutter_riverpod` state management providers and `GoRouter` declarative navigation.
  - [ ] Configure basic light and dark theme tokens defined in `Design.md`.
- **Verification**: Database migrations run successfully, sample entity CRUD operations pass unit tests.

---

### Phase 2: KaTeX Math Rendering Engine & Question Interaction UI
**Objective**: Build the core high-performance equation renderer and interactive question answering components.

- **Milestones**:
  - [ ] Build `KaTeXMathView` supporting complex inline and block LaTeX ($$ \LaTeX $$).
  - [ ] Implement `OptionCard` with squircle geometry supporting Single Choice (Radio) and Multiple Choice (Checkbox) states.
  - [ ] Build Integer / Numerical keypad input interface for numerical answer questions.
  - [ ] Implement instant answer evaluation in Practice Mode (correct, incorrect, show detailed solution).
- **Verification**: Mathematical equations (integrals, matrices, chemical bonds) render smoothly under 50ms with zero UI stutter.

---

### Phase 3: Chapter-wise Previous Year Questions (CPYQB) Explorer
**Objective**: Create the exam, subject, and chapter exploration flow.

- **Milestones**:
  - [ ] Exam selection dashboard (JEE Main, JEE Advanced, NEET, BITSAT, State CETs).
  - [ ] Subject & Unit taxonomy navigator (Physics, Chemistry, Math, Biology).
  - [ ] Question listing screen with multi-facet filters (Year, Difficulty, Question Type, Attempt Status).
  - [ ] Progress tracking per chapter (Total questions, attempted, accuracy percentage).
- **Verification**: Filtering a list of 500+ questions operates instantly ($$< 16\text{ ms}$$ frame rate).

---

### Phase 4: Custom Test Engine (Builder, Live Timer & Analytics)
**Objective**: Build the full-featured mock test and custom test simulation engine.

- **Milestones**:
  - [ ] Test Creation Wizard (Choose subjects, select chapters, set question count and time limit).
  - [ ] Live Exam Screen:
    - Full-screen countdown timer in `JetBrains Mono` with soft pulse alerts.
    - Question palette bottom sheet (color-coded: Answered, Marked for Review, Unvisited).
    - Section switching tabs.
  - [ ] Submission confirmation & auto-submit on timer expiry.
  - [ ] Comprehensive Test Analysis Report (Overall Score, Subject breakdown, Accuracy %, Time per question, Percentile estimate).
- **Verification**: Complete 30-minute mock test simulation with accurate score calculation (+4/-1 marking scheme) and persistence into SQLite.

---

### Phase 5: Daily Practice Problems (DPP) & Smart Mistake Notebooks
**Objective**: Implement engagement loops, habit building, and targeted revision workflows.

- **Milestones**:
  - [ ] Daily Dose / DPP quiz sets with streak tracking and study milestone badges.
  - [ ] Automatic Mistake Logging: Questions answered incorrectly in tests/practice automatically route to the Mistake Notebook.
  - [ ] Mistake Categorization interface (*Silly Mistake*, *Conceptual Gap*, *Calculation Error*).
  - [ ] Spaced repetition revision reminders (1-day, 3-day, 7-day schedules).
- **Verification**: Solving an incorrect question registers in the user's mistake queue and surfaces in the revision tab.

---

### Phase 6: Formula Cards, Quick Concepts & Media Solutions
**Objective**: Add high-yield revision cards and video solution integration.

- **Milestones**:
  - [ ] High-yield Formula Cards for quick revision with search and "Mark as Mastered" toggles.
  - [ ] Quick Concept summary sheets for rapid theory recall.
  - [ ] Video solution player with playback speed (0.75x to 2.0x) and timestamp markers.
- **Verification**: Formulas display with clean typography; video player plays smoothly without memory leaks.

---

### Phase 7: Paywall, Free vs. Pro Tier Entitlements & Store Release
**Objective**: Complete the monetization pipeline and produce production-ready APK/AAB and iOS builds.

- **Milestones**:
  - [ ] Clean-room server-verified subscription handling via In-App Purchases (Google Play Billing & RevenueCat).
  - [ ] Free Tier vs. Score PRO gatekeeping (Free: basic PYQs, 1 test/week; PRO: all years, unlimited custom tests, video solutions, advanced analytics).
  - [ ] Production compilation of `Score.apk` and release configuration.
- **Verification**: Subscriptions trigger correct entitlement changes; `flutter build apk --release` produces optimized, signed APK.
