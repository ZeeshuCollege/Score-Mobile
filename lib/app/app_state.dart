import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() {
    _loadTheme();
    return ThemeMode.system;
  }

  Future<void> _loadTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final modeStr = prefs.getString('app_theme_mode');
      if (modeStr == 'light') {
        state = ThemeMode.light;
      } else if (modeStr == 'dark') {
        state = ThemeMode.dark;
      } else {
        state = ThemeMode.system;
      }
    } catch (_) {}
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = mode;
    try {
      final prefs = await SharedPreferences.getInstance();
      if (mode == ThemeMode.light) {
        await prefs.setString('app_theme_mode', 'light');
      } else if (mode == ThemeMode.dark) {
        await prefs.setString('app_theme_mode', 'dark');
      } else {
        await prefs.setString('app_theme_mode', 'system');
      }
    } catch (_) {}
  }
}

final themeModeProvider = NotifierProvider<ThemeModeNotifier, ThemeMode>(ThemeModeNotifier.new);

class SelectedExamNotifier extends Notifier<String> {
  @override
  String build() {
    _loadExam();
    return 'jee_main';
  }

  Future<void> _loadExam() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final exam = prefs.getString('selected_exam_id');
      if (exam != null && exam.isNotEmpty) {
        state = exam;
      }
    } catch (_) {}
  }

  Future<void> setExam(String examId) async {
    state = examId;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('selected_exam_id', examId);
    } catch (_) {}
  }
}

final selectedExamProvider = NotifierProvider<SelectedExamNotifier, String>(SelectedExamNotifier.new);
