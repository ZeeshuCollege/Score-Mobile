import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:score/presentation/home/home_screen.dart';
import 'package:score/presentation/custom_test/custom_test_screen.dart';

void main() {
  testWidgets('Verify single-line equidistant SCORE, Course, Streak with side arrow and left ScoreDrawer', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 1. Verify single-line header items, right-facing side arrow, and NO dividers
    expect(find.text('SCORE'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.chevron_right), findsWidgets);
    expect(find.text('JEE Main'), findsWidgets);
    expect(find.text('12d'), findsOneWidget);
    expect(find.text('|'), findsNothing); // Divider must be removed

    // 2. Tap SCORE to open left drawer
    await tester.tap(find.text('SCORE'));
    await tester.pumpAndSettle();

    // 3. Verify Drawer contents: 4 rectangular buttons filling sidebar
    // Button 1: Course button
    expect(find.text('Course'), findsOneWidget);

    // Button 2: Theme toggler with Light and Dark in small
    expect(find.text('Theme'), findsOneWidget);
    expect(find.text('Light'), findsOneWidget);
    expect(find.text('Dark'), findsOneWidget);

    // Button 3: Profile button with profile icon
    expect(find.text('Profile'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.person_crop_circle_fill), findsOneWidget);

    // Button 4: Settings button with settings icon
    expect(find.text('Settings'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.gear_alt_fill), findsOneWidget);

    // 4. Test Course button click opens the previous popup (CupertinoActionSheet)
    await tester.tap(find.text('Course'));
    await tester.pumpAndSettle();

    // Verify popup appears with examination choices
    expect(find.text('Select Target Examination'), findsOneWidget);
    expect(find.text('JEE Advanced'), findsOneWidget);
    expect(find.text('NEET UG'), findsOneWidget);
    expect(find.text('Cancel'), findsOneWidget);

    // Select JEE Advanced from popup
    await tester.tap(find.text('JEE Advanced'));
    await tester.pumpAndSettle();

    // Close drawer if open and check updated course on home screen
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
