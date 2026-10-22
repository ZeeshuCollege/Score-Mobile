import 'dart:async';
import 'dart:io';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/theme/app_colors.dart';

/// Media format types supported by the slidebar section.
enum SlideMediaType {
  image,
  video,
  flutterDefault,
}

/// Represents an individual slide media item (image, video, or default Flutter showcase).
class SlideMediaItem {
  final String? mediaUrl;
  final SlideMediaType type;
  final String? title;
  final String? subtitle;
  final String? badge;
  final Color? accentColor;
  final VoidCallback? onTap;

  const SlideMediaItem({
    this.mediaUrl,
    this.type = SlideMediaType.flutterDefault,
    this.title,
    this.subtitle,
    this.badge,
    this.accentColor,
    this.onTap,
  });
}

/// Full-width slideshow / slidebar section supporting up to 5 images or videos
/// with white indicator dots inside the container and 2-second auto-run transitions.
class SlidebarSection extends StatefulWidget {
  final List<SlideMediaItem>? items;
  final double height;
  final Duration autoScrollDuration;

  const SlidebarSection({
    super.key,
    this.items,
    this.height = 175.0,
    this.autoScrollDuration = const Duration(seconds: 2),
  });

  /// 5 Default Flutter-powered showcase slides
  static List<SlideMediaItem> defaultFlutterSlides({
    VoidCallback? onTop500Tap,
    VoidCallback? onDppTap,
    VoidCallback? onTestTap,
    VoidCallback? onMistakesTap,
    VoidCallback? onFormulasTap,
  }) {
    return [
      SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        badge: 'FLUTTER POWERED',
        title: 'SCORE Engine v2.0',
        subtitle: '120Hz native performance for high-speed problem solving',
        accentColor: const Color(0xFF02569B),
        onTap: onFormulasTap,
      ),
      SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        badge: 'FLAGSHIP SERIES',
        title: 'Top 500 Questions',
        subtitle: 'Curated high-yield rank deciders with KaTeX step solutions',
        accentColor: const Color(0xFF5856D6),
        onTap: onTop500Tap,
      ),
      SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        badge: 'DAILY DOSE',
        title: 'Daily Practice Target',
        subtitle: 'Keep your 12-day streak alive with targeted chapter drills',
        accentColor: AppColors.systemOrange,
        onTap: onDppTap,
      ),
      SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        badge: 'NTA CBT SIMULATION',
        title: 'Custom Mock Tests',
        subtitle: 'Real exam countdown, question palette & percentile ranking',
        accentColor: const Color(0xFF007AFF),
        onTap: onTestTap,
      ),
      SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        badge: 'SMART REVISION',
        title: 'Mistake Notebook',
        subtitle: 'Categorize calculation & conceptual errors to boost AIR',
        accentColor: const Color(0xFF00C7BE),
        onTap: onMistakesTap,
      ),
    ];
  }

  @override
  State<SlidebarSection> createState() => _SlidebarSectionState();
}

class _SlidebarSectionState extends State<SlidebarSection> {
  late final PageController _pageController;
  Timer? _autoScrollTimer;
  int _currentIndex = 0;

