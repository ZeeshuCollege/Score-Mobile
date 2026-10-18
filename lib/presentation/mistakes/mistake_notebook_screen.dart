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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Mistake Notebook'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.brandBlue))
          : _mistakes.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle_outline_rounded,
                          size: 64, color: AppColors.correctGreen),
                      const SizedBox(height: 16),
                      Text(
                        'No mistakes logged yet!',
                        style: AppTypography.titleMedium(textPrimary),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Questions answered incorrectly during practice will appear here for spaced revision.',
                        textAlign: TextAlign.center,
                        style: AppTypography.bodySmall(textSecondary),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _mistakes.length,
                  itemBuilder: (context, index) {
                    final item = _mistakes[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(14),
                        leading: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.errorRed.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.error_outline_rounded,
                              color: AppColors.errorRed),
                        ),
                        title: Text(
                          item.mistakeType.label,
                          style: AppTypography.titleMedium(textPrimary),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text(
                              'Question ID: ${item.questionId}',
                              style: AppTypography.labelSmall(textSecondary),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Next Review: Stage ${item.reviewStage}',
                              style: AppTypography.labelSmall(AppColors.brandBlue),
                            ),
                          ],
                        ),
                        trailing: const Icon(Icons.chevron_right_rounded),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => QuestionSolveScreen(
                                title: 'Review Mistake',
                              ),
                            ),
                          ).then((_) => _loadMistakes());
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
