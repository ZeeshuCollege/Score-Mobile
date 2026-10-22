import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      splashFactory: NoSplash.splashFactory, // iOS uses opacity feedback rather than ripple
      highlightColor: Colors.black.withValues(alpha: 0.05),
      scaffoldBackgroundColor: AppColors.lightCanvasBg,
      primaryColor: AppColors.systemBlue,
      colorScheme: const ColorScheme.light(
        primary: AppColors.systemBlue,
        secondary: AppColors.correctGreen,
        error: AppColors.errorRed,
        surface: AppColors.lightCardSurface,
        onSurface: AppColors.lightTextPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.lightCanvasBg,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary),
        iconTheme: IconThemeData(color: AppColors.systemBlue),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarDividerColor: Colors.transparent,
          systemNavigationBarIconBrightness: Brightness.dark,
          systemNavigationBarContrastEnforced: false,
        ),
      ),
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
          TargetPlatform.linux: CupertinoPageTransitionsBuilder(),
        },
      ),
      cardTheme: CardThemeData(
        color: AppColors.lightCardSurface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: AppColors.lightCardStroke, width: 0.5),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.lightCardStroke,
        thickness: 0.5,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      splashFactory: NoSplash.splashFactory,
      highlightColor: Colors.white.withValues(alpha: 0.05),
      scaffoldBackgroundColor: AppColors.darkCanvasBg,
      primaryColor: AppColors.systemBlueDark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.systemBlueDark,
        secondary: AppColors.systemGreenDark,
        error: AppColors.systemRedDark,
        surface: AppColors.darkCardSurface,
        onSurface: AppColors.darkTextPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.darkCanvasBg,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: AppColors.darkTextPrimary),
        iconTheme: IconThemeData(color: AppColors.systemBlueDark),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarDividerColor: Colors.transparent,
          systemNavigationBarIconBrightness: Brightness.light,
          systemNavigationBarContrastEnforced: false,
        ),
      ),
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
          TargetPlatform.linux: CupertinoPageTransitionsBuilder(),
        },
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkCardSurface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: AppColors.darkCardStroke, width: 0.5),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.darkCardStroke,
        thickness: 0.5,
      ),
    );
  }
}
