import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/ios_grouped_list.dart';

class VideoSolutionItem {
  final String id;
  final String title;
  final String subject;
  final String yearShift;
  final String duration;
  final String educator;
  final int views;

  const VideoSolutionItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.yearShift,
    required this.duration,
    required this.educator,
    required this.views,
  });
}

class VideoSolutionsScreen extends StatefulWidget {
  const VideoSolutionsScreen({super.key});

  @override
  State<VideoSolutionsScreen> createState() => _VideoSolutionsScreenState();
}

class _VideoSolutionsScreenState extends State<VideoSolutionsScreen> {
  String _selectedSubject = 'all';

  static const List<VideoSolutionItem> solutions = [
    VideoSolutionItem(
      id: 'vs_1',
      title: 'Carnot Engine & Work Done in Cyclic Thermodynamic Process',
      subject: 'physics',
      yearShift: 'JEE Main 2024 · 30 Jan Shift 1',
      duration: '4:15',
      educator: 'Prof. Sharma (IIT Delhi)',
      views: 14200,
    ),
    VideoSolutionItem(
      id: 'vs_2',
      title: 'Rotational Equilibrium & Moment of Inertia of Composite Discs',
      subject: 'physics',
      yearShift: 'JEE Main 2024 · 29 Jan Shift 2',
      duration: '6:30',
      educator: 'Prof. Sharma (IIT Delhi)',
      views: 18900,
    ),
    VideoSolutionItem(
      id: 'vs_3',
      title: 'Nernst Equation & Concentration Cell Standard Potential',
      subject: 'chemistry',
      yearShift: 'JEE Main 2024 · 27 Jan Shift 1',
      duration: '5:45',
      educator: 'Dr. Kapoor (IIT Bombay)',
      views: 22100,
    ),
    VideoSolutionItem(
      id: 'vs_4',
      title: 'Complex Number Rotation & Euler Theorem in Geometry',
      subject: 'mathematics',
      yearShift: 'JEE Main 2024 · 31 Jan Shift 2',
      duration: '7:10',
      educator: 'Er. Gupta (IIT Kanpur)',
      views: 26500,
    ),
    VideoSolutionItem(
      id: 'vs_5',
      title: 'Definite Integration with King Property & Fractional Part Functions',
      subject: 'mathematics',
      yearShift: 'JEE Main 2023 · 24 Jan Shift 1',
      duration: '5:20',
      educator: 'Er. Gupta (IIT Kanpur)',
      views: 31200,
    ),
  ];

  List<VideoSolutionItem> get _filteredList {
    if (_selectedSubject == 'all') return solutions;
    return solutions.where((s) => s.subject == _selectedSubject).toList();
  }

  void _playVideo(VideoSolutionItem item) {
    HapticFeedback.lightImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 30),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // iOS Drag Handle
              Center(
                child: Container(
                  width: 36,
                  height: 5,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF3A3A3C) : const Color(0xFFD1D1D6),
                    borderRadius: BorderRadius.circular(2.5),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Mock Video Player Card
              Container(
                height: 190,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.25),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(CupertinoIcons.play_fill, color: Colors.white, size: 28),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Streaming HD Solution · 1080p',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                    Positioned(
                      bottom: 12,
                      right: 14,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          item.duration,
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              Text(item.title, style: AppTypography.titleLarge(isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary)),
              const SizedBox(height: 6),
              Text('${item.educator} · ${item.yearShift}', style: AppTypography.subhead(isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary)),
              const SizedBox(height: 16),

              // Step-by-step Timestamps
              Text('Key Timestamps:', style: AppTypography.subhead(isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary).copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              _buildTimestamp('0:00', 'Question Analysis & Given Data Extraction', isDark),
              _buildTimestamp('1:15', 'Core Formula & Free Body Diagram', isDark),
              _buildTimestamp('2:45', 'Algebraic Simplification Step-by-Step', isDark),
              _buildTimestamp('3:50', 'Final Answer Verification & Shortcut Trick', isDark),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTimestamp(String time, String label, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: AppColors.systemBlue.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(time, style: AppTypography.monoNumber(AppColors.systemBlue, fontSize: 11)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(label, style: AppTypography.labelSmall(isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;

    final list = _filteredList;

    return Scaffold(
      appBar: AppBar(
        title: Text('Video Solutions', style: AppTypography.headlineSmall(textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Segmented Control
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: double.infinity,
              child: CupertinoSlidingSegmentedControl<String>(
                groupValue: _selectedSubject,
                children: {
                  'all': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('All', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  'physics': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Physics', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  'chemistry': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Chemistry', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  'mathematics': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Math', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                },
                onValueChanged: (val) {
                  if (val != null) {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedSubject = val);
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: 16),

          IosGroupedSection(
            header: 'AVAILABLE LECTURE SOLUTIONS (${list.length})',
            children: list.map((sol) {
              return IosGroupedTile(
                icon: CupertinoIcons.play_circle_fill,
                iconBackgroundColor: AppColors.systemPurple,
                title: sol.title,
                subtitle: '${sol.yearShift} · ${sol.educator}',
                badge: sol.duration,
                badgeColor: AppColors.systemPurple,
                onTap: () => _playVideo(sol),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