  List<SlideMediaItem> get _slides {
    final raw = widget.items ?? SlidebarSection.defaultFlutterSlides();
    // Strictly cap at a maximum of 5 images/videos/slides
    return raw.take(5).toList();
  }

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _startTimer();
  }

  void _startTimer() {
    _autoScrollTimer?.cancel();
    if (_slides.length <= 1) return;

    // Auto-advance each slide every 2 seconds
    _autoScrollTimer = Timer.periodic(widget.autoScrollDuration, (timer) {
      if (!mounted || !_pageController.hasClients) return;
      final next = (_currentIndex + 1) % _slides.length;
      _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 450),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _autoScrollTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final slides = _slides;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        width: double.infinity,
        height: widget.height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
            width: 0.8,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.06),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            // PageView Slides
            PageView.builder(
              controller: _pageController,
              itemCount: slides.length,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
                _startTimer(); // Reset timer so current slide gets full duration
              },
              itemBuilder: (context, index) {
                final item = slides[index];
                return GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () {
                    HapticFeedback.lightImpact();
                    item.onTap?.call();
                  },
                  child: _buildSlideContent(item, isDark),
                );
              },
            ),

            // Bottom dark gradient scrim for crisp dot contrast
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              height: 38,
              child: IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withValues(alpha: isDark ? 0.45 : 0.35),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // White Dots Inside Bottom of Container
            if (slides.length > 1)
              Positioned(
                bottom: 10,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(slides.length, (index) {
                    final isSelected = index == _currentIndex;
                    return GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () {
                        HapticFeedback.selectionClick();
                        _pageController.animateToPage(
                          index,
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 4),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          curve: Curves.easeOutCubic,
                          width: isSelected ? 18 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: isSelected
                                ? Colors.white
                                : Colors.white.withValues(alpha: 0.45),
                            borderRadius: BorderRadius.circular(3),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.35),
                                blurRadius: 3,
                                offset: const Offset(0, 1),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSlideContent(SlideMediaItem item, bool isDark) {
    switch (item.type) {
      case SlideMediaType.image:
        return _buildImageSlide(item, isDark);
      case SlideMediaType.video:
        return _buildVideoSlide(item, isDark);
      case SlideMediaType.flutterDefault:
        return _buildFlutterDefaultSlide(item, isDark);
    }
  }

  /// Default Flutter Image & Showcase Slide
  Widget _buildFlutterDefaultSlide(SlideMediaItem item, bool isDark) {
    final accent = item.accentColor ?? const Color(0xFF02569B);
    final textPrimary = isDark ? Colors.white : const Color(0xFF1C1C1E);
    final textSecondary = isDark ? Colors.white70 : const Color(0xFF636366);

    return Container(
      width: double.infinity,
      height: widget.height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [
                  accent.withValues(alpha: 0.32),
                  const Color(0xFF14141E),
                ]
              : [
                  accent.withValues(alpha: 0.12),
                  Colors.white,
                ],
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(18, 16, 18, 28),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (item.badge != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: accent.withValues(alpha: isDark ? 0.35 : 0.16),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        item.badge!.toUpperCase(),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.6,
                          color: accent,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                  ],
                  Text(
                    item.title ?? 'SCORE Feature',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: textPrimary,
                      letterSpacing: -0.3,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.subtitle ?? '',
                    style: TextStyle(
                      fontSize: 12,
                      color: textSecondary,
                      height: 1.25,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 14),

            // Flutter Default Logo Image
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: accent.withValues(alpha: 0.25),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Center(
                child: FlutterLogo(
                  size: 46,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Custom Image Slide supporting web URLs, assets, and local files
  Widget _buildImageSlide(SlideMediaItem item, bool isDark) {
    final url = item.mediaUrl ?? '';
    Widget imageWidget;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      imageWidget = Image.network(
        url,
        fit: BoxFit.cover,
        width: double.infinity,
        height: widget.height,
        errorBuilder: (context, error, stackTrace) => _buildFallback(item, isDark),
      );
    } else if (url.startsWith('assets/')) {
      imageWidget = Image.asset(
        url,
        fit: BoxFit.cover,
        width: double.infinity,
        height: widget.height,
        errorBuilder: (context, error, stackTrace) => _buildFallback(item, isDark),
      );
    } else if (url.isNotEmpty) {
      imageWidget = Image.file(
        File(url),
        fit: BoxFit.cover,
        width: double.infinity,
        height: widget.height,
        errorBuilder: (context, error, stackTrace) => _buildFallback(item, isDark),
      );
    } else {
      imageWidget = _buildFallback(item, isDark);
    }

    return Stack(
      fit: StackFit.expand,
      children: [
        imageWidget,
        if (item.title != null || item.badge != null)
          Positioned(
            left: 16,
            bottom: 24,
            right: 16,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (item.badge != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      item.badge!.toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                if (item.title != null)
                  Text(
                    item.title!,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      shadows: [Shadow(color: Colors.black87, blurRadius: 4)],
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }

  /// Video Slide Supporting MP4/WebM/MOV with playback badge
  Widget _buildVideoSlide(SlideMediaItem item, bool isDark) {
    return Container(
      width: double.infinity,
      height: widget.height,
      color: Colors.black,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Background thumbnail or placeholder
          if (item.mediaUrl != null && item.mediaUrl!.isNotEmpty)
            _buildImageSlide(item, isDark)
          else
            _buildFallback(item, isDark),

          // Video Play Overlay Badge
          Center(
            child: Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.55),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white.withValues(alpha: 0.8), width: 1.5),
              ),
              child: const Icon(
                CupertinoIcons.play_arrow_solid,
                color: Colors.white,
                size: 26,
              ),
            ),
          ),

          // Video Format Badge
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(CupertinoIcons.video_camera_solid, color: Colors.white, size: 12),
                  SizedBox(width: 4),
                  Text(
                    'VIDEO',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFallback(SlideMediaItem item, bool isDark) {
    return _buildFlutterDefaultSlide(item, isDark);
  }
}
