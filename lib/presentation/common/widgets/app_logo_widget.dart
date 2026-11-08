import 'dart:convert';
import 'package:flutter/material.dart';
import '../../../core/services/app_config_service.dart';

/// Renders the SCORE Application Logo dynamically across the entire app.
///
/// If a custom logo has been uploaded via the Web Admin Portal, it renders
/// the custom logo (supporting both network URLs and base64 data URLs) with a 1:1 square ratio.
/// If no custom logo is configured, it falls back seamlessly to [FlutterLogo],
/// maintaining 100% test compatibility and zero external dependencies.
class AppLogoWidget extends StatelessWidget {
  final double size;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  const AppLogoWidget({
    super.key,
    this.size = 46,
    this.fit = BoxFit.contain,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<AppConfig>(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, appConfig, _) {
        final logoSource = appConfig.logoUrl;

        if (logoSource != null && logoSource.isNotEmpty) {
          final radius = borderRadius ?? BorderRadius.circular(size * 0.18);

          // 1. Base64 Data URL (e.g. data:image/png;base64,iVBOR...)
          if (logoSource.startsWith('data:image')) {
            try {
              final commaIndex = logoSource.indexOf(',');
              final base64String = commaIndex != -1 ? logoSource.substring(commaIndex + 1) : logoSource;
              final bytes = base64Decode(base64String);
              return ClipRRect(
                borderRadius: radius,
                child: Image.memory(
                  bytes,
                  width: size,
                  height: size,
                  fit: fit,
                  errorBuilder: (context, error, stackTrace) => FlutterLogo(size: size),
                ),
              );
            } catch (_) {
              return FlutterLogo(size: size);
            }
          }

          // 2. HTTP/HTTPS Network URL
          if (logoSource.startsWith('http://') || logoSource.startsWith('https://')) {
            return ClipRRect(
              borderRadius: radius,
              child: Image.network(
                logoSource,
                width: size,
                height: size,
                fit: fit,
                errorBuilder: (context, error, stackTrace) => FlutterLogo(size: size),
              ),
            );
          }
        }

        // Default Flutter icon
        return FlutterLogo(size: size);
      },
    );
  }
}
