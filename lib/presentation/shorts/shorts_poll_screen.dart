import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/question_entity.dart';
import '../common/katex_math_view.dart';

class ShortsPollScreen extends StatefulWidget {
  final String examId;

  const ShortsPollScreen({
    super.key,
    this.examId = 'jee_main',
  });

  @override
  State<ShortsPollScreen> createState() => _ShortsPollScreenState();
}

class _ShortsPollScreenState extends State<ShortsPollScreen> {
  final PageController _pageController = PageController();
  List<QuestionEntity> _questions = [];
  bool _isLoading = true;

  // Selected option map: questionId -> selectedLabel
  final Map<String, String> _userSelections = {};
  // Timer per active question
  int _secondsLeft = 45;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _loadQuestions() async {
    setState(() => _isLoading = true);
    final qs = await AppDatabase.instance.getQuestions(examId: widget.examId);
    setState(() {
      _questions = qs;
      _isLoading = false;
    });
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _secondsLeft = 45;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        _timer?.cancel();
      }
    });
  }

  void _onOptionSelected(String questionId, String label) {
    if (_userSelections.containsKey(questionId)) return;
    HapticFeedback.mediumImpact();
    setState(() {
      _userSelections[questionId] = label;
    });
  }

  void _onPageChanged(int index) {
    _startTimer();
  }

  // Simulated poll percentages for each option (A, B, C, D)
  Map<String, int> _getPollStats(QuestionEntity q) {
    if (q.correctAnswer == 'A') return {'A': 64, 'B': 18, 'C': 11, 'D': 7};
    if (q.correctAnswer == 'B') return {'A': 14, 'B': 71, 'C': 9, 'D': 6};
    if (q.correctAnswer == 'C') return {'A': 12, 'B': 16, 'C': 63, 'D': 9};
    return {'A': 8, 'B': 14, 'C': 12, 'D': 66};
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quick Polls')),
        body: const Center(child: CupertinoActivityIndicator(radius: 14)),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quick Polls')),
        body: const Center(child: Text('No poll questions found.')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(CupertinoIcons.bolt_fill, color: AppColors.systemOrange, size: 18),
            const SizedBox(width: 6),
            Text('Quick Polls · Shorts', style: AppTypography.headlineSmall(textPrimary)),
          ],
        ),
        actions: [
          // 45s countdown badge
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: (_secondsLeft <= 10 ? AppColors.errorRed : AppColors.systemBlue).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: _secondsLeft <= 10 ? AppColors.errorRed : AppColors.systemBlue,
                width: 0.8,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  CupertinoIcons.timer,
                  size: 14,
                  color: _secondsLeft <= 10 ? AppColors.errorRed : AppColors.systemBlue,
                ),
                const SizedBox(width: 4),
                Text(
                  '${_secondsLeft}s',
                  style: AppTypography.monoNumber(
                    _secondsLeft <= 10 ? AppColors.errorRed : AppColors.systemBlue,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: PageView.builder(
        controller: _pageController,
        scrollDirection: Axis.vertical,
        itemCount: _questions.length,
        onPageChanged: _onPageChanged,
        itemBuilder: (context, index) {
          final q = _questions[index];
          final selectedOption = _userSelections[q.id];
          final hasVoted = selectedOption != null;
          final stats = _getPollStats(q);

          return Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Meta Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.systemBlue.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '#${index + 1} · ${q.subjectId.toUpperCase()}',
                        style: AppTypography.monoNumber(AppColors.systemBlue, fontSize: 12),
                      ),
                    ),
                    Text(
                      '${q.year} Shift ${q.shift}',
                      style: AppTypography.labelSmall(textSecondary),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Question Box
                Expanded(
                  flex: 3,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                        width: 0.5,
                      ),
                    ),
                    child: SingleChildScrollView(
                      child: KaTeXMathView(
                        text: q.questionText,
                        baseStyle: AppTypography.bodyLarge(textPrimary).copyWith(fontSize: 18),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Poll Options (A, B, C, D)
                Expanded(
                  flex: 4,
                  child: ListView.separated(
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: q.options.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, optIndex) {
                      final label = String.fromCharCode(65 + optIndex);
                      final isSelected = selectedOption == label;
                      final isCorrect = label == q.correctAnswer;
                      final percentage = stats[label] ?? 0;

                      Color borderColor;
                      Color fillColor;

                      if (!hasVoted) {
                        borderColor = isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke;
                        fillColor = isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface;
                      } else if (isCorrect) {
                        borderColor = AppColors.correctGreen;
                        fillColor = AppColors.correctGreen.withValues(alpha: 0.15);
                      } else if (isSelected) {
                        borderColor = AppColors.errorRed;
                        fillColor = AppColors.errorRed.withValues(alpha: 0.15);
                      } else {
                        borderColor = isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke;
                        fillColor = isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface;
                      }

                      return GestureDetector(
                        onTap: () => _onOptionSelected(q.id, label),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 220),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: fillColor,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: borderColor, width: isSelected || (hasVoted && isCorrect) ? 1.5 : 0.5),
                          ),
                          child: Stack(
                            children: [
                              // Poll percentage meter fill if voted
                              if (hasVoted)
                                Positioned.fill(
                                  child: FractionallySizedBox(
                                    alignment: Alignment.centerLeft,
                                    widthFactor: (percentage / 100.0).clamp(0.0, 1.0),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: (isCorrect ? AppColors.correctGreen : (isSelected ? AppColors.errorRed : textSecondary)).withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                    ),
                                  ),
                                ),
                              Row(
                                children: [
                                  Container(
                                    width: 28,
                                    height: 28,
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? (isCorrect ? AppColors.correctGreen : AppColors.errorRed)
                                          : (isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA)),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      label,
                                      style: TextStyle(
                                        color: isSelected ? Colors.white : textPrimary,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      q.options[optIndex],
                                      style: AppTypography.bodyMedium(textPrimary).copyWith(fontWeight: FontWeight.w500),
                                    ),
                                  ),
                                  if (hasVoted) ...[
                                    const SizedBox(width: 8),
                                    Text(
                                      '$percentage%',
                                      style: AppTypography.monoNumber(
                                        isCorrect ? AppColors.correctGreen : (isSelected ? AppColors.errorRed : textSecondary),
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Bottom Indicator: Swipe Up for Next
                Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(CupertinoIcons.chevron_up, size: 14, color: textSecondary),
                      const SizedBox(width: 4),
                      Text(
                        'Swipe up for next poll',
                        style: AppTypography.labelSmall(textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
