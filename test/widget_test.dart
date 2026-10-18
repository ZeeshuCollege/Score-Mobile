import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:score/main.dart';

void main() {
  testWidgets('ScoreApp smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: ScoreApp(),
      ),
    );

    // Verify SCORE title renders
    expect(find.text('SCORE'), findsOneWidget);
  });
}
