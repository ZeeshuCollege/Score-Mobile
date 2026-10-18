enum MistakeType {
  sillyMistake,
  conceptualGap,
  calculationError,
  ranOutOfTime,
}

extension MistakeTypeX on MistakeType {
  String get label {
    switch (this) {
      case MistakeType.sillyMistake:
        return 'Silly Mistake';
      case MistakeType.conceptualGap:
        return 'Conceptual Gap';
      case MistakeType.calculationError:
        return 'Calculation Error';
      case MistakeType.ranOutOfTime:
        return 'Ran Out of Time';
    }
  }
}

class MistakeEntity {
  final String id;
  final String questionId;
  final MistakeType mistakeType;
  final String notes;
  final int reviewStage; // 1 to 5 for spaced repetition
  final DateTime nextReviewDate;
  final DateTime createdAt;

  const MistakeEntity({
    required this.id,
    required this.questionId,
    required this.mistakeType,
    required this.notes,
    this.reviewStage = 1,
    required this.nextReviewDate,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'question_id': questionId,
      'mistake_type': mistakeType.name,
      'notes': notes,
      'review_stage': reviewStage,
      'next_review_date': nextReviewDate.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory MistakeEntity.fromMap(Map<String, dynamic> map) {
    return MistakeEntity(
      id: map['id'] as String,
      questionId: map['question_id'] as String,
      mistakeType: MistakeType.values.firstWhere(
        (e) => e.name == map['mistake_type'],
        orElse: () => MistakeType.sillyMistake,
      ),
      notes: (map['notes'] as String?) ?? '',
      reviewStage: (map['review_stage'] as int?) ?? 1,
      nextReviewDate: DateTime.parse(map['next_review_date'] as String),
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }
}
