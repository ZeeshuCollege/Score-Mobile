import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/mistake_entity.dart';
import '../common/ios_grouped_list.dart';
import '../common/apple_segmented_control.dart';
import '../cpyq/question_solve_screen.dart';

class MistakeNotebookScreen extends StatefulWidget {
  const MistakeNotebookScreen({super.key});

  @override
  State<MistakeNotebookScreen> createState() => _MistakeNotebookScreenState();
}

class _MistakeNotebookScreenState extends State<MistakeNotebookScreen> {
  List<MistakeEntity> _mistakes = [];
  bool _isLoading = true;
  String _selectedFilter = 'all';

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
    HapticFeedback.lightImpact();
    final db = await AppDatabase.instance.database;
    await db.delete('mistakes', where: 'id = ?', whereArgs: [id]);
    _loadMistakes();
  }

  List<MistakeEntity> get _filteredMistakes {
    if (_selectedFilter == 'all') return _mistakes;
    return _mistakes.where((m) => m.mistakeType.name == _selectedFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mistake Notebook'),
        actions: [
          CupertinoButton(
            padding: const EdgeInsets.only(right: 12),
            onPressed: _loadMistakes,
            child: const Icon(CupertinoIcons.arrow_clockwise, size: 20),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CupertinoActivityIndicator())
          : ListView(
              padding: const EdgeInsets.symmetric(vertical: 10),
              children: [
                // iOS Sliding Segmented Filter Control
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  child: AppleSegmentedControl<String>(
                    groupValue: _selectedFilter,
                    children: const {
                      'all': Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                        child: Text('All', style: TextStyle(fontSize: 12)),
                      ),
                      'sillyMistake': Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                        child: Text('Silly', style: TextStyle(fontSize: 12)),
                      ),
                      'conceptualGap': Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                        child: Text('Concept', style: TextStyle(fontSize: 12)),
                      ),
                      'calculationError': Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                        child: Text('Calc', style: TextStyle(fontSize: 12)),
                      ),
                      'ranOutOfTime': Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                        child: Text('Time', style: TextStyle(fontSize: 12)),
                      ),
                    },
                    onValueChanged: (val) {
                      if (val != null) {
                        HapticFeedback.selectionClick();
                        setState(() => _selectedFilter = val);
                      }
                    },
                  ),
                ),
                const SizedBox(height: 8),

                if (_filteredMistakes.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          CupertinoIcons.checkmark_seal_fill,
                          size: 56,
                          color: AppColors.correctGreen.withValues(alpha: 0.8),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No Mistakes in This Category',
                          style: AppTypography.titleMedium(textPrimary),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Questions answered incorrectly during practice will automatically appear here for spaced revision.',
                          textAlign: TextAlign.center,
                          style: AppTypography.bodySmall(textSecondary),
                        ),
                      ],
                    ),
                  )
                else
                  IosGroupedSection(
                    header: 'Queued for Spaced Repetition',
                    footer: 'Review mistakes daily to consolidate memory before the exam',
                    children: [
                      for (final item in _filteredMistakes)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppColors.errorRed.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      item.mistakeType.label.toUpperCase(),
                                      style: AppTypography.labelSmall(AppColors.errorRed).copyWith(fontSize: 10),
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Text(
                                          'Stage ${item.reviewStage}',
                                          style: AppTypography.labelSmall(textSecondary).copyWith(fontSize: 11),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      CupertinoButton(
                                        padding: EdgeInsets.zero,
                                        minimumSize: Size.zero,
                                        onPressed: () => _deleteMistake(item.id),
                                        child: Icon(
                                          CupertinoIcons.trash,
                                          size: 16,
                                          color: textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Question #${item.questionId}',
                                style: AppTypography.titleMedium(textPrimary).copyWith(fontSize: 15),
                              ),
                              if (item.notes.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Text(
                                  item.notes,
                                  style: AppTypography.bodySmall(textSecondary),
                                ),
                              ],
                              const SizedBox(height: 10),
                              SizedBox(
                                width: double.infinity,
                                height: 36,
                                child: CupertinoButton(
                                  padding: EdgeInsets.zero,
                                  color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA),
                                  borderRadius: BorderRadius.circular(8),
                                  onPressed: () {
                                    HapticFeedback.lightImpact();
                                    Navigator.push(
                                      context,
                                      CupertinoPageRoute(
                                        builder: (_) => const QuestionSolveScreen(
                                          title: 'Review Problem',
                                        ),
                                      ),
                                    ).then((_) => _loadMistakes());
                                  },
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(CupertinoIcons.arrow_2_squarepath, size: 14, color: isDark ? Colors.white : Colors.black),
                                      const SizedBox(width: 6),
                                      Text(
                                        'Re-attempt Problem',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w500,
                                          color: isDark ? Colors.white : Colors.black,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                SizedBox(height: 56 + MediaQuery.of(context).padding.bottom + 24),
              ],
            ),
    );
  }
}
