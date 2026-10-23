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

  testWidgets('ProfileScreen renders with Edit button by default and locked profile fields', (tester) async {
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
    // Verified: Edit button is displayed instead of save button by default
    expect(find.text('Edit'), findsOneWidget);
    expect(find.text('Save'), findsNothing);

    // 2. Avatar edit action is present and visible
    expect(find.text('Edit Photo & Persona'), findsOneWidget);
    expect(find.byIcon(CupertinoIcons.camera_fill), findsOneWidget);

    // 3. Form fields are read-only by default
    expect(find.text('STUDENT PROFILE'), findsOneWidget);
    expect(find.text('Name'), findsOneWidget);
    expect(find.text('Bio / Goal'), findsOneWidget);
    expect(find.text('Dream College'), findsOneWidget);
    expect(find.text('Target Exam'), findsOneWidget);
    expect(find.text('Aspirant Scholar'), findsOneWidget);

    final nameField = tester.widget<CupertinoTextField>(
      find.widgetWithText(CupertinoTextField, 'Aspirant Scholar'),
    );
    expect(nameField.readOnly, isTrue);

    // 4. Locked status hint is shown
    expect(find.text('Profile details are locked. Tap "Edit" above to change.'), findsOneWidget);

    // 5. Apple Fitness-style 2x2 Bento Performance stats
    expect(find.text('PERFORMANCE STATS'), findsOneWidget);
    expect(find.text('SOLVED'), findsOneWidget);
    expect(find.text('ACCURACY'), findsOneWidget);
    expect(find.text('STREAK'), findsOneWidget);
    expect(find.text('STUDY TIME'), findsOneWidget);
    expect(find.text('1248'), findsOneWidget);
    expect(find.text('84.2%'), findsOneWidget);
    expect(find.text('12 Days'), findsOneWidget);

    // 6. Weekly Practice chart
    expect(find.text('WEEKLY PRACTICE DRILLS'), findsOneWidget);
    expect(find.text('308 Questions Solved'), findsOneWidget);
    expect(find.text('Mon'), findsOneWidget);
    expect(find.text('Sun'), findsOneWidget);

    // 7. Subject Breakdown & Unlocked Achievements
    expect(find.text('SUBJECT MASTERY & ACCURACY'), findsOneWidget);
    expect(find.text('Physics'), findsOneWidget);
    expect(find.text('Chemistry'), findsOneWidget);
    expect(find.text('UNLOCKED ACHIEVEMENTS'), findsOneWidget);
    expect(find.text('Century Solver'), findsOneWidget);
  });

  testWidgets('Clicking Edit enables editing, changes button to Save, and saves profile changes', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ProfileScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 1. Initially fields are readOnly and Edit button is visible
    expect(find.text('Edit'), findsOneWidget);
    var nameField = tester.widget<CupertinoTextField>(
      find.widgetWithText(CupertinoTextField, 'Aspirant Scholar'),
    );
    expect(nameField.readOnly, isTrue);

    // 2. Click Edit button
    await tester.tap(find.text('Edit'));
    await tester.pumpAndSettle();

    // 3. Button changes to Save, and fields become editable
    expect(find.text('Save'), findsWidgets);
    expect(find.text('Cancel'), findsOneWidget);

    nameField = tester.widget<CupertinoTextField>(
      find.widgetWithText(CupertinoTextField, 'Aspirant Scholar'),
    );
    expect(nameField.readOnly, isFalse);

    // 4. Enter new name
    await tester.enterText(find.widgetWithText(CupertinoTextField, 'Aspirant Scholar'), 'Arjun Sharma');
    await tester.pumpAndSettle();

    expect(find.text('Arjun Sharma'), findsOneWidget);

    // 5. Tap Save in AppBar
    await tester.tap(find.text('Save').first);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // 6. SnackBar appears and screen returns to view mode
    expect(find.text('Profile changes saved successfully!'), findsOneWidget);
    expect(find.text('Edit'), findsOneWidget);

    final updatedField = tester.widget<CupertinoTextField>(
      find.widgetWithText(CupertinoTextField, 'Arjun Sharma'),
    );
    expect(updatedField.readOnly, isTrue);
  });

  testWidgets('Only profilepic option is editable even WITHOUT clicking edit button', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ProfileScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Verify NOT in edit mode
    expect(find.text('Edit'), findsOneWidget);
    expect(find.text('Save'), findsNothing);

    // Tap on avatar edit WITHOUT clicking Edit button
    await tester.tap(find.text('Edit Photo & Persona'));
    await tester.pumpAndSettle();

    // Verify avatar picker sheet opens
    expect(find.text('Choose Avatar Persona'), findsOneWidget);
    expect(find.text('Electric Teal'), findsOneWidget);
    expect(find.text('Sunset Flame'), findsOneWidget);
    expect(find.text('Cosmic Purple'), findsOneWidget);

    // Select Electric Teal persona
    await tester.tap(find.text('Electric Teal'));
    await tester.pumpAndSettle();

    // Sheet dismissed and avatar updated immediately
    expect(find.text('Choose Avatar Persona'), findsNothing);

    // Profile fields remain locked
    final nameField = tester.widget<CupertinoTextField>(
      find.widgetWithText(CupertinoTextField, 'Aspirant Scholar'),
    );
    expect(nameField.readOnly, isTrue);
  });
}
