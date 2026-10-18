import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import 'katex_math_view.dart';

enum OptionState {
  defaultState,
  selected,
  correct,
  incorrect,
}

class OptionCard extends StatelessWidget {
  final String label; // 'A', 'B', 'C', 'D'
  final String text;
  final OptionState state;
  final VoidCallback? onTap;

  const OptionCard({
    super.key,
    required this.label,
    required this.text,
    this.state = OptionState.defaultState,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color borderColor;
    Color backgroundColor;
    Color bubbleColor;
    Color bubbleTextColor;
    Widget? trailingIcon;

    switch (state) {
      case OptionState.selected:
        borderColor = AppColors.brandBlue;
        backgroundColor = isDark ? AppColors.brandBlueDark : AppColors.brandBlueLight;
        bubbleColor = AppColors.brandBlue;
        bubbleTextColor = Colors.white;
        break;

      case OptionState.correct:
        borderColor = AppColors.correctGreen;
        backgroundColor = isDark
            ? AppColors.correctGreenSurfaceDark
            : AppColors.correctGreenSurfaceLight;
        bubbleColor = AppColors.correctGreen;
        bubbleTextColor = Colors.white;
        trailingIcon = const Icon(
          Icons.check_circle_rounded,
          color: AppColors.correctGreen,
          size: 22,
        );
        break;

      case OptionState.incorrect:
        borderColor = AppColors.errorRed;
        backgroundColor = isDark
            ? AppColors.errorRedSurfaceDark
            : AppColors.errorRedSurfaceLight;
        bubbleColor = AppColors.errorRed;
        bubbleTextColor = Colors.white;
        trailingIcon = const Icon(
          Icons.cancel_rounded,
          color: AppColors.errorRed,
          size: 22,
        );
        break;

      case OptionState.defaultState:
        borderColor = isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke;
        backgroundColor = isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface;
        bubbleColor = isDark ? const Color(0xFF22304A) : const Color(0xFFF1F5F9);
        bubbleTextColor = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
        break;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap != null
              ? () {
                  HapticFeedback.lightImpact();
                  onTap!();
                }
              : null,
          borderRadius: BorderRadius.circular(12),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOut,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: borderColor,
                width: state == OptionState.defaultState ? 1.5 : 2.0,
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Option Letter Badge [A]
                Container(
                  width: 32,
                  height: 32,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: bubbleColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    label,
                    style: AppTypography.monoNumber(bubbleTextColor, fontSize: 13),
                  ),
                ),
                const SizedBox(width: 14),

                // Option Content with KaTeX Math support
                Expanded(
                  child: KaTeXMathView(
                    text: text,
                    baseStyle: AppTypography.bodyMedium(
                      isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                    ),
                  ),
                ),

                if (trailingIcon != null) ...[
                  const SizedBox(width: 8),
                  trailingIcon,
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
