import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Semantic Typographic Architecture for SCORE
/// Reference: Design.md
class AppTypography {
  // Display & Headings (Outfit)
  static TextStyle displayLarge(Color color) => GoogleFonts.outfit(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        color: color,
      );

  static TextStyle displayMedium(Color color) => GoogleFonts.outfit(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.3,
        color: color,
      );

  static TextStyle titleLarge(Color color) => GoogleFonts.outfit(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: color,
      );

  static TextStyle titleMedium(Color color) => GoogleFonts.outfit(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: color,
      );

  // Body & Labels (Geist)
  static TextStyle bodyLarge(Color color) => GoogleFonts.geist(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        height: 1.5,
        color: color,
      );

  static TextStyle bodyMedium(Color color) => GoogleFonts.geist(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 1.45,
        color: color,
      );

  static TextStyle bodySmall(Color color) => GoogleFonts.geist(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: color,
      );

  static TextStyle labelLarge(Color color) => GoogleFonts.geist(
        fontSize: 13,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.2,
        color: color,
      );

  static TextStyle labelSmall(Color color) => GoogleFonts.geist(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.4,
        color: color,
      );

  // Numbers, Timers, Palette Indices (JetBrains Mono)
  static TextStyle timer(Color color) => GoogleFonts.jetBrainsMono(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.0,
        color: color,
      );

  static TextStyle monoNumber(Color color, {double fontSize = 14}) =>
      GoogleFonts.jetBrainsMono(
        fontSize: fontSize,
        fontWeight: FontWeight.w600,
        color: color,
      );
}
