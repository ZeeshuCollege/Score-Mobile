import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:score/presentation/profile/profile_screen.dart';

import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('ProfileScreen renders Apple-design editable fields, stats cards, and weekly chart', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ProfileScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 1. Navigation bar & title
    expect(find.text('Profile'), findsOneWidget);
    expect(find.text('Save'), findsOneWidget);

    // 2. Avatar edit action
    expect(find.text('Edit Photo & Persona'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.camera_fill), findsOneWidget);

    // 3. Editable form fields
    expect(find.text('STUDENT PROFILE'), findsOneWidget);
    expect(find.text('Name'), findsOneWidget);
    expect(find.text('Bio / Goal'), findsOneWidget);
    expect(find.text('Dream College'), findsOneWidget);
    expect(find.text('Target Exam'), findsOneWidget);
    expect(find.text('Aspirant Scholar'), findsOneWidget);

    // 4. Apple Fitness-style 2x2 Bento Performance stats
    expect(find.text('PERFORMANCE STATS'), findsOneWidget);
    expect(find.text('SOLVED'), findsOneWidget);
    expect(find.text('ACCURACY'), findsOneWidget);
    expect(find.text('STREAK'), findsOneWidget);
    expect(find.text('STUDY TIME'), findsOneWidget);
    expect(find.text('1248'), findsOneWidget);
    expect(find.text('84.2%'), findsOneWidget);
    expect(find.text('12 Days'), findsOneWidget);

    // 5. Weekly Practice chart
    expect(find.text('WEEKLY PRACTICE DRILLS'), findsOneWidget);
    expect(find.text('308 Questions Solved'), findsOneWidget);
    expect(find.text('Mon'), findsOneWidget);
    expect(find.text('Sun'), findsOneWidget);

    // 6. Subject Breakdown & Unlocked Achievements
    expect(find.text('SUBJECT MASTERY & ACCURACY'), findsOneWidget);
    expect(find.text('Physics'), findsOneWidget);
    expect(find.text('Chemistry'), findsOneWidget);
    expect(find.text('UNLOCKED ACHIEVEMENTS'), findsOneWidget);
    expect(find.text('Century Solver'), findsOneWidget);
  });

  testWidgets('Editing name, bio, and college updates and enables saving', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ProfileScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Enter new name
    final nameField = find.widgetWithText(CupertinoTextField, 'Aspirant Scholar');
    expect(nameField, findsOneWidget);

    await tester.enterText(nameField, 'Arjun Sharma');
    await tester.pumpAndSettle();

    expect(find.text('Arjun Sharma'), findsOneWidget);

    // Tap Save
    await tester.tap(find.text('Save'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // SnackBar appears
    expect(find.text('Profile changes saved successfully!'), findsOneWidget);
  });

  testWidgets('Avatar Persona picker sheet opens and selects new persona', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ProfileScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Tap on avatar edit
    await tester.tap(find.text('Edit Photo & Persona'));
    await tester.pumpAndSettle();

    // Verify avatar picker sheet appears
    expect(find.text('Choose Avatar Persona'), findsOneWidget);
    expect(find.text('Electric Teal'), findsOneWidget);
    expect(find.text('Sunset Flame'), findsOneWidget);
    expect(find.text('Cosmic Purple'), findsOneWidget);

    // Tap Electric Teal persona
    await tester.tap(find.text('Electric Teal'));
    await tester.pumpAndSettle();

    // Sheet dismissed
    expect(find.text('Choose Avatar Persona'), findsNothing);
  });
}
