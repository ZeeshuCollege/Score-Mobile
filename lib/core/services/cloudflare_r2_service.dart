import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

/// Result from a presigned URL request.
class R2PresignResult {
  /// The presigned URL for direct R2 upload or download.
  /// Treat as a temporary credential — never log, store, or reuse.
  final String presignedUrl;

  /// The R2 object key path: {user_id}/{file_category}/{unique_id}.{ext}
  final String objectKey;

  /// When this presigned URL expires.
  final DateTime expiresAt;

  const R2PresignResult({
    required this.presignedUrl,
    required this.objectKey,
    required this.expiresAt,
  });

  /// Whether this presigned URL is still valid.
  bool get isValid => DateTime.now().isBefore(expiresAt);
}

/// Handles Cloudflare R2 presigned URL requests via the Supabase Edge Function.
///
/// Architecture:
///   Flutter → Supabase Edge Function (r2-presign) → R2 Presigned URL → Flutter → R2
///
/// Never holds R2 credentials directly. All credentials are stored in
/// Supabase Edge Function secrets (server-side only).
///
/// Never logs presigned URLs — they are temporary credentials.
class CloudflareR2Service {
  CloudflareR2Service._();
  static final CloudflareR2Service instance = CloudflareR2Service._();

  /// Request a short-lived presigned URL for uploading a file to R2.
  ///
  /// [fileCategory] must be one of: question_images, question_diagrams,
  ///   educational_pdfs, study_materials, user_documents
  /// [mimeType] must be one of: image/jpeg, image/png, image/webp, image/gif, application/pdf
  /// [fileSize] in bytes, max 50 MB
  ///
  /// Returns null on failure. The caller should handle null gracefully.
  Future<R2PresignResult?> requestUploadUrl({
    required String fileCategory,
    required String mimeType,
    required int fileSize,
  }) async {
    if (kIsWeb) {
      debugPrint('CloudflareR2Service: file upload not supported on web');
      return null;
    }

    try {
      final client = Supabase.instance.client;
      final response = await client.functions.invoke(
        'r2-presign',
        body: {
          'operation': 'upload',
          'file_category': fileCategory,
          'mime_type': mimeType,
          'file_size': fileSize,
        },
      );

      if (response.status != 200) {
        debugPrint('CloudflareR2Service: upload URL request failed (status: ${response.status})');
        return null;
      }

      final data = response.data as Map<String, dynamic>?;
      if (data == null || data['presigned_url'] == null) {
        debugPrint('CloudflareR2Service: invalid response from r2-presign function');
        return null;
      }

      return R2PresignResult(
        presignedUrl: data['presigned_url'] as String,
        objectKey: data['object_key'] as String,
        expiresAt: DateTime.parse(data['expires_at'] as String),
      );
    } catch (e) {
      // Never include the presigned URL in error messages
      debugPrint('CloudflareR2Service: upload URL request exception');
      return null;
    }
  }

  /// Request a short-lived presigned URL for downloading a private file from R2.
  ///
  /// [objectKey] must start with the caller's user_id (enforced server-side).
  /// [fileCategory] is used server-side to determine the correct bucket.
  ///
  /// Returns the presigned URL string, or null on failure.
  /// The returned URL expires in 60 minutes — do not cache or store it.
  Future<String?> requestDownloadUrl({
    required String objectKey,
    required String fileCategory,
  }) async {
    if (kIsWeb) {
      debugPrint('CloudflareR2Service: download not supported on web');
      return null;
    }

    try {
      final client = Supabase.instance.client;
      final response = await client.functions.invoke(
        'r2-presign',
        body: {
          'operation': 'download',
          'file_category': fileCategory,
          'object_key': objectKey,
        },
      );

      if (response.status != 200) {
        debugPrint('CloudflareR2Service: download URL request failed (status: ${response.status})');
        return null;
      }

      final data = response.data as Map<String, dynamic>?;
      return data?['presigned_url'] as String?;
    } catch (e) {
      debugPrint('CloudflareR2Service: download URL request exception');
      return null;
    }
  }

  /// Upload a file directly to R2 using a presigned PUT URL.
  ///
  /// The presigned URL is obtained from [requestUploadUrl] and used exactly once.
  /// Never store or log the presigned URL beyond this call.
  ///
  /// Returns true if the upload succeeded (HTTP 200).
  Future<bool> uploadFileDirect({
    required String presignedUrl,
    required File file,
    required String mimeType,
  }) async {
    try {
      final bytes = await file.readAsBytes();
      final response = await http.put(
        Uri.parse(presignedUrl),
        headers: {
          'Content-Type': mimeType,
          'Content-Length': bytes.length.toString(),
        },
        body: bytes,
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        // Log status code only — never the presigned URL
        debugPrint('CloudflareR2Service: direct upload failed (HTTP ${response.statusCode})');
        return false;
      }
    } on http.ClientException {
      debugPrint('CloudflareR2Service: network error during direct upload');
      return false;
    } catch (e) {
      debugPrint('CloudflareR2Service: upload exception');
      return false;
    }
  }
}

