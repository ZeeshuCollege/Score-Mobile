import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';

/// App Store / Fitness+ style showcase hero card for flagship features
class HeroSpotlightCard extends StatelessWidget {
  final String eyebrow;
  final String title;
  final String subtitle;
  final List<String> tiers;
  final VoidCallback onTap;

  const HeroSpotlightCard({
    super.key,
    required this.eyebrow,
    required this.title,
    required this.subtitle,
    required this.tiers,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: CupertinoButton(
        padding: EdgeInsets.zero,
        onPressed: () {
          HapticFeedback.lightImpact();
          onTap();
        },
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: isDark
                  ? [
                      const Color(0xFF2E1065),
                      const Color(0xFF1E1B4B),
                    ]
                  : [
                      const Color(0xFFFAF5FF),
                      const Color(0xFFF3E8FF),
                    ],
            ),
            border: Border.all(
              color: AppColors.systemPurple.withValues(alpha: isDark ? 0.4 : 0.25),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.systemPurple.withValues(alpha: isDark ? 0.2 : 0.08),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.systemPurple.withValues(alpha: isDark ? 0.3 : 0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(CupertinoIcons.rosette, color: AppColors.systemPurple, size: 14),
                          const SizedBox(width: 5),
                          Text(
                            eyebrow.toUpperCase(),
                            style: AppTypography.labelSmall(AppColors.systemPurple).copyWith(
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.6,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.systemPurple.withValues(alpha: isDark ? 0.25 : 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        CupertinoIcons.chevron_right,
                        color: AppColors.systemPurple,
                        size: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  title,
                  style: AppTypography.displayMedium(textPrimary).copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.4,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTypography.bodySmall(textSecondary).copyWith(
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 14),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: tiers.map((tier) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                      decoration: BoxDecoration(
                        color: isDark
                            ? Colors.black.withValues(alpha: 0.35)
                            : Colors.white.withValues(alpha: 0.85),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isDark ? Colors.white12 : Colors.black.withValues(alpha: 0.06),
                          width: 0.5,
                        ),
                      ),
                      child: Text(
                        tier,
                        style: AppTypography.labelSmall(textPrimary).copyWith(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
