import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';

/// Apple Health / Fitness style Preparation Health & Readiness diagnostic card
class PrepSummaryCard extends StatelessWidget {
  final VoidCallback onTap;

  const PrepSummaryCard({
    super.key,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface;
    final strokeColor = isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke;
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
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: surfaceColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: strokeColor, width: 0.5),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.03),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(CupertinoIcons.chart_pie_fill, color: Color(0xFF2563EB), size: 18),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Preparation Readiness',
                            style: AppTypography.titleMedium(textPrimary).copyWith(
                              fontWeight: FontWeight.w700,
                              fontSize: 15,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.correctGreen.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '98.4 %ile',
                      style: AppTypography.labelSmall(AppColors.correctGreen).copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    flex: 4,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '78%',
                          style: AppTypography.displayLarge(textPrimary).copyWith(
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                            fontSize: 28,
                          ),
                        ),
                        Text(
                          'Overall Readiness',
                          style: AppTypography.bodySmall(textSecondary),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 6,
                    child: Column(
                      children: [
                        _buildSubjectRow('Physics', 0.82, AppColors.systemBlue, textSecondary),
                        const SizedBox(height: 6),
                        _buildSubjectRow('Chemistry', 0.74, AppColors.correctGreen, textSecondary),
                        const SizedBox(height: 6),
                        _buildSubjectRow('Maths / Bio', 0.78, AppColors.systemOrange, textSecondary),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Divider(height: 0.5, thickness: 0.5, color: strokeColor),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Tap to view weak chapters & rank forecast',
                      style: AppTypography.bodySmall(textSecondary).copyWith(fontSize: 12),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Full Report',
                        style: AppTypography.labelSmall(const Color(0xFF2563EB)).copyWith(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(width: 3),
                      const Icon(CupertinoIcons.chevron_right, size: 12, color: Color(0xFF2563EB)),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSubjectRow(String subject, double value, Color color, Color textColor) {
    return Row(
      children: [
        SizedBox(
          width: 70,
          child: Text(
            subject,
            style: AppTypography.labelSmall(textColor).copyWith(fontSize: 11),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: value,
              minHeight: 5,
              backgroundColor: const Color(0xFFE5E5EA).withValues(alpha: 0.5),
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ),
        const SizedBox(width: 6),
        Text(
          '${(value * 100).toInt()}%',
          style: AppTypography.monoNumber(color, fontSize: 10),
        ),
      ],
    );
  }
}
