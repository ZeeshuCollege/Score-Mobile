import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../domain/entities/exam_entity.dart';
import '../common/ios_grouped_list.dart';
import '../cpyq/chapter_list_screen.dart';
import '../custom_test/custom_test_screen.dart';
import '../mistakes/mistake_notebook_screen.dart';
import '../dpp/dpp_screen.dart';
import '../formula_cards/formula_cards_screen.dart';
import '../subscription/subscription_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedExamId = 'jee_main';

  ExamEntity get _currentExam => ExamEntity.defaultExams.firstWhere(
        (e) => e.id == _selectedExamId,
        orElse: () => ExamEntity.defaultExams.first,
      );

  void _showExamPicker(BuildContext context) {
    HapticFeedback.lightImpact();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showCupertinoModalPopup(
      context: context,
      builder: (_) => CupertinoActionSheet(
        title: const Text('Select Target Examination'),
        message: const Text('Practice previous year questions tailored to your exam syllabus'),
        actions: ExamEntity.defaultExams.map((exam) {
          final isSelected = exam.id == _selectedExamId;
          return CupertinoActionSheetAction(
            onPressed: () {
              setState(() => _selectedExamId = exam.id);
              Navigator.pop(context);
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  exam.name,
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    color: isSelected
                        ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                        : (isDark ? Colors.white : Colors.black),
                  ),
                ),
                if (isSelected) ...[
                  const SizedBox(width: 8),
                  Icon(
                    CupertinoIcons.checkmark_alt,
                    size: 18,
                    color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                  ),
                ],
              ],
            ),
          );
        }).toList(),
        cancelButton: CupertinoActionSheetAction(
          isDefaultAction: true,
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // iOS Collapsible Navigation Bar
          SliverAppBar(
            pinned: true,
            expandedHeight: 110,
            backgroundColor: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
            surfaceTintColor: Colors.transparent,
            title: Text(
              _currentExam.name,
              style: AppTypography.titleMedium(textPrimary),
            ),
            actions: [
              CupertinoButton(
                padding: const EdgeInsets.only(right: 16),
                onPressed: () {
                  HapticFeedback.lightImpact();
                  Navigator.push(
                    context,
                    CupertinoPageRoute(builder: (_) => DppScreen(examId: _selectedExamId)),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.reviewAmber.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      const Icon(CupertinoIcons.flame_fill, color: AppColors.reviewAmber, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        '12d',
                        style: AppTypography.monoNumber(AppColors.reviewAmber, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.only(left: 16, bottom: 12),
              title: GestureDetector(
                onTap: () => _showExamPicker(context),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'SCORE',
                      style: AppTypography.titleLarge(textPrimary).copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      CupertinoIcons.chevron_down,
                      size: 14,
                      color: textSecondary,
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Main Body Content in Inset Grouped Sections
          SliverToBoxAdapter(
            child: Column(
              children: [
                const SizedBox(height: 8),

                // 1. Daily Practice Target
                IosGroupedSection(
                  header: 'Today\'s Practice Goal',
                  children: [
                    CupertinoButton(
                      padding: const EdgeInsets.all(16),
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        Navigator.push(
                          context,
                          CupertinoPageRoute(builder: (_) => DppScreen(examId: _selectedExamId)),
                        );
                      },
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Daily Practice Dose',
                                    style: AppTypography.bodySmall(textSecondary),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '24 of 30 Questions',
                                    style: AppTypography.displayMedium(textPrimary),
                                  ),
                                ],
                              ),
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: AppColors.correctGreen.withValues(alpha: 0.15),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  CupertinoIcons.bolt_fill,
                                  color: AppColors.correctGreen,
                                  size: 22,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: const LinearProgressIndicator(
                              value: 24 / 30,
                              minHeight: 6,
                              backgroundColor: Color(0xFFE5E5EA),
                              valueColor: AlwaysStoppedAnimation<Color>(AppColors.correctGreen),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                // 2. Quick Actions Inset Group
                IosGroupedSection(
                  header: 'Quick Practice & Tools',
                  children: [
                    IosGroupedTile(
                      icon: CupertinoIcons.flame_fill,
                      iconBgColor: AppColors.reviewAmber,
                      title: 'Daily Practice Problems (DPP)',
                      subtitle: '10 curated questions & streak rewards',
                      onTap: () {
                        Navigator.push(
                          context,
                          CupertinoPageRoute(builder: (_) => DppScreen(examId: _selectedExamId)),
                        );
                      },
                    ),
                    IosGroupedTile(
                      icon: CupertinoIcons.timer_fill,
                      iconBgColor: AppColors.systemBlue,
                      title: 'Custom Mock Test Generator',
                      subtitle: 'Full NTA-style CBT test environment',
                      onTap: () {
                        Navigator.push(
                          context,
                          CupertinoPageRoute(builder: (_) => const CustomTestScreen()),
                        );
                      },
                    ),
                    IosGroupedTile(
                      icon: CupertinoIcons.function,
                      iconBgColor: AppColors.correctGreen,
                      title: 'High-Yield Formula Cards',
                      subtitle: 'KaTeX equations with mastery tracking',
                      onTap: () {
                        Navigator.push(
                          context,
                          CupertinoPageRoute(builder: (_) => const FormulaCardsScreen()),
                        );
                      },
                    ),
                    IosGroupedTile(
                      icon: CupertinoIcons.bookmark_fill,
                      iconBgColor: AppColors.errorRed,
                      title: 'Smart Mistake Notebook',
                      subtitle: 'Spaced repetition revision queue',
                      onTap: () {
                        Navigator.push(
                          context,
                          CupertinoPageRoute(builder: (_) => const MistakeNotebookScreen()),
                        );
                      },
                    ),
                  ],
                ),

                // 3. Chapter-wise PYQ Bank Inset Group
                IosGroupedSection(
                  header: 'Chapter-wise PYQ Bank (15+ Years)',
                  footer: 'Comprehensive past year question bank categorized by unit and difficulty',
                  children: [
                    for (final subId in _currentExam.subjects)
                      IosGroupedTile(
                        icon: _getSubjectIcon(subId),
                        iconBgColor: _getSubjectColor(subId),
                        title: subId[0].toUpperCase() + subId.substring(1),
                        trailingText: '${ChapterListScreen.sampleChapters[subId]?.length ?? 4} Chapters',
                        onTap: () {
                          Navigator.push(
                            context,
                            CupertinoPageRoute(
                              builder: (_) => ChapterListScreen(
                                examId: _selectedExamId,
                                subjectId: subId,
                                subjectName: subId[0].toUpperCase() + subId.substring(1),
                              ),
                            ),
                          );
                        },
                      ),
                  ],
                ),

                // 4. Score PRO Upgrade Banner
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.15),
                          blurRadius: 14,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(CupertinoIcons.star_fill, color: Colors.amber, size: 18),
                            const SizedBox(width: 6),
                            Text(
                              'SCORE PRO',
                              style: AppTypography.labelLarge(Colors.white).copyWith(
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Unlock all shifts from 2010–2026, step-by-step video solutions & unlimited custom mock tests.',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.85),
                            fontSize: 13,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          height: 42,
                          child: CupertinoButton(
                            padding: EdgeInsets.zero,
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            onPressed: () {
                              Navigator.push(
                                context,
                                CupertinoPageRoute(builder: (_) => const SubscriptionScreen()),
                              );
                            },
                            child: const Text(
                              'Upgrade to PRO',
                              style: TextStyle(
                                color: Color(0xFF1E3A8A),
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 80), // Room for bottom tab bar
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _getSubjectIcon(String subjectId) {
    switch (subjectId) {
      case 'physics':
        return CupertinoIcons.bolt_horizontal_circle_fill;
      case 'chemistry':
        return CupertinoIcons.lab_flask_solid;
      case 'mathematics':
        return CupertinoIcons.function;
      case 'biology':
        return CupertinoIcons.leaf_arrow_circlepath;
      default:
        return CupertinoIcons.book_fill;
    }
  }

  Color _getSubjectColor(String subjectId) {
    switch (subjectId) {
      case 'physics':
        return AppColors.systemIndigo;
      case 'chemistry':
        return AppColors.correctGreen;
      case 'mathematics':
        return AppColors.systemBlue;
      case 'biology':
        return AppColors.systemTeal;
      default:
        return AppColors.reviewAmber;
    }
  }
}
