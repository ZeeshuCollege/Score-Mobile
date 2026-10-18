import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../domain/entities/exam_entity.dart';
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Custom Test Generator'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section 1: Choose Exam
            Text('1. Choose Target Exam', style: AppTypography.titleMedium(textPrimary)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: ExamEntity.defaultExams.map((exam) {
                final isSelected = _selectedExam == exam.id;
                return ChoiceChip(
                  label: Text(exam.name),
                  selected: isSelected,
                  onSelected: (val) {
                    if (val) {
                      setState(() {
                        _selectedExam = exam.id;
                        _selectedSubjects.clear();
                        _selectedSubjects.addAll(exam.subjects);
                      });
                    }
                  },
                  selectedColor: AppColors.brandBlue,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Section 2: Choose Subjects
            Text('2. Included Subjects', style: AppTypography.titleMedium(textPrimary)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: ['physics', 'chemistry', 'mathematics', 'biology'].map((sub) {
                final isSelected = _selectedSubjects.contains(sub);
                return FilterChip(
                  label: Text(sub[0].toUpperCase() + sub.substring(1)),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      if (val) {
                        _selectedSubjects.add(sub);
                      } else if (_selectedSubjects.length > 1) {
                        _selectedSubjects.remove(sub);
                      }
                    });
                  },
                  selectedColor: AppColors.brandBlue.withValues(alpha: 0.18),
                  checkmarkColor: AppColors.brandBlue,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.brandBlue : textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Section 3: Question Count & Time Limit
            Text('3. Test Configuration', style: AppTypography.titleMedium(textPrimary)),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Questions', style: AppTypography.bodyMedium(textPrimary)),
                        DropdownButton<int>(
                          value: _questionCount,
                          items: [10, 25, 45, 75].map((cnt) {
                            return DropdownMenuItem(value: cnt, child: Text('$cnt Questions'));
                          }).toList(),
                          onChanged: (v) => setState(() => _questionCount = v ?? 25),
                        ),
                      ],
                    ),
                    const Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Time Duration', style: AppTypography.bodyMedium(textPrimary)),
                        DropdownButton<int>(
                          value: _durationMinutes,
                          items: [15, 30, 60, 180].map((mins) {
                            return DropdownMenuItem(value: mins, child: Text('$mins Minutes'));
                          }).toList(),
                          onChanged: (v) => setState(() => _durationMinutes = v ?? 60),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Launch Test Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.timer_rounded),
                label: Text(
                  'Start Custom Mock Test (${_questionCount}Q · ${_durationMinutes}m)',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brandBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => TestSimulationScreen(
                        testTitle: 'Custom Mock Test (${_selectedExam.toUpperCase()})',
                        durationMinutes: _durationMinutes,
                        examId: _selectedExam,
                        subjects: _selectedSubjects.toList(),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
