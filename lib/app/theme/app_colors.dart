import 'package:flutter/material.dart';

/// Semantic Design System Colors for SCORE
/// Reference: Design.md
class AppColors {
  // Brand Accent
  static const Color brandBlue = Color(0xFF2563EB); // High-contrast cobalt blue
  static const Color brandBlueLight = Color(0xFFEFF6FF); // Soft tint background
  static const Color brandBlueDark = Color(0xFF1E293B);

  // Functional State Colors
  static const Color correctGreen = Color(0xFF10B981); // Emerald green
  static const Color correctGreenSurfaceLight = Color(0xFFECFDF5);
  static const Color correctGreenSurfaceDark = Color(0xFF064E3B);

  static const Color errorRed = Color(0xFFEF4444); // Crisp coral red
  static const Color errorRedSurfaceLight = Color(0xFFFEF2F2);
  static const Color errorRedSurfaceDark = Color(0xFF7F1D1D);

  static const Color reviewAmber = Color(0xFFF59E0B); // Golden amber review
  static const Color reviewAmberSurfaceLight = Color(0xFFFFFBEB);
  static const Color reviewAmberSurfaceDark = Color(0xFF78350F);

  // Light Mode Surfaces & Neutrals
  static const Color lightCanvasBg = Color(0xFFF8FAFC);
  static const Color lightCardSurface = Color(0xFFFFFFFF);
  static const Color lightCardStroke = Color(0xFFE2E8F0);
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF64748B);
  static const Color lightTextMuted = Color(0xFF94A3B8);

  // Dark Mode Surfaces & Neutrals (OLED Midnight)
  static const Color darkCanvasBg = Color(0xFF0B0F17);
  static const Color darkCardSurface = Color(0xFF161F30);
  static const Color darkCardStroke = Color(0xFF23324D);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF94A3B8);
  static const Color darkTextMuted = Color(0xFF64748B);
}
