import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildDefaultApp({required Widget home}) {
    return MaterialApp(
      home: home,
    );
  }

  testWidgets('Test tap, scroll, textfield, dialog under default scale', (tester) async {
    bool dialogConfirmed = false;
    final textController = TextEditingController();

    await tester.pumpWidget(
      buildDefaultApp(
        home: Scaffold(
          body: ListView(
            children: [
              const SizedBox(height: 50),
              TextField(
                controller: textController,
                key: const Key('test_field'),
              ),
              const SizedBox(height: 50),
              Builder(
                builder: (context) => ElevatedButton(
                  key: const Key('open_dialog'),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Dialog Title'),
                        actions: [
                          TextButton(
                            key: const Key('confirm_btn'),
                            onPressed: () {
                              dialogConfirmed = true;
                              Navigator.pop(ctx);
                            },
                            child: const Text('Confirm'),
                          ),
                        ],
                      ),
                    );
                  },
                  child: const Text('Open Dialog'),
                ),
              ),
              for (int i = 0; i < 50; i++)
                ListTile(
                  title: Text('Item $i'),
                ),
            ],
          ),
        ),
      ),
    );

    // 1. Text field input
    await tester.enterText(find.byKey(const Key('test_field')), 'Hello Flutter');
    expect(textController.text, 'Hello Flutter');

    // 2. Open dialog and tap button inside
    await tester.tap(find.byKey(const Key('open_dialog')));
    await tester.pumpAndSettle();
    expect(find.text('Dialog Title'), findsOneWidget);

    await tester.tap(find.byKey(const Key('confirm_btn')));
    await tester.pumpAndSettle();
    expect(dialogConfirmed, isTrue);
    expect(find.text('Dialog Title'), findsNothing);

    // 3. Scroll ListView
    expect(find.text('Item 0'), findsOneWidget);
    await tester.drag(find.byType(ListView), const Offset(0, -500));
    await tester.pumpAndSettle();
    expect(find.text('Item 0'), findsNothing);
  });
}
