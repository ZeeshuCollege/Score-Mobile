import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../domain/entities/exam_entity.dart';
import 'question_list_screen.dart';

class ChapterListScreen extends StatelessWidget {
  final String examId;
  final String subjectId;
  final String subjectName;

  const ChapterListScreen({
    super.key,
    required this.examId,
    required this.subjectId,
    required this.subjectName,
  });

  static final Map<String, List<ChapterEntity>> sampleChapters = {
    'physics': [
      ChapterEntity(
        id: 'electrostatics',
        subjectId: 'physics',
        name: 'Electrostatics & Gauss Law',
        unitName: 'Electromagnetism',
        totalQuestions: 84,
        solvedQuestions: 32,
      ),
      ChapterEntity(
        id: 'current_electricity',
        subjectId: 'physics',
        name: 'Current Electricity & Circuits',
        unitName: 'Electromagnetism',
        totalQuestions: 96,
        solvedQuestions: 48,
      ),
      ChapterEntity(
        id: 'laws_of_motion',
        subjectId: 'physics',
        name: 'Laws of Motion & Friction',
        unitName: 'Mechanics 1',
        totalQuestions: 72,
        solvedQuestions: 18,
      ),
      ChapterEntity(
        id: 'thermodynamics',
        subjectId: 'physics',
        name: 'Thermodynamics & Heat Transfer',
        unitName: 'Thermodynamics',
        totalQuestions: 65,
        solvedQuestions: 50,
      ),
    ],
    'chemistry': [
      ChapterEntity(
        id: 'chemical_kinetics',
        subjectId: 'chemistry',
        name: 'Chemical Kinetics',
        unitName: 'Physical Chemistry',
        totalQuestions: 68,
        solvedQuestions: 40,
      ),
      ChapterEntity(
        id: 'chemical_bonding',
        subjectId: 'chemistry',
        name: 'Chemical Bonding & Structure',
        unitName: 'Inorganic Chemistry',
        totalQuestions: 110,
        solvedQuestions: 75,
      ),
      ChapterEntity(
        id: 'hydrocarbons',
        subjectId: 'chemistry',
        name: 'Hydrocarbons & Reactions',
        unitName: 'Organic Chemistry',
        totalQuestions: 92,
        solvedQuestions: 22,
      ),
    ],
    'mathematics': [
      ChapterEntity(
        id: 'definite_integration',
        subjectId: 'mathematics',
        name: 'Definite Integration & Properties',
        unitName: 'Calculus',
        totalQuestions: 105,
        solvedQuestions: 60,
      ),
      ChapterEntity(
        id: 'matrices_determinants',
        subjectId: 'mathematics',
        name: 'Matrices & Determinants',
        unitName: 'Algebra',
        totalQuestions: 78,
        solvedQuestions: 45,
      ),
      ChapterEntity(
        id: 'coordinate_geometry',
        subjectId: 'mathematics',
        name: 'Straight Lines & Circles',
        unitName: 'Coordinate Geometry',
        totalQuestions: 88,
        solvedQuestions: 30,
      ),
    ],
    'biology': [
      ChapterEntity(
        id: 'cell_cycle_and_division',
        subjectId: 'biology',
        name: 'Cell Cycle & Cell Division',
        unitName: 'Cell Biology',
        totalQuestions: 120,
        solvedQuestions: 80,
      ),
      ChapterEntity(
        id: 'genetics_evolution',
        subjectId: 'biology',
        name: 'Principles of Inheritance & Variation',
        unitName: 'Genetics',
        totalQuestions: 145,
        solvedQuestions: 90,
      ),
    ],
  };

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    final chapters = sampleChapters[subjectId.toLowerCase()] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(subjectName),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: chapters.length,
        itemBuilder: (context, index) {
          final ch = chapters[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => QuestionListScreen(
                      title: ch.name,
                      examId: examId,
                      subjectId: subjectId,
                      chapterId: ch.id,
                    ),
                  ),
                );
              },
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          ch.unitName.toUpperCase(),
                          style: AppTypography.labelSmall(AppColors.brandBlue),
                        ),
                        Text(
                          '${ch.solvedQuestions} / ${ch.totalQuestions} solved',
                          style: AppTypography.monoNumber(textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      ch.name,
                      style: AppTypography.titleMedium(textPrimary),
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: ch.progress,
                        minHeight: 6,
                        backgroundColor: isDark
                            ? const Color(0xFF1E293B)
                            : const Color(0xFFE2E8F0),
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          AppColors.brandBlue,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
