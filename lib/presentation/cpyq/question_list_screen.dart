import 'package:flutter/material.dart';
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
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => QuestionFilterSheet(
        initialFilters: _filters,
        onApply: (newFilters) {
          setState(() => _filters = newFilters);
          _applyFilters();
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
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.tune_rounded),
                if (_filters.hasActiveFilters)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.brandBlue,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: _showFilterModal,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Summary Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: TextField(
              onChanged: (val) {
                _searchQuery = val;
                _applyFilters();
              },
              decoration: InputDecoration(
                hintText: 'Search questions, formulas...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                filled: true,
                fillColor: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                  ),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                  ),
                ),
              ),
            ),
          ),

          // Active Filter Chips
          if (_filters.hasActiveFilters)
            Container(
              height: 38,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  if (_filters.selectedDifficulty != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: Chip(
                        label: Text('Diff: ${_filters.selectedDifficulty!.name.toUpperCase()}'),
                        onDeleted: () {
                          setState(() => _filters = _filters.copyWith(clearDifficulty: true));
                          _applyFilters();
                        },
                      ),
                    ),
                  if (_filters.selectedType != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: Chip(
                        label: Text('Type: ${_filters.selectedType!.name}'),
                        onDeleted: () {
                          setState(() => _filters = _filters.copyWith(clearType: true));
                          _applyFilters();
                        },
                      ),
                    ),
                  if (_filters.selectedYears.isNotEmpty)
                    Chip(
                      label: Text('Years: ${_filters.selectedYears.join(", ")}'),
                      onDeleted: () {
                        setState(() => _filters = _filters.copyWith(selectedYears: {}));
                        _applyFilters();
                      },
                    ),
                ],
              ),
            ),

          // Question Listing
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.brandBlue))
                : _filteredQuestions.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.filter_alt_off_rounded, size: 56, color: Colors.grey),
                            const SizedBox(height: 12),
                            Text('No questions match your filter criteria',
                                style: AppTypography.titleMedium(textPrimary)),
                            const SizedBox(height: 6),
                            TextButton(
                              onPressed: () {
                                setState(() {
                                  _filters = const QuestionFilterOptions();
                                  _searchQuery = '';
                                });
                                _applyFilters();
                              },
                              child: const Text('Reset All Filters'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _filteredQuestions.length,
                        itemBuilder: (context, index) {
                          final q = _filteredQuestions[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => QuestionSolveScreen(
                                      title: widget.title,
                                      examId: widget.examId,
                                      subjectId: widget.subjectId,
                                      chapterId: widget.chapterId,
                                    ),
                                  ),
                                );
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(16),
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
                                            color: AppColors.brandBlue.withValues(alpha: 0.12),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            '${q.year} · ${q.shift}',
                                            style: AppTypography.labelSmall(AppColors.brandBlue),
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
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),

                                    // Question text preview (with KaTeX)
                                    KaTeXMathView(
                                      text: q.questionText,
                                      baseStyle: AppTypography.bodyMedium(textPrimary),
                                    ),
                                    const SizedBox(height: 12),

                                    // Footer: Options count & Action link
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          q.questionType == QuestionType.numerical
                                              ? 'Numerical Answer'
                                              : '${q.options.length} Options',
                                          style: AppTypography.labelSmall(textSecondary),
                                        ),
                                        Row(
                                          children: [
                                            Text('Solve', style: AppTypography.labelSmall(AppColors.brandBlue)),
                                            const SizedBox(width: 4),
                                            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.brandBlue),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
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
}
