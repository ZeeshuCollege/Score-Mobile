# SCORE — Project Memory & AI Continuity Context

> **Note for AI Agents & Developers:** This file maintains the canonical state, history, architectural findings, and workflow instructions for the **SCORE** application. Read this file first when resuming or continuing the project.

---

## 1. Project Overview & Identity
- **App Name**: SCORE
- **Category**: Mobile-Only Competitive Exam Prep & Practice Platform (JEE Main, JEE Advanced, NEET, BITSAT, State CETs)
- **Target OS**: Android (API 21+) and iOS (iOS 15+)
- **Primary Framework**: Flutter 3.47+ (Dart 3.13+) for cross-platform single codebase parity and high-speed KaTeX math rendering.
- **Reference Target**: Analyzed from `com.scoremarks.marks` v2.0.8 (`com.scoremarks.marks_2.0.8.xapk`, 53 MB) using the REA reverse-engineering skill.
- **Strict Invariant**: Zero piracy, zero cracked entitlement bypasses. Legitimate Free Tier vs. Paid/Premium Subscription model backed by server validation.

---

## 2. Reverse-Engineering Evidence & Findings (From REA Analysis)

### 2.1. Target APK Anatomy
- **Package**: `com.scoremarks.marks` | Version Name: `2.0.8` | Version Code: `119`
- **Architecture**: Native Android Kotlin with Room Database, ViewBinding/DataBinding, and embedded KaTeX/MathJax rendering WebViews for complex equations.
- **Assets Uncovered**:
  - Full chapter/unit taxonomy across Physics, Chemistry, Mathematics, and Biology.
  - SVG asset libraries for Single/Multiple choice states (`default`, `selected`, `correct`, `incorrect`, both light & dark variants).
  - KaTeX math engine template (`assets/katex_template.html`) and MathJax template (`assets/index.html`).
  - Lottie animation assets for splash, loading, quotes, and badges.

### 2.2. Core Data Models Discovered in Bytecode
1. **Authentication & User**:
   - `Lcom/scoremarks/marks/data/models/auth/AuthRequest`
   - `Lcom/scoremarks/marks/data/models/auth/GoogleAuthRequest`
   - `Lcom/scoremarks/marks/data/models/auth/User`
   - `Lcom/scoremarks/marks/data/models/auth/QuestionSettings`
2. **Chapter-wise PYQ Bank (CPYQB)**:
   - `Lcom/scoremarks/marks/data/models/cpyq/ChapterProgressV4Data`
   - `Lcom/scoremarks/marks/data/models/cpyq/DetailedAnalysisData`
   - `Lcom/scoremarks/marks/data/models/cpyq/PyqTrendsData`
   - `Lcom/scoremarks/marks/data/models/cpyq/ChapterPercentile`
   - `Lcom/scoremarks/marks/data/models/cpyq/BucketQuestionsDetailRequest`
3. **Custom Test Engine (CT)**:
   - `Lcom/scoremarks/marks/data/models/customTest/CTAttemptBody`
   - `Lcom/scoremarks/marks/data/models/customTest/CTResponse`
   - `Lcom/scoremarks/marks/data/models/customTest/Question`
   - `Lcom/scoremarks/marks/data/models/custom_test/custom_test_analysis/Analysis`
   - `Lcom/scoremarks/marks/data/models/custom_test/custom_test_analysis/OverallTimeSpent`
   - `Lcom/scoremarks/marks/data/models/custom_test/custom_test_analysis/MarkingSchemeX`
4. **Notebooks & Bookmarks**:
   - `Lcom/scoremarks/marks/data/models/BookmarkV2Request`
   - `Lcom/scoremarks/marks/data/models/BookmarkedQsListResponse`
   - `Lcom/scoremarks/marks/data/models/TopicBookmarkedResponse`
5. **Daily Practice & Challenges**:
   - `Lcom/scoremarks/marks/data/models/daily_dose/`
   - `Lcom/scoremarks/marks/data/models/challenge/AttemptedChallengeRequest`
   - `Lcom/scoremarks/marks/data/models/top_500_questions/`

---

## 3. Core Workspace Files Map

