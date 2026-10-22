import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/app_state.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';
import '../../../domain/entities/exam_entity.dart';

class ScoreDrawer extends ConsumerWidget {
  const ScoreDrawer({super.key});

  void _showProfileModal(BuildContext context, bool isDark) {
    HapticFeedback.lightImpact();
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: EdgeInsets.only(
            top: 16,
            left: 20,
            right: 20,
            bottom: 24 + MediaQuery.of(ctx).padding.bottom,
          ),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF007AFF), Color(0xFF5856D6)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.systemBlue.withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: const Icon(CupertinoIcons.person_crop_circle_fill, size: 44, color: Colors.white),
              ),
              const SizedBox(height: 12),
              Text('Aspirant Scholar', style: AppTypography.headlineSmall(textPrimary)),
              const SizedBox(height: 4),
              Text('Target: Top 100 AIR · JEE & NEET 2026', style: AppTypography.subhead(textSecondary)),
              const SizedBox(height: 20),

              // Profile Stats Grid
              Row(
                children: [
                  _statCard('Solved', '1,248', AppColors.systemBlue, isDark),
                  const SizedBox(width: 8),
                  _statCard('Accuracy', '84.2%', AppColors.correctGreen, isDark),
                  const SizedBox(width: 8),
                  _statCard('Streak', '12 Days', AppColors.systemOrange, isDark),
                ],
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: CupertinoButton.filled(
                  borderRadius: BorderRadius.circular(12),
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Close Profile', style: TextStyle(fontWeight: FontWeight.w600)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _statCard(String label, String value, Color accent, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.03),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
            width: 0.5,
          ),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: accent)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  void _showSettingsModal(BuildContext context, bool isDark) {
    HapticFeedback.lightImpact();
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        bool dppReminder = true;
        bool haptics = true;
        bool timerVisible = true;

        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                top: 16,
                left: 20,
                right: 20,
                bottom: 24 + MediaQuery.of(ctx).padding.bottom,
              ),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 36,
                      height: 4,
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white24 : Colors.black12,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(CupertinoIcons.gear_alt_fill, color: AppColors.systemBlue, size: 22),
                      const SizedBox(width: 8),
                      Text('Settings & Preferences', style: AppTypography.titleLarge(textPrimary)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text('Customize app feedback, reminders and data sync', style: AppTypography.subhead(textSecondary)),
                  const SizedBox(height: 16),

                  _settingSwitch(
                    title: 'Daily DPP Notifications',
                    subtitle: 'Reminder alerts to keep your 12d streak active',
                    value: dppReminder,
                    isDark: isDark,
                    onChanged: (v) => setModalState(() => dppReminder = v),
                  ),
                  const Divider(height: 16, thickness: 0.5),
                  _settingSwitch(
                    title: 'Haptic Feedback',
                    subtitle: 'Tactile vibration on answer selection & taps',
                    value: haptics,
                    isDark: isDark,
                    onChanged: (v) => setModalState(() => haptics = v),
                  ),
                  const Divider(height: 16, thickness: 0.5),
                  _settingSwitch(
                    title: 'Exam Timer Countdown',
                    subtitle: 'Show floating time elapsed on mocks & tests',
                    value: timerVisible,
                    isDark: isDark,
                    onChanged: (v) => setModalState(() => timerVisible = v),
                  ),
                  const Divider(height: 16, thickness: 0.5),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(CupertinoIcons.trash, color: AppColors.errorRed, size: 20),
                    title: const Text('Clear Solution Cache', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                    trailing: Text('14.2 MB', style: TextStyle(color: textSecondary, fontSize: 13)),
                    onTap: () {
                      HapticFeedback.mediumImpact();
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Cache successfully cleared!'), duration: Duration(seconds: 1)),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  Center(
                    child: Text('SCORE Mobile · Version 1.0.0 (Build 2026)', style: TextStyle(color: textSecondary, fontSize: 11)),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: CupertinoButton.filled(
                      borderRadius: BorderRadius.circular(12),
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Done', style: TextStyle(fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _settingSwitch({
    required String title,
    required String subtitle,
    required bool value,
    required bool isDark,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
              const SizedBox(height: 2),
              Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          ),
        ),
        CupertinoSwitch(
          value: value,
          activeTrackColor: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
          onChanged: (v) {
            HapticFeedback.lightImpact();
            onChanged(v);
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
    final currentThemeMode = ref.watch(themeModeProvider);
    final selectedExamId = ref.watch(selectedExamProvider);

    final currentExam = ExamEntity.defaultExams.firstWhere(
      (e) => e.id == selectedExamId,
      orElse: () => ExamEntity.defaultExams.first,
    );

    return Drawer(
      backgroundColor: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
      elevation: 0,
      width: MediaQuery.of(context).size.width * 0.82,
      child: SafeArea(
        top: true,
        bottom: true,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Profile Section Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                  _showProfileModal(context, isDark);
                },
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                      width: 0.5,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF007AFF), Color(0xFF5856D6)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.systemBlue.withValues(alpha: 0.3),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Icon(
                          CupertinoIcons.person_crop_circle_fill,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  'Aspirant Profile',
                                  style: AppTypography.titleMedium(textPrimary).copyWith(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 15,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Icon(CupertinoIcons.checkmark_seal_fill, color: AppColors.systemBlue, size: 14),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Target: ${currentExam.name}',
                              style: AppTypography.bodySmall(textSecondary).copyWith(fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      Icon(CupertinoIcons.chevron_forward, color: textSecondary, size: 16),
                    ],
                  ),
                ),
              ),
            ),

            const Divider(height: 1, thickness: 0.5),

            // Scrollable Content: Course Changer, Appearance & Settings
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                children: [
                  // Section: Course Changer
                  Row(
                    children: [
                      const Icon(CupertinoIcons.square_stack_3d_up_fill, size: 16, color: AppColors.systemBlue),
                      const SizedBox(width: 6),
                      Text(
                        'COURSE CHANGER',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.6,
                          color: textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                        width: 0.5,
                      ),
                    ),
                    child: Column(
                      children: ExamEntity.defaultExams.map((exam) {
                        final isSelected = exam.id == selectedExamId;
                        return InkWell(
                          onTap: () {
                            HapticFeedback.selectionClick();
                            ref.read(selectedExamProvider.notifier).setExam(exam.id);
                            Navigator.pop(context); // Close left drawer smoothly
                          },
                          borderRadius: BorderRadius.circular(14),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        exam.name,
                                        style: TextStyle(
                                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                          fontSize: 14,
                                          color: isSelected
                                              ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                                              : textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        exam.subtitle,
                                        style: TextStyle(fontSize: 11, color: textSecondary),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                                if (isSelected)
                                  Container(
                                    padding: const EdgeInsets.all(3),
                                    decoration: const BoxDecoration(
                                      color: AppColors.systemBlue,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(CupertinoIcons.checkmark, size: 12, color: Colors.white),
                                  ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Section: Appearance (Light / Dark Mode Toggler)
                  Row(
                    children: [
                      const Icon(CupertinoIcons.paintbrush_fill, size: 16, color: AppColors.systemOrange),
                      const SizedBox(width: 6),
                      Text(
                        'APPEARANCE',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.6,
                          color: textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                        width: 0.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        _themeOption(
                          label: 'Light',
                          icon: CupertinoIcons.sun_max_fill,
                          isSelected: currentThemeMode == ThemeMode.light,
                          isDark: isDark,
                          onTap: () {
                            HapticFeedback.selectionClick();
                            ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.light);
                          },
                        ),
                        _themeOption(
                          label: 'Dark',
                          icon: CupertinoIcons.moon_fill,
                          isSelected: currentThemeMode == ThemeMode.dark,
                          isDark: isDark,
                          onTap: () {
                            HapticFeedback.selectionClick();
                            ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
                          },
                        ),
                        _themeOption(
                          label: 'System',
                          icon: CupertinoIcons.circle_lefthalf_fill,
                          isSelected: currentThemeMode == ThemeMode.system,
                          isDark: isDark,
                          onTap: () {
                            HapticFeedback.selectionClick();
                            ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.system);
                          },
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Section: Settings Button with Settings Icon
                  Row(
                    children: [
                      const Icon(CupertinoIcons.gear_alt_fill, size: 16, color: Colors.grey),
                      const SizedBox(width: 6),
                      Text(
                        'PREFERENCES',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.6,
                          color: textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  Material(
                    color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                      side: BorderSide(
                        color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                        width: 0.5,
                      ),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                      leading: Container(
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: AppColors.systemBlue.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(CupertinoIcons.gear_alt_fill, size: 18, color: AppColors.systemBlue),
                      ),
                      title: const Text('Settings', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      subtitle: const Text('Haptics, alerts, cache & version', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      trailing: const Icon(CupertinoIcons.chevron_forward, size: 16, color: Colors.grey),
                      onTap: () {
                        Navigator.pop(context);
                        _showSettingsModal(context, isDark);
                      },
                    ),
                  ),
                ],
              ),
            ),

            // Drawer Footer
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'SCORE Mobile v1.0.0',
                    style: TextStyle(fontSize: 11, color: textSecondary, fontWeight: FontWeight.w500),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Text(
                      'Done',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _themeOption({
    required String label,
    required IconData icon,
    required bool isSelected,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? (isDark ? Colors.white.withValues(alpha: 0.15) : Colors.white)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSelected && !isDark
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Column(
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected
                    ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                    : Colors.grey,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected
                      ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                      : Colors.grey,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
