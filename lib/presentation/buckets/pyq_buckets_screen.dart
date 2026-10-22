import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/ios_grouped_list.dart';
import '../cpyq/question_solve_screen.dart';

class PyqBucketItem {
  final String id;
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final int questionCount;
  final String tag;

  const PyqBucketItem({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.questionCount,
    required this.tag,
  });
}

class PyqBucketsScreen extends StatelessWidget {
  final String examId;

  const PyqBucketsScreen({
    super.key,
    this.examId = 'jee_main',
  });

  static const List<PyqBucketItem> buckets = [
    PyqBucketItem(
      id: 'most_repeated',
      title: 'Most Repeated Questions',
      description: 'Frequently tested PYQs appearing in 3+ shifts across 2018-2024.',
      icon: CupertinoIcons.flame_fill,
      color: AppColors.systemOrange,
      questionCount: 185,
      tag: 'HIGH YIELD',
    ),
    PyqBucketItem(
      id: 'tricky_advanced',
      title: 'Tricky & Multi-Concept',
      description: 'Complex problems testing 2 or more chapters simultaneously.',
      icon: CupertinoIcons.bolt_fill,
      color: AppColors.systemPurple,
      questionCount: 120,
      tag: 'ADVANCED',
    ),
    PyqBucketItem(
      id: 'speed_boosters',
      title: 'Formula & Speed Boosters',
      description: 'Direct formula applications designed to be solved in under 60 seconds.',
      icon: CupertinoIcons.speedometer,
      color: AppColors.correctGreen,
      questionCount: 210,
      tag: 'SPEED',
    ),
    PyqBucketItem(
      id: 'recent_trends',
      title: 'Recent Year Trends (2021-2024)',
      description: 'Latest pattern shifts introduced in recent online computer-based tests.',
      icon: CupertinoIcons.chart_bar_fill,
      color: AppColors.systemBlue,
      questionCount: 240,
      tag: 'LATEST',
    ),
    PyqBucketItem(
      id: 'ncert_overlap',
      title: 'NCERT & Board Match',
      description: 'Questions directly linked to Class 12 CBSE & State Board syllabus.',
      icon: CupertinoIcons.book_fill,
      color: AppColors.systemIndigo,
      questionCount: 145,
      tag: 'BOARDS',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

    return Scaffold(
      appBar: AppBar(
        title: Text('PYQ Buckets', style: AppTypography.headlineSmall(textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Header Description
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                  width: 0.5,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.systemBlue.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(CupertinoIcons.square_stack_3d_up_fill, color: AppColors.systemBlue, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Curated PYQ Categorization', style: AppTypography.titleMedium(textPrimary)),
                        const SizedBox(height: 2),
                        const Text(
                          'Practice targeted buckets instead of random solving to maximize marks.',
                          style: TextStyle(fontSize: 12, color: Colors.grey, height: 1.3),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Inset Grouped Section for Buckets
          IosGroupedSection(
            header: 'SELECT PRACTICE BUCKET',
            children: buckets.map((bucket) {
              return IosGroupedTile(
                icon: bucket.icon,
                iconBackgroundColor: bucket.color,
                title: bucket.title,
                subtitle: bucket.description,
                badge: '${bucket.questionCount} Qs',
                badgeColor: bucket.color,
                onTap: () {
                  HapticFeedback.lightImpact();
                  Navigator.push(
                    context,
                    CupertinoPageRoute(
                      builder: (_) => QuestionSolveScreen(
                        title: bucket.title,
                        examId: examId,
                      ),
                    ),
                  );
                },
              );
            }).toList(),
          ),
          SizedBox(height: 16 + MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }
}
