import 'dart:convert';
import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/mistake_entity.dart';
import '../../domain/entities/question_entity.dart';
import '../common/katex_math_view.dart';

class TestResultAnalysisScreen extends StatefulWidget {
  final String testTitle;
  final List<QuestionEntity> questions;
  final Map<String, String> responses;
  final Map<String, int> timeSpent;
  final int totalDurationMinutes;

  const TestResultAnalysisScreen({
    super.key,
    required this.testTitle,
    required this.questions,
    required this.responses,
    required this.timeSpent,
    required this.totalDurationMinutes,
  });

  @override
  State<TestResultAnalysisScreen> createState() => _TestResultAnalysisScreenState();
}

class _TestResultAnalysisScreenState extends State<TestResultAnalysisScreen> {
  int _correctCount = 0;
  int _incorrectCount = 0;
  int _unattemptedCount = 0;
  double _totalScore = 0;
  int _totalTimeSeconds = 0;

  @override
  void initState() {
    super.initState();
    _calculateResultsAndPersist();
  }

  Future<void> _calculateResultsAndPersist() async {
    int correct = 0;
    int incorrect = 0;
    int unattempted = 0;
    double score = 0;
    int totalTime = 0;

    for (final q in widget.questions) {
      final userAns = widget.responses[q.id];
      final spent = widget.timeSpent[q.id] ?? 0;
      totalTime += spent;

      if (userAns == null || userAns.isEmpty) {
        unattempted++;
      } else if (userAns.trim().toUpperCase() == q.correctAnswer.trim().toUpperCase()) {
        correct++;
        score += 4.0; // NTA Marking Scheme: +4
      } else {
        incorrect++;
        score -= 1.0; // NTA Marking Scheme: -1
      }
    }

    setState(() {
      _correctCount = correct;
      _incorrectCount = incorrect;
      _unattemptedCount = unattempted;
      _totalScore = score;
      _totalTimeSeconds = totalTime;
    });

    // Persist attempt to SQLite test_attempts table
    final db = await AppDatabase.instance.database;
    await db.insert('test_attempts', {
      'id': 'att_${DateTime.now().millisecondsSinceEpoch}',
      'test_title': widget.testTitle,
      'total_questions': widget.questions.length,
      'correct_count': correct,
      'incorrect_count': incorrect,
      'unattempted_count': unattempted,
      'score': score,
      'total_time_seconds': totalTime,
      'submitted_at': DateTime.now().toIso8601String(),
      'responses_json': jsonEncode(widget.responses),
    });
  }

  Future<void> _logMistake(String questionId, MistakeType type) async {
    final mistake = MistakeEntity(
      id: 'm_${DateTime.now().millisecondsSinceEpoch}',
      questionId: questionId,
      mistakeType: type,
      notes: 'Logged from ${widget.testTitle}',
      reviewStage: 1,
      nextReviewDate: DateTime.now().add(const Duration(days: 1)),
      createdAt: DateTime.now(),
    );
    await AppDatabase.instance.logMistake(mistake);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Added to Mistake Notebook (${type.label})')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    final totalQuestions = widget.questions.length;
    final attemptedCount = _correctCount + _incorrectCount;
    final accuracy = attemptedCount > 0
        ? ((_correctCount / attemptedCount) * 100).toStringAsFixed(1)
        : '0.0';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Test Analysis Report'),
        automaticallyImplyLeading: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Scorecard Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: _totalScore >= 0
                      ? [const Color(0xFF1E3A8A), AppColors.brandBlue]
                      : [const Color(0xFF7F1D1D), AppColors.errorRed],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  Text(
                    widget.testTitle,
                    style: const TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${_totalScore.toInt()} / ${totalQuestions * 4}',
                    style: AppTypography.displayLarge(Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Accuracy: $accuracy%',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Performance Metrics Grid
            Row(
              children: [
                _metricTile('Correct', '+$_correctCount', AppColors.correctGreen),
                const SizedBox(width: 8),
                _metricTile('Incorrect', '-$_incorrectCount', AppColors.errorRed),
                const SizedBox(width: 8),
                _metricTile('Skipped', '$_unattemptedCount', Colors.grey),
                const SizedBox(width: 8),
                _metricTile('Time', '${_totalTimeSeconds ~/ 60}m ${_totalTimeSeconds % 60}s', AppColors.brandBlue),
              ],
            ),
            const SizedBox(height: 24),

            // Question by Question Review Header
            Text('Question Review & Solutions', style: AppTypography.titleLarge(textPrimary)),
            const SizedBox(height: 4),
            Text('Review answers and tag mistakes for spaced repetition',
                style: AppTypography.bodySmall(textSecondary)),
            const SizedBox(height: 14),

            // Question Review List
            for (int i = 0; i < widget.questions.length; i++) ...[
              _buildQuestionReviewCard(widget.questions[i], i, textPrimary, textSecondary, isDark),
              const SizedBox(height: 12),
            ],
          ],
        ),
      ),
    );
  }

  Widget _metricTile(String label, String value, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          child: Column(
            children: [
              Text(
                value,
                style: AppTypography.titleLarge(color),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: AppTypography.labelSmall(AppColors.lightTextSecondary),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuestionReviewCard(
    QuestionEntity q,
    int index,
    Color textPrimary,
    Color textSecondary,
    bool isDark,
  ) {
    final userAns = widget.responses[q.id];
    final isAttempted = userAns != null && userAns.isNotEmpty;
    final isCorrect = isAttempted && (userAns.trim().toUpperCase() == q.correctAnswer.trim().toUpperCase());

    Color badgeColor;
    String statusText;

    if (!isAttempted) {
      badgeColor = Colors.grey;
      statusText = 'Unattempted (0)';
    } else if (isCorrect) {
      badgeColor = AppColors.correctGreen;
      statusText = 'Correct (+4)';
    } else {
      badgeColor = AppColors.errorRed;
      statusText = 'Incorrect (-1)';
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Q ${index + 1}', style: AppTypography.monoNumber(textPrimary, fontSize: 14)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: badgeColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    statusText,
                    style: AppTypography.labelSmall(badgeColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Question text
            KaTeXMathView(
              text: q.questionText,
              baseStyle: AppTypography.bodyMedium(textPrimary),
            ),
            const SizedBox(height: 12),

            // User Answer vs Correct Answer
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Your Answer: ${userAns ?? "None"}',
                      style: TextStyle(
                        color: isCorrect ? AppColors.correctGreen : (isAttempted ? AppColors.errorRed : textSecondary),
                        fontWeight: FontWeight.bold,
                      )),
                  Text('Correct: ${q.correctAnswer}',
                      style: const TextStyle(
                        color: AppColors.correctGreen,
                        fontWeight: FontWeight.bold,
                      )),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Detailed Solution
            Text('Solution:', style: AppTypography.labelLarge(textPrimary)),
            const SizedBox(height: 4),
            KaTeXMathView(
              text: q.solutionText,
              baseStyle: AppTypography.bodySmall(textSecondary),
            ),

            // Mistake Tagging Actions for incorrect questions
            if (!isCorrect) ...[
              const Divider(height: 20),
              Text('Tag Mistake to Notebook:', style: AppTypography.labelSmall(textSecondary)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: MistakeType.values.map((type) {
                  return ActionChip(
                    label: Text(type.label),
                    labelStyle: AppTypography.labelSmall(AppColors.errorRed),
                    backgroundColor: AppColors.errorRed.withValues(alpha: 0.1),
                    onPressed: () => _logMistake(q.id, type),
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
