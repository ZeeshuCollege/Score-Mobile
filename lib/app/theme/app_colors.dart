import 'package:flutter/material.dart';

/// Apple Human Interface Guidelines (HIG) Semantic Palette for SCORE
/// Grounded in Apple HIG Color & Materials Specifications (iOS 17/18/Liquid Glass)
class AppColors {
  // Apple System Accent
  static const Color systemBlue = Color(0xFF007AFF); // Light System Blue
  static const Color systemBlueDark = Color(0xFF0A84FF); // Dark System Blue
  static const Color brandBlue = systemBlue; // Alias for backward compatibility
  static const Color brandBlueLight = Color(0xFFE5F1FF);

  // Apple Semantic Functional Tints
  static const Color correctGreen = Color(0xFF34C759); // iOS System Green
  static const Color systemGreenDark = Color(0xFF30D158);
  static const Color correctGreenSurfaceLight = Color(0xFFEAF9EE);
  static const Color correctGreenSurfaceDark = Color(0xFF0F3D1A);

  static const Color errorRed = Color(0xFFFF3B30); // iOS System Red
  static const Color systemRedDark = Color(0xFFFF453A);
  static const Color errorRedSurfaceLight = Color(0xFFFFECEB);
  static const Color errorRedSurfaceDark = Color(0xFF45110E);

  static const Color reviewAmber = Color(0xFFFF9500); // iOS System Orange
  static const Color systemOrange = Color(0xFFFF9500);
  static const Color systemOrangeDark = Color(0xFFFF9F0A);
  static const Color reviewAmberSurfaceLight = Color(0xFFFFF4E5);
  static const Color reviewAmberSurfaceDark = Color(0xFF452703);

  static const Color systemIndigo = Color(0xFF5856D6); // iOS System Indigo
  static const Color systemPurple = Color(0xFFAF52DE); // iOS System Purple
  static const Color systemTeal = Color(0xFF5AC8FA);   // iOS System Teal

  // Light Appearance (iOS System Grouped Backgrounds & Labels)
  static const Color lightCanvasBg = Color(0xFFF2F2F7); // iOS Grouped Canvas
  static const Color lightGroupedBackground = lightCanvasBg;
  static const Color lightCardSurface = Color(0xFFFFFFFF); // Grouped Cell Surface
  static const Color lightSecondarySurface = Color(0xFFF2F2F7);
  static const Color lightCardStroke = Color(0xFFE5E5EA); // Hairline separator
  static const Color lightHairline = Color(0xFFE5E5EA);
  static const Color lightSeparator = Color(0x333C3C43); // 20% opacity separator
  static const Color lightTextPrimary = Color(0xFF000000); // System Label
  static const Color lightTextSecondary = Color(0xFF6C6C70); // Secondary Label
  static const Color lightTextMuted = Color(0xFF8E8E93); // Tertiary Label
  static const Color lightFill = Color(0x1F787880); // System Fill (12%)

  // Dark Appearance (iOS True OLED Midnight & Vibrant Labels)
  static const Color darkCanvasBg = Color(0xFF000000); // Pure OLED Black
  static const Color darkGroupedBackground = darkCanvasBg;
  static const Color darkCardSurface = Color(0xFF1C1C1E); // iOS Secondary System Grouped
  static const Color darkSecondarySurface = Color(0xFF2C2C2E); // Tertiary System Grouped
  static const Color darkCardStroke = Color(0xFF2C2C2E);
  static const Color darkHairline = Color(0xFF2C2C2E);
  static const Color darkSeparator = Color(0x38383A80);
  static const Color darkTextPrimary = Color(0xFFFFFFFF);
  static const Color darkTextSecondary = Color(0xFF8E8E93);
  static const Color darkTextMuted = Color(0xFF636366);
  static const Color darkFill = Color(0x3D787880); // Dark System Fill (24%)

  // Liquid Glass Material Tints
  static const Color glassLight = Color(0xD9FFFFFF); // 85% White Frosted
  static const Color glassDark = Color(0xD91C1C1E);  // 85% Translucent Midnight
}
