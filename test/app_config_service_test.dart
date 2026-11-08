import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:score/core/services/app_config_service.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('AppConfig initializes with null defaults and falls back cleanly', () {
    const config = AppConfig();
    expect(config.logoUrl, isNull);
    expect(config.onboardingSlide1, isNull);
    expect(config.onboardingSlide2, isNull);
    expect(config.onboardingSlide3, isNull);
    expect(config.inAppSlide1, isNull);
    expect(config.inAppSlide2, isNull);
    expect(config.inAppSlide3, isNull);
    expect(config.hasCustomInAppSlides, isFalse);
    expect(config.getOnboardingSlide(0), isNull);
    expect(config.getInAppSlide(0), isNull);
  });

  test('AppConfig serializes and deserializes JSON correctly', () {
    const config = AppConfig(
      logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      onboardingSlide1: 'https://example.com/slide1.png',
      onboardingSlide2: 'https://example.com/slide2.png',
      onboardingSlide3: 'https://example.com/slide3.png',
      inAppSlide1: 'https://example.com/banner1.png',
      inAppSlide2: 'https://example.com/banner2.png',
      inAppSlide3: 'https://example.com/banner3.png',
    );

    final json = config.toJson();
    final restored = AppConfig.fromJson(json);

    expect(restored.logoUrl, config.logoUrl);
    expect(restored.onboardingSlide1, 'https://example.com/slide1.png');
    expect(restored.onboardingSlide2, 'https://example.com/slide2.png');
    expect(restored.onboardingSlide3, 'https://example.com/slide3.png');
    expect(restored.inAppSlide1, 'https://example.com/banner1.png');
    expect(restored.inAppSlide2, 'https://example.com/banner2.png');
    expect(restored.inAppSlide3, 'https://example.com/banner3.png');
    expect(restored.hasCustomInAppSlides, isTrue);
    expect(restored.getOnboardingSlide(1), 'https://example.com/slide2.png');
    expect(restored.getInAppSlide(2), 'https://example.com/banner3.png');
  });

  test('AppConfig copyWith updates fields immutably', () {
    const config = AppConfig(logoUrl: 'logo_a.png');
    final updated = config.copyWith(
      logoUrl: 'logo_b.png',
      onboardingSlide1: 'ob_1.png',
    );

    expect(config.logoUrl, 'logo_a.png');
    expect(updated.logoUrl, 'logo_b.png');
    expect(updated.onboardingSlide1, 'ob_1.png');
    expect(updated.onboardingSlide2, isNull);
  });
}
