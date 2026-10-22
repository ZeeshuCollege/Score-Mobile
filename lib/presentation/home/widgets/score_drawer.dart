import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/app_state.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_typography.dart';
import '../../../domain/entities/exam_entity.dart';
import '../../profile/profile_screen.dart';

class ScoreDrawer extends ConsumerWidget {
  const ScoreDrawer({super.key});

  void _showExamPicker(BuildContext context, WidgetRef ref, String currentExamId) {
    HapticFeedback.lightImpact();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showCupertinoModalPopup(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: const Text('Select Target Examination'),
        message: const Text('Practice previous year questions tailored to your exam syllabus'),
        actions: ExamEntity.defaultExams.map((exam) {
          final isSelected = exam.id == currentExamId;
          return CupertinoActionSheetAction(
            onPressed: () {
              ref.read(selectedExamProvider.notifier).setExam(exam.id);
              Navigator.pop(ctx);
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  exam.name,
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    color: isSelected
                        ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                        : (isDark ? Colors.white : Colors.black),
                  ),
                ),
                if (isSelected) ...[
                  const SizedBox(width: 8),
                  Icon(
                    CupertinoIcons.checkmark_alt,
                    size: 18,
                    color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                  ),
                ],
              ],
            ),
          );
        }).toList(),
        cancelButton: CupertinoActionSheetAction(
          isDefaultAction: true,
          onPressed: () => Navigator.pop(ctx),
          child: const Text('Cancel'),
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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Drawer Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Menu',
                    style: AppTypography.titleLarge(textPrimary).copyWith(
                      fontWeight: FontWeight.w800,
                      fontSize: 20,
                    ),
                  ),
                  GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () => Navigator.pop(context),
                    child: Padding(
                      padding: const EdgeInsets.all(4),
                      child: Icon(
                        CupertinoIcons.xmark_circle_fill,
                        color: textSecondary.withValues(alpha: 0.6),
                        size: 24,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // 1. Course Button (Long rectangular button)
              _drawerRectangleButton(
                icon: CupertinoIcons.book_fill,
                iconColor: AppColors.systemBlue,
                title: 'Course',
                trailingText: currentExam.name,
                isDark: isDark,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                onTap: () {
                  _showExamPicker(context, ref, selectedExamId);
                },
              ),
              const SizedBox(height: 12),

              // 2. Dark/Light Mode Toggler (Long rectangular button saying dark and light each side in small)
              _themeRectangleButton(
                isDark: isDark,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                currentThemeMode: currentThemeMode,
                ref: ref,
              ),
              const SizedBox(height: 12),

              // 3. Profile Button (Long rectangular button)
              _drawerRectangleButton(
                icon: CupertinoIcons.person_crop_circle_fill,
                iconColor: const Color(0xFF5856D6),
                title: 'Profile',
                isDark: isDark,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                onTap: () {
                  HapticFeedback.lightImpact();
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    CupertinoPageRoute(builder: (_) => const ProfileScreen()),
                  );
                },
              ),
              const SizedBox(height: 12),

              // 4. Settings Button (Long rectangular button)
              _drawerRectangleButton(
                icon: CupertinoIcons.gear_alt_fill,
                iconColor: Colors.grey,
                title: 'Settings',
                isDark: isDark,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                onTap: () {
                  _showSettingsModal(context, isDark);
                },
              ),

              const Spacer(),

              // Bottom Brand
              Center(
                child: Text(
                  'SCORE Mobile · v1.0.0',
                  style: TextStyle(fontSize: 11, color: textSecondary, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _drawerRectangleButton({
    required IconData icon,
    required Color iconColor,
    required String title,
    String? trailingText,
    required VoidCallback onTap,
    required bool isDark,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Material(
      color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(
          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
          width: 0.5,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          HapticFeedback.lightImpact();
          onTap();
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Icon(icon, size: 20, color: iconColor),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                    color: textPrimary,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
              if (trailingText != null) ...[
                Text(
                  trailingText,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: textSecondary,
                  ),
                ),
                const SizedBox(width: 6),
              ],
              Icon(CupertinoIcons.chevron_right, size: 14, color: textSecondary),
            ],
          ),
        ),
      ),
    );
  }

  Widget _themeRectangleButton({
    required bool isDark,
    required Color textPrimary,
    required Color textSecondary,
    required ThemeMode currentThemeMode,
    required WidgetRef ref,
  }) {
    final isDarkModeActive = currentThemeMode == ThemeMode.dark ||
        (currentThemeMode == ThemeMode.system && isDark);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
          width: 0.5,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: AppColors.systemOrange.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Icon(
                isDarkModeActive ? CupertinoIcons.moon_fill : CupertinoIcons.sun_max_fill,
                size: 20,
                color: AppColors.systemOrange,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              'Theme',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 15,
                color: textPrimary,
                letterSpacing: -0.2,
              ),
            ),
          ),
          // Simple toggle button saying dark and light each side in small
          Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () {
                    HapticFeedback.selectionClick();
                    ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.light);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: !isDarkModeActive
                          ? (isDark ? Colors.white24 : Colors.white)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: !isDarkModeActive
                          ? [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4)]
                          : null,
                    ),
                    child: Text(
                      'Light',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: !isDarkModeActive ? FontWeight.w700 : FontWeight.w400,
                        color: !isDarkModeActive
                            ? (isDark ? Colors.white : Colors.black87)
                            : textSecondary,
                      ),
                    ),
                  ),
                ),
                GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () {
                    HapticFeedback.selectionClick();
                    ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: isDarkModeActive
                          ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: isDarkModeActive
                          ? [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4)]
                          : null,
                    ),
                    child: Text(
                      'Dark',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: isDarkModeActive ? FontWeight.w700 : FontWeight.w400,
                        color: isDarkModeActive ? Colors.white : textSecondary,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
