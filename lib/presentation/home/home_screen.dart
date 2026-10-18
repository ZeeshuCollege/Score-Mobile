import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../domain/entities/exam_entity.dart';
import '../cpyq/chapter_list_screen.dart';
import '../custom_test/custom_test_screen.dart';
import '../mistakes/mistake_notebook_screen.dart';

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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.brandBlue,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'SCORE',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            const SizedBox(width: 10),
            DropdownButton<String>(
              value: _selectedExamId,
              underline: const SizedBox(),
              icon: const Icon(Icons.keyboard_arrow_down_rounded),
              style: AppTypography.titleMedium(textPrimary),
              items: ExamEntity.defaultExams.map((exam) {
                return DropdownMenuItem(
                  value: exam.id,
                  child: Text(exam.name),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedExamId = val);
              },
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.reviewAmber.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(Icons.local_fire_department_rounded,
                    color: AppColors.reviewAmber, size: 20),
                const SizedBox(width: 4),
                Text('12d', style: AppTypography.monoNumber(AppColors.reviewAmber)),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Daily Goal & Stats Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Today\'s Practice Goal',
                                style: AppTypography.labelLarge(textSecondary)),
                            const SizedBox(height: 4),
                            Text('24 / 30 Questions',
                                style: AppTypography.displayMedium(textPrimary)),
                          ],
                        ),
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: AppColors.correctGreen.withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.bolt_rounded,
                              color: AppColors.correctGreen, size: 30),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: const LinearProgressIndicator(
                        value: 24 / 30,
                        minHeight: 8,
                        backgroundColor: Color(0xFFE2E8F0),
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.correctGreen),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Quick Actions: Custom Test & Mistake Notebook
            Row(
              children: [
                Expanded(
                  child: _buildActionTile(
                    title: 'Custom Mock Test',
                    subtitle: 'Full exam timer',
                    icon: Icons.timer_outlined,
                    iconBg: AppColors.brandBlue,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const CustomTestScreen()),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionTile(
                    title: 'Mistake Notebook',
                    subtitle: 'Spaced revision',
                    icon: Icons.bookmark_added_outlined,
                    iconBg: AppColors.errorRed,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MistakeNotebookScreen()),
                      );
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Subject Chapter-wise PYQ Directory
            Text('Chapter-wise PYQ Bank', style: AppTypography.titleLarge(textPrimary)),
            const SizedBox(height: 4),
            Text('Practice past 15 years chapter questions',
                style: AppTypography.bodySmall(textSecondary)),
            const SizedBox(height: 14),

            for (final sub in _currentExam.subjects) ...[
              _buildSubjectCard(context, sub, textPrimary, textSecondary),
              const SizedBox(height: 12),
            ],

            const SizedBox(height: 16),

            // Score PRO Upgrade Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, color: Colors.amber, size: 22),
                      const SizedBox(width: 6),
                      Text(
                        'SCORE PRO',
                        style: GoogleFonts.outfit(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          fontSize: 15,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Unlock 2022-2026 all shifts, step-by-step video solutions & unlimited custom tests.',
                    style: TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Score PRO Subscription Checkout')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppColors.brandBlue,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    ),
                    child: const Text('Upgrade to PRO', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildActionTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconBg,
    required VoidCallback onTap,
  }) {
    return Builder(
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

        return Card(
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: iconBg.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(icon, color: iconBg, size: 22),
                  ),
                  const SizedBox(height: 10),
                  Text(title, style: AppTypography.titleMedium(textPrimary)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: AppTypography.bodySmall(AppColors.lightTextSecondary)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSubjectCard(
    BuildContext context,
    String subjectId,
    Color textPrimary,
    Color textSecondary,
  ) {
    final subName = subjectId[0].toUpperCase() + subjectId.substring(1);
    IconData icon;
    Color color;

    switch (subjectId) {
      case 'physics':
        icon = Icons.offline_bolt_outlined;
        color = const Color(0xFF6366F1); // Indigo
        break;
      case 'chemistry':
        icon = Icons.science_outlined;
        color = const Color(0xFFEC4899); // Pink
        break;
      case 'mathematics':
        icon = Icons.functions_rounded;
        color = const Color(0xFF0EA5E9); // Sky
        break;
      case 'biology':
      default:
        icon = Icons.biotech_outlined;
        color = const Color(0xFF10B981); // Emerald
        break;
    }

    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        title: Text(subName, style: AppTypography.titleMedium(textPrimary)),
        subtitle: Text('Chapter-wise questions & PYQs', style: AppTypography.bodySmall(textSecondary)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ChapterListScreen(
                examId: _selectedExamId,
                subjectId: subjectId,
                subjectName: subName,
              ),
            ),
          );
        },
      ),
    );
  }
}

