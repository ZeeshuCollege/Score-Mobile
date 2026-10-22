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

- **Action 35**: Resolved zero-dimension web startup constraints, segmented control assertions, and layout overflows:
  - Guarded against transient zero/uninitialized canvas dimensions (`mediaQuery.size.width <= 0 || mediaQuery.size.height <= 0`) in [`ScoreApp.build`](file:///d:/CodeSupa/Score/lib/main.dart) during Flutter Web engine startup.
  - Built resilient [`AppleSegmentedControl`](file:///d:/CodeSupa/Score/lib/presentation/common/apple_segmented_control.dart) handling zero-width boundaries, preventing negative constraint crashes (`BoxConstraints(w=-0.8; NOT NORMALIZED)`), and supporting smooth horizontal bouncing scrolling.
  - Migrated all segmented controls across the app to `AppleSegmentedControl` in [`FormulaCardsScreen`](file:///d:/CodeSupa/Score/lib/presentation/formula_cards/formula_cards_screen.dart), [`CustomTestScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/custom_test_screen.dart), [`MistakeNotebookScreen`](file:///d:/CodeSupa/Score/lib/presentation/mistakes/mistake_notebook_screen.dart), [`Top500Screen`](file:///d:/CodeSupa/Score/lib/presentation/top500/top500_screen.dart), [`NcertToolboxScreen`](file:///d:/CodeSupa/Score/lib/presentation/ncert/ncert_toolbox_screen.dart), [`VideoSolutionsScreen`](file:///d:/CodeSupa/Score/lib/presentation/video_solutions/video_solutions_screen.dart), [`QuickConceptsScreen`](file:///d:/CodeSupa/Score/lib/presentation/concepts/quick_concepts_screen.dart), and [`QuestionSolveScreen`](file:///d:/CodeSupa/Score/lib/presentation/cpyq/question_solve_screen.dart).
  - Fixed 76-pixel right overflow in [`PrepSummaryCard`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/prep_summary_card.dart) by wrapping title header row in `Expanded` with text ellipsis truncation.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) (248 MB) at the root of the workspace.
  - Mirrored and pushed to GitHub remote `origin main`.

- **Action 37**: Cleaned dead code and achieved 89.4% app size reduction (from 248.6 MB down to 26.3 MB):
  - Removed dead `DailyQuoteService` and `QuoteEntity` code ([`lib/data/services/daily_quote_service.dart`](file:///d:/CodeSupa/Score/lib/data/services/daily_quote_service.dart)).
  - Cleaned unreferenced dependencies in [`pubspec.yaml`](file:///d:/CodeSupa/Score/pubspec.yaml): `flutter_svg` and `intl`.
  - Removed 14 MB of unused decompiled web/bootstrap assets from APK asset bundle declarations in `pubspec.yaml`.
  - Configured Android R8 minification, resource shrinking, and native jniLibs packaging in [`android/app/build.gradle.kts`](file:///d:/CodeSupa/Score/android/app/build.gradle.kts) and [`android/app/proguard-rules.pro`](file:///d:/CodeSupa/Score/android/app/proguard-rules.pro).
  - Updated [`build_score_apk.ps1`](file:///d:/CodeSupa/Score/build_score_apk.ps1) to compile optimized release builds signed with debug keys for universal deployment.
  - Enabled icon font tree-shaking (MaterialIcons: 99.8% reduction from 1.6MB to 2.8KB; CupertinoIcons: 98.6% reduction from 257KB to 3.5KB).
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Successfully recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at workspace root: 27,599,052 bytes (26.3 MB / 27.5 MB), down from 248,644,171 bytes (a 221 MB reduction).
  - Mirrored and pushed to GitHub remote `origin main`.

- **Action 38**: Implemented edge-to-edge responsiveness for mobile full-screen gestures, notification bars, and Dynamic Island cutouts:
  - Enabled native display cutout handling (`shortEdges`) and fully transparent status/navigation bars in [`android/app/src/main/res/values/styles.xml`](file:///d:/CodeSupa/Score/android/app/src/main/res/values/styles.xml) and [`values-night/styles.xml`](file:///d:/CodeSupa/Score/android/app/src/main/res/values-night/styles.xml).
  - Configured `SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge)` in [`lib/main.dart`](file:///d:/CodeSupa/Score/lib/main.dart) and applied dynamic theme-adaptive `AnnotatedRegion<SystemUiOverlayStyle>` for pixel-perfect status bar icons and transparent navigation bar.
  - Implemented Apple-style swipe-to-back interactive edge transitions across all platforms using `CupertinoPageTransitionsBuilder()` in [`lib/app/theme/app_theme.dart`](file:///d:/CodeSupa/Score/lib/app/theme/app_theme.dart).
  - Enhanced Android 3-button back button handling in [`MainNavScreen`](file:///d:/CodeSupa/Score/lib/presentation/main_nav_screen.dart) with `PopScope` returning to the Home tab before exiting the app.
  - Added dynamic hardware-safe inset calculations (`MediaQuery.of(context).padding.bottom`) across 17 presentation screens ensuring zero content occlusion regardless of navigation pill, 3-button bar, or camera punch-holes / Dynamic Islands.
  - Mathematically aligned hardware safe area insets with 0.7 content scaling (`mediaQuery.padding * invScale`) in [`lib/main.dart`](file:///d:/CodeSupa/Score/lib/main.dart).
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.
  - Mirrored and pushed to GitHub remote `origin main`.

- **Action 39**: Restored content size and all UI elements back to default (100% natural scale):
  - Removed global 0.7 `FittedBox` and inverted `MediaQuery` safe inset scaling in [`lib/main.dart`](file:///d:/CodeSupa/Score/lib/main.dart).
  - Maintained edge-to-edge transparent notification and navigation bar styling with system overlay style and dynamic insets.
  - Updated test suite [`test/scale_test.dart`](file:///d:/CodeSupa/Score/test/scale_test.dart) to verify default scale functionality.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.
  - Mirrored and pushed to GitHub remote `origin main`.

- **Action 40**: Implemented single-line aligned top bar, left-sliding ScoreDrawer, and subject filtering:
  - Redesigned `HomeScreen` top bar to align `SCORE ▾ | <course name> | 🔥 12d` horizontally on a single line with `CrossAxisAlignment.center`, removing the lower-placed flexible space discrepancy.
  - Built Apple-styled leading [`ScoreDrawer`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/score_drawer.dart) accessible via `SCORE ▾` tap or left edge swipe:
    - **Profile section**: User avatar, student level, target status, and interactive Profile sheet with solved questions, accuracy, and streak.
    - **Course changer**: Direct selection between JEE Main, JEE Advanced, NEET UG, and BITSAT with active indicators and instant home screen updates.
    - **Appearance**: Light, Dark, and System theme toggler wired to persistent Riverpod state (`ThemeModeNotifier`).
    - **Settings**: Preferences sheet featuring DPP notification reminders, exam timer countdown, tactile haptic toggles, and solution cache clearing.
  - Filtered test subjects in [`CustomTestScreen`](file:///d:/CodeSupa/Score/lib/presentation/custom_test/custom_test_screen.dart) to strictly display subjects for the selected exam, removing the Biology subject for JEE Main and JEE Advanced while preserving it for NEET.
  - Added comprehensive test suite [`test/header_drawer_test.dart`](file:///d:/CodeSupa/Score/test/header_drawer_test.dart).
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.
  - Mirrored and pushed to GitHub remote `origin main`.

- **Action 41**: Refined top bar spacing, side arrow, and full-width rectangular sidebar buttons:
  - Updated `HomeScreen` top bar: replaced dropdown chevron with right-pointing side arrow (`CupertinoIcons.chevron_right`), removed `|` dividers, and balanced spacing using identical flex `Spacer`s between `SCORE >`, `<course name>`, and `🔥 12d`.
  - Redesigned [`ScoreDrawer`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/score_drawer.dart) with 4 full-width rectangular buttons:
    1. **Course button**: Long rectangular button opening the `CupertinoActionSheet` target exam selection popup.
    2. **Theme button**: Long rectangular card with "Theme" label and dual small toggle pills ("Light" & "Dark") for instant switching.
    3. **Profile button**: Long rectangular button with profile icon opening study statistics modal.
    4. **Settings button**: Long rectangular button with settings gear icon opening app preferences modal.
  - Updated test suite [`test/header_drawer_test.dart`](file:///d:/CodeSupa/Score/test/header_drawer_test.dart) verifying side arrow, absence of dividers, and 4 rectangular drawer buttons.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.
- **Action 42**: Removed subtitle texts and vertically aligned main titles across all sidebar drawer buttons:
  - Removed dummy subtitle texts from [`ScoreDrawer`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/score_drawer.dart) buttons matching user request:
    - `"Dark appearance"` / `"Light appearance"` under Theme.
    - `"Aspirant Scholar"` under Profile.
    - `"Preferences & Cache"` under Settings.
  - Relocated course name (`currentExam.name`) from subtitle to trailing text next to the right chevron in the Course button.
  - Standardized all 4 rectangular buttons (`Course`, `Theme`, `Profile`, `Settings`) to have identical padding (`horizontal: 16, vertical: 14`), identical icon containers (`38x38` box with 20px centered icon), and centered vertical alignment (`CrossAxisAlignment.center`) for the main title text in `Expanded(child: Text(title, ...))`.
  - Updated test assertions in [`test/header_drawer_test.dart`](file:///d:/CodeSupa/Score/test/header_drawer_test.dart) confirming absence of subtitle texts and 100% test pass rate.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.
- **Action 43**: Added `SlidebarSection` slideshow replacing `HeroSpotlightCard`:
  - Created [`SlidebarSection`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/slidebar_section.dart) matching all user requirements:
    - Maximum 5 slides (strictly enforced via `.take(5)`).
    - Multi-format media support (`SlideMediaType.image`, `SlideMediaType.video`, `SlideMediaType.flutterDefault`) handling web URLs, Flutter assets, and local files.
    - Embedded white indicator dots located exclusively inside the container at the bottom (`Positioned(bottom: 10, ...)`), with active dot expansion and dark gradient scrim for universal visibility in both dark and light modes.
    - Default Flutter logo showcase slides (`FlutterLogo`) with clean badges, title, and descriptive subtitles.
    - Automated 2-second slideshow interval (`Duration(seconds: 2)`) with smooth `Curves.easeInOutCubic` page transitions and touch-drag reset.
  - Integrated `SlidebarSection` into [`HomeScreen`](file:///d:/CodeSupa/Score/lib/presentation/home/home_screen.dart) in place of `HeroSpotlightCard`.
  - Added dedicated test suite [`test/slidebar_section_test.dart`](file:///d:/CodeSupa/Score/test/slidebar_section_test.dart) verifying 5-item cap, Flutter logo presence, white dots, video badge, and 2-second auto-advance.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass across all 7 tests).
- **Action 44**: Built full Apple-Design Profile Screen with editable user details & performance stats:
  - Created [`ProfileScreen`](file:///d:/CodeSupa/Score/lib/presentation/profile/profile_screen.dart) and user profile data model & provider ([`user_profile_model.dart`](file:///d:/CodeSupa/Score/lib/presentation/profile/user_profile_model.dart), [`user_profile_provider.dart`](file:///d:/CodeSupa/Score/lib/presentation/profile/user_profile_provider.dart)).
  - Implemented editable PFP with camera badge and an Apple-styled bottom modal sheet offering 8 curated aspirant personas with vibrant Apple system gradients and real-time selection.
  - Implemented Apple Inset Grouped form rows for editing Full Name, Bio/Goal, Dream College, and Target Exam with live validation and persistence to `SharedPreferences`.
  - Implemented Apple-Design grounded Performance Metrics section:
    - 4 Bento Metric Cards (Questions Solved, Accuracy %, Current Streak, Study Hours) with Apple system colors, micro-labels, and trend indicators.
    - Weekly Problem Drills Bar Chart (Mon–Sun) with daily target guideline and highlighted active day.
    - Subject Mastery Breakdown with smooth linear progress indicators and accuracy tags.
    - Unlocked Aspirant Achievement Badges (Century Solver, Streak Pioneer, Precision Pro, Top 500 Candidate).
  - Wired [`ScoreDrawer`](file:///d:/CodeSupa/Score/lib/presentation/home/widgets/score_drawer.dart) Profile button to open `ProfileScreen` via `CupertinoPageRoute`.
  - Added test suite [`test/profile_screen_test.dart`](file:///d:/CodeSupa/Score/test/profile_screen_test.dart) covering rendering, editing, avatar selection, and save flow.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (100% pass across all 10 tests).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.
  - Mirrored and pushed to GitHub remote `origin main`.

- **Action 45**: Complete Startup Flow (White Splash Loading Screen, 3-Slide Full-Screen Onboarding, Switchable Auth Landing Page with Google Buttons, SQLite Testing Credentials):
  - **White Startup Splash Screen** ([`SplashScreen`](file:///d:/CodeSupa/Score/lib/presentation/auth/splash_screen.dart)):
    - Pure white background (`Colors.white`).
    - Centered default Flutter logo (`FlutterLogo(size: 74)`) functioning as the Score logo.
    - Prominent bold `SCORE` brand text below logo with subtitle.
    - Smooth auto-transition timer (1.8s) routing to `MainNavScreen` if already logged in, otherwise transitioning to `OnboardingSlideshowScreen`.
  - **Full-Screen Onboarding Slideshow** ([`OnboardingSlideshowScreen`](file:///d:/CodeSupa/Score/lib/presentation/auth/onboarding_slideshow_screen.dart)):
    - Maximum 3 full-screen slides presenting key app features (`100K+ Authentic PYQs with KaTeX Math`, `NTA-Style Mock Tests with Real Percentiles`, `Smart Mistake Notebook with Weak-Area Insights`).
    - Styled with Flutter logo hero badges, subtle background gradients, bottom white indicator dots, and top "Skip" button.
    - Prominent bottom "Login / Sign Up" button navigating directly to `AuthLandingScreen`.
  - **Switchable Auth Landing Page** ([`AuthLandingScreen`](file:///d:/CodeSupa/Score/lib/presentation/auth/auth_landing_screen.dart)):
    - Unified single landing page with smooth switching between Login and Sign Up views via Apple-style segmented pill control (`[ Login | Sign Up ]`).
    - All form elements, headers, and buttons centered with maximum content width constraint (440px).
    - Login Form: Email & password fields with eye toggle + "Login to SCORE" action button.
    - Signup Form: Full name, email, password, and confirm password fields + "Create Account" action button.
    - "Sign in with Google" button placed cleanly below the login form.
    - "Sign up with Google" button placed cleanly below the signup form.
    - Includes one-tap "Auto-Fill Testing ID" chip for rapid testing.
  - **SQLite Testing Database Setup** ([`AppDatabase`](file:///d:/CodeSupa/Score/lib/data/local/app_database.dart)):
    - Added `users` table (`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, name TEXT NOT NULL, created_at TEXT NOT NULL)`).
    - Seeded testing credentials requested by user:
      - Email: `pinjari.work@gmail.com`
      - Password: `Student@123`
    - Implemented `authenticateUser`, `registerUser`, and `getUserByEmail` methods with Riverpod `authProvider` ([`auth_provider.dart`](file:///d:/CodeSupa/Score/lib/presentation/auth/auth_provider.dart)) and `SharedPreferences` session persistence.
  - **App Entry Point**:
    - Updated [`main.dart`](file:///d:/CodeSupa/Score/lib/main.dart) to launch with `home: const SplashScreen()`.
  - **Comprehensive Test Suite** ([`test/auth_flow_test.dart`](file:///d:/CodeSupa/Score/test/auth_flow_test.dart)):
    - Verifies splash screen white background, Flutter logo, and SCORE text.
    - Verifies onboarding slideshow 3-slide limit and navigation to AuthLandingScreen.
    - Verifies segmented switching between login and signup forms, presence of Google buttons, and successful SQLite authentication routing into `MainNavScreen`.
    - Unit tests SQLite user authentication for test credentials.
  - Verified with `flutter analyze` (0 issues) and `flutter test` (14/14 tests passing, 100%).
  - Recompiled and updated [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) at root of workspace.

---

## 5. Next Immediate Actions
1. Keep [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) continuously refreshed upon subsequent commits.
2. Synchronize and push latest commits to remote repository `https://github.com/ZeeshuCollege/Score-Mobile.git`.
3. Enhance offline synchronization for user-generated notes.


