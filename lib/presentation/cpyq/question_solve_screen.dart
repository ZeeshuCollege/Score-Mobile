import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/question_entity.dart';
import '../../domain/entities/mistake_entity.dart';
import '../common/katex_math_view.dart';
import '../common/option_card.dart';
import '../common/apple_segmented_control.dart';

class QuestionSolveScreen extends StatefulWidget {
  final String title;
  final String? examId;
  final String? subjectId;
  final String? chapterId;

  const QuestionSolveScreen({
    super.key,
    required this.title,
    this.examId,
    this.subjectId,
    this.chapterId,
  });

  @override
  State<QuestionSolveScreen> createState() => _QuestionSolveScreenState();
}

class _QuestionSolveScreenState extends State<QuestionSolveScreen> {
  List<QuestionEntity> _questions = [];
  int _currentIndex = 0;
  bool _isLoading = true;

  // Solving State for current question
  String? _selectedOption; // 'A', 'B', 'C', 'D' or numerical text
  bool _isSubmitted = false;
  bool _isBookmarked = false;
  String? _currentNote;
  MistakeType? _selectedMistakeType;
  int _solutionTab = 0; // 0 = Official, 1 = Community Shortcut

  final TextEditingController _numericalController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  @override
  void dispose() {
    _numericalController.dispose();
    super.dispose();
  }

  Future<void> _loadQuestions() async {
    setState(() => _isLoading = true);
    final qs = await AppDatabase.instance.getQuestions(
      examId: widget.examId,
      subjectId: widget.subjectId,
      chapterId: widget.chapterId,
    );

    setState(() {
      _questions = qs;
      _isLoading = false;
      _currentIndex = 0;
    });

    if (qs.isNotEmpty) {
      _checkBookmarkAndNote(qs.first.id);
    }
  }

  Future<void> _checkBookmarkAndNote(String questionId) async {
    final bookmarked = await AppDatabase.instance.isBookmarked(questionId);
    final note = await AppDatabase.instance.getQuestionNote(questionId);
    setState(() {
      _isBookmarked = bookmarked;
      _currentNote = note;
    });
  }

  void _resetQuestionState() {
    setState(() {
      _selectedOption = null;
      _isSubmitted = false;
      _selectedMistakeType = null;
      _solutionTab = 0;
      _numericalController.clear();
    });
    if (_questions.isNotEmpty) {
      _checkBookmarkAndNote(_questions[_currentIndex].id);
    }
  }

  void _submitAnswer() {
    if (_selectedOption == null && _numericalController.text.trim().isEmpty) return;

    HapticFeedback.mediumImpact();
    setState(() {
      _isSubmitted = true;
      if (_questions[_currentIndex].questionType == QuestionType.numerical) {
        _selectedOption = _numericalController.text.trim();
      }
    });

    final currentQ = _questions[_currentIndex];
    final isCorrect = _selectedOption?.toUpperCase() == currentQ.correctAnswer.toUpperCase();

    // If incorrect, automatically prepare mistake logging
    if (!isCorrect) {
      _logMistake(currentQ.id, MistakeType.sillyMistake);
    }
  }

  Future<void> _logMistake(String questionId, MistakeType type) async {
    final mistake = MistakeEntity(
      id: 'm_${DateTime.now().millisecondsSinceEpoch}',
      questionId: questionId,
      mistakeType: type,
      notes: 'Logged during Practice Mode',
      reviewStage: 1,
      nextReviewDate: DateTime.now().add(const Duration(days: 1)),
      createdAt: DateTime.now(),
    );
    await AppDatabase.instance.logMistake(mistake);
    setState(() => _selectedMistakeType = type);
  }

