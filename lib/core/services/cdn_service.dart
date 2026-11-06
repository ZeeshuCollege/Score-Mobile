import 'package:flutter/foundation.dart';

/// Provides CDN URLs for publicly accessible Cloudflare R2 assets.
///
/// Only public educational content (question images, diagrams, PDFs) should be
/// served through the CDN. Private user documents must always use presigned
/// download URLs via CloudflareR2Service — never this service.
///
/// The CDN domain is configured via compile-time flag:
///   --dart-define=R2_PUBLIC_DOMAIN=https://cdn.your-domain.com
///
/// If the domain is not configured, publicAssetUrl() returns null and the
/// app can fall back to direct R2 access or show a placeholder.
class CdnService {
  CdnService._();
  static final CdnService instance = CdnService._();

  /// Custom CDN domain for public R2 assets.
  /// Set at build time: --dart-define=R2_PUBLIC_DOMAIN=https://cdn.your-domain.com
  static const String _cdnDomain = String.fromEnvironment(
    'R2_PUBLIC_DOMAIN',
    defaultValue: '', // Empty until CDN domain is configured via Cloudflare
  );

  /// Whether CDN delivery is configured and available.
  bool get isConfigured => _cdnDomain.isNotEmpty;

  /// Returns the CDN URL for a public R2 object key.
  ///
  /// [objectKey] is the R2 object path (e.g., 'question_images/abc123.jpg').
  /// For public educational assets, this returns a fast, cached CDN URL.
  ///
  /// Returns null if [isConfigured] is false.
  ///
  /// IMPORTANT: Never use this for private user documents. Use
  /// CloudflareR2Service.requestDownloadUrl() for private files.
  String? publicAssetUrl(String objectKey) {
    if (!isConfigured) {
      debugPrint('CdnService: R2_PUBLIC_DOMAIN not configured — CDN URLs unavailable');
      return null;
    }

    if (objectKey.isEmpty) {
      debugPrint('CdnService: objectKey must not be empty');
      return null;
    }

    final base = _cdnDomain.endsWith('/') ? _cdnDomain : '$_cdnDomain/';
    final key = objectKey.startsWith('/') ? objectKey.substring(1) : objectKey;
    return '$base$key';
  }

  /// Returns a versioned CDN URL using a content hash for cache-busting.
  ///
  /// Use this when the content at [objectKey] may change. Including [version]
  /// in the URL path ensures CDN caches for the specific version and old
  /// versions naturally expire.
  ///
  /// For immutable assets (e.g., question images with content-hash keys),
  /// prefer [publicAssetUrl] directly since the object key already encodes uniqueness.
  String? versionedAssetUrl(String objectKey, String version) {
    final base = publicAssetUrl(objectKey);
    if (base == null) return null;
    return '$base?v=$version';
  }

  /// Returns the CDN base domain (without trailing slash), or empty string.
  String get cdnDomain => _cdnDomain.endsWith('/')
      ? _cdnDomain.substring(0, _cdnDomain.length - 1)
      : _cdnDomain;
}

