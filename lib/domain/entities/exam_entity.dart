class ExamEntity {
  final String id;
  final String name;
  final String subtitle;
  final String category; // 'engineering' or 'medical'
  final List<String> subjects;
  final int totalQuestions;
  final int defaultDurationMinutes;

  const ExamEntity({
    required this.id,
    required this.name,
    required this.subtitle,
    required this.category,
    required this.subjects,
    this.totalQuestions = 75,
    this.defaultDurationMinutes = 180,
  });

  static const List<ExamEntity> defaultExams = [
    ExamEntity(
      id: 'jee_main',
      name: 'JEE Main',
      subtitle: 'NTA CBT Pattern (Physics, Chemistry, Maths)',
      category: 'engineering',
      subjects: ['physics', 'chemistry', 'mathematics'],
      totalQuestions: 75,
      defaultDurationMinutes: 180,
    ),
    ExamEntity(
      id: 'jee_advanced',
      name: 'JEE Advanced',
      subtitle: 'IIT Entrance Exam (Multi-correct & Numerical)',
      category: 'engineering',
      subjects: ['physics', 'chemistry', 'mathematics'],
      totalQuestions: 54,
      defaultDurationMinutes: 180,
    ),
    ExamEntity(
      id: 'neet',
      name: 'NEET UG',
      subtitle: 'NTA Medical Entrance (Physics, Chem, Biology)',
      category: 'medical',
      subjects: ['physics', 'chemistry', 'biology'],
      totalQuestions: 180,
      defaultDurationMinutes: 200,
    ),
    ExamEntity(
      id: 'bitsat',
      name: 'BITSAT',
      subtitle: 'BITS Pilani Online Test',
      category: 'engineering',
      subjects: ['physics', 'chemistry', 'mathematics'],
      totalQuestions: 130,
      defaultDurationMinutes: 180,
    ),
  ];
}

class ChapterEntity {
  final String id;
  final String subjectId;
  final String name;
  final String unitName;
  final int totalQuestions;
  final int solvedQuestions;

  const ChapterEntity({
    required this.id,
    required this.subjectId,
    required this.name,
    required this.unitName,
    this.totalQuestions = 0,
    this.solvedQuestions = 0,
  });

  double get progress => totalQuestions > 0 ? solvedQuestions / totalQuestions : 0.0;
}
