# SCORE — Application Architecture Specification

---

## 1. System Overview

**SCORE** is built on a modern **Clean Architecture** pattern using **Flutter & Dart**, providing a single performant codebase for both **Android** and **iOS** with zero platform-specific divergence.

```mermaid
graph TD
    subgraph UI_Layer [Presentation Layer (Flutter)]
        V[Views / Screens]
        W[Reusable Widgets / KaTeX Renderers]
        VM[State Notifiers / Riverpod ViewModels]
    end

    subgraph Domain_Layer [Domain Layer (Pure Dart)]
        UC[Use Cases / Interactors]
        E[Domain Entities]
        IR[Repository Interfaces]
    end

    subgraph Data_Layer [Data Layer]
        R[Repository Implementations]
        LDS[Local Data Source (Drift / SQLite)]
        RDS[Remote Data Source (Dio HTTP Client)]
    end

    V --> VM
    VM --> UC
    UC --> E
    UC --> IR
    R -.-> IR
    R --> LDS
    R --> RDS
```

---

## 2. Technology Stack & Key Libraries

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Flutter 3.47+ / Dart 3.13+ | Single codebase for Android + iOS, 60/120 FPS Skia/Impeller rendering engine. |
| **State Management** | `flutter_riverpod` + `freezed` | Compile-time safe, decoupled state management, easy testing, zero boilerplate. |
| **Local Database** | `drift` (SQLite ORM) | High-performance reactive relational DB; mirrors the Room DAOs discovered in MARKS. |
| **Key-Value Storage** | `flutter_secure_storage` | AES-256 encrypted storage for tokens, user tier entitlement, and offline keys. |
| **Networking** | `dio` + `retrofit` | HTTP client with automatic request interceptors, JWT refresh, and retry handlers. |
| **Math / KaTeX Engine**| `flutter_math_fork` & offline WebView | Blazing-fast rendering of complex mathematical & chemical equations ($$ \LaTeX $$). |
| **Graphics & Animation**| `flutter_svg`, `lottie` | Native rendering of vector icons and smooth micro-animations. |
| **In-App Purchases** | `purchases_flutter` (RevenueCat) | Clean, robust server-verified subscription handling for Free vs. Pro tiers. |

---

## 3. Directory & File Architecture

```text
score/
├── android/                   # Native Android configuration (SDK 21 - 35)
├── ios/                       # Native iOS configuration (iOS 15+)
├── assets/
│   ├── animations/            # Lottie animation JSONs (splash, success, streak)
│   ├── fonts/                 # Outfit, Geist, and JetBrains Mono fonts
│   ├── icons/                 # SVG icons (exams, subjects, options A/B/C/D)
│   └── katex/                 # Offline KaTeX template and CSS bundles
├── lib/
│   ├── app/                   # App entrypoint, routing, and global themes
│   │   ├── app.dart
│   │   ├── routes.dart        # GoRouter declarative navigation
│   │   └── theme/             # Light & Dark theme definitions (from Design.md)
│   │       ├── colors.dart
│   │       ├── typography.dart
│   │       └── app_theme.dart
│   ├── core/                  # Shared utilities, constants, network, and error handlers
│   │   ├── constants/         # App constants, API endpoints, exam lists
│   │   ├── error/             # Failure and Exception hierarchies
│   │   ├── network/           # Dio client, auth interceptor, retry interceptor
│   │   ├── security/          # Secure storage & receipt validation
│   │   └── utils/             # Math formatting, time formatters, loggers
│   ├── data/                  # Data layer: Models, DAOs, and Repositories
│   │   ├── local/
│   │   │   ├── app_database.dart       # Drift SQLite database definition
│   │   │   ├── daos/
│   │   │   │   ├── question_dao.dart   # Question caching & search
│   │   │   │   ├── test_dao.dart       # Custom test attempts & results
│   │   │   │   ├── bookmark_dao.dart   # Bookmarked questions
│   │   │   │   └── mistake_dao.dart    # Automatic mistake logging
│   │   │   └── tables/                 # Table definitions
│   │   ├── models/            # DTOs with JSON serialization (Freezed)
│   │   │   ├── question_model.dart
│   │   │   ├── custom_test_model.dart
│   │   │   ├── exam_model.dart
│   │   │   └── user_model.dart
│   │   └── repositories/      # Repository implementations
│   │       ├── question_repository_impl.dart
│   │       ├── test_repository_impl.dart
│   │       ├── auth_repository_impl.dart
│   │       └── subscription_repository_impl.dart
│   ├── domain/                # Business logic, pure entities, and repository contracts
│   │   ├── entities/          # Pure immutable business models
│   │   ├── repositories/      # Abstract repository interfaces
│   │   └── usecases/          # Granular interactors
│   │       ├── get_chapter_pyqs_usecase.dart
│   │       ├── generate_custom_test_usecase.dart
│   │       ├── submit_test_attempt_usecase.dart
│   │       ├── log_mistake_usecase.dart
│   │       └── verify_subscription_usecase.dart
│   └── presentation/          # UI layer: Screens, ViewModels, and Reusable Widgets
│       ├── common/            # Universal widgets
│       │   ├── katex_math_view.dart    # High-performance math renderer
│       │   ├── squircle_card.dart      # Custom squircle cards
│       │   ├── option_tile.dart        # Option buttons (A/B/C/D with states)
│       │   └── custom_app_bar.dart
│       ├── auth/              # Onboarding & Sign-in screens
│       ├── home/              # Dashboard, Exam selection, Streaks
│       ├── cpyq/              # Chapter-wise PYQ practice & test mode
│       ├── custom_test/       # Custom test wizard, live exam UI, analysis report
│       ├── notebooks/         # Mistake notebook & Bookmark collections
│       ├── formula_cards/     # Formula cheat sheets & quick revision
│       └── paywall/           # Score PRO tier subscription upgrade screen
└── test/                      # Unit, widget, and integration tests
```

