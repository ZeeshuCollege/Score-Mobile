import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../domain/entities/exam_entity.dart';
import '../common/ios_grouped_list.dart';
import '../common/apple_segmented_control.dart';
import 'test_simulation_screen.dart';

class CustomTestScreen extends StatefulWidget {
  const CustomTestScreen({super.key});

  @override
  State<CustomTestScreen> createState() => _CustomTestScreenState();
}

class _CustomTestScreenState extends State<CustomTestScreen> {
  String _selectedExam = 'jee_main';
  final Set<String> _selectedSubjects = {'physics', 'chemistry', 'mathematics'};
  int _questionCount = 25;
  int _durationMinutes = 60;

  ExamEntity get _currentExam => ExamEntity.defaultExams.firstWhere(
        (e) => e.id == _selectedExam,
        orElse: () => ExamEntity.defaultExams.first,
      );

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    // Ensure selected subjects strictly belong to current exam (removes biology for JEE & JEE Adv)
    final validSubjects = _currentExam.subjects;
    _selectedSubjects.removeWhere((sub) => !validSubjects.contains(sub));
    if (_selectedSubjects.isEmpty) {
      _selectedSubjects.addAll(validSubjects);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Custom Test Generator'),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Section 1: Choose Exam (Inset Grouped with checkmark)
          IosGroupedSection(
            header: 'Target Examination',
            children: ExamEntity.defaultExams.map((exam) {
              final isSelected = _selectedExam == exam.id;
              return IosGroupedTile(
                title: exam.name,
                trailing: isSelected
                    ? Icon(
                        CupertinoIcons.checkmark_alt,
                        color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                        size: 20,
                      )
                    : null,
                showChevron: false,
                onTap: () {
                  setState(() {
                    _selectedExam = exam.id;
                    _selectedSubjects.clear();
                    _selectedSubjects.addAll(exam.subjects);
                  });
                },
              );
            }).toList(),
          ),

          // Section 2: Included Subjects (Inset Grouped with Cupertino Switches)
          IosGroupedSection(
            header: 'Included Subjects (${_currentExam.name})',
            footer: 'Select at least one subject to generate your custom test paper',
            children: [
              for (final sub in _currentExam.subjects)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        sub[0].toUpperCase() + sub.substring(1),
                        style: AppTypography.titleMedium(textPrimary).copyWith(
                          fontWeight: FontWeight.w400,
                          fontSize: 16,
                        ),
                      ),
                      CupertinoSwitch(
                        value: _selectedSubjects.contains(sub),
                        activeTrackColor: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                        onChanged: (val) {
                          HapticFeedback.lightImpact();
                          setState(() {
                            if (val) {
                              _selectedSubjects.add(sub);
                            } else if (_selectedSubjects.length > 1) {
                              _selectedSubjects.remove(sub);
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
            ],
          ),

          // Section 3: Test Configuration (Inset Grouped with Cupertino Segmented Controls)
          IosGroupedSection(
            header: 'Paper Configuration',
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Total Questions', style: AppTypography.bodySmall(textSecondary)),
                    const SizedBox(height: 8),
                    AppleSegmentedControl<int>(
                      groupValue: _questionCount,
                      children: const {
                        10: Text('10 Qs', style: TextStyle(fontSize: 13)),
                        25: Text('25 Qs', style: TextStyle(fontSize: 13)),
                        45: Text('45 Qs', style: TextStyle(fontSize: 13)),
                        75: Text('75 Qs', style: TextStyle(fontSize: 13)),
                      },
                      onValueChanged: (val) {
                        if (val != null) {
                          HapticFeedback.selectionClick();
                          setState(() => _questionCount = val);
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    Text('Duration Limit', style: AppTypography.bodySmall(textSecondary)),
                    const SizedBox(height: 8),
                    AppleSegmentedControl<int>(
                      groupValue: _durationMinutes,
                      children: const {
                        15: Text('15 min', style: TextStyle(fontSize: 13)),
                        30: Text('30 min', style: TextStyle(fontSize: 13)),
                        60: Text('60 min', style: TextStyle(fontSize: 13)),
                        180: Text('180 min', style: TextStyle(fontSize: 13)),
                      },
                      onValueChanged: (val) {
                        if (val != null) {
                          HapticFeedback.selectionClick();
                          setState(() => _durationMinutes = val);
                        }
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Launch CTA Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: CupertinoButton.filled(
                borderRadius: BorderRadius.circular(12),
                padding: EdgeInsets.zero,
                onPressed: () {
                  HapticFeedback.mediumImpact();
                  Navigator.push(
                    context,
                    CupertinoPageRoute(
                      builder: (_) => TestSimulationScreen(
                        testTitle: 'Custom Mock (${_selectedExam.toUpperCase()})',
                        durationMinutes: _durationMinutes,
                        examId: _selectedExam,
                        subjects: _selectedSubjects.toList(),
                      ),
                    ),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(CupertinoIcons.play_circle_fill, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Start Mock Exam (${_questionCount}Q · ${_durationMinutes}m)',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(height: 56 + MediaQuery.of(context).padding.bottom + 24),
        ],
      ),
    );
  }
}
