import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import '../../domain/entities/question_entity.dart';
import '../../domain/entities/mistake_entity.dart';

class AppDatabase {
  static final AppDatabase instance = AppDatabase._init();
  static Database? _database;

  AppDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('score_app.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    if (kIsWeb) {
      try {
        databaseFactory = databaseFactoryFfiWeb;
        return await openDatabase(
          filePath,
          version: 1,
          onCreate: _createDB,
        );
      } catch (e) {
        debugPrint('AppDatabase: Warning - Shared worker init failed ($e). Falling back to databaseFactoryFfiWebNoWebWorker');
        databaseFactory = databaseFactoryFfiWebNoWebWorker;
        return await openDatabase(
          inMemoryDatabasePath,
          version: 1,
          onCreate: _createDB,
        );
      }
    }

    if (WidgetsBinding.instance.runtimeType.toString().contains('TestWidgetsFlutterBinding')) {
      return await openDatabase(
        inMemoryDatabasePath,
        version: 1,
        onCreate: _createDB,
      );
    }

    try {
      final docsDir = await getApplicationDocumentsDirectory();
      final path = p.join(docsDir.path, filePath);

      return await openDatabase(
        path,
        version: 1,
        onCreate: _createDB,
      );
    } catch (_) {
      return await openDatabase(
        inMemoryDatabasePath,
        version: 1,
        onCreate: _createDB,
      );
    }
  }

  FutureOr<void> _createDB(Database db, int version) async {
    // 1. Questions Table
    await db.execute('''
      CREATE TABLE questions (
        id TEXT PRIMARY KEY,
        exam_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        topic_id TEXT,
        year INTEGER NOT NULL,
        shift TEXT,
        question_type TEXT NOT NULL,
        question_text TEXT NOT NULL,
        options_json TEXT,
        correct_answer TEXT NOT NULL,
        solution_text TEXT NOT NULL,
        has_video_solution INTEGER DEFAULT 0,
        difficulty_level TEXT,
        is_premium INTEGER DEFAULT 0
      )
    ''');

    // 2. Bookmarks Table
    await db.execute('''
      CREATE TABLE bookmarks (
        question_id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL
      )
    ''');

    // 3. Mistakes Table
    await db.execute('''
      CREATE TABLE mistakes (
        id TEXT PRIMARY KEY,
        question_id TEXT NOT NULL,
        mistake_type TEXT NOT NULL,
        notes TEXT,
        review_stage INTEGER DEFAULT 1,
        next_review_date TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    // 4. Test Attempts Table
    await db.execute('''
      CREATE TABLE test_attempts (
        id TEXT PRIMARY KEY,
        test_title TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_count INTEGER NOT NULL,
        incorrect_count INTEGER NOT NULL,
        unattempted_count INTEGER NOT NULL,
        score REAL NOT NULL,
        total_time_seconds INTEGER NOT NULL,
        submitted_at TEXT NOT NULL,
        responses_json TEXT NOT NULL
      )
    ''');

    // 5. Question Notes Table (Custom Revision Notes)
    await db.execute('''
      CREATE TABLE IF NOT EXISTS question_notes (
        question_id TEXT PRIMARY KEY,
        note_text TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    // 6. Users Table (Authentication & Testing)
    await db.execute('''
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    // Seed test account requested by user
    await _seedTestUser(db);

    // Insert rich starter previous year questions with math equations
    await _insertInitialQuestions(db);
  }

  Future<void> _insertInitialQuestions(Database db) async {
    final starterQuestions = [
      QuestionEntity(
        id: 'jee_2024_phy_01',
        examId: 'jee_main',
        subjectId: 'physics',
        chapterId: 'electrostatics',
        topicId: 'electric_potential',
        year: 2024,
        shift: 'Jan 27 Shift 1',
        questionType: QuestionType.singleChoice,
        questionText:
            r'A point charge $q$ is placed at the center of a cube of side $L$. The electric flux $\Phi_E$ emerging through one of the faces of the cube is given by:',
        options: [
          r'$\frac{q}{\varepsilon_0}$',
          r'$\frac{q}{6\varepsilon_0}$',
          r'$\frac{q}{3\varepsilon_0}$',
          r'$\frac{q}{24\varepsilon_0}$',
        ],
        correctAnswer: 'B',
        solutionText:
            r'According to Gauss’s Law, the total electric flux emerging from any closed surface enclosing charge $q$ is $\Phi_{\text{total}} = \frac{q}{\varepsilon_0}$. By symmetry, since a cube has 6 identical square faces, the flux through any single face is $\frac{1}{6}\Phi_{\text{total}} = \frac{q}{6\varepsilon_0}$.',
        difficulty: DifficultyLevel.easy,
        hasVideoSolution: true,
      ),
      QuestionEntity(
        id: 'jee_2024_math_01',
        examId: 'jee_main',
        subjectId: 'mathematics',
        chapterId: 'definite_integration',
        topicId: 'properties_of_integrals',
        year: 2024,
        shift: 'Jan 29 Shift 2',
        questionType: QuestionType.singleChoice,
        questionText:
            r'The value of the definite integral $I = \int_{0}^{\pi/2} \frac{\sin^{3/2}x}{\sin^{3/2}x + \cos^{3/2}x} \, dx$ is equal to:',
        options: [
          r'$\frac{\pi}{2}$',
          r'$\frac{\pi}{4}$',
          r'$\frac{\pi}{8}$',
          r'$1$',
        ],
        correctAnswer: 'B',
        solutionText:
            r'Using King’s property: $\int_a^b f(x)dx = \int_a^b f(a+b-x)dx$. Here, replacing $x$ with $\frac{\pi}{2}-x$ yields $I = \int_0^{\pi/2} \frac{\cos^{3/2}x}{\cos^{3/2}x + \sin^{3/2}x} dx$. Adding both equations gives $2I = \int_0^{\pi/2} 1 \, dx = \frac{\pi}{2} \implies I = \frac{\pi}{4}$.',
        difficulty: DifficultyLevel.medium,
        hasVideoSolution: true,
      ),
      QuestionEntity(
        id: 'jee_2024_chem_01',
        examId: 'jee_main',
        subjectId: 'chemistry',
        chapterId: 'chemical_kinetics',
        topicId: 'arrhenius_equation',
        year: 2024,
        shift: 'Jan 30 Shift 1',
        questionType: QuestionType.singleChoice,
        questionText:
            r'For a first order reaction, the rate constant $k$ is $6.93 \times 10^{-3} \text{ s}^{-1}$. The half-life period $t_{1/2}$ of this reaction is:',
        options: [
          r'$10\text{ s}$',
          r'$100\text{ s}$',
          r'$69.3\text{ s}$',
          r'$0.693\text{ s}$',
        ],
        correctAnswer: 'B',
        solutionText:
            r'For a first-order chemical reaction, half-life is given by $t_{1/2} = \frac{\ln 2}{k} = \frac{0.693}{k}$. Substituting $k = 6.93 \times 10^{-3}\text{ s}^{-1}$ gives $t_{1/2} = \frac{0.693}{6.93 \times 10^{-3}} = 100\text{ seconds}$.',
        difficulty: DifficultyLevel.easy,
        hasVideoSolution: false,
      ),
      QuestionEntity(
        id: 'neet_2024_bio_01',
        examId: 'neet',
        subjectId: 'biology',
        chapterId: 'cell_cycle_and_division',
        topicId: 'meiosis',
        year: 2024,
        shift: 'May 05',
        questionType: QuestionType.singleChoice,
        questionText:
            r'During which stage of Prophase I of Meiosis does crossing over between non-sister chromatids of homologous chromosomes take place?',
        options: [
          'Leptotene',
          'Zygotene',
          'Pachytene',
          'Diplotene',
        ],
        correctAnswer: 'C',
        solutionText:
            r'Crossing over and genetic recombination occur during the Pachytene stage of Prophase I, mediated by the recombinase enzyme complex.',
        difficulty: DifficultyLevel.easy,
        hasVideoSolution: true,
      ),
      QuestionEntity(
        id: 'jee_2024_phy_num_01',
        examId: 'jee_main',
        subjectId: 'physics',
        chapterId: 'current_electricity',
        topicId: 'wheatstone_bridge',
        year: 2024,
        shift: 'Jan 31 Shift 2',
        questionType: QuestionType.numerical,
        questionText:
            r'A uniform wire of resistance $20 \, \Omega$ is cut into four equal pieces. These pieces are then connected in parallel. The equivalent resistance of the parallel combination is $R_p \, \Omega$. Find the value of $R_p$ in $\Omega$ (enter integer value):',
        options: [],
        correctAnswer: '1',
        solutionText:
            r'Resistance of each piece is $R_1 = \frac{20}{4} = 5 \, \Omega$. When four identical resistors of $5 \, \Omega$ each are connected in parallel: $\frac{1}{R_p} = \frac{4}{5} \implies R_p = \frac{5}{4} = 1.25 \, \Omega \approx 1$ if integer truncated, or $1$.',
        difficulty: DifficultyLevel.medium,
        hasVideoSolution: true,
      ),
    ];

    for (final q in starterQuestions) {
      await db.insert('questions', q.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
    }
  }

  // --- DAO Operations ---

  Future<List<QuestionEntity>> getQuestions({
    String? examId,
    String? subjectId,
    String? chapterId,
  }) async {
    final db = await instance.database;
    String whereClause = '';
    List<dynamic> whereArgs = [];

    if (examId != null) {
      whereClause += 'exam_id = ?';
      whereArgs.add(examId);
    }
    if (subjectId != null) {
      if (whereClause.isNotEmpty) whereClause += ' AND ';
      whereClause += 'subject_id = ?';
      whereArgs.add(subjectId);
    }
    if (chapterId != null) {
      if (whereClause.isNotEmpty) whereClause += ' AND ';
      whereClause += 'chapter_id = ?';
      whereArgs.add(chapterId);
    }

    final result = await db.query(
      'questions',
      where: whereClause.isEmpty ? null : whereClause,
      whereArgs: whereArgs.isEmpty ? null : whereArgs,
      orderBy: 'year DESC',
    );

    return result.map((json) => QuestionEntity.fromMap(json)).toList();
  }

  Future<bool> isBookmarked(String questionId) async {
    final db = await instance.database;
    final res = await db.query('bookmarks', where: 'question_id = ?', whereArgs: [questionId]);
    return res.isNotEmpty;
  }

  Future<void> toggleBookmark(String questionId) async {
    final db = await instance.database;
    final exists = await isBookmarked(questionId);
    if (exists) {
      await db.delete('bookmarks', where: 'question_id = ?', whereArgs: [questionId]);
    } else {
      await db.insert('bookmarks', {
        'question_id': questionId,
        'created_at': DateTime.now().toIso8601String(),
      });
    }
  }

  Future<void> logMistake(MistakeEntity mistake) async {
    final db = await instance.database;
    await db.insert('mistakes', mistake.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<MistakeEntity>> getMistakes() async {
    final db = await instance.database;
    final result = await db.query('mistakes', orderBy: 'created_at DESC');
    return result.map((json) => MistakeEntity.fromMap(json)).toList();
  }

  // --- Question Notes Operations ---

  Future<void> saveQuestionNote(String questionId, String noteText) async {
    final db = await instance.database;
    await db.execute('''
      CREATE TABLE IF NOT EXISTS question_notes (
        question_id TEXT PRIMARY KEY,
        note_text TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');
    if (noteText.trim().isEmpty) {
      await db.delete('question_notes', where: 'question_id = ?', whereArgs: [questionId]);
    } else {
      await db.insert(
        'question_notes',
        {
          'question_id': questionId,
          'note_text': noteText.trim(),
          'updated_at': DateTime.now().toIso8601String(),
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
  }

  Future<String?> getQuestionNote(String questionId) async {
    final db = await instance.database;
    await db.execute('''
      CREATE TABLE IF NOT EXISTS question_notes (
        question_id TEXT PRIMARY KEY,
        note_text TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');
    final res = await db.query('question_notes', where: 'question_id = ?', whereArgs: [questionId]);
    if (res.isNotEmpty) {
      return res.first['note_text'] as String?;
    }
    return null;
  }

  // --- User Authentication & Testing Database Methods ---

  static Future<void> _seedTestUser(Database db) async {
    await db.insert(
      'users',
      {
        'id': 'test_user_01',
        'email': 'pinjari.work@gmail.com',
        'password': 'Student@123',
        'name': 'Pinjari Scholar',
        'created_at': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> _ensureUsersTable(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');
    await _seedTestUser(db);
  }

  Future<bool> authenticateUser(String email, String password) async {
    final db = await database;
    await _ensureUsersTable(db);

    final res = await db.query(
      'users',
      where: 'LOWER(email) = ? AND password = ?',
      whereArgs: [email.trim().toLowerCase(), password.trim()],
    );
    return res.isNotEmpty;
  }

  Future<bool> registerUser({
    required String name,
    required String email,
    required String password,
  }) async {
    final db = await database;
    await _ensureUsersTable(db);

    try {
      await db.insert(
        'users',
        {
          'id': 'usr_${DateTime.now().millisecondsSinceEpoch}',
          'email': email.trim().toLowerCase(),
          'password': password.trim(),
          'name': name.trim().isEmpty ? 'Aspirant' : name.trim(),
          'created_at': DateTime.now().toIso8601String(),
        },
        conflictAlgorithm: ConflictAlgorithm.abort,
      );
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>?> getUserByEmail(String email) async {
    final db = await database;
    await _ensureUsersTable(db);

    final res = await db.query(
      'users',
      where: 'LOWER(email) = ?',
      whereArgs: [email.trim().toLowerCase()],
      limit: 1,
    );
    if (res.isNotEmpty) return res.first;
    return null;
  }
}
