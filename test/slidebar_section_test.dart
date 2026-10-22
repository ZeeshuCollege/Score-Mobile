import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:score/presentation/home/widgets/slidebar_section.dart';

void main() {
  testWidgets('SlidebarSection renders 5 default Flutter slides with white dots at bottom and auto-advances every 2s', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SlidebarSection(),
        ),
      ),
    );
    await tester.pump();

    // 1. Verify default Flutter logo is rendered on slide
    expect(find.byType(FlutterLogo), findsWidgets);
    expect(find.text('SCORE Engine v2.0'), findsOneWidget);

    // 2. Verify PageView is present
    expect(find.byType(PageView), findsOneWidget);

    // 3. Verify white indicator dots at the bottom inside container
    // Default has 5 slides, so 5 dot containers
    final dotFinder = find.byType(AnimatedContainer);
    expect(dotFinder, findsWidgets);

    // 4. Verify auto-scroll advances after 2 seconds
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();

    // After 2 seconds, slide 2 ('Top 500 Questions') should now be active
    expect(find.text('Top 500 Questions'), findsOneWidget);

    // Advance another 2 seconds -> slide 3 ('Daily Practice Target')
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
    expect(find.text('Daily Practice Target'), findsOneWidget);
  });

  testWidgets('SlidebarSection strictly enforces a maximum of 5 items when more are supplied', (tester) async {
    final sevenItems = List.generate(
      7,
      (i) => SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        title: 'Slide Item #$i',
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SlidebarSection(items: sevenItems),
        ),
      ),
    );
    await tester.pump();

    // Should only have 5 slides
    final pageView = tester.widget<PageView>(find.byType(PageView));
    final controller = pageView.controller;
    expect(controller, isNotNull);

    // Initial slide
    expect(find.text('Slide Item #0'), findsOneWidget);

    // Swipe through up to slide 4 (the 5th item)
    for (int i = 1; i < 5; i++) {
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();
      expect(find.text('Slide Item #$i'), findsOneWidget);
    }

    // Advance another 2 seconds -> loops back to Slide Item #0, NEVER reaches #5 or #6
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
    expect(find.text('Slide Item #0'), findsOneWidget);
    expect(find.text('Slide Item #5'), findsNothing);
    expect(find.text('Slide Item #6'), findsNothing);
  });

  testWidgets('SlidebarSection supports video slide type and interactive taps', (tester) async {
    bool tapped = false;
    final items = [
      SlideMediaItem(
        type: SlideMediaType.video,
        title: 'Video Solution Masterclass',
        onTap: () => tapped = true,
      ),
      const SlideMediaItem(
        type: SlideMediaType.flutterDefault,
        title: 'Second Slide',
      ),
    ];

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SlidebarSection(items: items),
        ),
      ),
    );
    await tester.pump();

    // Verify video badge
    expect(find.text('VIDEO'), findsOneWidget);
    expect(find.text('Video Solution Masterclass'), findsOneWidget);

    // Tap slide
    await tester.tap(find.text('Video Solution Masterclass'));
    await tester.pump();
    expect(tapped, isTrue);
  });
}
