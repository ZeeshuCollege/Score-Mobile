# SCORE — Product Requirements Document (PRD)

---

## 1. Executive Summary & Vision

**SCORE** is an elite, cross-platform mobile application designed for students preparing for highly competitive engineering and medical entrance exams (JEE Main, JEE Advanced, NEET, BITSAT, KCET, MHTCET, WBJEE, NDA, etc.). 

By reverse-engineering the core structural mechanics of top-tier exam prep applications (specifically *MARKS: IIT JEE & NEET Prep*, package `com.scoremarks.marks`), **SCORE** reconstructs a high-performance, distraction-free preparation platform with:
- Granular Chapter-wise & Topic-wise Previous Year Questions (PYQs).
- A dynamic, customizable **Custom Test Engine** mimicking real exam conditions.
- Daily Practice Problems (DPP) and Smart Mistake Notebooks.
- Clear, legitimate, and clean separation between **Free Tier** and **Premium / Paid Tier** functionality (with zero pirated or bypassed client-side code).

---

## 2. Target Audience & Personas

| Persona | Description | Primary Needs |
| :--- | :--- | :--- |
| **Aarav (JEE Aspirant)** | Class 11/12 student aiming for IIT Bombay / NITs. | High-frequency PYQ practice, difficulty-sorted question banks, timer-based custom tests, detailed percentile and time-spent analytics. |
| **Priya (NEET Aspirant)** | Class 12 / Dropper focusing on MBBS entry. | Chapter-wise NCERT question mapping, Biology/Chemistry fact verification, DPP quizzes, high-yield question buckets. |
| **Mentor / Educator** | Coaching institute tutor or self-study supervisor. | Assignment tracking, syllabus coverage insights, student mistake analytics. |

---

## 3. Supported Exams & Hierarchy

### Categories & Exams
1. **Engineering Stream**:
   - **JEE Main** (Physics, Chemistry, Mathematics)
   - **JEE Advanced** (Multi-correct, Numerical, Matrix Match)
   - **BITSAT** (Physics, Chemistry, Math, English, Logical Reasoning)
   - **State CETs**: KCET, MHTCET, WBJEE, VITEEE, NDA
2. **Medical Stream**:
   - **NEET UG** (Physics, Chemistry, Biology: Botany + Zoology)
   - **AIIMS Archives**

### Academic Taxonomy
$$\text{Exam} \longrightarrow \text{Category} \longrightarrow \text{Subject} \longrightarrow \text{Unit} \longrightarrow \text{Chapter} \longrightarrow \text{Topic} \longrightarrow \text{Question}$$

- **Subjects**: Physics, Chemistry (Physical, Organic, Inorganic), Mathematics (Algebra, Calculus, Coordinate Geometry, Trigonometry, Vectors/3D), Biology (Botany, Zoology).
- **Units**: Mechanics 1 & 2, Electromagnetism, Modern Physics, Thermodynamics, Organic Reactions, Physical Equilibrium, Coordinate Geometry, etc.

---

## 4. Core Features & Functional Requirements

### 4.1. Chapter-wise Previous Year Question Bank (CPYQB)
- **Filters & Sorting**:
  - Filter by Year (2010 – 2026), Exam, Shift/Session, Question Type (Single Choice, Multiple Choice, Numerical Integer, Match the Column).
  - Filter by Status: Unattempted, Correct, Incorrect, Marked for Review.
  - Sort by: Year (Newest/Oldest), Difficulty (Easy, Medium, Hard), Question Order.
- **Solving Modes**:
  1. **Practice Mode**: Instant answer check, step-by-step solution display, KaTeX math formula rendering, community explanations, hint reveals.
  2. **Test Mode**: Timed question answering without immediate feedback; full submission report generated at completion.
- **Question Interaction**:
  - Single Choice (Radio A, B, C, D)
  - Multiple Choice (Checkboxes A, B, C, D)
  - Numerical / Integer (Keypad input with decimal/integer support)
  - Bookmarking & Adding to Custom Notebooks.

