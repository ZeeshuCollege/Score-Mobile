import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app_links/app_links.dart';
import 'app/app_state.dart';
import 'app/theme/app_colors.dart';
import 'app/theme/app_theme.dart';
import 'presentation/auth/splash_screen.dart';
import 'data/remote/supabase_service.dart';
import 'core/services/firebase_notification_service.dart';
import 'core/services/app_config_service.dart';
import 'presentation/auth/auth_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Enable full-screen edge-to-edge drawing under notification bar, Dynamic Island, and gestures
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);

  // Initialize Supabase Backend Client (Email Auth, Google OAuth, Cloud DB)
  await SupabaseService.instance.initialize();

  // Initialize Dynamic App Configuration (Live Logo & Slideshow Asset Synchronization)
  await AppConfigService.instance.initialize();

  // Initialize Firebase and FCM (gracefully degrades if config files are absent)
  // google-services.json (Android) and GoogleService-Info.plist (iOS) must be
  // added to the project before this will connect to a live Firebase project.
  // See INFRASTRUCTURE_SETUP.md for Firebase configuration instructions.
  await FirebaseNotificationService.instance.initialize();

  runApp(
    const ProviderScope(
      child: ScoreApp(),
    ),
  );
}

class ScoreApp extends ConsumerStatefulWidget {
  const ScoreApp({super.key});

  @override
  ConsumerState<ScoreApp> createState() => _ScoreAppState();
}

class _ScoreAppState extends ConsumerState<ScoreApp> {
  late final AppLinks _appLinks;

  @override
  void initState() {
    super.initState();
    _initDeepLinks();
  }

  /// Listens for incoming deep links (including the OAuth callback
  /// `score://login-callback?code=...`) and forwards them to the
  /// auth notifier for processing.
  void _initDeepLinks() {
    _appLinks = AppLinks();

    _appLinks.uriLinkStream.listen(
      (uri) {
        debugPrint('ScoreApp: deep link received — $uri');
        if (uri.host == 'login-callback') {
          ref.read(authProvider.notifier).handleOAuthCallback(uri);
        }
      },
      onError: (e) {
        debugPrint('ScoreApp: deep link error — $e');
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp(
      title: 'SCORE',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
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

        return AnnotatedRegion<SystemUiOverlayStyle>(
          value: systemOverlay,
          child: ColoredBox(
            color: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
            child: child,
          ),
        );
      },
      home: const SplashScreen(),
    );
  }
}
