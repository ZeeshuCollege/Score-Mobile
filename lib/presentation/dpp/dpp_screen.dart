import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
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
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.emoji_events_rounded, color: Colors.amber, size: 28),
              const SizedBox(width: 8),
              const Text('Streak Maintained!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$_currentStreak DAYS',
                style: GoogleFonts.outfit(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: AppColors.reviewAmber,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'You\'ve successfully completed today\'s Daily Practice Problem set. Keep the momentum going tomorrow!',
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: Colors.white,
              ),
              child: const Text('Awesome!'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Practice (DPP)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Streak Hero Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFEA580C), Color(0xFFF97316)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFEA580C).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.local_fire_department_rounded,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$_currentStreak Day Streak!',
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                          ),
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
            const SizedBox(height: 24),

            // Today's Target Card
            Text('Today\'s Dose (${widget.examId.toUpperCase().replaceAll('_', ' ')})',
                style: AppTypography.titleLarge(textPrimary)),
            const SizedBox(height: 4),
            Text('10 curated questions across Physics, Chem & Math',
                style: AppTypography.bodySmall(textSecondary)),
            const SizedBox(height: 12),

            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Curated Set #84', style: AppTypography.titleMedium(textPrimary)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _isTodayCompleted
                                ? AppColors.correctGreen.withValues(alpha: 0.15)
                                : AppColors.brandBlue.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            _isTodayCompleted ? 'COMPLETED' : 'PENDING',
                            style: AppTypography.labelSmall(
                              _isTodayCompleted ? AppColors.correctGreen : AppColors.brandBlue,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    _dppSubjectRow('Physics', 'Electrostatics & Current', '3 Questions'),
                    const Divider(height: 16),
                    _dppSubjectRow('Chemistry', 'Equilibrium & Kinetics', '3 Questions'),
                    const Divider(height: 16),
                    _dppSubjectRow('Mathematics', 'Calculus & Integration', '4 Questions'),
                    const SizedBox(height: 20),

                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        icon: Icon(_isTodayCompleted ? Icons.check_circle_rounded : Icons.play_arrow_rounded),
                        label: Text(_isTodayCompleted ? 'Practice Again' : 'Solve Today\'s DPP'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isTodayCompleted ? AppColors.correctGreen : AppColors.brandBlue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
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
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Performance & Consistency History
            Text('Practice Milestones', style: AppTypography.titleLarge(textPrimary)),
            const SizedBox(height: 12),
            Row(
              children: [
                _milestoneCard('Total DPPs', '$_totalDppsSolved', Icons.auto_awesome_rounded, AppColors.brandBlue),
                const SizedBox(width: 12),
                _milestoneCard('Weekly Goal', '5/7 Days', Icons.calendar_today_rounded, AppColors.correctGreen),
                const SizedBox(width: 12),
                _milestoneCard('Accuracy', '86.4%', Icons.track_changes_rounded, AppColors.reviewAmber),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _dppSubjectRow(String subject, String topics, String count) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(subject, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            Text(topics, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        ),
        Text(count, style: AppTypography.monoNumber(AppColors.brandBlue, fontSize: 13)),
      ],
    );
  }

  Widget _milestoneCard(String title, String val, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
          child: Column(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 6),
              Text(val, style: AppTypography.titleMedium(color)),
              const SizedBox(height: 2),
              Text(title, style: AppTypography.labelSmall(Colors.grey), textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
}
