import 'package:flutter/material.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import '../../app/theme/app_colors.dart';

/// High-Performance KaTeX Math View
/// Parses mixed plain text and inline/block LaTeX formulas ($...$ and $$...$$).
class KaTeXMathView extends StatelessWidget {
  final String text;
  final TextStyle? baseStyle;
  final bool isSelectable;

  const KaTeXMathView({
    super.key,
    required this.text,
    this.baseStyle,
    this.isSelectable = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final defaultColor = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final style = baseStyle ?? TextStyle(fontSize: 15, height: 1.5, color: defaultColor);

    // Regular expression matching $$ ... $$ or $ ... $
    final regex = RegExp(r'(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)', multiLine: true);
    final spans = <InlineSpan>[];
    int lastIndex = 0;

    for (final match in regex.allMatches(text)) {
      // Add text before math formula
      if (match.start > lastIndex) {
        spans.add(TextSpan(
          text: text.substring(lastIndex, match.start),
          style: style,
        ));
      }

      final rawMatch = match.group(0)!;
      final isBlock = rawMatch.startsWith(r'$$');
      final cleanMath = isBlock
          ? rawMatch.substring(2, rawMatch.length - 2).trim()
          : rawMatch.substring(1, rawMatch.length - 1).trim();

      spans.add(
        WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: 3,
              vertical: isBlock ? 6 : 1,
            ),
            child: Math.tex(
              cleanMath,
              textStyle: style.copyWith(
                fontSize: isBlock ? (style.fontSize ?? 15) * 1.05 : style.fontSize,
              ),
              mathStyle: isBlock ? MathStyle.display : MathStyle.text,
              onErrorFallback: (err) => Text(
                rawMatch,
                style: style.copyWith(color: AppColors.errorRed),
              ),
            ),
          ),
        ),
      );

      lastIndex = match.end;
    }

    // Remaining text after last formula
    if (lastIndex < text.length) {
      spans.add(TextSpan(
        text: text.substring(lastIndex),
        style: style,
      ));
    }

    if (spans.isEmpty) {
      return Text(text, style: style);
    }

    return RichText(
      text: TextSpan(children: spans),
    );
  }
}