  void _nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      setState(() => _currentIndex++);
      _resetQuestionState();
    }
  }

  void _prevQuestion() {
    if (_currentIndex > 0) {
      setState(() => _currentIndex--);
      _resetQuestionState();
    }
  }

  void _openNoteSheet(QuestionEntity q) {
    HapticFeedback.lightImpact();
    final controller = TextEditingController(text: _currentNote ?? '');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                    Text('Revision Note', style: AppTypography.headlineSmall(isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary)),
                    CupertinoButton(
                      padding: EdgeInsets.zero,
                      minimumSize: Size.zero,
                      onPressed: () async {
                        HapticFeedback.lightImpact();
                        await AppDatabase.instance.saveQuestionNote(q.id, controller.text);
                        final updated = await AppDatabase.instance.getQuestionNote(q.id);
                        if (mounted) {
                          setState(() => _currentNote = updated);
                        }
                        if (ctx.mounted) {
                          Navigator.pop(ctx);
                        }
                      },
                      child: const Text('Save', style: TextStyle(color: AppColors.systemBlue, fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Add custom hints, caveats, or shortcuts for this question.', style: AppTypography.subhead(isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary)),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkGroupedBackground : AppColors.lightGroupedBackground,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: TextField(
                    controller: controller,
                    maxLines: 4,
                    autofocus: true,
                    style: AppTypography.bodyMedium(isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
                    decoration: const InputDecoration(
                      hintText: 'e.g. Remember to check temperature in Kelvin! Use L\'Hopital for limit 0/0 form.',
                      border: InputBorder.none,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.title)),
        body: const Center(child: CupertinoActivityIndicator(radius: 14)),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.title)),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(CupertinoIcons.book, size: 60, color: textSecondary),
              const SizedBox(height: 16),
              Text('No questions found for this selection', style: AppTypography.titleMedium(textPrimary)),
            ],
          ),
        ),
      );
    }

    final currentQ = _questions[_currentIndex];
    final isCorrect = _isSubmitted &&
        (_selectedOption?.toUpperCase() == currentQ.correctAnswer.toUpperCase());

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.title, style: AppTypography.headlineSmall(textPrimary).copyWith(fontSize: 17)),
            Text(
              '${currentQ.year} · ${currentQ.shift}',
              style: AppTypography.labelSmall(AppColors.systemBlue),
            ),
          ],
        ),
        actions: [
          // Revision Note Action
          CupertinoButton(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            minimumSize: Size.zero,
            onPressed: () => _openNoteSheet(currentQ),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  CupertinoIcons.pencil_ellipsis_rectangle,
                  color: _currentNote != null && _currentNote!.isNotEmpty ? AppColors.systemBlue : textSecondary,
                  size: 22,
                ),
                if (_currentNote != null && _currentNote!.isNotEmpty)
                  Positioned(
                    top: -2,
                    right: -2,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(color: AppColors.systemBlue, shape: BoxShape.circle),
                    ),
                  ),
              ],
            ),
          ),
          // Bookmark Action
          CupertinoButton(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            minimumSize: Size.zero,
            onPressed: () async {
              HapticFeedback.lightImpact();
              await AppDatabase.instance.toggleBookmark(currentQ.id);
              _checkBookmarkAndNote(currentQ.id);
            },
            child: Icon(
              _isBookmarked ? CupertinoIcons.bookmark_fill : CupertinoIcons.bookmark,
              color: _isBookmarked ? AppColors.systemOrange : textSecondary,
              size: 22,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question Progress & Badge Indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.systemBlue.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Q ${_currentIndex + 1} of ${_questions.length}',
                    style: AppTypography.monoNumber(AppColors.systemBlue, fontSize: 13),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: currentQ.difficulty == DifficultyLevel.easy
                        ? AppColors.correctGreen.withValues(alpha: 0.14)
                        : (currentQ.difficulty == DifficultyLevel.hard
                            ? AppColors.errorRed.withValues(alpha: 0.14)
                            : AppColors.systemOrange.withValues(alpha: 0.14)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    currentQ.difficulty.name.toUpperCase(),
                    style: AppTypography.labelSmall(
                      currentQ.difficulty == DifficultyLevel.easy
                          ? AppColors.correctGreen
                          : (currentQ.difficulty == DifficultyLevel.hard
                              ? AppColors.errorRed
                              : AppColors.systemOrange),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Question Text with KaTeX formulas inside Apple HIG Squircle Card
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

            // Custom Note Banner (if present)
            if (_currentNote != null && _currentNote!.isNotEmpty) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.systemBlue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.systemBlue.withValues(alpha: 0.3), width: 0.5),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(CupertinoIcons.pin_fill, size: 16, color: AppColors.systemBlue),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('YOUR REVISION NOTE:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.systemBlue)),
                          const SizedBox(height: 2),
                          Text(_currentNote!, style: AppTypography.bodySmall(textPrimary)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
            ],

            // Options Section
            if (currentQ.questionType == QuestionType.numerical) ...[
              Padding(
                padding: const EdgeInsets.only(left: 4, bottom: 8),
                child: Text('Enter numerical answer:', style: AppTypography.subhead(textSecondary)),
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
                  enabled: !_isSubmitted,
                  style: AppTypography.monoNumber(textPrimary, fontSize: 18),
                  decoration: const InputDecoration(
                    hintText: 'e.g. 42',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                ),
              ),
            ] else ...[
              for (int i = 0; i < currentQ.options.length; i++) ...[
                Builder(builder: (context) {
                  final label = String.fromCharCode(65 + i);
                  OptionState cardState = OptionState.defaultState;

                  if (_isSubmitted) {
                    if (label == currentQ.correctAnswer) {
                      cardState = OptionState.correct;
                    } else if (_selectedOption == label) {
                      cardState = OptionState.incorrect;
                    }
                  } else if (_selectedOption == label) {
                    cardState = OptionState.selected;
                  }

                  return OptionCard(
                    label: label,
                    text: currentQ.options[i],
                    state: cardState,
                    onTap: !_isSubmitted
                        ? () => setState(() => _selectedOption = label)
                        : null,
                  );
                }),
              ],
            ],

            const SizedBox(height: 16),

            // Detailed Solution Panel (Revealed on Submit)
            if (_isSubmitted) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: isCorrect
                      ? (isDark ? AppColors.correctGreenSurfaceDark : AppColors.correctGreenSurfaceLight)
                      : (isDark ? AppColors.errorRedSurfaceDark : AppColors.errorRedSurfaceLight),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: (isCorrect ? AppColors.correctGreen : AppColors.errorRed).withValues(alpha: 0.4),
                    width: 0.5,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          isCorrect ? CupertinoIcons.checkmark_circle_fill : CupertinoIcons.xmark_circle_fill,
                          color: isCorrect ? AppColors.correctGreen : AppColors.errorRed,
                          size: 22,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          isCorrect ? 'Correct Answer!' : 'Incorrect Answer',
                          style: AppTypography.headlineSmall(
                            isCorrect ? AppColors.correctGreen : AppColors.errorRed,
                          ).copyWith(fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Solution Toggle: Official vs Community Shortcuts
                    AppleSegmentedControl<int>(
                      groupValue: _solutionTab,
                      children: {
                        0: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Text('Official Solution', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                        1: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(CupertinoIcons.sparkles, size: 14, color: AppColors.systemOrange),
                              const SizedBox(width: 4),
                              Text('Community Shortcut', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      },
                      onValueChanged: (val) {
                        if (val != null) {
                          HapticFeedback.selectionClick();
                          setState(() => _solutionTab = val);
                        }
                      },
                    ),
                    const SizedBox(height: 12),

                    if (_solutionTab == 0) ...[
                      KaTeXMathView(
                        text: currentQ.solutionText,
                        baseStyle: AppTypography.bodyMedium(textPrimary),
                      ),
                    ] else ...[
                      // Community Shortcut Card
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkGroupedBackground : AppColors.lightGroupedBackground,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Alternative 20-Second Method', style: AppTypography.labelLarge(AppColors.systemOrange)),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.correctGreen.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('▲ 842 Upvotes', style: TextStyle(color: AppColors.correctGreen, fontSize: 11, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Shortcut: Use Dimensional Analysis. Only Option ${currentQ.correctAnswer} has correct units of [ML²T⁻²]. No need to integrate the full equation!',
                              style: AppTypography.bodySmall(textPrimary),
                            ),
                          ],
                        ),
                      ),
                    ],

                    if (!isCorrect) ...[
                      const SizedBox(height: 14),
                      Divider(
                        height: 1,
                        color: isDark ? AppColors.darkHairline : AppColors.lightHairline,
                      ),
                      const SizedBox(height: 14),
                      Text('Tag mistake for spaced repetition:', style: AppTypography.labelSmall(textSecondary)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: MistakeType.values.map((type) {
                          final isSelected = _selectedMistakeType == type;
                          return GestureDetector(
                            onTap: () {
                              HapticFeedback.lightImpact();
                              _logMistake(currentQ.id, type);
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 180),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppColors.errorRed.withValues(alpha: 0.18)
                                    : (isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: isSelected
                                      ? AppColors.errorRed
                                      : (isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke),
                                  width: isSelected ? 1.0 : 0.5,
                                ),
                              ),
                              child: Text(
                                type.label,
                                style: AppTypography.labelSmall(
                                  isSelected ? AppColors.errorRed : textSecondary,
                                ).copyWith(fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Action Buttons Bar
            Row(
              children: [
                if (_currentIndex > 0) ...[
                  CupertinoButton(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    minimumSize: Size.zero,
                    color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                    borderRadius: BorderRadius.circular(14),
                    onPressed: _prevQuestion,
                    child: Icon(
                      CupertinoIcons.chevron_left,
                      color: textPrimary,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: CupertinoButton.filled(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    borderRadius: BorderRadius.circular(14),
                    onPressed: _isSubmitted ? _nextQuestion : _submitAnswer,
                    child: Text(
                      _isSubmitted
                          ? (_currentIndex < _questions.length - 1 ? 'Next Question' : 'Completed')
                          : 'Check Answer',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16 + MediaQuery.of(context).padding.bottom),
          ],
        ),
      ),
    );
  }
}