| File Path | Description |
| :--- | :--- |
| [`PRD.md`](file:///d:/CodeSupa/Score/PRD.md) | Comprehensive Product Requirements Document (features, personas, tiering). |
| [`Memory.md`](file:///d:/CodeSupa/Score/Memory.md) | Active project state, REA findings, and context handoff for AI continuity. |
| [`Architecture.md`](file:///d:/CodeSupa/Score/Architecture.md) | Technical architecture, Clean Architecture layers, DB schema, and state management. |
| [`Design.md`](file:///d:/CodeSupa/Score/Design.md) | Stitch-compatible semantic design tokens, color palette, typography, and UI specs. |
| [`Phases.md`](file:///d:/CodeSupa/Score/Phases.md) | Milestone breakdown from Phase 1 (Core & Scaffolding) through Phase 7 (Store Release). |
| [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) | Compiled Android APK artifact, kept up-to-date with application builds. |

---

## 4. Current State & Chronological Changelog

### Phase 0: Reverse Engineering & Project Scaffolding (Completed)
- **Action 1**: Successfully installed and configured REA MCP server globally in `~/.gemini/config/mcp_config.json` and `.agents/skills/reverse-engineer-anything/`.
- **Action 2**: Analyzed target package `com.scoremarks.marks_2.0.8.xapk`, extracting `manifest.json`, `classes*.dex`, and assets.
- **Action 3**: Recovered data models, API endpoints, styling rules, KaTeX templates, and exam taxonomy.
- **Action 4**: Established project documentation suite ([`PRD.md`](file:///d:/CodeSupa/Score/PRD.md), [`Memory.md`](file:///d:/CodeSupa/Score/Memory.md), [`Architecture.md`](file:///d:/CodeSupa/Score/Architecture.md), [`Design.md`](file:///d:/CodeSupa/Score/Design.md), [`Phases.md`](file:///d:/CodeSupa/Score/Phases.md)).
- **Action 5**: Initialized cross-platform Flutter project structure (`com.score.app.score`) targeting Android SDK 21–35 and iOS 15+.
- **Action 6**: Successfully compiled initial debug build and published [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (150 MB) at the project root with the automated continuous build script [`build_score_apk.ps1`](file:///d:/CodeSupa/Score/build_score_apk.ps1).
- **Action 7**: Initialized Git repository, configured remote [`https://github.com/ZeeshuCollege/Score-Mobile.git`](https://github.com/ZeeshuCollege/Score-Mobile.git), committed all core specifications, source files, and reverse-engineered assets, and pushed branch `main`.

### Phase 1 & Phase 2: Core Architecture, SQLite Database & KaTeX Engine (Completed)
- **Action 8**: Added core reactive dependencies (`flutter_riverpod`, `flutter_math_fork`, `google_fonts`, `sqflite`, `flutter_svg`, `shared_preferences`).
- **Action 9**: Implemented design tokens & theme system in [`lib/app/theme/`](file:///d:/CodeSupa/Score/lib/app/theme/) (`app_colors.dart`, `app_typography.dart`, `app_theme.dart`).
- **Action 10**: Created Domain entities for questions, exams, chapters, and mistakes in [`lib/domain/entities/`](file:///d:/CodeSupa/Score/lib/domain/entities/).
- **Action 11**: Implemented local SQLite database manager [`lib/data/local/app_database.dart`](file:///d:/CodeSupa/Score/lib/data/local/app_database.dart) with tables for `questions`, `bookmarks`, `mistakes`, and `test_attempts`, pre-populated with starter PYQ questions containing real LaTeX math equations.
- **Action 12**: Built the high-performance [`KaTeXMathView`](file:///d:/CodeSupa/Score/lib/presentation/common/katex_math_view.dart) widget parsing inline/block LaTeX formulas ($$...$$ and $...$).
- **Action 13**: Built the squircle [`OptionCard`](file:///d:/CodeSupa/Score/lib/presentation/common/option_card.dart) component with tactile haptic feedback, adaptive states (default, selected, correct, incorrect), and embedded KaTeX formula rendering.
- **Action 14**: Implemented interactive [`QuestionSolveScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/question_solve_screen.dart) supporting Practice Mode instant answer check, step-by-step KaTeX solutions, bookmarking, and mistake categorization (*Silly Mistake*, *Conceptual Gap*, *Calculation Error*).
- **Action 15**: Built the [`CustomTestScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/custom_test_screen.dart) exam generator, [`ChapterListScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/chapter_list_screen.dart), [`MistakeNotebookScreen`](file:///d:/CodeSupa/Score/lib/presentation/mistakes/mistake_notebook_screen.dart), and [`HomeScreen`](file:///d:/CodeSupa/Score/lib/presentation/home/home_screen.dart).
- **Action 16**: Resolved Windows multi-drive Kotlin compilation constraints via `android/gradle.properties` (`kotlin.incremental=false`), ran `flutter analyze` (0 issues), and passed `flutter test` test suite.
- **Action 17**: Recompiled and published updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (173 MB), synced changes to Git, and pushed to origin `main` (commit `762f45c`).

### Phase 3, 4, 5, 6 & 7: Test Engine, DPP, Formulas, Paywall & Navigation (Completed)
- **Action 18**: Built [`QuestionFilterSheet`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/widgets/question_filter_sheet.dart) supporting multi-criteria filtering by difficulty, year range, and question type (MCQ vs Numerical).
- **Action 19**: Implemented [`QuestionListScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/question_list_screen.dart) with chapter-wise question preview, active filter chips, search query matching, and direct jump to solve view.
- **Action 20**: Created full NTA-style CBT [`TestSimulationScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/test_simulation_screen.dart) with full-screen countdown timer, interactive Question Palette (Answered, Marked for Review, Not Visited), section navigation, and auto-submit.
- **Action 21**: Built [`TestResultAnalysisScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/test_result_analysis_screen.dart) with NTA marking (+4/-1), accuracy %, time breakdown, question-by-question review, and direct one-click logging to the Mistake Notebook.
- **Action 22**: Implemented [`DppScreen`](file:///d:/CodeSupa/Score/lib/presentation/dpp/dpp_screen.dart) featuring Daily Practice Problems, 12+ day streak engine, completion dialog, milestone achievements, and local state persistence.
- **Action 23**: Built [`FormulaEntity`](file:///d:/CodeSupa/Score/lib/domain/entities/formula_entity.dart) and [`FormulaCardsScreen`](file:///d:/CodeSupa/Score/lib/presentation/formula_cards/formula_cards_screen.dart) supporting high-yield KaTeX equations across Physics, Chemistry, Mathematics, and Biology with real-time search and "Mark as Mastered" toggling.
- **Action 24**: Upgraded [`MistakeNotebookScreen`](file:///d:/CodeSupa/Score/lib/presentation/mistakes/mistake_notebook_screen.dart) with mistake type tabs (*Silly Mistake*, *Conceptual Gap*, *Calculation Error*, *Ran Out of Time*), spaced repetition stage indicators, and direct re-attempt flows.
- **Action 25**: Implemented ethical, zero-piracy [`SubscriptionScreen`](file:///d:/CodeSupa/Score/lib/presentation/subscription/subscription_screen.dart) with Free vs. PRO comparison table, monthly/6-month/annual pricing tiers, and entitlement validation.
- **Action 26**: Built unified [`MainNavScreen`](file:///d:/CodeSupa/Score/lib/presentation/main_nav_screen.dart) providing bottom navigation between Home, DPP, Tests, Formulas, and Mistakes.
- **Action 27**: Ran full `flutter analyze` with 0 errors and 0 warnings.
- **Action 28**: Recompiled debug binary and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (208 MB) at the root of the workspace.
- **Action 29**: Installed and configured the **Apple Design Skill** ([`apple-design`](file:///d:/CodeSupa/Score/.agents/skills/apple-design/SKILL.md)) across workspace roots and global config (`C:\Users\pinja\.gemini\config\skills\apple-design`), enabling deep Human Interface Guidelines (HIG) compliance audits, accessibility reviews, tactile haptics, and fluid motion design.
- **Action 30**: Executed complete Apple Human Interface Guidelines (HIG) UI Redesign across the entire application:
  - Calibrated system colors (`AppColors`) to authentic Apple iOS values (`#007AFF` System Blue, `#34C759` System Green, `#FF9500` System Orange, `#FF3B30` System Red, `#F2F2F7` Grouped Canvas, `#000000` True OLED Midnight, and Liquid Glass frosted tints).
  - Implemented Apple HIG typography scale (`AppTypography`) using `Inter` with SF Pro optical metrics (`largeTitle`, `displayLarge`, `titleLarge`, `titleMedium`, `subhead`, `monoNumber`).
  - Standardized iOS Inset Grouped Sections (`IosGroupedSection` & `IosGroupedTile`) with squircle icons, indented 0.5px hairline dividers, and chevron disclosure accessories.
  - Converted bottom navigation into a Floating Liquid Glass tab bar with frosted `BackdropFilter` (sigma 25 blur), Cupertino filled/outline glyph transitions, and selection haptics.
  - Redesigned all application screens: [`HomeScreen`](file:///d:/CodeSupa/Score/lib/presentation/home/home_screen.dart), [`ChapterListScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/chapter_list_screen.dart), [`QuestionListScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/question_list_screen.dart), [`QuestionSolveScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/question_solve_screen.dart), [`QuestionFilterSheet`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/widgets/question_filter_sheet.dart), [`OptionCard`](file:///d:/CodeSupa/Score/lib/presentation/common/option_card.dart), [`DppScreen`](file:///d:/CodeSupa/Score/lib/presentation/dpp/dpp_screen.dart), [`FormulaCardsScreen`](file:///d:/CodeSupa/Score/lib/presentation/formula_cards/formula_cards_screen.dart), [`CustomTestScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/custom_test_screen.dart), [`TestSimulationScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/test_simulation_screen.dart), [`TestResultAnalysisScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/test_result_analysis_screen.dart), [`SubscriptionScreen`](file:///d:/CodeSupa/Score/lib/presentation/subscription/subscription_screen.dart), and [`MistakeNotebookScreen`](file:///d:/CodeSupa/Score/lib/presentation/mistakes/mistake_notebook_screen.dart).
  - Verified 0 issues with `flutter analyze`, 100% pass on `flutter test`, and successfully recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (208 MB).

- **Action 31**: Conducted secondary exhaustive deep-dive of target APK `com.scoremarks.marks.apk` via REA and implemented all missing core features:
  - **Daily Motivational Quotes**: Integrated `assets/quotes.json` (366 quotes) via [`DailyQuoteService`](file:///d:/CodeSupa/Score/lib/data/services/daily_quote_service.dart), rendering day-indexed motivational cards on [`HomeScreen`](file:///d:/CodeSupa/Score/lib/presentation/home/home_screen.dart).
  - **Top 500 Questions Mode**: Implemented [`Top500Screen`](file:///d:/CodeSupa/Score/lib/presentation/top500/top500_screen.dart) featuring milestone tiers (Bronze, Silver, Gold, Platinum), progress meters, and high-yield question listings.
  - **Marks Shorts & Quick Polls**: Built [`ShortsPollScreen`](file:///d:/CodeSupa/Score/lib/presentation/shorts/shorts_poll_screen.dart) supporting vertical swipe feeds, 45-second countdown timers, and live simulated community voting statistics.
  - **PYQ Buckets Engine**: Created [`PyqBucketsScreen`](file:///d:/CodeSupa/Score/lib/presentation/buckets/pyq_buckets_screen.dart) with 5 high-impact categories (*Most Repeated*, *Tricky & Multi-Concept*, *Formula & Speed Boosters*, *Recent Trends*, *NCERT Board Overlap*).
  - **Quick Concepts & Formula Revision**: Built [`QuickConceptsScreen`](file:///d:/CodeSupa/Score/lib/presentation/concepts/quick_concepts_screen.dart) with searchable micro-theory cards, KaTeX formulas, and exam trap warnings.
  - **NCERT Line-by-Line Toolbox (LBLQ)**: Built [`NcertToolboxScreen`](file:///d:/CodeSupa/Score/lib/presentation/ncert/ncert_toolbox_screen.dart) with textbook page references for Chemistry and Biology across Class 11 and Class 12.
  - **Preparation Tracker & Report Card**: Built [`PrepTrackerScreen`](file:///d:/CodeSupa/Score/lib/presentation/tracker/prep_tracker_screen.dart) with readiness score, subject accuracy gauges, strong/weak chapter matrix, and projected percentile predictor.
  - **Video Solutions Hub**: Built [`VideoSolutionsScreen`](file:///d:/CodeSupa/Score/lib/presentation/video_solutions/video_solutions_screen.dart) with chapter-wise video listings, timestamped breakdown sheets, and video player simulation.
  - **Personal Revision Notes & Community Shortcuts**: Upgraded [`QuestionSolveScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/question_solve_screen.dart) and [`AppDatabase`](file:///d:/CodeSupa/Score/lib/data/local/app_database.dart) with persistent custom student notes and community shortcut tricks.
  - **Build Verification**: `flutter analyze` (0 issues), `flutter test` (100% pass), and updated root [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (248 MB).

- **Action 32**: Scaled down the content size of the whole application by exactly 30% (scale factor = 0.70):
  - Configured top-level virtual layout scaling in [`ScoreApp.build`](file:///d:/CodeSupa/Score/lib/main.dart) via `MaterialApp.builder`.
  - Scaled virtual canvas size (`mediaQuery.size / 0.7`) and inverted edge insets/padding (`* 1.0 / 0.7`) wrapped inside a root `FittedBox(fit: BoxFit.contain, alignment: Alignment.topCenter)`.
  - All UI elements (fonts, icons, cards, squircle containers, paddings, buttons, dialogs, KaTeX formulas, bottom sheets) render cleanly at 70% scale without affecting functionality, gestures, or responsiveness.
  - Added test suite [`test/scale_test.dart`](file:///d:/CodeSupa/Score/test/scale_test.dart) verifying gestures, text input, dialogs, scrolling, and safe area metrics under 0.7 scale.
  - Passed `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (248 MB) at the root of the workspace.
  - Mirrored and pushed to GitHub remote `origin main` (commit `a718b76`).

- **Action 33**: Fixed Flutter Web runtime issues and layout overflow:
  - Fixed `RenderFlex overflowed by 83 pixels` on [`HomeScreen`](file:///d:/CodeSupa/Score/lib/presentation/home/home_screen.dart) line 256 in the "Today's Practice Goal" dose card by wrapping the inner text column with `Expanded` and adding text ellipsis truncation.
  - Resolved `SqfliteFfiWebException` on Chrome by generating and installing `sqflite_sw.js` and `sqlite3.wasm` binaries into the `web/` assets directory.
  - Added graceful fallback in [`AppDatabase._initDB`](file:///d:/CodeSupa/Score/lib/data/local/app_database.dart) to fall back to `databaseFactoryFfiWebNoWebWorker` with `inMemoryDatabasePath` if shared web workers are unavailable in the browser environment.
  - Passed `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Synchronized binaries and code to GitHub remote `origin main` (commit `472e2dc`).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (248 MB) at the root of the workspace.

- **Action 34**: Restructured and elevated Home Screen visual hierarchy using `apple-design` skill:
  - Replaced repetitive monolithic list rows with distinct, high-impact Apple HIG card components:
    - Built [`HeroSpotlightCard`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/hero_spotlight_card.dart) for **Top 500 Questions** (App Store / Fitness+ showcase with tiered badges: Bronze, Silver, Gold, Platinum).
    - Built [`BentoCard`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/bento_card.dart) for 2-column high-velocity modes (**Marks Shorts & Quick Polls** and **PYQ Buckets**; and **NCERT Line-by-Line (LBLQ)** and **Video Solutions**).
    - Built [`PrepSummaryCard`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/prep_summary_card.dart) for **Preparation Health & Readiness** (Apple Health diagnostic summary with 78% overall readiness, 98.4 %ile chip, and subject breakdown bars).
    - Built [`QuickConceptStrip`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/quick_concept_strip.dart) for micro-theory and exam trap revision.
    - Preserved authentic `IosGroupedSection` for secondary utilities (DPP, Custom Tests, Formula Cards, Mistake Notebook).
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (248 MB) at the root of the workspace.
  - Mirrored and pushed to GitHub remote `origin main`.

---

## 5. Next Immediate Actions
1. Keep [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) continuously refreshed upon subsequent commits.
2. Synchronize and push latest commits to remote repository `https://github.com/ZeeshuCollege/Score-Mobile.git`.
3. Enhance offline synchronization for user-generated notes.

