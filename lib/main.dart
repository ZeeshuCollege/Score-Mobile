import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/theme/app_colors.dart';
import 'app/theme/app_theme.dart';
import 'presentation/main_nav_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Enable full-screen edge-to-edge drawing under notification bar, Dynamic Island, and gestures
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  runApp(
    const ProviderScope(
      child: ScoreApp(),
    ),
  );
}

class ScoreApp extends StatelessWidget {
  const ScoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SCORE',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      builder: (context, child) {
        if (child == null) return const SizedBox.shrink();
        final mediaQuery = MediaQuery.of(context);
        if (mediaQuery.size.width <= 0 || mediaQuery.size.height <= 0) {
          return const SizedBox.shrink();
        }
        final isDark = Theme.of(context).brightness == Brightness.dark;
        final systemOverlay = SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
          statusBarBrightness: isDark ? Brightness.dark : Brightness.light,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarDividerColor: Colors.transparent,
          systemNavigationBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
          systemNavigationBarContrastEnforced: false,
        );

        const double scale = 0.7; // Scale entire app content 30% smaller
        final scaledSize = mediaQuery.size / scale;
        const double invScale = 1.0 / scale;

        return AnnotatedRegion<SystemUiOverlayStyle>(
          value: systemOverlay,
          child: ColoredBox(
            color: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
            child: MediaQuery(
              data: mediaQuery.copyWith(
                size: scaledSize,
                padding: mediaQuery.padding * invScale,
                viewPadding: mediaQuery.viewPadding * invScale,
                viewInsets: mediaQuery.viewInsets * invScale,
              ),
              child: FittedBox(
                fit: BoxFit.contain,
                alignment: Alignment.topCenter,
                child: SizedBox(
                  width: scaledSize.width,
                  height: scaledSize.height,
                  child: child,
                ),
              ),
            ),
          ),
        );
      },
      home: const MainNavScreen(),
    );
  }
}
