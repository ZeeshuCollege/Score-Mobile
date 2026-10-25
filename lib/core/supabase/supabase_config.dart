import 'package:flutter/foundation.dart';

/// Configuration constants and helpers for Supabase Backend Integration.
class SupabaseConfig {
  SupabaseConfig._();

  /// Default Supabase Project URL.
  /// Can be overridden via compile-time flag: --dart-define=SUPABASE_URL=https://your-ref.supabase.co
  static const String _defaultUrl = 'https://jpjvcimeggkcpvlybciq.supabase.co';

  /// Default Supabase Anon Key.
  /// Can be overridden via compile-time flag: --dart-define=SUPABASE_ANON_KEY=eyJh...
  static const String _defaultAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwanZjaW1lZ2drY3B2bHliY2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjM5OTMsImV4cCI6MjEwODQ5OTk5M30.cZOiQRxedvp_Ac72XE_DZxJxhVrIdjcSqbdmJTjqQh4';

  /// Default Google OAuth Web Client ID
  static const String _defaultGoogleWebClientId =
      '451337378745-goklsv2dsh9tlcrj6j5l8fegq55kmvtt.apps.googleusercontent.com';

  /// Compile-time or runtime configured URL
  static String url = const String.fromEnvironment('SUPABASE_URL', defaultValue: _defaultUrl);

  /// Compile-time or runtime configured Anon Public Key
  static String anonKey = const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: _defaultAnonKey);

  /// Compile-time or runtime configured Google Web Client ID
  static String googleWebClientId =
      const String.fromEnvironment('GOOGLE_WEB_CLIENT_ID', defaultValue: _defaultGoogleWebClientId);

  /// Deep link OAuth redirect scheme (matched in AndroidManifest.xml and iOS Info.plist)
  static const String redirectUrl = 'score://login-callback';

  /// Check whether credentials have been set
  static bool get isConfigured {
    return url.isNotEmpty &&
        url.startsWith('https://') &&
        anonKey.isNotEmpty &&
        !anonKey.contains('sample_anon_key');
  }

  /// Update credentials dynamically at runtime (e.g. from developer settings or initial config)
  static void setCredentials({
    required String newUrl,
    required String newAnonKey,
    String? newGoogleWebClientId,
  }) {
    url = newUrl.trim();
    anonKey = newAnonKey.trim();
    if (newGoogleWebClientId != null && newGoogleWebClientId.isNotEmpty) {
      googleWebClientId = newGoogleWebClientId.trim();
    }
    debugPrint('SupabaseConfig: Credentials updated for $url');
  }
}
