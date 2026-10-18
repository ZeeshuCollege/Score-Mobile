import 'package:flutter/material.dart';
import '../app/theme/app_colors.dart';
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        backgroundColor: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        indicatorColor: AppColors.brandBlue.withValues(alpha: 0.15),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppColors.brandBlue),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.local_fire_department_outlined),
            selectedIcon: Icon(Icons.local_fire_department_rounded, color: AppColors.reviewAmber),
            label: 'DPP',
          ),
          NavigationDestination(
            icon: Icon(Icons.timer_outlined),
            selectedIcon: Icon(Icons.timer_rounded, color: AppColors.brandBlue),
            label: 'Tests',
          ),
          NavigationDestination(
            icon: Icon(Icons.functions_rounded),
            selectedIcon: Icon(Icons.functions_rounded, color: AppColors.correctGreen),
            label: 'Formulas',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_border_rounded),
            selectedIcon: Icon(Icons.bookmark_rounded, color: AppColors.errorRed),
            label: 'Mistakes',
          ),
        ],
      ),
    );
  }
}
