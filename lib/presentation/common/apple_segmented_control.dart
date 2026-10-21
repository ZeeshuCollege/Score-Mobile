import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

/// Resilient Apple Sliding Segmented Control that handles zero-width frames,
/// prevents negative constraint crashes, and supports responsive horizontal scrolling.
class AppleSegmentedControl<T extends Object> extends StatelessWidget {
  final T groupValue;
  final Map<T, Widget> children;
  final ValueChanged<T?> onValueChanged;
  final Color? backgroundColor;
  final Color? thumbColor;

  const AppleSegmentedControl({
    super.key,
    required this.groupValue,
    required this.children,
    required this.onValueChanged,
    this.backgroundColor,
    this.thumbColor,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth <= 50) {
          return const SizedBox.shrink();
        }

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: constraints.maxWidth),
            child: CupertinoSlidingSegmentedControl<T>(
              groupValue: groupValue,
              children: children,
              onValueChanged: onValueChanged,
              backgroundColor: backgroundColor ?? CupertinoColors.tertiarySystemFill,
              thumbColor: thumbColor ??
                  (Theme.of(context).brightness == Brightness.dark
                      ? const Color(0xFF636366)
                      : CupertinoColors.white),
            ),
          ),
        );
      },
    );
  }
}
