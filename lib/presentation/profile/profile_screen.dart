import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../core/services/permission_service.dart';
import '../../domain/entities/exam_entity.dart';
import 'user_profile_model.dart';
import 'user_profile_provider.dart';

/// Full-fidelity Apple-Design HIG Profile & Performance Metrics Screen.
class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  late final TextEditingController _nameController;
  late final TextEditingController _bioController;
  late final TextEditingController _collegeController;

  int _selectedAvatarId = 0;
  String _selectedExam = 'JEE Advanced';
  bool _isEdited = false;
  bool _isEditing = false; // By default, profile fields cannot be edited

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    _selectedAvatarId = profile.avatarId;
    _selectedExam = profile.targetExam;
    _nameController = TextEditingController(text: profile.name);
    _bioController = TextEditingController(text: profile.description);
    _collegeController = TextEditingController(text: profile.targetCollege);

    _nameController.addListener(_markEdited);
    _bioController.addListener(_markEdited);
    _collegeController.addListener(_markEdited);
  }

  void _markEdited() {
    if (!_isEdited && _isEditing) {
      setState(() => _isEdited = true);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    _collegeController.dispose();
    super.dispose();
  }

  void _cancelEditing() {
    HapticFeedback.lightImpact();
    final profile = ref.read(userProfileProvider);
    _nameController.text = profile.name;
    _bioController.text = profile.description;
    _collegeController.text = profile.targetCollege;
    setState(() {
      _selectedExam = profile.targetExam;
      _selectedAvatarId = profile.avatarId;
      _isEditing = false;
      _isEdited = false;
    });
  }

  Future<void> _saveProfile() async {
    HapticFeedback.mediumImpact();
    await ref.read(userProfileProvider.notifier).updateProfile(
      name: _nameController.text.trim().isEmpty ? 'Aspirant Scholar' : _nameController.text.trim(),
      description: _bioController.text.trim().isEmpty ? 'Target: Top 100 AIR' : _bioController.text.trim(),
      avatarId: _selectedAvatarId,
      targetCollege: _collegeController.text.trim().isEmpty ? 'IIT Bombay' : _collegeController.text.trim(),
      targetExam: _selectedExam,
    );

    setState(() {
      _isEdited = false;
      _isEditing = false;
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Row(
            children: [
              Icon(CupertinoIcons.checkmark_circle_fill, color: Colors.white, size: 20),
              SizedBox(width: 8),
              Text('Profile changes saved successfully!'),
            ],
          ),
          duration: Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _openAvatarPicker(bool isDark) {
    HapticFeedback.lightImpact();
    // Prompt camera permission if needed
    PermissionService.instance.requestCameraPermission();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: EdgeInsets.only(
            top: 14,
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
              // Grab handle
              Container(
                width: 38,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Choose Avatar Persona',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Select a vibrant aspirant badge for your study profile',
                style: TextStyle(
                  fontSize: 13,
                  color: isDark ? Colors.white60 : Colors.black54,
                ),
              ),
              const SizedBox(height: 20),

              // Avatar Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: UserProfileData.avatarStyles.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 0.85,
                ),
                itemBuilder: (context, index) {
                  final style = UserProfileData.avatarStyles[index];
                  final isSelected = style.id == _selectedAvatarId;

                  return GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() {
                        _selectedAvatarId = style.id;
                        _isEdited = true;
                      });
                      // Persist avatar selection immediately so profile picture is editable anytime!
                      ref.read(userProfileProvider.notifier).updateProfile(
                        avatarId: style.id,
                      );
                      Navigator.pop(ctx);
                    },
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 58,
                          height: 58,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: style.gradientColors,
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isSelected ? Colors.white : Colors.transparent,
                              width: isSelected ? 3 : 0,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: style.gradientColors.first.withValues(alpha: 0.35),
                                blurRadius: isSelected ? 12 : 6,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              Icon(style.icon, color: Colors.white, size: 28),
                              if (isSelected)
                                Positioned(
                                  right: 0,
                                  bottom: 0,
                                  child: Container(
                                    padding: const EdgeInsets.all(2),
                                    decoration: const BoxDecoration(
                                      color: AppColors.systemBlue,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(CupertinoIcons.checkmark, size: 12, color: Colors.white),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          style.label,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isDark ? Colors.white70 : Colors.black87,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showExamSelector(BuildContext context, bool isDark) {
    HapticFeedback.lightImpact();
    showCupertinoModalPopup<void>(
      context: context,
      builder: (BuildContext ctx) => CupertinoActionSheet(
        title: const Text('Select Target Exam', style: TextStyle(fontWeight: FontWeight.w600)),
        message: const Text('Your profile stats and custom tests calibrate to this target'),
        actions: ExamEntity.defaultExams.map((exam) {
          final isSelected = exam.name == _selectedExam;
          return CupertinoActionSheetAction(
            onPressed: () {
              HapticFeedback.selectionClick();
              setState(() {
                _selectedExam = exam.name;
                _isEdited = true;
              });
              Navigator.pop(ctx);
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  exam.name,
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                    color: isSelected ? AppColors.systemBlue : null,
                  ),
                ),
                if (isSelected) ...[
                  const SizedBox(width: 8),
                  const Icon(CupertinoIcons.checkmark_alt, size: 18, color: AppColors.systemBlue),
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
    final profile = ref.watch(userProfileProvider);

    final avatarStyle = UserProfileData.avatarStyles.firstWhere(
      (s) => s.id == _selectedAvatarId,
      orElse: () => UserProfileData.avatarStyles.first,
    );

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: _isEditing
            ? CupertinoButton(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                onPressed: _cancelEditing,
                child: Text(
                  'Cancel',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: isDark ? Colors.white70 : Colors.black54,
                  ),
                ),
              )
            : CupertinoButton(
                padding: EdgeInsets.zero,
                onPressed: () => Navigator.pop(context),
                child: Icon(
                  CupertinoIcons.chevron_left,
                  color: isDark ? Colors.white : Colors.black87,
                  size: 24,
                ),
              ),
        leadingWidth: _isEditing ? 76 : null,
        title: Text(
          'Profile',
          style: AppTypography.titleLarge(textPrimary).copyWith(
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          CupertinoButton(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            onPressed: () {
              if (_isEditing) {
                _saveProfile();
              } else {
                HapticFeedback.lightImpact();
                setState(() => _isEditing = true);
              }
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _isEditing ? CupertinoIcons.checkmark_alt : CupertinoIcons.pencil,
                  size: 16,
                  color: AppColors.systemBlue,
                ),
                const SizedBox(width: 4),
                Text(
                  _isEditing ? 'Save' : 'Edit',
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                    color: AppColors.systemBlue,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        top: false,
        bottom: true,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Apple-Style Avatar Header with Camera Edit Button
              Center(
                child: Column(
                  children: [
                    GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () => _openAvatarPicker(isDark),
                      child: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          Container(
                            width: 92,
                            height: 92,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: avatarStyle.gradientColors,
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: avatarStyle.gradientColors.first.withValues(alpha: 0.35),
                                  blurRadius: 18,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: Center(
                              child: Icon(
                                avatarStyle.icon,
                                size: 48,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(7),
                            decoration: BoxDecoration(
                              color: AppColors.systemBlue,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isDark ? AppColors.darkCanvasBg : Colors.white,
                                width: 2.5,
                              ),
                            ),
                            child: const Icon(
                              CupertinoIcons.camera_fill,
                              size: 15,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    CupertinoButton(
                      padding: EdgeInsets.zero,
                      onPressed: () => _openAvatarPicker(isDark),
                      child: const Text(
                        'Edit Photo & Persona',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.systemBlue,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 2. Personal Information (Apple Grouped Form)
              _buildSectionHeader('STUDENT PROFILE', textSecondary),
              _buildGroupedCard(
                isDark: isDark,
                children: [
                  _buildFormRow(
                    label: 'Name',
                    controller: _nameController,
                    placeholder: 'Enter full name',
                    isDark: isDark,
                    textPrimary: textPrimary,
                    textSecondary: textSecondary,
                  ),
                  _buildDivider(isDark),
                  _buildFormRow(
                    label: 'Bio / Goal',
                    controller: _bioController,
                    placeholder: 'e.g. Target: Top 100 AIR · JEE 2026',
                    isDark: isDark,
                    textPrimary: textPrimary,
                    textSecondary: textSecondary,
                  ),
                  _buildDivider(isDark),
                  _buildFormRow(
                    label: 'Dream College',
                    controller: _collegeController,
                    placeholder: 'e.g. IIT Bombay · CSE',
                    isDark: isDark,
                    textPrimary: textPrimary,
                    textSecondary: textSecondary,
                  ),
                  _buildDivider(isDark),
                  InkWell(
                    onTap: _isEditing ? () => _showExamSelector(context, isDark) : null,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Target Exam',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              color: textPrimary,
                            ),
                          ),
                          Row(
                            children: [
                              Text(
                                _selectedExam,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: _isEditing ? AppColors.systemBlue : textSecondary,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                _isEditing ? CupertinoIcons.chevron_right : CupertinoIcons.lock_fill,
                                size: _isEditing ? 14 : 11,
                                color: _isEditing ? textSecondary : textSecondary.withValues(alpha: 0.35),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              // Dynamic Status / Action Row for Profile Editing
              if (_isEditing) ...[
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: CupertinoButton(
                    color: AppColors.systemBlue,
                    borderRadius: BorderRadius.circular(12),
                    padding: EdgeInsets.zero,
                    onPressed: _saveProfile,
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(CupertinoIcons.checkmark_circle_fill, color: Colors.white, size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Save Profile Changes',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ] else ...[
                Padding(
                  padding: const EdgeInsets.only(top: 8, left: 4),
                  child: Row(
                    children: [
                      Icon(CupertinoIcons.lock, size: 12, color: textSecondary.withValues(alpha: 0.6)),
                      const SizedBox(width: 5),
                      Text(
                        'Profile details are locked. Tap "Edit" above to change.',
                        style: TextStyle(
                          fontSize: 12,
                          color: textSecondary.withValues(alpha: 0.6),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 24),

              // 3. Apple-Design Performance Metrics (Fitness+ / Health Style Bento Grid)
              _buildSectionHeader('PERFORMANCE STATS', textSecondary),
              Row(
                children: [
                  Expanded(
                    child: _buildMetricBentoCard(
                      label: 'SOLVED',
                      value: '${profile.solvedCount}',
                      subtitle: '+48 this week',
                      accent: AppColors.systemBlue,
                      icon: CupertinoIcons.check_mark_circled_solid,
                      isDark: isDark,
                      textPrimary: textPrimary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricBentoCard(
                      label: 'ACCURACY',
                      value: '${profile.accuracy}%',
                      subtitle: 'Top 8% percentile',
                      accent: AppColors.correctGreen,
                      icon: CupertinoIcons.bolt_fill,
                      isDark: isDark,
                      textPrimary: textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildMetricBentoCard(
                      label: 'STREAK',
                      value: '${profile.streakDays} Days',
                      subtitle: 'Personal best: 18d',
                      accent: AppColors.systemOrange,
                      icon: CupertinoIcons.flame_fill,
                      isDark: isDark,
                      textPrimary: textPrimary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricBentoCard(
                      label: 'STUDY TIME',
                      value: '${profile.studyHours}h',
                      subtitle: 'Avg 3.4 hrs/day',
                      accent: const Color(0xFFAF52DE),
                      icon: CupertinoIcons.time_solid,
                      isDark: isDark,
                      textPrimary: textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 4. Weekly Problem Drills Bar Chart (Apple Health Chart Style)
              _buildSectionHeader('WEEKLY PRACTICE DRILLS', textSecondary),
              _buildWeeklyActivityChart(isDark, textPrimary, textSecondary),
              const SizedBox(height: 24),

              // 5. Subject Mastery Breakdown Progress Rings
              _buildSectionHeader('SUBJECT MASTERY & ACCURACY', textSecondary),
              _buildGroupedCard(
                isDark: isDark,
                children: [
                  _buildSubjectProgressRow(
                    subject: 'Physics',
                    solved: 428,
                    total: 500,
                    accuracy: 86.4,
                    accentColor: AppColors.systemBlue,
                    isDark: isDark,
                    textPrimary: textPrimary,
                    textSecondary: textSecondary,
                  ),
                  _buildDivider(isDark),
                  _buildSubjectProgressRow(
                    subject: 'Chemistry',
                    solved: 412,
                    total: 500,
                    accuracy: 82.1,
                    accentColor: AppColors.systemOrange,
                    isDark: isDark,
                    textPrimary: textPrimary,
                    textSecondary: textSecondary,
                  ),
                  _buildDivider(isDark),
                  _buildSubjectProgressRow(
                    subject: _selectedExam.contains('NEET') ? 'Biology' : 'Mathematics',
                    solved: 408,
                    total: 500,
                    accuracy: 85.0,
                    accentColor: const Color(0xFFAF52DE),
                    isDark: isDark,
                    textPrimary: textPrimary,
                    textSecondary: textSecondary,
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 6. Aspirant Milestone Badges (Apple Watch Activity Awards style)
              _buildSectionHeader('UNLOCKED ACHIEVEMENTS', textSecondary),
              _buildMilestoneAwards(isDark, textPrimary, textSecondary),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color textSecondary) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.8,
          color: textSecondary,
        ),
      ),
    );
  }

  Widget _buildGroupedCard({
    required bool isDark,
    required List<Widget> children,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
          width: 0.6,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  Widget _buildFormRow({
    required String label,
    required TextEditingController controller,
    required String placeholder,
    required bool isDark,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          SizedBox(
            width: 105,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: textPrimary,
              ),
            ),
          ),
          Expanded(
            child: CupertinoTextField(
              controller: controller,
              readOnly: !_isEditing,
              showCursor: _isEditing,
              placeholder: _isEditing ? placeholder : '',
              placeholderStyle: TextStyle(
                color: textSecondary.withValues(alpha: 0.5),
                fontSize: 14,
              ),
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: _isEditing ? textPrimary : textPrimary.withValues(alpha: 0.9),
              ),
              decoration: BoxDecoration(
                color: _isEditing
                    ? (isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.03))
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
              ),
              padding: EdgeInsets.symmetric(vertical: 4, horizontal: _isEditing ? 8 : 0),
              clearButtonMode: _isEditing ? OverlayVisibilityMode.editing : OverlayVisibilityMode.never,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(bool isDark) {
    return Divider(
      height: 0.5,
      thickness: 0.5,
      indent: 16,
      endIndent: 0,
      color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
    );
  }

  Widget _buildMetricBentoCard({
    required String label,
    required String value,
    required String subtitle,
    required Color accent,
    required IconData icon,
    required bool isDark,
    required Color textPrimary,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
          width: 0.6,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.6,
                  color: accent,
                ),
              ),
              Icon(icon, color: accent, size: 18),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
              color: textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 11,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyActivityChart(bool isDark, Color textPrimary, Color textSecondary) {
    // 7 days of problem solving marks
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final counts = [32, 45, 52, 28, 48, 65, 38];
    const maxVal = 70;
    const target = 30;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
          width: 0.6,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '308 Questions Solved',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.correctGreen.withValues(alpha: isDark ? 0.3 : 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'Daily Goal Met (7/7)',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.correctGreen,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Daily target: $target questions · Best day: Saturday (65 Qs)',
            style: TextStyle(fontSize: 12, color: textSecondary),
          ),
          const SizedBox(height: 20),

          // Bar marks
          SizedBox(
            height: 120,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(days.length, (i) {
                final count = counts[i];
                final heightFactor = (count / maxVal).clamp(0.1, 1.0);
                final isToday = i == 5; // Saturday

                return Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        '$count',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: isToday ? FontWeight.w700 : FontWeight.w500,
                          color: isToday ? AppColors.systemBlue : textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        height: 80 * heightFactor,
                        width: 16,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: isToday
                                ? [AppColors.systemBlue, const Color(0xFF5856D6)]
                                : [
                                    isDark ? Colors.white24 : const Color(0xFFD1D1D6),
                                    isDark ? Colors.white38 : const Color(0xFFE5E5EA),
                                  ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        days[i],
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: isToday ? FontWeight.w700 : FontWeight.w500,
                          color: isToday ? textPrimary : textSecondary,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectProgressRow({
    required String subject,
    required int solved,
    required int total,
    required double accuracy,
    required Color accentColor,
    required bool isDark,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    final progress = (solved / total).clamp(0.0, 1.0);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                subject,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: textPrimary,
                ),
              ),
              Row(
                children: [
                  Text(
                    '$solved/$total Qs',
                    style: TextStyle(fontSize: 12, color: textSecondary),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: accentColor.withValues(alpha: isDark ? 0.25 : 0.12),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      '${accuracy.toStringAsFixed(1)}% Acc',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: accentColor,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 6,
              backgroundColor: isDark ? Colors.white10 : const Color(0xFFE5E5EA),
              valueColor: AlwaysStoppedAnimation<Color>(accentColor),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMilestoneAwards(bool isDark, Color textPrimary, Color textSecondary) {
    final awards = [
      {'icon': '🥉', 'title': 'Century Solver', 'desc': '100+ PYQs Solved'},
      {'icon': '🥈', 'title': 'Streak Pioneer', 'desc': '10+ Days Active'},
      {'icon': '🥇', 'title': 'Precision Pro', 'desc': '>80% Accuracy'},
      {'icon': '💎', 'title': 'Top 500 Candidate', 'desc': 'Rank Tracked'},
    ];

    return Row(
      children: awards.map((award) {
        return Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 3),
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                width: 0.5,
              ),
            ),
            child: Column(
              children: [
                Text(award['icon']!, style: const TextStyle(fontSize: 22)),
                const SizedBox(height: 4),
                Text(
                  award['title']!,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: textPrimary,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  award['desc']!,
                  style: const TextStyle(fontSize: 9, color: Colors.grey),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
