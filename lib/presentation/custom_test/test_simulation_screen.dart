import 'dart:async';
import 'package:flutter/cupertino.dart';
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
    HapticFeedback.lightImpact();
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
    HapticFeedback.selectionClick();
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
    HapticFeedback.lightImpact();
    final currentQ = _testQuestions[_currentQuestionIndex];
    setState(() {
      _responses.remove(currentQ.id);
      _statuses[currentQ.id] = QuestionStatus.notAnswered;
      _numericalController.clear();
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
      final q = _testQuestions[index];
      if (_statuses[q.id] == QuestionStatus.notVisited) {
        _statuses[q.id] = QuestionStatus.notAnswered;
      }
      if (q.questionType == QuestionType.numerical) {
        _numericalController.text = _responses[q.id] ?? '';
      }
    });
  }

  void _confirmSubmitDialog() {
    HapticFeedback.mediumImpact();
    int answeredCount = 0;
    int markedCount = 0;
    int unvisitedCount = 0;

    for (final q in _testQuestions) {
      final s = _statuses[q.id];
      if (s == QuestionStatus.answered || s == QuestionStatus.answeredAndMarkedForReview) {
        answeredCount++;
      } else if (s == QuestionStatus.markedForReview) {
        markedCount++;
      } else {
        unvisitedCount++;
      }
    }

    showCupertinoDialog(
      context: context,
      builder: (ctx) => CupertinoAlertDialog(
        title: const Text('Submit Test?'),
        content: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Time Remaining: ${_formatTime(_remainingSeconds)}'),
              const SizedBox(height: 8),
              Text('• Answered: $answeredCount',
                  style: const TextStyle(color: AppColors.correctGreen, fontWeight: FontWeight.bold)),
              Text('• Marked for Review: $markedCount',
                  style: const TextStyle(color: AppColors.systemOrange, fontWeight: FontWeight.bold)),
              Text('• Unattempted: $unvisitedCount',
                  style: const TextStyle(color: AppColors.errorRed, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        actions: [
          CupertinoDialogAction(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          CupertinoDialogAction(
            isDestructiveAction: false,
            isDefaultAction: true,
            onPressed: () {
              Navigator.pop(ctx);
              _finishTest();
            },
            child: const Text('Confirm Submit'),
          ),
        ],
      ),
    );
  }

  void _autoSubmitTest() {
    _finishTest();
  }

  void _finishTest() {
    _timer?.cancel();
    Navigator.pushReplacement(
      context,
      CupertinoPageRoute(
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
    HapticFeedback.lightImpact();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // iOS Drag Handle
              Center(
                child: Container(
                  width: 36,
                  height: 5,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF3A3A3C) : const Color(0xFFD1D1D6),
                    borderRadius: BorderRadius.circular(2.5),
                  ),
                ),
              ),
              const SizedBox(height: 14),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Question Palette', style: AppTypography.headlineSmall(isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary)),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    onPressed: () => Navigator.pop(context),
                    child: Icon(CupertinoIcons.xmark_circle_fill, size: 24, color: isDark ? Colors.white38 : Colors.black26),
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
                  _legendItem(AppColors.systemOrange, 'Review'),
                  _legendItem(AppColors.errorRed, 'Not Answered'),
                  _legendItem(isDark ? Colors.white38 : Colors.grey, 'Not Visited'),
                ],
              ),
              const SizedBox(height: 14),
              Divider(height: 1, color: isDark ? AppColors.darkHairline : AppColors.lightHairline),
              const SizedBox(height: 14),

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
                      bg = AppColors.systemOrange;
                      break;
                    case QuestionStatus.notAnswered:
                      bg = AppColors.errorRed;
                      break;
                    case QuestionStatus.notVisited:
                      bg = isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA);
                      textCol = isDark ? Colors.white : Colors.black87;
                      break;
                  }

                  final isCurrent = idx == _currentQuestionIndex;

                  return GestureDetector(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      Navigator.pop(context);
                      _jumpToQuestion(idx);
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(12),
                        border: isCurrent
                            ? Border.all(color: AppColors.systemBlue, width: 2.5)
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
              const SizedBox(height: 16),
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
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3)),
        ),
        const SizedBox(width: 5),
        Text(text, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CupertinoActivityIndicator(radius: 14)),
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
            CupertinoButton(
              padding: EdgeInsets.zero,
              minimumSize: Size.zero,
              onPressed: _openQuestionPalette,
              child: Icon(
                CupertinoIcons.square_grid_2x2,
                color: AppColors.systemBlue,
                size: 22,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              'Q ${_currentQuestionIndex + 1} / ${_testQuestions.length}',
              style: AppTypography.headlineSmall(textPrimary).copyWith(fontSize: 17),
            ),
          ],
        ),
        actions: [
          // Live Countdown Timer
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: isTimeRunningLow
                  ? AppColors.errorRed.withValues(alpha: 0.14)
                  : AppColors.systemBlue.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
              border: isTimeRunningLow
                  ? Border.all(color: AppColors.errorRed, width: 1.0)
                  : null,
            ),
            child: Row(
              children: [
                Icon(
                  CupertinoIcons.timer,
                  size: 15,
                  color: isTimeRunningLow ? AppColors.errorRed : AppColors.systemBlue,
                ),
                const SizedBox(width: 4),
                Text(
                  _formatTime(_remainingSeconds),
                  style: AppTypography.monoNumber(
                    isTimeRunningLow ? AppColors.errorRed : AppColors.systemBlue,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          CupertinoButton(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            minimumSize: Size.zero,
            onPressed: _confirmSubmitDialog,
            child: const Text('SUBMIT', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.errorRed, fontSize: 13)),
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question Subject & Shift Header
            Text(
              '${currentQ.subjectId.toUpperCase()} · ${currentQ.year}',
              style: AppTypography.labelSmall(AppColors.systemBlue),
            ),
            const SizedBox(height: 10),

            // Question Card with LaTeX math
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                  width: 0.5,
                ),
              ),
              child: KaTeXMathView(
                text: currentQ.questionText,
                baseStyle: AppTypography.bodyLarge(textPrimary),
              ),
            ),
            const SizedBox(height: 18),

            // Options
            if (currentQ.questionType == QuestionType.numerical) ...[
              Padding(
                padding: const EdgeInsets.only(left: 4, bottom: 8),
                child: Text('Enter Integer Answer:', style: AppTypography.subhead(textSecondary)),
              ),
              Container(
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                    width: 0.5,
                  ),
                ),
                child: TextField(
                  controller: _numericalController,
                  keyboardType: TextInputType.number,
                  style: AppTypography.monoNumber(textPrimary, fontSize: 18),
                  decoration: const InputDecoration(
                    hintText: 'e.g. 4',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
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
              color: isDark ? AppColors.darkHairline : AppColors.lightHairline,
              width: 0.5,
            ),
          ),
        ),
        child: SafeArea(
          top: false,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CupertinoButton(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                minimumSize: Size.zero,
                color: isDark ? AppColors.darkGroupedBackground : AppColors.lightGroupedBackground,
                borderRadius: BorderRadius.circular(12),
                onPressed: _clearResponse,
                child: Text('Clear', style: TextStyle(color: textSecondary, fontSize: 14, fontWeight: FontWeight.w500)),
              ),
              CupertinoButton(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                minimumSize: Size.zero,
                color: AppColors.systemOrange.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
                onPressed: _markForReviewAndNext,
                child: const Text('Mark & Next', style: TextStyle(color: AppColors.systemOrange, fontSize: 14, fontWeight: FontWeight.w600)),
              ),
              CupertinoButton.filled(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                minimumSize: Size.zero,
                borderRadius: BorderRadius.circular(12),
                onPressed: _saveAndNext,
                child: const Text('Save & Next', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
