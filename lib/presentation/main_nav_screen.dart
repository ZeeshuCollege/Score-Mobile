import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../app/theme/app_colors.dart';
import '../app/theme/app_typography.dart';
import 'home/home_screen.dart';
import 'dpp/dpp_screen.dart';
import 'custom_test/custom_test_screen.dart';
import 'formula_cards/formula_cards_screen.dart';
import 'mistakes/mistake_notebook_screen.dart';

class MainNavScreen extends StatefulWidget {
  const MainNavScreen({super.key});

  @override
  State<MainNavScreen> createState() => _MainNavScreenState();
}

class _MainNavScreenState extends State<MainNavScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    DppScreen(),
    CustomTestScreen(),
    FormulaCardsScreen(),
    MistakeNotebookScreen(),
  ];

  final List<Map<String, dynamic>> _tabs = const [
    {
      'label': 'Home',
      'icon': CupertinoIcons.house,
      'activeIcon': CupertinoIcons.house_fill,
    },
    {
      'label': 'DPP',
      'icon': CupertinoIcons.flame,
      'activeIcon': CupertinoIcons.flame_fill,
    },
    {
      'label': 'Tests',
      'icon': CupertinoIcons.timer,
      'activeIcon': CupertinoIcons.timer_fill,
    },
    {
      'label': 'Formulas',
      'icon': CupertinoIcons.function,
      'activeIcon': CupertinoIcons.function,
    },
    {
      'label': 'Mistakes',
      'icon': CupertinoIcons.bookmark,
      'activeIcon': CupertinoIcons.bookmark_fill,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeColor = isDark ? AppColors.systemBlueDark : AppColors.systemBlue;
    final inactiveColor = isDark ? AppColors.darkTextSecondary : AppColors.lightTextMuted;
    final glassColor = isDark ? AppColors.darkCardSurface.withValues(alpha: 0.82) : AppColors.lightCardSurface.withValues(alpha: 0.85);
    final borderColor = isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke;

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: ClipRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 25, sigmaY: 25),
          child: Container(
            decoration: BoxDecoration(
              color: glassColor,
              border: Border(
                top: BorderSide(color: borderColor, width: 0.5),
              ),
            ),
            child: SafeArea(
              top: false,
              child: SizedBox(
                height: 50,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: List.generate(_tabs.length, (index) {
                    final isSelected = _currentIndex == index;
                    final tab = _tabs[index];

                    return Expanded(
                      child: CupertinoButton(
                        padding: EdgeInsets.zero,
                        onPressed: () {
                          if (_currentIndex != index) {
                            HapticFeedback.selectionClick();
                            setState(() => _currentIndex = index);
                          }
                        },
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isSelected ? tab['activeIcon'] as IconData : tab['icon'] as IconData,
                              size: 22,
                              color: isSelected ? activeColor : inactiveColor,
                            ),
                            const SizedBox(height: 3),
                            Text(
                              tab['label'] as String,
                              style: AppTypography.labelSmall(
                                isSelected ? activeColor : inactiveColor,
                              ).copyWith(
                                fontSize: 10,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
