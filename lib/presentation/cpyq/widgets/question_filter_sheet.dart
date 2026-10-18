import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';
import '../../../domain/entities/question_entity.dart';

class QuestionFilterOptions {
  final Set<int> selectedYears;
  final DifficultyLevel? selectedDifficulty;
  final QuestionType? selectedType;
  final bool onlyBookmarked;

  const QuestionFilterOptions({
    this.selectedYears = const {},
    this.selectedDifficulty,
    this.selectedType,
    this.onlyBookmarked = false,
  });

  QuestionFilterOptions copyWith({
    Set<int>? selectedYears,
    DifficultyLevel? selectedDifficulty,
    bool clearDifficulty = false,
    QuestionType? selectedType,
    bool clearType = false,
    bool? onlyBookmarked,
  }) {
    return QuestionFilterOptions(
      selectedYears: selectedYears ?? this.selectedYears,
      selectedDifficulty: clearDifficulty
          ? null
          : (selectedDifficulty ?? this.selectedDifficulty),
      selectedType: clearType ? null : (selectedType ?? this.selectedType),
      onlyBookmarked: onlyBookmarked ?? this.onlyBookmarked,
    );
  }

  bool get hasActiveFilters =>
      selectedYears.isNotEmpty ||
      selectedDifficulty != null ||
      selectedType != null ||
      onlyBookmarked;
}

class QuestionFilterSheet extends StatefulWidget {
  final QuestionFilterOptions initialFilters;
  final ValueChanged<QuestionFilterOptions> onApply;

  const QuestionFilterSheet({
    super.key,
    required this.initialFilters,
    required this.onApply,
  });

  @override
  State<QuestionFilterSheet> createState() => _QuestionFilterSheetState();
}

class _QuestionFilterSheetState extends State<QuestionFilterSheet> {
  late QuestionFilterOptions _filters;

  static const List<int> availableYears = [
    2024,
    2023,
    2022,
    2021,
    2020,
    2019,
    2018,
    2017,
  ];

  @override
  void initState() {
    super.initState();
    _filters = widget.initialFilters;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Filter Questions', style: AppTypography.titleLarge(textPrimary)),
                  Text('Refine PYQs by criteria', style: AppTypography.bodySmall(textSecondary)),
                ],
              ),
              TextButton(
                onPressed: () {
                  setState(() => _filters = const QuestionFilterOptions());
                },
                child: const Text('Reset', style: TextStyle(color: AppColors.errorRed)),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // 1. Difficulty Level Filter
          Text('Difficulty Level', style: AppTypography.titleMedium(textPrimary)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              FilterChip(
                label: const Text('All'),
                selected: _filters.selectedDifficulty == null,
                onSelected: (_) => setState(
                    () => _filters = _filters.copyWith(clearDifficulty: true)),
                selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
              ),
              ...DifficultyLevel.values.map((diff) {
                final isSelected = _filters.selectedDifficulty == diff;
                return FilterChip(
                  label: Text(diff.name.toUpperCase()),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() => _filters = val
                        ? _filters.copyWith(selectedDifficulty: diff)
                        : _filters.copyWith(clearDifficulty: true));
                  },
                  selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
                );
              }),
            ],
          ),
          const SizedBox(height: 18),

          // 2. Question Type Filter
          Text('Question Type', style: AppTypography.titleMedium(textPrimary)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              FilterChip(
                label: const Text('All Types'),
                selected: _filters.selectedType == null,
                onSelected: (_) => setState(
                    () => _filters = _filters.copyWith(clearType: true)),
                selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
              ),
              FilterChip(
                label: const Text('Single Choice'),
                selected: _filters.selectedType == QuestionType.singleChoice,
                onSelected: (val) => setState(() => _filters = val
                    ? _filters.copyWith(selectedType: QuestionType.singleChoice)
                    : _filters.copyWith(clearType: true)),
                selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
              ),
              FilterChip(
                label: const Text('Numerical Integer'),
                selected: _filters.selectedType == QuestionType.numerical,
                onSelected: (val) => setState(() => _filters = val
                    ? _filters.copyWith(selectedType: QuestionType.numerical)
                    : _filters.copyWith(clearType: true)),
                selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // 3. Exam Years Filter
          Text('Exam Years', style: AppTypography.titleMedium(textPrimary)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: availableYears.map((yr) {
              final isSelected = _filters.selectedYears.contains(yr);
              return FilterChip(
                label: Text('$yr'),
                selected: isSelected,
                onSelected: (val) {
                  final newYears = Set<int>.from(_filters.selectedYears);
                  if (val) {
                    newYears.add(yr);
                  } else {
                    newYears.remove(yr);
                  }
                  setState(() => _filters = _filters.copyWith(selectedYears: newYears));
                },
                selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // Apply Filter Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                widget.onApply(_filters);
                Navigator.pop(context);
              },
              child: const Text('Apply Filters', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }
}
