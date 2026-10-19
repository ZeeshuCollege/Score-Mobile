import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/ios_grouped_list.dart';
import '../cpyq/question_solve_screen.dart';

class NcertChapterItem {
  final String id;
  final String title;
  final String subject;
  final int classLevel; // 11 or 12
  final int questionCount;
  final String pageRange;
  final double completionProgress;

  const NcertChapterItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.classLevel,
    required this.questionCount,
    required this.pageRange,
    required this.completionProgress,
  });
}

class NcertToolboxScreen extends StatefulWidget {
  const NcertToolboxScreen({super.key});

  @override
  State<NcertToolboxScreen> createState() => _NcertToolboxScreenState();
}

class _NcertToolboxScreenState extends State<NcertToolboxScreen> {
  int _selectedClass = 12; // 11 or 12
  String _selectedSubject = 'chemistry'; // chemistry or biology

  static const List<NcertChapterItem> ncertChapters = [
    // Class 12 Chemistry
    NcertChapterItem(
      id: 'ncert_c12_chem_1',
      title: 'Solutions & Colligative Properties',
      subject: 'chemistry',
      classLevel: 12,
      questionCount: 48,
      pageRange: 'NCERT Pages 33-64',
      completionProgress: 0.65,
    ),
    NcertChapterItem(
      id: 'ncert_c12_chem_2',
      title: 'Electrochemistry',
      subject: 'chemistry',
      classLevel: 12,
      questionCount: 52,
      pageRange: 'NCERT Pages 65-98',
      completionProgress: 0.80,
    ),
    NcertChapterItem(
      id: 'ncert_c12_chem_3',
      title: 'Chemical Kinetics',
      subject: 'chemistry',
      classLevel: 12,
      questionCount: 45,
      pageRange: 'NCERT Pages 99-128',
      completionProgress: 0.40,
    ),
    NcertChapterItem(
      id: 'ncert_c12_chem_4',
      title: 'd and f Block Elements',
      subject: 'chemistry',
      classLevel: 12,
      questionCount: 60,
      pageRange: 'NCERT Pages 209-242',
      completionProgress: 0.90,
    ),
    NcertChapterItem(
      id: 'ncert_c12_chem_5',
      title: 'Coordination Compounds',
      subject: 'chemistry',
      classLevel: 12,
      questionCount: 55,
      pageRange: 'NCERT Pages 243-274',
      completionProgress: 0.50,
    ),

    // Class 11 Chemistry
    NcertChapterItem(
      id: 'ncert_c11_chem_1',
      title: 'Structure of Atom',
      subject: 'chemistry',
      classLevel: 11,
      questionCount: 42,
      pageRange: 'NCERT Pages 29-68',
      completionProgress: 0.70,
    ),
    NcertChapterItem(
      id: 'ncert_c11_chem_2',
      title: 'Chemical Bonding & Molecular Structure',
      subject: 'chemistry',
      classLevel: 11,
      questionCount: 65,
      pageRange: 'NCERT Pages 99-140',
      completionProgress: 0.85,
    ),
    NcertChapterItem(
      id: 'ncert_c11_chem_3',
      title: 'Equilibrium (Chemical & Ionic)',
      subject: 'chemistry',
      classLevel: 11,
      questionCount: 58,
      pageRange: 'NCERT Pages 185-230',
      completionProgress: 0.35,
    ),

    // Class 12 Biology
    NcertChapterItem(
      id: 'ncert_c12_bio_1',
      title: 'Sexual Reproduction in Flowering Plants',
      subject: 'biology',
      classLevel: 12,
      questionCount: 75,
      pageRange: 'NCERT Pages 19-38',
      completionProgress: 0.95,
    ),
    NcertChapterItem(
      id: 'ncert_c12_bio_2',
      title: 'Principles of Inheritance & Variation',
      subject: 'biology',
      classLevel: 12,
      questionCount: 88,
      pageRange: 'NCERT Pages 69-92',
      completionProgress: 0.60,
    ),
    NcertChapterItem(
      id: 'ncert_c12_bio_3',
      title: 'Molecular Basis of Inheritance',
      subject: 'biology',
      classLevel: 12,
      questionCount: 92,
      pageRange: 'NCERT Pages 95-126',
      completionProgress: 0.45,
    ),
  ];

  List<NcertChapterItem> get _filteredList {
    return ncertChapters.where((c) {
      return c.classLevel == _selectedClass && c.subject == _selectedSubject;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    final chapters = _filteredList;

    return Scaffold(
      appBar: AppBar(
        title: Text('NCERT Line-by-Line (LBLQ)', style: AppTypography.headlineSmall(textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Apple Header Banner
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
                      color: AppColors.correctGreen.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(CupertinoIcons.book_fill, color: AppColors.correctGreen, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Line-by-Line NCERT Questions', style: AppTypography.titleMedium(textPrimary)),
                        const SizedBox(height: 2),
                        const Text(
                          'Target 100% textbook mastery with questions tied directly to page numbers.',
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

          // Class Segmented Control (Class 11 vs Class 12)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: double.infinity,
              child: CupertinoSlidingSegmentedControl<int>(
                groupValue: _selectedClass,
                children: {
                  11: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Class 11 NCERT', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  12: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Class 12 NCERT', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                },
                onValueChanged: (val) {
                  if (val != null) {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedClass = val);
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Subject Pill Selectors (Chemistry vs Biology)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: CupertinoButton(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    minimumSize: Size.zero,
                    color: _selectedSubject == 'chemistry'
                        ? AppColors.systemBlue
                        : (isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface),
                    borderRadius: BorderRadius.circular(12),
                    onPressed: () {
                      HapticFeedback.selectionClick();
                      setState(() => _selectedSubject = 'chemistry');
                    },
                    child: Text(
                      'Chemistry',
                      style: TextStyle(
                        color: _selectedSubject == 'chemistry' ? Colors.white : textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: CupertinoButton(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    minimumSize: Size.zero,
                    color: _selectedSubject == 'biology'
                        ? AppColors.systemBlue
                        : (isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface),
                    borderRadius: BorderRadius.circular(12),
                    onPressed: () {
                      HapticFeedback.selectionClick();
                      setState(() => _selectedSubject = 'biology');
                    },
                    child: Text(
                      'Biology',
                      style: TextStyle(
                        color: _selectedSubject == 'biology' ? Colors.white : textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Chapter List Section
          if (chapters.isEmpty)
            Padding(
              padding: const EdgeInsets.all(32),
              child: Center(child: Text('No NCERT chapters for this filter.', style: AppTypography.subhead(textSecondary))),
            )
          else
            IosGroupedSection(
              header: 'NCERT CHAPTERS (${chapters.length})',
              children: chapters.map((c) {
                return IosGroupedTile(
                  icon: CupertinoIcons.doc_text_fill,
                  iconBackgroundColor: AppColors.correctGreen,
                  title: c.title,
                  subtitle: '${c.pageRange} · ${(c.completionProgress * 100).toInt()}% Done',
                  badge: '${c.questionCount} Qs',
                  badgeColor: AppColors.systemBlue,
                  onTap: () {
                    HapticFeedback.lightImpact();
                    Navigator.push(
                      context,
                      CupertinoPageRoute(
                        builder: (_) => QuestionSolveScreen(
                          title: 'NCERT: ${c.title}',
                        ),
                      ),
                    );
                  },
                );
              }).toList(),
            ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