### 4.2. Custom Test Generator (CT Engine)
- **Step 1: Exam & Subjects Selection**: Choose target exam pattern (JEE Main 75-question pattern, NEET 180/200 pattern, or customized).
- **Step 2: Chapter & Topic Breakdown**: Multi-select chapters across subjects with weighting.
- **Step 3: Test Configuration**: Total questions (10 to 90), time duration (15 mins to 180 mins), negative marking rules (+4 / -1 or custom).
- **Step 4: Test Taking Interface**:
  - Full-screen distraction-free timer with countdown.
  - Question Palette (Answered, Not Answered, Marked for Review, Visited).
  - Instant section switcher (Physics, Chemistry, Math/Bio).
- **Step 5: Analysis & Report Card**:
  - Overall Score, Rank/Percentile estimate.
  - Accuracy %, Subject-wise breakdown, Time spent per question.
  - Mistake categorization: *Silly Mistake*, *Conceptual Error*, *Calculation Mistake*, *Ran out of Time*.

### 4.3. Daily Practice Problems (DPP) & Challenges
- Daily curated sets (10-15 questions) matching student's syllabus progress.
- Daily streaks, streak freezes, and study milestone badges.
- Weekly Top 500 Question Challenges with community leaderboard.

### 4.4. Smart Notebooks & Mistake Tracker
- **Automatic Mistake Logging**: Every question marked incorrect in test or practice mode automatically syncs to the student's *Mistake Notebook*.
- **Custom Tags & Notes**: Users can add personal handwritten or text notes to tricky questions.
- **Revision Reminders**: Spaced repetition schedule (Review after 1 day, 3 days, 7 days, 21 days).

### 4.5. Formula Cards & Quick Concept Summaries
- High-yield formula cards organized by chapter and unit.
- Searchable formula directory.
- "Mark as Mastered" and revision status toggle.

### 4.6. KaTeX & Media Rendering Engine
- First-class offline LaTeX/KaTeX equation rendering ($$ \int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2} $$).
- High-resolution SVG / WebP diagrams with pinch-to-zoom and pan.
- Integrated video solutions with player controls (0.75x – 2.0x speed, timestamp navigation).

---

## 5. Monetization & Tiering Model (Zero Piracy Policy)

SCORE enforces a strict, clean-room monetization model. Client-side checks are backed by server-validated cryptographic receipts (JWT / RevenueCat / Google Play Billing / StoreKit).

| Feature | Free Tier | Score PRO (Premium) |
| :--- | :--- | :--- |
| **PYQ Question Bank** | Full access to PYQs up to 2021 | Full access to all years (including latest 2022–2026 shifts) |
| **Practice Mode** | Unlimited standard practice with text solutions | Unlimited with step-by-step solutions & AI Hints |
| **Custom Tests** | 1 test per week (max 25 questions) | Unlimited custom tests (up to full 3-hour mock tests) |
| **Video Solutions** | Preview (10 videos / month) | Unlimited high-definition video explanations |
| **Mistake Notebook** | 1 default notebook (up to 50 questions) | Unlimited smart notebooks with spaced repetition |
| **Analytics** | Basic score & accuracy | In-depth percentile prediction, weak area AI diagnosis |
| **Ads** | Minimal non-intrusive banner | 100% Ad-Free Experience |

---

## 6. Non-Functional Requirements (NFRs)

1. **Performance**: 60 FPS scrolling on question listings; KaTeX math formulas render within $< 50\text{ ms}$.
2. **Offline Resilience**: Local SQLite database stores question text, bookmarks, and offline tests. Syncs seamlessly when online.
3. **Cross-Platform Parity**: Identical feature set and performance across Android (SDK 21+) and iOS (iOS 15+).
4. **Security & Integrity**:
   - Secure token storage (EncryptedSharedPreferences / iOS Keychain).
   - End-to-end API encryption with HMAC request signing.
   - Zero hardcoded secrets, zero mod/piracy bypass flags.
