import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../domain/entities/formula_entity.dart';
import '../common/katex_math_view.dart';

class FormulaCardsScreen extends StatefulWidget {
  final String? initialSubjectId;

  const FormulaCardsScreen({super.key, this.initialSubjectId});

  @override
  State<FormulaCardsScreen> createState() => _FormulaCardsScreenState();
}

class _FormulaCardsScreenState extends State<FormulaCardsScreen> {
  final Set<String> _masteredFormulaIds = {};
  String _searchQuery = '';
  String _selectedSubject = 'all';

  final List<Map<String, String>> _subjects = [
    {'id': 'all', 'label': 'All'},
    {'id': 'physics', 'label': 'Physics'},
    {'id': 'chemistry', 'label': 'Chemistry'},
    {'id': 'mathematics', 'label': 'Math'},
    {'id': 'biology', 'label': 'Biology'},
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialSubjectId != null) {
      _selectedSubject = widget.initialSubjectId!;
    }
    _loadMasteredFormulas();
  }

  Future<void> _loadMasteredFormulas() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList('mastered_formula_ids') ?? [];
    setState(() {
      _masteredFormulaIds.addAll(list);
    });
  }

  Future<void> _toggleMastered(String id) async {
    HapticFeedback.lightImpact();
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      if (_masteredFormulaIds.contains(id)) {
        _masteredFormulaIds.remove(id);
      } else {
        _masteredFormulaIds.add(id);
      }
    });
    await prefs.setStringList('mastered_formula_ids', _masteredFormulaIds.toList());
  }

  List<FormulaEntity> _getFilteredFormulas() {
    return FormulaEntity.defaultFormulas.where((f) {
      final matchesSubject = _selectedSubject == 'all' || f.subjectId == _selectedSubject;
      final matchesSearch = _searchQuery.isEmpty ||
          f.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          f.chapterName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          f.description.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
    final list = _getFilteredFormulas();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Formula Flashcards'),
      ),
      body: Column(
        children: [
          // iOS Search Bar & Mastery Counter
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: Row(
              children: [
                Expanded(
                  child: CupertinoSearchTextField(
                    placeholder: 'Search formulas or concepts...',
                    style: TextStyle(color: textPrimary, fontSize: 15),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                  decoration: BoxDecoration(
                    color: AppColors.correctGreen.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(CupertinoIcons.checkmark_circle_fill, color: AppColors.correctGreen, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        '${_masteredFormulaIds.length}',
                        style: AppTypography.monoNumber(AppColors.correctGreen, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // iOS Sliding Segmented Control
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: SizedBox(
              width: double.infinity,
              child: CupertinoSlidingSegmentedControl<String>(
                groupValue: _selectedSubject,
                children: {
                  for (final s in _subjects)
                    s['id']!: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                      child: Text(
                        s['label']!,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: _selectedSubject == s['id'] ? FontWeight.w600 : FontWeight.w400,
                          color: _selectedSubject == s['id']
                              ? (isDark ? Colors.white : Colors.black)
                              : textSecondary,
                        ),
                      ),
                    ),
                },
                onValueChanged: (val) {
                  if (val != null) {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedSubject = val);
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: 6),

          // Cards List
          Expanded(
            child: list.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(CupertinoIcons.search, size: 48, color: textSecondary.withValues(alpha: 0.5)),
                        const SizedBox(height: 12),
                        Text('No formulas found matching criteria', style: AppTypography.bodyMedium(textSecondary)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 90),
                    itemCount: list.length,
                    itemBuilder: (ctx, idx) {
                      final item = list[idx];
                      final isMastered = _masteredFormulaIds.contains(item.id);
                      return _buildFormulaCard(item, isMastered, textPrimary, textSecondary, isDark);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormulaCard(
    FormulaEntity item,
    bool isMastered,
    Color textPrimary,
    Color textSecondary,
    bool isDark,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isMastered
              ? AppColors.correctGreen.withValues(alpha: 0.5)
              : (isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke),
          width: isMastered ? 1.5 : 0.5,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Chapter and High-Yield Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.systemBlue.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    '${item.subjectId.toUpperCase()} · ${item.chapterName}',
                    style: AppTypography.labelSmall(AppColors.systemBlue).copyWith(fontSize: 10),
                  ),
                ),
                CupertinoButton(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  onPressed: () => _toggleMastered(item.id),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isMastered
                          ? AppColors.correctGreen.withValues(alpha: 0.18)
                          : (isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isMastered ? CupertinoIcons.checkmark_circle_fill : CupertinoIcons.circle,
                          size: 14,
                          color: isMastered ? AppColors.correctGreen : textSecondary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          isMastered ? 'Mastered' : 'Mark Mastered',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isMastered ? AppColors.correctGreen : textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Title
            Text(
              item.title,
              style: AppTypography.titleMedium(textPrimary).copyWith(fontSize: 16),
            ),
            const SizedBox(height: 10),

            // LaTeX Formula Display Container
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF14171F) : const Color(0xFFF8F9FA),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA),
                  width: 0.5,
                ),
              ),
              child: Center(
                child: KaTeXMathView(
                  text: item.latexExpression,
                  baseStyle: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    color: textPrimary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Description
            Text(item.description, style: AppTypography.bodySmall(textSecondary)),

            // Variables Legend
            if (item.keyVariables.isNotEmpty) ...[
              const SizedBox(height: 10),
              Divider(height: 1, thickness: 0.5, color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke),
              const SizedBox(height: 8),
              for (final v in item.keyVariables)
                Padding(
                  padding: const EdgeInsets.only(bottom: 3),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('• ', style: TextStyle(color: AppColors.systemBlue, fontWeight: FontWeight.bold)),
                      Expanded(
                        child: KaTeXMathView(
                          text: v,
                          baseStyle: AppTypography.bodySmall(textSecondary),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }
}
