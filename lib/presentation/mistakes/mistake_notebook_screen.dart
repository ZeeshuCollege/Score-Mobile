import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/mistake_entity.dart';
import '../cpyq/question_solve_screen.dart';

class MistakeNotebookScreen extends StatefulWidget {
  const MistakeNotebookScreen({super.key});

  @override
  State<MistakeNotebookScreen> createState() => _MistakeNotebookScreenState();
}

class _MistakeNotebookScreenState extends State<MistakeNotebookScreen> {
  List<MistakeEntity> _mistakes = [];
  bool _isLoading = true;
  MistakeType? _selectedTypeFilter;

  @override
  void initState() {
    super.initState();
    _loadMistakes();
  }

  Future<void> _loadMistakes() async {
    setState(() => _isLoading = true);
    final list = await AppDatabase.instance.getMistakes();
    setState(() {
      _mistakes = list;
      _isLoading = false;
    });
  }

  Future<void> _deleteMistake(String id) async {
    final db = await AppDatabase.instance.database;
    await db.delete('mistakes', where: 'id = ?', whereArgs: [id]);
    _loadMistakes();
  }

  List<MistakeEntity> get _filteredMistakes {
    if (_selectedTypeFilter == null) return _mistakes;
    return _mistakes.where((m) => m.mistakeType == _selectedTypeFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Mistake Notebook'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadMistakes,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.brandBlue))
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Filter Categories
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      FilterChip(
                        label: Text('All (${_mistakes.length})'),
                        selected: _selectedTypeFilter == null,
                        onSelected: (_) => setState(() => _selectedTypeFilter = null),
                        selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
                      ),
                      const SizedBox(width: 8),
                      ...MistakeType.values.map((type) {
                        final count = _mistakes.where((m) => m.mistakeType == type).length;
                        final isSelected = _selectedTypeFilter == type;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: Text('${type.label} ($count)'),
                            selected: isSelected,
                            onSelected: (val) {
                              setState(() {
                                _selectedTypeFilter = val ? type : null;
                              });
                            },
                            selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
                          ),
                        );
                      }),
                    ],
                  ),
                ),

                // Mistake List
                Expanded(
                  child: _filteredMistakes.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.check_circle_outline_rounded,
                                  size: 64, color: AppColors.correctGreen),
                              const SizedBox(height: 16),
                              Text(
                                _selectedTypeFilter != null
                                    ? 'No mistakes under ${_selectedTypeFilter!.label}'
                                    : 'No mistakes logged yet!',
                                style: AppTypography.titleMedium(textPrimary),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Questions answered incorrectly during tests and PYQs\nwill be automatically queued here for spaced repetition.',
                                textAlign: TextAlign.center,
                                style: AppTypography.bodySmall(textSecondary),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          itemCount: _filteredMistakes.length,
                          itemBuilder: (context, index) {
                            final item = _filteredMistakes[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: AppColors.errorRed.withValues(alpha: 0.12),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            item.mistakeType.label.toUpperCase(),
                                            style: AppTypography.labelSmall(AppColors.errorRed),
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                              decoration: BoxDecoration(
                                                color: AppColors.brandBlue.withValues(alpha: 0.12),
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                              child: Text(
                                                'Stage ${item.reviewStage} (Due: Day ${item.reviewStage * 2})',
                                                style: AppTypography.labelSmall(AppColors.brandBlue),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            IconButton(
                                              icon: const Icon(Icons.delete_outline_rounded, size: 20),
                                              color: textSecondary,
                                              onPressed: () => _deleteMistake(item.id),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      'Question #${item.questionId}',
                                      style: AppTypography.titleMedium(textPrimary),
                                    ),
                                    if (item.notes.isNotEmpty) ...[
                                      const SizedBox(height: 4),
                                      Text(
                                        item.notes,
                                        style: AppTypography.bodySmall(textSecondary),
                                      ),
                                    ],
                                    const SizedBox(height: 14),
                                    SizedBox(
                                      width: double.infinity,
                                      height: 40,
                                      child: OutlinedButton.icon(
                                        icon: const Icon(Icons.replay_rounded, size: 18),
                                        label: const Text('Re-attempt Problem'),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: AppColors.brandBlue,
                                          side: const BorderSide(color: AppColors.brandBlue),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                        ),
                                        onPressed: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (_) => QuestionSolveScreen(
                                                title: 'Review Problem',
                                              ),
                                            ),
                                          ).then((_) => _loadMistakes());
                                        },
                                      ),
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
}
