import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

  Widget _buildFilterPill({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        onTap();
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.systemBlue
              : (isDark ? AppColors.darkGroupedBackground : AppColors.lightGroupedBackground),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected
                ? AppColors.systemBlue
                : (isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke),
            width: isSelected ? 1.0 : 0.5,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.subhead(
            isSelected ? Colors.white : (isSelected ? textPrimary : textSecondary),
          ).copyWith(
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

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
          const SizedBox(height: 16),

          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Filter Questions', style: AppTypography.headlineSmall(textPrimary)),
                  Text('Refine PYQs by criteria', style: AppTypography.subhead(textSecondary)),
                ],
              ),
              CupertinoButton(
                padding: EdgeInsets.zero,
                minimumSize: Size.zero,
                onPressed: () {
                  HapticFeedback.lightImpact();
                  setState(() => _filters = const QuestionFilterOptions());
                },
                child: const Text('Reset', style: TextStyle(color: AppColors.errorRed, fontSize: 15)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // 1. Difficulty Level Filter
          Text('Difficulty Level', style: AppTypography.subhead(textPrimary).copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildFilterPill(
                label: 'All',
                isSelected: _filters.selectedDifficulty == null,
                onTap: () => setState(() => _filters = _filters.copyWith(clearDifficulty: true)),
              ),
              ...DifficultyLevel.values.map((diff) {
                final isSelected = _filters.selectedDifficulty == diff;
                return _buildFilterPill(
                  label: diff.name.toUpperCase(),
                  isSelected: isSelected,
                  onTap: () => setState(() => _filters = isSelected
                      ? _filters.copyWith(clearDifficulty: true)
                      : _filters.copyWith(selectedDifficulty: diff)),
                );
              }),
            ],
          ),
          const SizedBox(height: 16),

          // 2. Question Type Filter
          Text('Question Type', style: AppTypography.subhead(textPrimary).copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildFilterPill(
                label: 'All Types',
                isSelected: _filters.selectedType == null,
                onTap: () => setState(() => _filters = _filters.copyWith(clearType: true)),
              ),
              _buildFilterPill(
                label: 'Single Choice',
                isSelected: _filters.selectedType == QuestionType.singleChoice,
                onTap: () => setState(() => _filters = _filters.selectedType == QuestionType.singleChoice
                    ? _filters.copyWith(clearType: true)
                    : _filters.copyWith(selectedType: QuestionType.singleChoice)),
              ),
              _buildFilterPill(
                label: 'Numerical',
                isSelected: _filters.selectedType == QuestionType.numerical,
                onTap: () => setState(() => _filters = _filters.selectedType == QuestionType.numerical
                    ? _filters.copyWith(clearType: true)
                    : _filters.copyWith(selectedType: QuestionType.numerical)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // 3. Exam Years Filter
          Text('Exam Years', style: AppTypography.subhead(textPrimary).copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: availableYears.map((yr) {
              final isSelected = _filters.selectedYears.contains(yr);
              return _buildFilterPill(
                label: '$yr',
                isSelected: isSelected,
                onTap: () {
                  final newYears = Set<int>.from(_filters.selectedYears);
                  if (isSelected) {
                    newYears.remove(yr);
                  } else {
                    newYears.add(yr);
                  }
                  setState(() => _filters = _filters.copyWith(selectedYears: newYears));
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 22),

          // Apply Filter Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: CupertinoButton.filled(
              borderRadius: BorderRadius.circular(14),
              padding: EdgeInsets.zero,
              onPressed: () {
                HapticFeedback.lightImpact();
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
