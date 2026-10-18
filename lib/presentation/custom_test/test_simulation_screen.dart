import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/question_entity.dart';
import '../common/katex_math_view.dart';
import '../common/option_card.dart';
import 'test_result_analysis_screen.dart';

enum QuestionStatus {
  notVisited,
  notAnswered,
  answered,
  markedForReview,
  answeredAndMarkedForReview,
}

class TestSimulationScreen extends StatefulWidget {
  final String testTitle;
  final int durationMinutes;
  final String examId;
  final List<String> subjects;

  const TestSimulationScreen({
    super.key,
    required this.testTitle,
    required this.durationMinutes,
    required this.examId,
    required this.subjects,
  });

  @override
  State<TestSimulationScreen> createState() => _TestSimulationScreenState();
}

class _TestSimulationScreenState extends State<TestSimulationScreen> {
  List<QuestionEntity> _testQuestions = [];
  bool _isLoading = true;

  int _currentQuestionIndex = 0;
  late int _remainingSeconds;
  Timer? _timer;

  // Student Responses: Map<questionId, selectedOption>
  final Map<String, String> _responses = {};
  // Student Statuses: Map<questionId, QuestionStatus>
  final Map<String, QuestionStatus> _statuses = {};
  // Time Spent: Map<questionId, seconds>
  final Map<String, int> _timeSpentPerQuestion = {};

