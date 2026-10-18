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

---

## 5. Next Immediate Actions
1. Begin **Phase 1 & Phase 2**: Implement the local Drift/SQLite database schema (`QuestionDao`, `TestAttemptDao`, `MistakeDao`) and the `KaTeXMathView` equation renderer.
2. Build the interactive `OptionCard` component (Single/Multiple/Numeric choice evaluation).
3. Re-run [`build_score_apk.ps1`](file:///d:/CodeSupa/Score/build_score_apk.ps1) after code changes to keep [`Score.apk`](file:///d:/CodeSupa/Score/Score.apk) synchronized.
