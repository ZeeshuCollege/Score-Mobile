enum QuestionType {
  singleChoice,
  multipleChoice,
  numerical,
}

enum DifficultyLevel {
  easy,
  medium,
  hard,
}

class QuestionEntity {
  final String id;
  final String examId; // 'jee_main', 'jee_advanced', 'neet', 'bitsat'
  final String subjectId; // 'physics', 'chemistry', 'mathematics', 'biology'
  final String chapterId;
  final String? topicId;
  final int year;
  final String shift;
  final QuestionType questionType;
  final String questionText; // LaTeX string e.g. $$ \int_0^\infty e^{-x} dx $$
  final List<String> options; // Option text/LaTeX (empty for numerical)
  final String correctAnswer; // 'A', 'A,B', or '42'
  final String solutionText;
  final bool hasVideoSolution;
  final DifficultyLevel difficulty;
  final bool isPremium;

  const QuestionEntity({
    required this.id,
    required this.examId,
    required this.subjectId,
    required this.chapterId,
    this.topicId,
    required this.year,
    required this.shift,
    required this.questionType,
    required this.questionText,
    required this.options,
    required this.correctAnswer,
    required this.solutionText,
    this.hasVideoSolution = false,
    this.difficulty = DifficultyLevel.medium,
    this.isPremium = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'exam_id': examId,
      'subject_id': subjectId,
      'chapter_id': chapterId,
      'topic_id': topicId,
      'year': year,
      'shift': shift,
      'question_type': questionType.name,
      'question_text': questionText,
      'options_json': options.join('|||'), // pipe delimited or json
      'correct_answer': correctAnswer,
      'solution_text': solutionText,
      'has_video_solution': hasVideoSolution ? 1 : 0,
      'difficulty_level': difficulty.name,
      'is_premium': isPremium ? 1 : 0,
    };
  }

  factory QuestionEntity.fromMap(Map<String, dynamic> map) {
    final opts = map['options_json'] != null && (map['options_json'] as String).isNotEmpty
        ? (map['options_json'] as String).split('|||')
        : <String>[];

    return QuestionEntity(
      id: map['id'] as String,
      examId: map['exam_id'] as String,
      subjectId: map['subject_id'] as String,
      chapterId: map['chapter_id'] as String,
      topicId: map['topic_id'] as String?,
      year: map['year'] as int,
      shift: (map['shift'] as String?) ?? '',
      questionType: QuestionType.values.firstWhere(
        (e) => e.name == map['question_type'],
        orElse: () => QuestionType.singleChoice,
      ),
      questionText: map['question_text'] as String,
      options: opts,
      correctAnswer: map['correct_answer'] as String,
      solutionText: map['solution_text'] as String,
      hasVideoSolution: (map['has_video_solution'] as int?) == 1,
      difficulty: DifficultyLevel.values.firstWhere(
        (e) => e.name == map['difficulty_level'],
        orElse: () => DifficultyLevel.medium,
      ),
      isPremium: (map['is_premium'] as int?) == 1,
    );
  }
}