---

## 4. Database Schema (Mirroring Discovered DAOs)

### 4.1. `questions` Table
```sql
CREATE TABLE questions (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL,           -- e.g. 'jee_main', 'neet'
    subject_id TEXT NOT NULL,        -- e.g. 'physics', 'chemistry'
    chapter_id TEXT NOT NULL,
    topic_id TEXT,
    year INTEGER NOT NULL,           -- e.g. 2024
    shift TEXT,                      -- e.g. 'Jan 27 Shift 1'
    question_type TEXT NOT NULL,     -- 'SINGLE', 'MULTIPLE', 'NUMERICAL'
    question_text TEXT NOT NULL,     -- Includes KaTeX strings ($$...$$)
    options_json TEXT,               -- JSON array of choices
    correct_answer TEXT NOT NULL,
    solution_text TEXT NOT NULL,
    has_video_solution BOOLEAN DEFAULT FALSE,
    difficulty_level TEXT,           -- 'EASY', 'MEDIUM', 'HARD'
    is_premium BOOLEAN DEFAULT FALSE
);
```

### 4.2. `test_attempts` Table
```sql
CREATE TABLE test_attempts (
    id TEXT PRIMARY KEY,
    test_title TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    incorrect_count INTEGER NOT NULL,
    unattempted_count INTEGER NOT NULL,
    score REAL NOT NULL,
    total_time_seconds INTEGER NOT NULL,
    submitted_at DATETIME NOT NULL,
    question_responses_json TEXT NOT NULL   -- Complete per-question response and time spent
);
```

### 4.3. `mistake_notebook` Table
```sql
CREATE TABLE mistake_notebook (
    id TEXT PRIMARY KEY,
    question_id TEXT REFERENCES questions(id),
    mistake_type TEXT NOT NULL,      -- 'SILLY', 'CONCEPTUAL', 'CALCULATION', 'TIME'
    student_notes TEXT,
    review_stage INTEGER DEFAULT 1,  -- Spaced repetition level (1 to 5)
    next_review_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);
```

---

## 5. Security & Anti-Piracy Architecture

1. **Server-Side Entitlement Resolution**:
   - Client never relies on a simple local boolean `isPremium = true`.
   - All premium questions, detailed solutions, and advanced tests are verified via encrypted JWT claims issued by the authentication service.
2. **Encrypted Local Cache**:
   - SQLite database is encrypted with SQLCipher via `drift` on sensitive tables.
3. **Receipt Validation**:
   - Google Play Billing & Apple StoreKit purchase tokens are forwarded directly to the backend for cryptographic signature verification.
