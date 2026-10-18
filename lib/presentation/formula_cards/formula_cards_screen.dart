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

class _FormulaCardsScreenState extends State<FormulaCardsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  final Set<String> _masteredFormulaIds = {};
  String _searchQuery = '';

  final List<Map<String, String>> _subjects = [
    {'id': 'all', 'label': 'All'},
    {'id': 'physics', 'label': 'Physics'},
    {'id': 'chemistry', 'label': 'Chemistry'},
    {'id': 'mathematics', 'label': 'Mathematics'},
    {'id': 'biology', 'label': 'Biology'},
  ];

  @override
  void initState() {
    super.initState();
    int initialIdx = 0;
    if (widget.initialSubjectId != null) {
      final found = _subjects.indexWhere((s) => s['id'] == widget.initialSubjectId);
      if (found != -1) initialIdx = found;
    }
    _tabController = TabController(length: _subjects.length, vsync: this, initialIndex: initialIdx);
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

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  List<FormulaEntity> _getFilteredFormulas(String subjectId) {
    return FormulaEntity.defaultFormulas.where((f) {
      final matchesSubject = subjectId == 'all' || f.subjectId == subjectId;
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Formula Flashcards'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.brandBlue,
          unselectedLabelColor: textSecondary,
          indicatorColor: AppColors.brandBlue,
          tabs: _subjects.map((s) => Tab(text: s['label'])).toList(),
        ),
      ),
      body: Column(
        children: [
          // Search & Summary Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search formula, chapter or rule...',
                      prefixIcon: const Icon(Icons.search_rounded),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded),
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                              },
                            )
                          : null,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.correctGreen.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: AppColors.correctGreen, size: 18),
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

          // Tab views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: _subjects.map((s) {
                final list = _getFilteredFormulas(s['id']!);
                if (list.isEmpty) {
                  return Center(
                    child: Text('No formulas found matching criteria',
                        style: AppTypography.bodyMedium(textSecondary)),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: list.length,
                  itemBuilder: (ctx, idx) {
                    final item = list[idx];
                    final isMastered = _masteredFormulaIds.contains(item.id);
                    return _buildFormulaCard(item, isMastered, textPrimary, textSecondary, isDark);
                  },
                );
              }).toList(),
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
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: isMastered
            ? const BorderSide(color: AppColors.correctGreen, width: 1.5)
            : BorderSide(
                color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                width: 1,
              ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Chapter and High-Yield Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.brandBlue.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${item.subjectId.toUpperCase()} · ${item.chapterName}',
                    style: AppTypography.labelSmall(AppColors.brandBlue),
                  ),
                ),
                InkWell(
                  onTap: () => _toggleMastered(item.id),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isMastered
                          ? AppColors.correctGreen.withValues(alpha: 0.18)
                          : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isMastered ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                          size: 16,
                          color: isMastered ? AppColors.correctGreen : textSecondary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          isMastered ? 'Mastered' : 'Mark Mastered',
                          style: TextStyle(
                            fontSize: 12,
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
            const SizedBox(height: 12),

            // Title
            Text(item.title, style: AppTypography.titleMedium(textPrimary)),
            const SizedBox(height: 12),

            // LaTeX Formula Display Container
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 14),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0B132B) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                ),
              ),
              child: Center(
                child: KaTeXMathView(
                  text: item.latexExpression,
                  baseStyle: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: textPrimary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Description
            Text(item.description, style: AppTypography.bodySmall(textSecondary)),
            const SizedBox(height: 8),

            // Variables Legend
            if (item.keyVariables.isNotEmpty) ...[
              const Divider(height: 16),
              for (final v in item.keyVariables) ...[
                Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('• ', style: TextStyle(color: AppColors.brandBlue, fontWeight: FontWeight.bold)),
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
          ],
        ),
      ),
    );
  }
}
