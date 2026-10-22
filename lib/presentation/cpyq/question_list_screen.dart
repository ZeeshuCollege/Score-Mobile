import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/question_entity.dart';
import '../common/katex_math_view.dart';
import 'question_solve_screen.dart';
import 'widgets/question_filter_sheet.dart';

class QuestionListScreen extends StatefulWidget {
  final String title;
  final String examId;
  final String subjectId;
  final String chapterId;

  const QuestionListScreen({
    super.key,
    required this.title,
    required this.examId,
    required this.subjectId,
    required this.chapterId,
  });

  @override
  State<QuestionListScreen> createState() => _QuestionListScreenState();
}

class _QuestionListScreenState extends State<QuestionListScreen> {
  List<QuestionEntity> _allQuestions = [];
  List<QuestionEntity> _filteredQuestions = [];
  bool _isLoading = true;
  QuestionFilterOptions _filters = const QuestionFilterOptions();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  Future<void> _loadQuestions() async {
    setState(() => _isLoading = true);
    final qs = await AppDatabase.instance.getQuestions(
      examId: widget.examId,
      subjectId: widget.subjectId,
      chapterId: widget.chapterId,
    );

    setState(() {
      _allQuestions = qs;
      _applyFilters();
      _isLoading = false;
    });
  }

  void _applyFilters() {
    List<QuestionEntity> result = List.from(_allQuestions);

    if (_searchQuery.isNotEmpty) {
      result = result
          .where((q) => q.questionText.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    if (_filters.selectedDifficulty != null) {
      result = result.where((q) => q.difficulty == _filters.selectedDifficulty).toList();
    }

    if (_filters.selectedType != null) {
      result = result.where((q) => q.questionType == _filters.selectedType).toList();
    }

    if (_filters.selectedYears.isNotEmpty) {
      result = result.where((q) => _filters.selectedYears.contains(q.year)).toList();
    }

    setState(() => _filteredQuestions = result);
  }

  void _showFilterModal() {
    HapticFeedback.lightImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => QuestionFilterSheet(
        initialFilters: _filters,
        onApply: (newFilters) {
          setState(() {
            _filters = newFilters;
            _applyFilters();
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: [
          CupertinoButton(
            padding: const EdgeInsets.only(right: 12),
            onPressed: _showFilterModal,
            child: Stack(
              alignment: Alignment.topRight,
              children: [
                Icon(
                  CupertinoIcons.slider_horizontal_3,
                  size: 20,
                  color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                ),
                if (_filters.hasActiveFilters)
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: AppColors.errorRed,
                      shape: BoxShape.circle,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // iOS Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: CupertinoSearchTextField(
              placeholder: 'Search questions or formulas...',
              style: TextStyle(color: textPrimary, fontSize: 15),
              onChanged: (val) {
                _searchQuery = val;
                _applyFilters();
              },
            ),
          ),

          // Active Filter Chips
          if (_filters.hasActiveFilters)
            Container(
              height: 34,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              margin: const EdgeInsets.only(bottom: 6),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  if (_filters.selectedDifficulty != null)
                    _iosPill(
                      label: 'Diff: ${_filters.selectedDifficulty!.name.toUpperCase()}',
                      onDelete: () {
                        setState(() => _filters = _filters.copyWith(clearDifficulty: true));
                        _applyFilters();
                      },
                      isDark: isDark,
                    ),
                  if (_filters.selectedType != null)
                    _iosPill(
                      label: 'Type: ${_filters.selectedType!.name}',
                      onDelete: () {
                        setState(() => _filters = _filters.copyWith(clearType: true));
                        _applyFilters();
                      },
                      isDark: isDark,
                    ),
                  if (_filters.selectedYears.isNotEmpty)
                    _iosPill(
                      label: 'Years: ${_filters.selectedYears.join(", ")}',
                      onDelete: () {
                        setState(() => _filters = _filters.copyWith(selectedYears: {}));
                        _applyFilters();
                      },
                      isDark: isDark,
                    ),
                ],
              ),
            ),

          // Question Listing
          Expanded(
            child: _isLoading
                ? const Center(child: CupertinoActivityIndicator())
                : _filteredQuestions.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(CupertinoIcons.search, size: 48, color: textSecondary.withValues(alpha: 0.5)),
                            const SizedBox(height: 12),
                            Text('No questions match your filter criteria',
                                style: AppTypography.titleMedium(textPrimary)),
                            const SizedBox(height: 6),
                            CupertinoButton(
                              onPressed: () {
                                setState(() {
                                  _filters = const QuestionFilterOptions();
                                  _searchQuery = '';
                                  _applyFilters();
                                });
                              },
                              child: const Text('Reset Filters'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: EdgeInsets.fromLTRB(16, 8, 16, 16 + MediaQuery.of(context).padding.bottom),
                        itemCount: _filteredQuestions.length,
                        itemBuilder: (context, index) {
                          final q = _filteredQuestions[index];
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                                width: 0.5,
                              ),
                            ),
                            child: CupertinoButton(
                              padding: const EdgeInsets.all(16),
                              onPressed: () {
                                HapticFeedback.lightImpact();
                                Navigator.push(
                                  context,
                                  CupertinoPageRoute(
                                    builder: (_) => QuestionSolveScreen(
                                      title: widget.title,
                                      examId: widget.examId,
                                      subjectId: widget.subjectId,
                                      chapterId: widget.chapterId,
                                    ),
                                  ),
                                );
                              },
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Header: Year, Shift, Difficulty
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: (isDark ? AppColors.systemBlueDark : AppColors.systemBlue).withValues(alpha: 0.12),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          '${q.year} · ${q.shift}',
                                          style: AppTypography.labelSmall(isDark ? AppColors.systemBlueDark : AppColors.systemBlue),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: q.difficulty == DifficultyLevel.easy
                                              ? AppColors.correctGreen.withValues(alpha: 0.15)
                                              : (q.difficulty == DifficultyLevel.hard
                                                  ? AppColors.errorRed.withValues(alpha: 0.15)
                                                  : AppColors.reviewAmber.withValues(alpha: 0.15)),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          q.difficulty.name.toUpperCase(),
                                          style: AppTypography.labelSmall(
                                            q.difficulty == DifficultyLevel.easy
                                                ? AppColors.correctGreen
                                                : (q.difficulty == DifficultyLevel.hard
                                                    ? AppColors.errorRed
                                                    : AppColors.reviewAmber),
                                          ).copyWith(fontSize: 10),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),

                                  // Question preview with KaTeX
                                  KaTeXMathView(
                                    text: q.questionText,
                                    baseStyle: AppTypography.bodyMedium(textPrimary).copyWith(fontSize: 15),
                                  ),
                                  const SizedBox(height: 12),

                                  // Footer
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        q.questionType == QuestionType.numerical
                                            ? 'Numerical Value'
                                            : '${q.options.length} Options',
                                        style: AppTypography.labelSmall(textSecondary),
                                      ),
                                      Row(
                                        children: [
                                          Text(
                                            'Solve',
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600,
                                              color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          Icon(
                                            CupertinoIcons.chevron_right,
                                            size: 12,
                                            color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _iosPill({required String label, required VoidCallback onDelete, required bool isDark}) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
          const SizedBox(width: 4),
          GestureDetector(
            onTap: onDelete,
            child: const Icon(CupertinoIcons.xmark_circle_fill, size: 14, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