  final TextEditingController _numericalController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _remainingSeconds = widget.durationMinutes * 60;
    _loadTestQuestions();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _numericalController.dispose();
    super.dispose();
  }

  Future<void> _loadTestQuestions() async {
    setState(() => _isLoading = true);
    final qs = await AppDatabase.instance.getQuestions(examId: widget.examId);

    setState(() {
      _testQuestions = qs.isNotEmpty ? qs : [];
      for (final q in _testQuestions) {
        _statuses[q.id] = QuestionStatus.notVisited;
        _timeSpentPerQuestion[q.id] = 0;
      }
      if (_testQuestions.isNotEmpty) {
        _statuses[_testQuestions[0].id] = QuestionStatus.notAnswered;
      }
      _isLoading = false;
    });

    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
          if (_testQuestions.isNotEmpty) {
            final curQId = _testQuestions[_currentQuestionIndex].id;
            _timeSpentPerQuestion[curQId] =
                (_timeSpentPerQuestion[curQId] ?? 0) + 1;
          }
        });
      } else {
        _timer?.cancel();
        _autoSubmitTest();
      }
    });
  }

  String _formatTime(int totalSeconds) {
    final m = totalSeconds ~/ 60;
    final s = totalSeconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  void _saveAndNext() {
    final currentQ = _testQuestions[_currentQuestionIndex];
    String? response = _responses[currentQ.id];

    if (currentQ.questionType == QuestionType.numerical) {
      final val = _numericalController.text.trim();
      if (val.isNotEmpty) {
        response = val;
        _responses[currentQ.id] = val;
      }
    }

    setState(() {
      if (response != null && response.isNotEmpty) {
        _statuses[currentQ.id] = QuestionStatus.answered;
      } else {
        _statuses[currentQ.id] = QuestionStatus.notAnswered;
      }
    });

    _goToNextQuestion();
  }

  void _markForReviewAndNext() {
    final currentQ = _testQuestions[_currentQuestionIndex];
    final hasAnswer = _responses[currentQ.id] != null;

    setState(() {
      _statuses[currentQ.id] = hasAnswer
          ? QuestionStatus.answeredAndMarkedForReview
          : QuestionStatus.markedForReview;
    });

    _goToNextQuestion();
  }

  void _clearResponse() {
    final currentQ = _testQuestions[_currentQuestionIndex];
    setState(() {
      _responses.remove(currentQ.id);
      _numericalController.clear();
      _statuses[currentQ.id] = QuestionStatus.notAnswered;
    });
  }

  void _goToNextQuestion() {
    if (_currentQuestionIndex < _testQuestions.length - 1) {
      _jumpToQuestion(_currentQuestionIndex + 1);
    }
  }

  void _jumpToQuestion(int index) {
    setState(() {
      _currentQuestionIndex = index;
      final qId = _testQuestions[index].id;
      if (_statuses[qId] == QuestionStatus.notVisited) {
        _statuses[qId] = QuestionStatus.notAnswered;
      }

      final existingAns = _responses[qId];
      if (_testQuestions[index].questionType == QuestionType.numerical) {
        _numericalController.text = existingAns ?? '';
      }
    });
  }

  void _confirmSubmitDialog() {
    final answeredCount = _statuses.values
        .where((s) =>
            s == QuestionStatus.answered ||
            s == QuestionStatus.answeredAndMarkedForReview)
        .length;
    final markedCount = _statuses.values
        .where((s) =>
            s == QuestionStatus.markedForReview ||
            s == QuestionStatus.answeredAndMarkedForReview)
        .length;
    final unvisitedCount = _statuses.values
        .where((s) => s == QuestionStatus.notVisited || s == QuestionStatus.notAnswered)
        .length;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Submit Mock Test?'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Time Remaining: ${_formatTime(_remainingSeconds)}'),
            const SizedBox(height: 12),
            Text('• Answered: $answeredCount',
                style: const TextStyle(color: AppColors.correctGreen, fontWeight: FontWeight.bold)),
            Text('• Marked for Review: $markedCount',
                style: const TextStyle(color: AppColors.reviewAmber, fontWeight: FontWeight.bold)),
            Text('• Unattempted: $unvisitedCount',
                style: const TextStyle(color: AppColors.errorRed, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.brandBlue),
            onPressed: () {
              Navigator.pop(ctx);
              _finishTest();
            },
            child: const Text('Confirm Submit', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _autoSubmitTest() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Time expired! Auto-submitting test.')),
    );
    _finishTest();
  }

  void _finishTest() {
    _timer?.cancel();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => TestResultAnalysisScreen(
          testTitle: widget.testTitle,
          questions: _testQuestions,
          responses: _responses,
          timeSpent: _timeSpentPerQuestion,
          totalDurationMinutes: widget.durationMinutes,
        ),
      ),
    );
  }

  void _openQuestionPalette() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Question Palette', style: AppTypography.titleLarge(isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary)),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Legend
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  _legendItem(AppColors.correctGreen, 'Answered'),
                  _legendItem(AppColors.reviewAmber, 'Review'),
                  _legendItem(AppColors.errorRed, 'Not Answered'),
                  _legendItem(Colors.grey, 'Not Visited'),
                ],
              ),
              const Divider(height: 24),
              // Grid of question buttons
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 5,
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                ),
                itemCount: _testQuestions.length,
                itemBuilder: (ctx, idx) {
                  final qId = _testQuestions[idx].id;
                  final status = _statuses[qId] ?? QuestionStatus.notVisited;
                  Color bg;
                  Color textCol = Colors.white;

                  switch (status) {
                    case QuestionStatus.answered:
                    case QuestionStatus.answeredAndMarkedForReview:
                      bg = AppColors.correctGreen;
                      break;
                    case QuestionStatus.markedForReview:
                      bg = AppColors.reviewAmber;
                      break;
                    case QuestionStatus.notAnswered:
                      bg = AppColors.errorRed;
                      break;
                    case QuestionStatus.notVisited:
                      bg = isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);
                      textCol = isDark ? Colors.white : Colors.black;
                      break;
                  }

                  final isCurrent = idx == _currentQuestionIndex;

                  return InkWell(
                    onTap: () {
                      Navigator.pop(context);
                      _jumpToQuestion(idx);
                    },
                    child: Container(
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: bg,
                        shape: BoxShape.circle,
                        border: isCurrent
                            ? Border.all(color: AppColors.brandBlue, width: 3)
                            : null,
                      ),
                      child: Text(
                        '${idx + 1}',
                        style: AppTypography.monoNumber(textCol, fontSize: 13),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  Widget _legendItem(Color color, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.brandBlue)),
      );
    }

    if (_testQuestions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.testTitle)),
        body: const Center(child: Text('No questions available to generate test.')),
      );
    }

    final currentQ = _testQuestions[_currentQuestionIndex];
    final selectedOption = _responses[currentQ.id];
    final isTimeRunningLow = _remainingSeconds < 300; // < 5 mins

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            // Palette Button
            IconButton(
              icon: const Icon(Icons.grid_view_rounded),
              onPressed: _openQuestionPalette,
            ),
            const SizedBox(width: 4),
            Text(
              'Q ${_currentQuestionIndex + 1} / ${_testQuestions.length}',
              style: AppTypography.titleMedium(textPrimary),
            ),
          ],
        ),
        actions: [
          // Live Countdown Timer
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: isTimeRunningLow
                  ? AppColors.errorRed.withValues(alpha: 0.15)
                  : AppColors.brandBlue.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(8),
              border: isTimeRunningLow
                  ? Border.all(color: AppColors.errorRed, width: 1.5)
                  : null,
            ),
            child: Row(
              children: [
                Icon(
                  Icons.timer_outlined,
                  size: 16,
                  color: isTimeRunningLow ? AppColors.errorRed : AppColors.brandBlue,
                ),
                const SizedBox(width: 4),
                Text(
                  _formatTime(_remainingSeconds),
                  style: AppTypography.timer(
                    isTimeRunningLow ? AppColors.errorRed : AppColors.brandBlue,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          TextButton(
            onPressed: _confirmSubmitDialog,
            child: const Text('SUBMIT', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.errorRed)),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question Subject & Shift Header
            Text(
              '${currentQ.subjectId.toUpperCase()} · ${currentQ.year}',
              style: AppTypography.labelSmall(AppColors.brandBlue),
            ),
            const SizedBox(height: 10),

            // Question Card with LaTeX math
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                ),
              ),
              child: KaTeXMathView(
                text: currentQ.questionText,
                baseStyle: AppTypography.bodyLarge(textPrimary),
              ),
            ),
            const SizedBox(height: 20),

            // Options
            if (currentQ.questionType == QuestionType.numerical) ...[
              Text('Enter Integer Answer:', style: AppTypography.labelLarge(textPrimary)),
              const SizedBox(height: 8),
              TextField(
                controller: _numericalController,
                keyboardType: TextInputType.number,
                style: AppTypography.monoNumber(textPrimary, fontSize: 18),
                decoration: InputDecoration(
                  hintText: 'e.g. 4',
                  filled: true,
                  fillColor: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ] else ...[
              for (int i = 0; i < currentQ.options.length; i++) ...[
                Builder(builder: (ctx) {
                  final label = String.fromCharCode(65 + i);
                  final isSelected = selectedOption == label;
                  return OptionCard(
                    label: label,
                    text: currentQ.options[i],
                    state: isSelected ? OptionState.selected : OptionState.defaultState,
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() => _responses[currentQ.id] = label);
                    },
                  );
                }),
              ],
            ],
            const SizedBox(height: 24),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
          border: Border(
            top: BorderSide(
              color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
            ),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            OutlinedButton(
              onPressed: _clearResponse,
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Clear'),
            ),
            OutlinedButton(
              onPressed: _markForReviewAndNext,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.reviewAmber,
                side: const BorderSide(color: AppColors.reviewAmber),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Mark & Next'),
            ),
            ElevatedButton(
              onPressed: _saveAndNext,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Save & Next'),
            ),
          ],
        ),
      ),
    );
  }
}
