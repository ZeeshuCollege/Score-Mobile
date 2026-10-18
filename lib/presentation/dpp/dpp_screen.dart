import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/ios_grouped_list.dart';
import '../cpyq/question_solve_screen.dart';

class DppScreen extends StatefulWidget {
  final String examId;

  const DppScreen({super.key, this.examId = 'jee_main'});

  @override
  State<DppScreen> createState() => _DppScreenState();
}

class _DppScreenState extends State<DppScreen> {
  int _currentStreak = 12;
  bool _isTodayCompleted = false;
  int _totalDppsSolved = 28;

  @override
  void initState() {
    super.initState();
    _loadDppState();
  }

  Future<void> _loadDppState() async {
    final prefs = await SharedPreferences.getInstance();
    final todayKey = 'dpp_completed_${DateTime.now().year}_${DateTime.now().month}_${DateTime.now().day}';
    setState(() {
      _currentStreak = prefs.getInt('user_streak_days') ?? 12;
      _totalDppsSolved = prefs.getInt('total_dpps_solved') ?? 28;
      _isTodayCompleted = prefs.getBool(todayKey) ?? false;
    });
  }

  Future<void> _markTodayComplete() async {
    final prefs = await SharedPreferences.getInstance();
    final todayKey = 'dpp_completed_${DateTime.now().year}_${DateTime.now().month}_${DateTime.now().day}';
    final newStreak = _currentStreak + 1;
    final newSolved = _totalDppsSolved + 1;

    await prefs.setBool(todayKey, true);
    await prefs.setInt('user_streak_days', newStreak);
    await prefs.setInt('total_dpps_solved', newSolved);

    setState(() {
      _isTodayCompleted = true;
      _currentStreak = newStreak;
      _totalDppsSolved = newSolved;
    });

    if (mounted) {
      HapticFeedback.heavyImpact();
      showCupertinoDialog(
        context: context,
        builder: (_) => CupertinoAlertDialog(
          title: const Text('Streak Maintained!'),
          content: Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: Column(
              children: [
                Text(
                  '$_currentStreak DAYS',
                  style: AppTypography.displayLarge(AppColors.reviewAmber),
                ),
                const SizedBox(height: 8),
                const Text(
                  'You\'ve successfully completed today\'s Daily Practice Problem set. Keep the momentum going tomorrow!',
                ),
              ],
            ),
          ),
          actions: [
            CupertinoDialogAction(
              isDefaultAction: true,
              onPressed: () => Navigator.pop(context),
              child: const Text('Awesome'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Practice (DPP)'),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // iOS Hero Flame Card
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFE65100), Color(0xFFFF9500)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFFF9500).withValues(alpha: 0.25),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      CupertinoIcons.flame_fill,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$_currentStreak Day Streak',
                          style: AppTypography.displayMedium(Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _isTodayCompleted
                              ? 'Today\'s goal completed! Awesome job!'
                              : 'Complete today\'s DPP to keep your streak alive.',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Today's Target Inset Section
          IosGroupedSection(
            header: 'Today\'s Curated Dose',
            footer: 'Curated mix of past examination questions to test daily recall',
            children: [
              IosGroupedTile(
                icon: CupertinoIcons.bolt_fill,
                iconBgColor: AppColors.systemIndigo,
                title: 'Physics',
                subtitle: 'Electrostatics & Current Electricity',
                trailingText: '3 Questions',
                showChevron: false,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.lab_flask_solid,
                iconBgColor: AppColors.correctGreen,
                title: 'Chemistry',
                subtitle: 'Equilibrium & Kinetics',
                trailingText: '3 Questions',
                showChevron: false,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.function,
                iconBgColor: AppColors.systemBlue,
                title: 'Mathematics',
                subtitle: 'Calculus & Integration',
                trailingText: '4 Questions',
                showChevron: false,
              ),
            ],
          ),

          // Solve CTA Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: CupertinoButton(
                color: _isTodayCompleted ? AppColors.correctGreen : AppColors.systemBlue,
                borderRadius: BorderRadius.circular(12),
                padding: EdgeInsets.zero,
                onPressed: () {
                  HapticFeedback.mediumImpact();
                  Navigator.push(
                    context,
                    CupertinoPageRoute(
                      builder: (_) => QuestionSolveScreen(
                        title: 'Daily Practice Set #84',
                        examId: widget.examId,
                      ),
                    ),
                  ).then((_) {
                    if (!_isTodayCompleted) {
                      _markTodayComplete();
                    }
                  });
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _isTodayCompleted ? CupertinoIcons.checkmark_circle_fill : CupertinoIcons.play_arrow_solid,
                      size: 18,
                      color: Colors.white,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _isTodayCompleted ? 'Practice Again' : 'Solve Today\'s DPP (10 Questions)',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Milestone Stats Inset Group
          IosGroupedSection(
            header: 'Practice Consistency & Milestones',
            children: [
              IosGroupedTile(
                icon: CupertinoIcons.check_mark_circled_solid,
                iconBgColor: AppColors.systemBlue,
                title: 'Total Sets Completed',
                trailingText: '$_totalDppsSolved Sets',
                showChevron: false,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.calendar,
                iconBgColor: AppColors.correctGreen,
                title: 'Weekly Target',
                trailingText: '5 / 7 Days',
                showChevron: false,
              ),
              IosGroupedTile(
                icon: CupertinoIcons.chart_pie_fill,
                iconBgColor: AppColors.reviewAmber,
                title: 'Average Accuracy',
                trailingText: '86.4%',
                showChevron: false,
              ),
            ],
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}
