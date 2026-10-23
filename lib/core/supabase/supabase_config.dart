import 'package:flutter/foundation.dart';

/// Configuration constants and helpers for Supabase Backend Integration.
class SupabaseConfig {
  SupabaseConfig._();

  /// Default Supabase Project URL.
  /// Can be overridden via compile-time flag: --dart-define=SUPABASE_URL=https://your-ref.supabase.co
  static const String _defaultUrl = 'https://sckxsqhplnswtwvhveqm.supabase.co';

  /// Default Supabase Anon Key.
  /// Can be overridden via compile-time flag: --dart-define=SUPABASE_ANON_KEY=eyJh...
  static const String _defaultAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNja3hzcWhwbG5zd3R3dmh2ZXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzE1NjAsImV4cCI6MjA1NTc0NzU2MH0.sample_anon_key_for_score';

  /// Compile-time or runtime configured URL
  static String url = const String.fromEnvironment('SUPABASE_URL', defaultValue: _defaultUrl);

  /// Compile-time or runtime configured Anon Public Key
  static String anonKey = const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: _defaultAnonKey);

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
  static void setCredentials({required String newUrl, required String newAnonKey}) {
    url = newUrl.trim();
    anonKey = newAnonKey.trim();
    debugPrint('SupabaseConfig: Credentials updated for $url');
  }
}
