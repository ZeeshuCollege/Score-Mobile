import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/question_entity.dart';
import '../../domain/entities/mistake_entity.dart';
import '../common/katex_math_view.dart';
import '../common/option_card.dart';

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
  MistakeType? _selectedMistakeType;

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
      _checkBookmark(qs.first.id);
    }
  }

  Future<void> _checkBookmark(String questionId) async {
    final bookmarked = await AppDatabase.instance.isBookmarked(questionId);
    setState(() => _isBookmarked = bookmarked);
  }

  void _resetQuestionState() {
    setState(() {
      _selectedOption = null;
      _isSubmitted = false;
      _selectedMistakeType = null;
      _numericalController.clear();
    });
    if (_questions.isNotEmpty) {
      _checkBookmark(_questions[_currentIndex].id);
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.title)),
        body: const Center(child: CircularProgressIndicator(color: AppColors.brandBlue)),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.title)),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.menu_book_rounded, size: 64, color: textSecondary),
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
            Text(widget.title, style: AppTypography.titleMedium(textPrimary)),
            Text(
              '${currentQ.year} · ${currentQ.shift}',
              style: AppTypography.labelSmall(AppColors.brandBlue),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
              color: _isBookmarked ? AppColors.reviewAmber : textSecondary,
            ),
            onPressed: () async {
              await AppDatabase.instance.toggleBookmark(currentQ.id);
              _checkBookmark(currentQ.id);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question Progress & Badge Indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'Q ${_currentIndex + 1} of ${_questions.length}',
                    style: AppTypography.monoNumber(AppColors.brandBlue, fontSize: 13),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: currentQ.difficulty == DifficultyLevel.easy
                        ? AppColors.correctGreen.withValues(alpha: 0.15)
                        : (currentQ.difficulty == DifficultyLevel.hard
                            ? AppColors.errorRed.withValues(alpha: 0.15)
                            : AppColors.reviewAmber.withValues(alpha: 0.15)),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    currentQ.difficulty.name.toUpperCase(),
                    style: AppTypography.labelSmall(
                      currentQ.difficulty == DifficultyLevel.easy
                          ? AppColors.correctGreen
                          : (currentQ.difficulty == DifficultyLevel.hard
                              ? AppColors.errorRed
                              : AppColors.reviewAmber),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Question Text with KaTeX formulas
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

            // Options Section
            if (currentQ.questionType == QuestionType.numerical) ...[
              // Numerical Input Field
              Text('Enter numerical answer:', style: AppTypography.labelLarge(textSecondary)),
              const SizedBox(height: 8),
              TextField(
                controller: _numericalController,
                keyboardType: TextInputType.number,
                enabled: !_isSubmitted,
                style: AppTypography.monoNumber(textPrimary, fontSize: 18),
                decoration: InputDecoration(
                  hintText: 'e.g. 42',
                  filled: true,
                  fillColor: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ] else ...[
              // Multiple Choice Option Cards (A, B, C, D)
              for (int i = 0; i < currentQ.options.length; i++) ...[
                Builder(builder: (context) {
                  final label = String.fromCharCode(65 + i); // 'A', 'B', 'C', 'D'
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
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isCorrect
                      ? (isDark ? AppColors.correctGreenSurfaceDark : AppColors.correctGreenSurfaceLight)
                      : (isDark ? AppColors.errorRedSurfaceDark : AppColors.errorRedSurfaceLight),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isCorrect ? AppColors.correctGreen : AppColors.errorRed,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          isCorrect ? Icons.check_circle_rounded : Icons.cancel_rounded,
                          color: isCorrect ? AppColors.correctGreen : AppColors.errorRed,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          isCorrect ? 'Correct Answer!' : 'Incorrect Answer',
                          style: AppTypography.titleMedium(
                            isCorrect ? AppColors.correctGreen : AppColors.errorRed,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text('Detailed Solution:', style: AppTypography.labelLarge(textPrimary)),
                    const SizedBox(height: 6),
                    KaTeXMathView(
                      text: currentQ.solutionText,
                      baseStyle: AppTypography.bodyMedium(textPrimary),
                    ),

                    if (!isCorrect) ...[
                      const Divider(height: 24),
                      Text('Tag this mistake for revision:', style: AppTypography.labelSmall(textSecondary)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        children: MistakeType.values.map((type) {
                          final isSelected = _selectedMistakeType == type;
                          return ChoiceChip(
                            label: Text(type.label),
                            selected: isSelected,
                            onSelected: (_) => _logMistake(currentQ.id, type),
                            selectedColor: AppColors.errorRed.withValues(alpha: 0.2),
                            labelStyle: AppTypography.labelSmall(
                              isSelected ? AppColors.errorRed : textSecondary,
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
                if (_currentIndex > 0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _prevQuestion,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Previous'),
                    ),
                  ),
                if (_currentIndex > 0) const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: _isSubmitted ? _nextQuestion : _submitAnswer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.brandBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(_isSubmitted
                        ? (_currentIndex < _questions.length - 1 ? 'Next Question' : 'Completed')
                        : 'Check Answer'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
