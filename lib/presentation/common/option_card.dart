import 'package:flutter/cupertino.dart';
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

/// iOS-styled Option Card with tactile haptics, squircle geometry, and KaTeX math
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
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

    Color borderColor;
    Color backgroundColor;
    Color bubbleColor;
    Color bubbleTextColor;
    Widget? trailingIcon;

    switch (state) {
      case OptionState.selected:
        borderColor = isDark ? AppColors.systemBlueDark : AppColors.systemBlue;
        backgroundColor = (isDark ? AppColors.systemBlueDark : AppColors.systemBlue).withValues(alpha: 0.12);
        bubbleColor = isDark ? AppColors.systemBlueDark : AppColors.systemBlue;
        bubbleTextColor = Colors.white;
        break;

      case OptionState.correct:
        borderColor = isDark ? AppColors.systemGreenDark : AppColors.correctGreen;
        backgroundColor = (isDark ? AppColors.systemGreenDark : AppColors.correctGreen).withValues(alpha: 0.14);
        bubbleColor = isDark ? AppColors.systemGreenDark : AppColors.correctGreen;
        bubbleTextColor = Colors.white;
        trailingIcon = Icon(
          CupertinoIcons.checkmark_circle_fill,
          color: isDark ? AppColors.systemGreenDark : AppColors.correctGreen,
          size: 22,
        );
        break;

      case OptionState.incorrect:
        borderColor = isDark ? AppColors.systemRedDark : AppColors.errorRed;
        backgroundColor = (isDark ? AppColors.systemRedDark : AppColors.errorRed).withValues(alpha: 0.12);
        bubbleColor = isDark ? AppColors.systemRedDark : AppColors.errorRed;
        bubbleTextColor = Colors.white;
        trailingIcon = Icon(
          CupertinoIcons.xmark_circle_fill,
          color: isDark ? AppColors.systemRedDark : AppColors.errorRed,
          size: 22,
        );
        break;

      case OptionState.defaultState:
        borderColor = isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke;
        backgroundColor = isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface;
        bubbleColor = isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA);
        bubbleTextColor = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
        break;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: CupertinoButton(
        padding: EdgeInsets.zero,
        onPressed: onTap != null
            ? () {
                HapticFeedback.selectionClick();
                onTap!();
              }
            : null,
        pressedOpacity: 0.7,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeOutCubic,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: borderColor,
              width: state == OptionState.defaultState ? 0.8 : 2.0,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Option Letter Squircle Badge [A]
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
                  style: AppTypography.monoNumber(
                    bubbleTextColor,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Option Content (Parsed with KaTeX)
              Expanded(
                child: KaTeXMathView(
                  text: text,
                  baseStyle: AppTypography.bodyMedium(textPrimary).copyWith(fontSize: 15),
                ),
              ),

              // Trailing Indicator Icon
              if (trailingIcon != null) ...[
                const SizedBox(width: 8),
                trailingIcon,
              ],
            ],
          ),
        ),
      ),
    );
  }
}
