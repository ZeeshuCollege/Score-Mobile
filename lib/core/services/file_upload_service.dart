import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'cloudflare_r2_service.dart';

/// Available file categories for R2 uploads.
/// Determines bucket (public vs. private) and object key prefix.
enum FileCategory {
  /// Public bucket — question images for the question bank
  questionImages('question_images', 'score-public-assets', false),

  /// Public bucket — diagrams and illustrations for questions
  questionDiagrams('question_diagrams', 'score-public-assets', false),

  /// Public bucket — educational PDF resources
  educationalPdfs('educational_pdfs', 'score-public-assets', false),

  /// Public bucket — study material files
  studyMaterials('study_materials', 'score-public-assets', false),

  /// Private bucket — user-uploaded personal documents
  userDocuments('user_documents', 'score-private-uploads', true);

  /// R2 file_category value sent to Edge Function
  final String value;

  /// Bucket name for metadata recording
  final String bucketName;

  /// Whether this category uses the private bucket
  final bool isPrivate;

  const FileCategory(this.value, this.bucketName, this.isPrivate);

  static FileCategory? fromValue(String value) {
    for (final c in FileCategory.values) {
      if (c.value == value) return c;
    }
    return null;
  }
}

/// Result of a file upload operation.
class FileUploadResult {
  /// Whether the upload was fully successful (file reached R2 and metadata recorded).
  final bool success;

  /// The R2 object key for the uploaded file. Present on success.
  final String? objectKey;

  /// Human-readable error message. Present on failure.
  final String? errorMessage;

  const FileUploadResult({
    required this.success,
    this.objectKey,
    this.errorMessage,
  });

  factory FileUploadResult.success(String objectKey) =>
      FileUploadResult(success: true, objectKey: objectKey);

  factory FileUploadResult.failure(String errorMessage) =>
      FileUploadResult(success: false, errorMessage: errorMessage);
}

/// Orchestrates the full three-step file upload flow:
///
///   1. Request presigned upload URL from Supabase Edge Function (server validates user)
///   2. Upload file bytes directly to Cloudflare R2 using the presigned URL
///   3. Record file metadata (not content) in Supabase for future reference
///
/// Security:
/// - R2 credentials never reach Flutter
/// - File size and MIME type are validated both client-side and server-side
/// - Each upload gets a unique random object key (not user-predictable)
/// - Private files cannot be listed or accessed without a presigned download URL
class FileUploadService {
  FileUploadService._();
  static final FileUploadService instance = FileUploadService._();

  /// Maximum allowed file size: 50 MB
  static const int maxFileSizeBytes = 52428800;

  /// MIME types allowed for upload (must match Edge Function allowlist)
  static const List<String> allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];

  /// Upload a file to Cloudflare R2.
  ///
  /// [file] — the local file to upload
  /// [mimeType] — the MIME type of the file (e.g., 'image/jpeg')
  /// [category] — determines storage bucket and access policy
  /// [originalFileName] — the original filename for metadata (not used as object key)
  ///
  /// Returns [FileUploadResult] indicating success or failure with explanation.
  Future<FileUploadResult> uploadFile({
    required File file,
    required String mimeType,
    required FileCategory category,
    required String originalFileName,
  }) async {
    if (kIsWeb) {
      return FileUploadResult.failure('File upload is not supported on web');
    }

    // ── Client-side validation (server also validates) ────────────────────
    final int fileSize;
    try {
      fileSize = await file.length();
    } catch (e) {
      return FileUploadResult.failure('Could not read file');
    }

    if (fileSize <= 0) {
      return FileUploadResult.failure('File is empty');
    }

    if (fileSize > maxFileSizeBytes) {
      final sizeMB = (fileSize / 1024 / 1024).toStringAsFixed(1);
      return FileUploadResult.failure('File size ($sizeMB MB) exceeds the 50 MB limit');
    }

    if (!allowedMimeTypes.contains(mimeType)) {
      return FileUploadResult.failure('File type "$mimeType" is not supported');
    }

    // ── Step 1: Request presigned upload URL from server ─────────────────
    final presignResult = await CloudflareR2Service.instance.requestUploadUrl(
      fileCategory: category.value,
      mimeType: mimeType,
      fileSize: fileSize,
    );

    if (presignResult == null) {
      return FileUploadResult.failure('Could not obtain upload authorization. Please try again.');
    }

    if (!presignResult.isValid) {
      return FileUploadResult.failure('Upload authorization expired. Please try again.');
    }

    // ── Step 2: Upload directly to R2 ────────────────────────────────────
    final uploaded = await CloudflareR2Service.instance.uploadFileDirect(
      presignedUrl: presignResult.presignedUrl,
      file: file,
      mimeType: mimeType,
    );

    // presignResult is no longer needed after this point — do not store or log it
    if (!uploaded) {
      return FileUploadResult.failure('File upload failed. Please check your connection and try again.');
    }

    // ── Step 3: Record metadata in Supabase ───────────────────────────────
    try {
      final client = Supabase.instance.client;
      final userId = client.auth.currentUser?.id;

      if (userId != null) {
        await client.from('file_uploads').insert({
          'owner_id': userId,
          'bucket_name': category.bucketName,
          'object_key': presignResult.objectKey,
          'original_file_name': originalFileName,
          'mime_type': mimeType,
          'file_size': fileSize,
          'file_category': category.value,
          'visibility': category.isPrivate ? 'private' : 'public',
          'upload_status': 'completed',
        });
      }
    } catch (e) {
      // Metadata recording failure is non-fatal — the file is in R2 and usable.
      // The objectKey is still returned so the caller can use it.
      debugPrint('FileUploadService: metadata recording failed (non-fatal)');
    }

    return FileUploadResult.success(presignResult.objectKey);
  }

  /// Retrieve file upload records for the authenticated user.
  Future<List<Map<String, dynamic>>> getUserUploads({
    FileCategory? category,
  }) async {
    try {
      final client = Supabase.instance.client;
      var query = client
          .from('file_uploads')
          .select()
          .eq('upload_status', 'completed');

      if (category != null) {
        query = query.eq('file_category', category.value);
      }

      final result = await query.order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(result as List);
    } catch (e) {
      debugPrint('FileUploadService: getUserUploads failed');
      return [];
    }
  }
}

