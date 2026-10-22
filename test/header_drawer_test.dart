import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:score/presentation/home/home_screen.dart';
import 'package:score/presentation/custom_test/custom_test_screen.dart';

void main() {
  testWidgets('Verify single-line SCORE | Course | Streak and left ScoreDrawer', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 1. Verify single-line header items
    expect(find.text('SCORE'), findsOneWidget);
    expect(find.text('JEE Main'), findsWidgets);
    expect(find.text('12d'), findsOneWidget);

    // 2. Tap SCORE to open left drawer
    await tester.tap(find.text('SCORE'));
    await tester.pumpAndSettle();

    // 3. Verify Drawer contents
    // Profile
    expect(find.text('Aspirant Profile'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.person_crop_circle_fill), findsOneWidget);

    // Course Changer
    expect(find.text('COURSE CHANGER'), findsOneWidget);
    expect(find.text('JEE Advanced'), findsOneWidget);
    expect(find.text('NEET UG'), findsOneWidget);

    // Appearance Toggler
    expect(find.text('APPEARANCE'), findsOneWidget);
    expect(find.text('Light'), findsOneWidget);
    expect(find.text('Dark'), findsOneWidget);
    expect(find.text('System'), findsOneWidget);

    // Settings
    expect(find.text('Settings'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.gear_alt_fill), findsWidgets);

    // 4. Test Course Changer in drawer: switch to JEE Advanced
    await tester.tap(find.text('JEE Advanced'));
    await tester.pumpAndSettle();

    // Drawer closes and home header now shows JEE Advanced
    expect(find.text('JEE Advanced'), findsWidgets);
  });

  testWidgets('Verify biology subject is excluded for JEE and JEE Advanced in CustomTestScreen', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: CustomTestScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Default exam is JEE Main: Physics, Chemistry, Mathematics should exist, Biology must NOT
    expect(find.text('Physics'), findsOneWidget);
    expect(find.text('Chemistry'), findsOneWidget);
    expect(find.text('Mathematics'), findsOneWidget);
    expect(find.text('Biology'), findsNothing);

    // Switch to JEE Advanced
    await tester.tap(find.text('JEE Advanced'));
    await tester.pumpAndSettle();

    // Biology must still NOT be present
    expect(find.text('Biology'), findsNothing);

    // Switch to NEET UG
    await tester.tap(find.text('NEET UG'));
    await tester.pumpAndSettle();

    // Biology should now be present for NEET
    expect(find.text('Biology'), findsOneWidget);
  });
}
