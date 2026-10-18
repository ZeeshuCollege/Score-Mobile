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
  - [x] Initialize clean Flutter project in `Score/` with Android SDK 21-35 and iOS deployment targets.
  - [x] Configure SQLite database with `questions`, `test_attempts`, `bookmarks`, and `mistakes` tables.
  - [x] Set up `flutter_riverpod` state management architecture.
  - [x] Configure complete light and dark theme tokens defined in `Design.md`.
- **Verification**: Database migrations run successfully, sample entity CRUD operations pass unit tests.

---

### Phase 2: KaTeX Math Rendering Engine & Question Interaction UI
**Objective**: Build the core high-performance equation renderer and interactive question answering components.

- **Milestones**:
  - [x] Build `KaTeXMathView` supporting complex inline and block LaTeX ($$ \LaTeX $$).
  - [x] Implement `OptionCard` with squircle geometry supporting Single Choice (Radio) and Multiple Choice (Checkbox) states.
  - [x] Build Integer / Numerical keypad input interface for numerical answer questions.
  - [x] Implement instant answer evaluation in Practice Mode (correct, incorrect, show detailed step-by-step solution).
- **Verification**: Mathematical equations (integrals, matrices, chemical bonds) render smoothly under 50ms with zero UI stutter.

---

### Phase 3: Chapter-wise Previous Year Questions (CPYQB) Explorer
**Objective**: Create the exam, subject, and chapter exploration flow.

- **Milestones**:
  - [x] Exam selection dashboard (JEE Main, JEE Advanced, NEET, BITSAT, State CETs).
  - [x] Subject & Unit taxonomy navigator (Physics, Chemistry, Math, Biology).
  - [x] Question listing screen with multi-facet filters (Year, Difficulty, Question Type, Attempt Status).
  - [x] Progress tracking per chapter (Total questions, attempted, accuracy percentage).
- **Verification**: Filtering a list of questions operates instantly (< 16 ms frame rate) via in-memory and SQLite queries.

---

### Phase 4: Custom Test Engine (Builder, Live Timer & Analytics)
**Objective**: Build the full-featured mock test and custom test simulation engine.

- **Milestones**:
  - [x] Test Creation Wizard (Choose subjects, select chapters, set question count and time limit).
  - [x] Live Exam Screen:
    - Full-screen countdown timer in `JetBrains Mono` with pulse alerts.
    - Question palette bottom sheet (color-coded: Answered, Marked for Review, Not Answered, Not Visited).
    - Next, Previous, Mark for Review, and Clear Response actions.
  - [x] Submission confirmation modal & auto-submit on timer expiry.
  - [x] Comprehensive Test Analysis Report (Overall Score, +4/-1 NTA marking scheme, Accuracy %, Time spent per question, SQLite persistence).
- **Verification**: Complete mock test simulation with accurate score calculation and persistence into SQLite `test_attempts` table.

---

### Phase 5: Daily Practice Problems (DPP) & Smart Mistake Notebooks
**Objective**: Implement engagement loops, habit building, and targeted revision workflows.

- **Milestones**:
  - [x] Daily Dose / DPP quiz sets with streak tracking (12+ day streak engine) and milestone awards.
  - [x] Automatic Mistake Logging: Questions answered incorrectly in tests/practice automatically route to the Mistake Notebook.
  - [x] Mistake Categorization interface (*Silly Mistake*, *Conceptual Gap*, *Calculation Error*, *Ran Out of Time*).
  - [x] Spaced repetition revision filter tabs and direct Re-attempt problem flow.
- **Verification**: Solving an incorrect question registers in SQLite and surfaces in the revision tab with spaced repetition stage tracking.

---

### Phase 6: Formula Cards, Quick Concepts & Media Solutions
**Objective**: Add high-yield revision cards and video solution integration.

- **Milestones**:
  - [x] High-yield Formula Cards for quick revision with search and "Mark as Mastered" toggles.
  - [x] Multi-subject formula taxonomy across Physics, Chemistry, Mathematics, and Biology with KaTeX rendering.
  - [x] Quick variable definitions and formula context.
  - [ ] Embedded video solution player with playback speed (0.75x to 2.0x) and timestamp markers.
- **Verification**: Formulas display with clean typography and KaTeX equations; mastery state persists across app restarts.

---

### Phase 7: Paywall, Free vs. Pro Tier Entitlements & Store Release
**Objective**: Complete the monetization pipeline and produce production-ready APK/AAB and iOS builds.

- **Milestones**:
  - [x] Clean-room server-verified subscription handling and ethical Zero-Piracy policy.
  - [x] Free Tier vs. Score PRO gatekeeping and comparison matrix (1 Month ₹199, 6 Months ₹799, 12 Months ₹1,299).
  - [x] Unified `MainNavScreen` bottom navigation bar connecting Home, DPP, Custom Tests, Formulas, and Mistakes.
  - [x] Continuous automated compilation of `Score.apk` at workspace root.
- **Verification**: Subscriptions trigger correct entitlement changes; `Score.apk` continuously built and updated at root.
