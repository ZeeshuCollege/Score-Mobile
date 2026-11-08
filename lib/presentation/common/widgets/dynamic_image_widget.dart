import 'dart:convert';
import 'package:flutter/material.dart';

/// Reusable widget for rendering dynamic images from base64 data URLs, network URLs, or fallback widgets.
class DynamicImageWidget extends StatelessWidget {
  final String? imageSource;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget fallback;
  final BorderRadius? borderRadius;

  const DynamicImageWidget({
    super.key,
    required this.imageSource,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    required this.fallback,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final src = imageSource;
    if (src == null || src.isEmpty) {
      return fallback;
    }

    Widget image;

    if (src.startsWith('data:image')) {
      try {
        final commaIndex = src.indexOf(',');
        final base64String = commaIndex != -1 ? src.substring(commaIndex + 1) : src;
        final bytes = base64Decode(base64String);
        image = Image.memory(
          bytes,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (context, error, stackTrace) => fallback,
        );
      } catch (_) {
        return fallback;
      }
    } else if (src.startsWith('http://') || src.startsWith('https://')) {
      image = Image.network(
        src,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => fallback,
      );
    } else {
      return fallback;
    }

    if (borderRadius != null) {
      return ClipRRect(
        borderRadius: borderRadius!,
        child: image,
      );
    }

    return image;
  }
}
