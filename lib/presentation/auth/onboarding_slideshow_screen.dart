import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../main_nav_screen.dart';
import 'auth_landing_screen.dart';
import 'auth_provider.dart';

class OnboardingSlide {
  final String title;
  final String subtitle;
  final String badge;
  final List<Color> gradient;
  final IconData icon;

  const OnboardingSlide({
    required this.title,
    required this.subtitle,
    required this.badge,
    required this.gradient,
    required this.icon,
  });
}

/// Full screen slideshow about the app with a maximum of three slides/images.
class OnboardingSlideshowScreen extends ConsumerStatefulWidget {
  const OnboardingSlideshowScreen({super.key});

  @override
  ConsumerState<OnboardingSlideshowScreen> createState() => _OnboardingSlideshowScreenState();
}

class _OnboardingSlideshowScreenState extends ConsumerState<OnboardingSlideshowScreen> {
  late final PageController _pageController;
  int _currentPage = 0;
  Timer? _autoSlideTimer;

  // Maximum of 3 images / slides as requested
  static const List<OnboardingSlide> slides = [
    OnboardingSlide(
      badge: 'PREVIOUS YEAR QUESTIONS',
      title: '100K+ Authentic PYQs\nwith KaTeX Math',
      subtitle: 'Chapter-wise questions for JEE Main, JEE Advanced, and NEET with comprehensive step-by-step solutions.',
      gradient: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF02569B)],
      icon: CupertinoIcons.book_fill,
    ),
    OnboardingSlide(
      badge: 'NTA CBT SIMULATION',
      title: 'Real Computer-Based\nCustom Mock Tests',
      subtitle: 'Simulate official exam conditions with countdown timers, question palettes, and instant accuracy analytics.',
      gradient: [Color(0xFF064E3B), Color(0xFF0F172A), Color(0xFF007AFF)],
      icon: CupertinoIcons.speedometer,
    ),
    OnboardingSlide(
      badge: 'SMART REVISION',
      title: 'AI Mistake Notebook\n& Daily Streaks',
      subtitle: 'Categorize calculation and conceptual errors to eliminate flaws and boost your All India Rank.',
      gradient: [Color(0xFF4C1D95), Color(0xFF1E1B4B), Color(0xFFFF9500)],
      icon: CupertinoIcons.flame_fill,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startTimer();
  }

  void _startTimer() {
    _autoSlideTimer?.cancel();
    _autoSlideTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!mounted || !_pageController.hasClients) return;
      final next = (_currentPage + 1) % slides.length;
      _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _openAuthLanding({bool initialIsSignup = false}) {
    HapticFeedback.lightImpact();
    Navigator.push(
      context,
      CupertinoPageRoute(
        builder: (_) => AuthLandingScreen(initialIsSignup: initialIsSignup),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Full-screen PageView (Max 3 slides)
          PageView.builder(
            controller: _pageController,
            itemCount: slides.length,
            onPageChanged: (idx) {
              setState(() => _currentPage = idx);
              _startTimer();
            },
            itemBuilder: (context, index) {
              final item = slides[index];
              return _buildSlidePage(item);
            },
          ),

          // 2. Top Skip / Guest action
          SafeArea(
            child: Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: CupertinoButton(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  color: Colors.white.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    ref.read(authProvider.notifier).continueAsGuest();
                    Navigator.pushReplacement(
                      context,
                      CupertinoPageRoute(builder: (_) => const MainNavScreen()),
                    );
                  },
                  child: const Text(
                    'Skip',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // 3. Bottom Controls (Indicator Dots + Login/Signup Button)
          SafeArea(
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Slide Indicator Dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(slides.length, (idx) {
                        final isSelected = idx == _currentPage;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeOutCubic,
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: isSelected ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: isSelected ? Colors.white : Colors.white30,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: 24),

                    // Primary Login / Signup Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: CupertinoButton(
                        color: AppColors.systemBlue,
                        borderRadius: BorderRadius.circular(16),
                        padding: EdgeInsets.zero,
                        onPressed: () => _openAuthLanding(initialIsSignup: false),
                        child: const Text(
                          'Login / Sign Up',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: -0.2,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Quick guest alternative
                    CupertinoButton(
                      padding: EdgeInsets.zero,
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        ref.read(authProvider.notifier).continueAsGuest();
                        Navigator.pushReplacement(
                          context,
                          CupertinoPageRoute(builder: (_) => const MainNavScreen()),
                        );
                      },
                      child: Text(
                        'Continue as Guest',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: Colors.white.withValues(alpha: 0.7),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSlidePage(OnboardingSlide slide) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: slide.gradient,
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Spacer(flex: 2),

              // Default Flutter icon hero badge showcase
              Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.08),
                  border: Border.all(color: Colors.white24, width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.4),
                      blurRadius: 32,
                      offset: const Offset(0, 12),
                    ),
                  ],
                ),
                child: const Center(
                  child: FlutterLogo(
                    size: 80,
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Category Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  slide.badge,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.0,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                slide.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  height: 1.25,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 14),

              // Subtitle
              Text(
                slide.subtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.white.withValues(alpha: 0.75),
                  height: 1.45,
                ),
              ),

              const Spacer(flex: 3),
            ],
          ),
        ),
      ),
    );
  }
}
