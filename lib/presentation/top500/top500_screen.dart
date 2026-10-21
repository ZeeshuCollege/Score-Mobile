import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../data/local/app_database.dart';
import '../../domain/entities/question_entity.dart';
import '../common/ios_grouped_list.dart';
import '../common/apple_segmented_control.dart';
import '../cpyq/question_solve_screen.dart';

class Top500Screen extends StatefulWidget {
  final String examId;

  const Top500Screen({
    super.key,
    this.examId = 'jee_main',
  });

  @override
  State<Top500Screen> createState() => _Top500ScreenState();
}

class _Top500ScreenState extends State<Top500Screen> {
  String _selectedSubject = 'all'; // all, physics, chemistry, mathematics
  List<QuestionEntity> _questions = [];
  bool _isLoading = true;
  final int _solvedCount = 142; // simulated solved progress out of 500

  @override
  void initState() {
    super.initState();
    _loadTop500Questions();
  }

  Future<void> _loadTop500Questions() async {
    setState(() => _isLoading = true);
    final allQs = await AppDatabase.instance.getQuestions(
      examId: widget.examId,
      subjectId: _selectedSubject == 'all' ? null : _selectedSubject,
    );
    setState(() {
      _questions = allQs;
      _isLoading = false;
    });
  }

  void _onSubjectChanged(String subject) {
    if (_selectedSubject == subject) return;
    HapticFeedback.selectionClick();
    setState(() => _selectedSubject = subject);
    _loadTop500Questions();
  }

  String _getTierName(int count) {
    if (count >= 400) return 'Platinum Topper';
    if (count >= 250) return 'Gold Contender';
    if (count >= 100) return 'Silver Qualifier';
    return 'Bronze Aspirant';
  }

  Color _getTierColor(int count) {
    if (count >= 400) return AppColors.systemPurple;
    if (count >= 250) return AppColors.systemOrange;
    if (count >= 100) return AppColors.systemBlue;
    return const Color(0xFFCD7F32); // Bronze
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    final progressRatio = (_solvedCount / 500.0).clamp(0.0, 1.0);
    final tierName = _getTierName(_solvedCount);
    final tierColor = _getTierColor(_solvedCount);

    return Scaffold(
      appBar: AppBar(
        title: Text('Top 500 Questions', style: AppTypography.headlineSmall(textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Apple Hero Trophy Banner
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isDark
                      ? [const Color(0xFF1C1C1E), const Color(0xFF2C2C2E)]
                      : [const Color(0xFF007AFF), const Color(0xFF5856D6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: (isDark ? Colors.black : AppColors.systemBlue).withValues(alpha: 0.25),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: tierColor.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: tierColor, width: 1.0),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(CupertinoIcons.rosette, color: Colors.white, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              tierName,
                              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        '$_solvedCount / 500 Solved',
                        style: AppTypography.monoNumber(Colors.white, fontSize: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'High-Yield Rank Deciders',
                    style: AppTypography.displayLarge(Colors.white).copyWith(fontSize: 22),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Master the 500 questions that repeatedly appear across past 15 years.',
                    style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.3),
                  ),
                  const SizedBox(height: 16),
                  // Progress Bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: progressRatio,
                      backgroundColor: Colors.white24,
                      valueColor: AlwaysStoppedAnimation<Color>(tierColor),
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Subject Sliding Segmented Control
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: AppleSegmentedControl<String>(
              groupValue: _selectedSubject,
              children: {
                'all': Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Text('All (500)', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                ),
                'physics': Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Text('Physics', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                ),
                'chemistry': Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Text('Chemistry', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                ),
                'mathematics': Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Text('Math', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                ),
              },
              onValueChanged: (val) {
                if (val != null) _onSubjectChanged(val);
              },
            ),
          ),
          const SizedBox(height: 16),

          // Questions List
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(40),
              child: Center(child: CupertinoActivityIndicator(radius: 14)),
            )
          else if (_questions.isEmpty)
            Padding(
              padding: const EdgeInsets.all(32),
              child: Center(
                child: Text('No questions found for this selection.', style: AppTypography.subhead(textSecondary)),
              ),
            )
          else
            IosGroupedSection(
              header: 'TOP QUESTIONS (${_questions.length})',
              children: _questions.map((q) {
                return IosGroupedTile(
                  icon: CupertinoIcons.sparkles,
                  iconBackgroundColor: AppColors.systemOrange,
                  title: '${q.subjectId.toUpperCase()} · ${q.year}',
                  subtitle: q.questionText.length > 55 ? '${q.questionText.substring(0, 55)}...' : q.questionText,
                  badge: q.difficulty.name.toUpperCase(),
                  badgeColor: q.difficulty == DifficultyLevel.easy
                      ? AppColors.correctGreen
                      : (q.difficulty == DifficultyLevel.hard ? AppColors.errorRed : AppColors.systemOrange),
                  onTap: () {
                    HapticFeedback.lightImpact();
                    Navigator.push(
                      context,
                      CupertinoPageRoute(
                        builder: (_) => QuestionSolveScreen(
                          title: 'Top 500: ${q.subjectId.toUpperCase()}',
                          examId: widget.examId,
                          subjectId: q.subjectId,
                          chapterId: q.chapterId,
                        ),
                      ),
                    );
                  },
                );
              }).toList(),
            ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
