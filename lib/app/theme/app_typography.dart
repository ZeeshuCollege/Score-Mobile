import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Apple Human Interface Guidelines (HIG) Typography Scale for SCORE
/// Uses Inter for optical fidelity with Apple's SF Pro System Font
class AppTypography {
  // iOS Large Title (34pt, Bold, -0.7px tracking)
  static TextStyle largeTitle(Color color) => GoogleFonts.inter(
        fontSize: 34,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.7,
        color: color,
      );

  // iOS Title 1 (28pt, Bold, -0.5px tracking)
  static TextStyle displayLarge(Color color) => GoogleFonts.inter(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        color: color,
      );

  // iOS Title 2 (22pt, Bold, -0.3px tracking)
  static TextStyle displayMedium(Color color) => GoogleFonts.inter(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.3,
        color: color,
      );

  // iOS Title 3 (20pt, Semibold, -0.2px tracking)
  static TextStyle titleLarge(Color color) => GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.2,
        color: color,
      );
  static TextStyle headlineMedium(Color color) => titleLarge(color);

  // iOS Headline (17pt, Semibold, -0.4px tracking)
  static TextStyle titleMedium(Color color) => GoogleFonts.inter(
        fontSize: 17,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.4,
        color: color,
      );
  static TextStyle headlineSmall(Color color) => titleMedium(color);

  // iOS Body (17pt, Regular, -0.4px tracking)
  static TextStyle bodyLarge(Color color) => GoogleFonts.inter(
        fontSize: 17,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.4,
        height: 1.45,
        color: color,
      );

  // iOS Callout (16pt, Regular, -0.3px tracking)
  static TextStyle bodyMedium(Color color) => GoogleFonts.inter(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.2,
        height: 1.4,
        color: color,
      );

  // iOS Subhead (15pt, Regular, -0.2px tracking)
  static TextStyle subhead(Color color) => GoogleFonts.inter(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.2,
        color: color,
      );

  // iOS Footnote (13pt, Regular, -0.1px tracking)
  static TextStyle bodySmall(Color color) => GoogleFonts.inter(
        fontSize: 13,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.1,
        color: color,
      );

  // iOS Caption 1 (12pt, Regular, 0.0px tracking)
  static TextStyle labelLarge(Color color) => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.0,
        color: color,
      );

  // iOS Caption 2 (11pt, Medium, 0.1px tracking)
  static TextStyle labelSmall(Color color) => GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.1,
        color: color,
      );

  // Monospace Numbers (JetBrains Mono for timers and scores)
  static TextStyle monoNumber(Color color, {double fontSize = 15, FontWeight fontWeight = FontWeight.w600}) =>
      GoogleFonts.jetBrainsMono(
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: color,
        fontFeatures: const [FontFeature.tabularFigures()],
      );
}
