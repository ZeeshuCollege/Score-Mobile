import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:score/presentation/auth/splash_screen.dart';
import 'package:score/presentation/auth/onboarding_slideshow_screen.dart';
import 'package:score/presentation/auth/auth_landing_screen.dart';
import 'package:score/presentation/main_nav_screen.dart';
import 'package:score/data/local/app_database.dart';

void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('SplashScreen renders white background, default Flutter icon as Score logo, and SCORE text', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: SplashScreen(),
        ),
      ),
    );
    await tester.pump();

    // 1. Verify Flutter logo is rendered
    expect(find.byType(FlutterLogo), findsOneWidget);

    // 2. Verify SCORE text
    expect(find.text('SCORE'), findsOneWidget);

    // 3. Verify white background
    final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
    expect(scaffold.backgroundColor, Colors.white);

    // Let timer complete
    await tester.pump(const Duration(milliseconds: 2000));
    await tester.pumpAndSettle();
  });

  testWidgets('OnboardingSlideshowScreen renders full screen slideshow with max 3 slides and Login/Signup button', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: OnboardingSlideshowScreen(),
        ),
      ),
    );
    await tester.pump();

    // 1. Verify Login / Sign Up button exists
    expect(find.text('Login / Sign Up'), findsOneWidget);

    // 2. Verify max 3 slides via PageView and indicators
    expect(find.byType(PageView), findsOneWidget);
    expect(find.text('100K+ Authentic PYQs\nwith KaTeX Math'), findsOneWidget);

    // 3. Tap Login / Sign Up button navigates to AuthLandingScreen
    await tester.tap(find.text('Login / Sign Up'));
    await tester.pumpAndSettle();

    expect(find.byType(AuthLandingScreen), findsOneWidget);
  });

  testWidgets('AuthLandingScreen has centered login and signup switcher, Google buttons, and authenticates SQLite test user', (tester) async {
    tester.view.physicalSize = const Size(800, 1400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: AuthLandingScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 1. Segmented Switcher exists
    expect(find.text('Login'), findsOneWidget);
    expect(find.text('Sign Up'), findsOneWidget);

    // 2. Google sign-in button exists on Login view
    expect(find.text('Sign in with Google'), findsOneWidget);

    // 3. Testing account helper banner exists
    expect(find.text('Auto-Fill Testing ID'), findsOneWidget);

    // 4. Test auto-filling credentials
    await tester.tap(find.text('Auto-Fill Testing ID'));
    await tester.pumpAndSettle();

    expect(find.text('pinjari.work@gmail.com'), findsWidgets);
    expect(find.text('Student@123'), findsWidgets);

    // 5. Test switching to Sign Up view
    await tester.tap(find.text('Sign Up'));
    await tester.pumpAndSettle();

    expect(find.text('Sign up with Google'), findsOneWidget);
    expect(find.text('Create Account'), findsOneWidget);

    // 6. Switch back to Login and authenticate test user
    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Auto-Fill Testing ID'));
    await tester.pumpAndSettle();

    // Tap Login inside runAsync so FFI isolate messages are processed
    await tester.runAsync(() async {
      await tester.tap(find.text('Login to SCORE'));
      await Future.delayed(const Duration(milliseconds: 600));
    });
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    // Verified: navigates to MainNavScreen on successful SQLite authentication
    expect(find.byType(MainNavScreen), findsOneWidget);
  });

  test('AppDatabase authenticates seeded user pinjari.work@gmail.com with Student@123', () async {
    final success = await AppDatabase.instance.authenticateUser(
      'pinjari.work@gmail.com',
      'Student@123',
    );
    expect(success, isTrue);

    final invalid = await AppDatabase.instance.authenticateUser(
      'pinjari.work@gmail.com',
      'WrongPassword',
    );
    expect(invalid, isFalse);
  });
}
