import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/ios_grouped_list.dart';

class PrepTrackerScreen extends StatelessWidget {
  const PrepTrackerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

    return Scaffold(
      appBar: AppBar(
        title: Text('Preparation Tracker', style: AppTypography.headlineSmall(textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Apple Hero Scorecard Card
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isDark
                      ? [const Color(0xFF1C1C1E), const Color(0xFF2C2C2E)]
                      : [const Color(0xFF007AFF), const Color(0xFF0A84FF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: (isDark ? Colors.black : AppColors.systemBlue).withValues(alpha: 0.25),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'EXAM READINESS',
                        style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Estimated: 98.4 %ile',
                          style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Text(
                        '78%',
                        style: AppTypography.displayLarge(Colors.white).copyWith(fontSize: 44),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'On track for Top 5,000 Rank',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '412 of 500 PYQs solved · 74.2% accuracy',
                              style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: const LinearProgressIndicator(
                      value: 0.78,
                      backgroundColor: Colors.white24,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Subject Mastery Cards Grid
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _buildSubjectGauge(
                  subject: 'Physics',
                  percentage: 76,
                  color: AppColors.systemBlue,
                  isDark: isDark,
                  textPrimary: textPrimary,
                ),
                const SizedBox(width: 10),
                _buildSubjectGauge(
                  subject: 'Chemistry',
                  percentage: 88,
                  color: AppColors.correctGreen,
                  isDark: isDark,
                  textPrimary: textPrimary,
                ),
                const SizedBox(width: 10),
                _buildSubjectGauge(
                  subject: 'Mathematics',
                  percentage: 69,
                  color: AppColors.systemOrange,
                  isDark: isDark,
                  textPrimary: textPrimary,
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Strong vs Weak Chapters Inset Section
          IosGroupedSection(
            header: 'ACCURACY MATRIX',
            children: [
              IosGroupedTile(
                icon: CupertinoIcons.checkmark_seal_fill,
                iconBackgroundColor: AppColors.correctGreen,
                title: 'Strong Chapters (80%+)',
                subtitle: 'Electrostatics, Coordination Compounds, Matrices',
                badge: '14 Chapters',
                badgeColor: AppColors.correctGreen,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.exclamationmark_triangle_fill,
                iconBackgroundColor: AppColors.systemOrange,
                title: 'Needs Revision (50-80%)',
                subtitle: 'Rotational Dynamics, Chemical Kinetics, Integration',
                badge: '8 Chapters',
                badgeColor: AppColors.systemOrange,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.xmark_circle_fill,
                iconBackgroundColor: AppColors.errorRed,
                title: 'Critical Focus (<50%)',
                subtitle: 'Ionic Equilibrium, Complex Numbers, Wave Optics',
                badge: '3 Chapters',
                badgeColor: AppColors.errorRed,
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Recent Activity & Percentile Breakdown
          IosGroupedSection(
            header: 'PROJECTED METRICS',
            children: [
              IosGroupedTile(
                icon: CupertinoIcons.graph_circle_fill,
                iconBackgroundColor: AppColors.systemPurple,
                title: 'Projected JEE Main Score',
                subtitle: 'Based on last 5 CBT attempts',
                badge: '196 / 300',
                badgeColor: AppColors.systemPurple,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.speedometer,
                iconBackgroundColor: AppColors.systemBlue,
                title: 'Avg Time Per Question',
                subtitle: 'NTA Ideal: 2m 24s',
                badge: '1m 58s',
                badgeColor: AppColors.systemBlue,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.flame_fill,
                iconBackgroundColor: AppColors.systemOrange,
                title: 'Daily Solving Consistency',
                subtitle: 'Active 12 days in a row',
                badge: '12-Day Streak',
                badgeColor: AppColors.systemOrange,
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildSubjectGauge({
    required String subject,
    required int percentage,
    required Color color,
    required bool isDark,
    required Color textPrimary,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
            width: 0.5,
          ),
        ),
        child: Column(
          children: [
            Text(
              '$percentage%',
              style: AppTypography.displayLarge(color).copyWith(fontSize: 22),
            ),
            const SizedBox(height: 6),
            Text(
              subject,
              style: AppTypography.labelSmall(textPrimary).copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: percentage / 100.0,
                backgroundColor: color.withValues(alpha: 0.15),
                valueColor: AlwaysStoppedAnimation<Color>(color),
                minHeight: 5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
