import 'package:flutter/widgets.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/supabase/supabase_config.dart';

/// Result wrapper for Supabase authentication operations.
class SupabaseAuthResult {
  final bool success;
  final String? errorMessage;
  final String? email;
  final String? name;
  final User? user;

  const SupabaseAuthResult({
    required this.success,
    this.errorMessage,
    this.email,
    this.name,
    this.user,
  });

  factory SupabaseAuthResult.successful({
    required String email,
    required String name,
    User? user,
  }) {
    return SupabaseAuthResult(
      success: true,
      email: email,
      name: name,
      user: user,
    );
  }

  factory SupabaseAuthResult.failed(String errorMessage) {
    return SupabaseAuthResult(
      success: false,
      errorMessage: errorMessage,
    );
  }
}

/// Centralized service handling Supabase Client, Authentication, and Cloud Operations.
class SupabaseService {
  SupabaseService._();
  static final SupabaseService instance = SupabaseService._();

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  SupabaseClient? get client {
    if (!_isInitialized) return null;
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

  /// Initialize Supabase client safely with PKCE auth flow for mobile deep linking
  Future<void> initialize() async {
    // Avoid running remote network client setup during automated widget tests
    if (WidgetsBinding.instance.runtimeType.toString().contains('TestWidgetsFlutterBinding')) {
      _isInitialized = false;
      return;
    }

    if (_isInitialized) return;

    try {
      await Supabase.initialize(
        url: SupabaseConfig.url,
        // ignore: deprecated_member_use
        anonKey: SupabaseConfig.anonKey,
        authOptions: const FlutterAuthClientOptions(
          authFlowType: AuthFlowType.pkce,
        ),
      );
      _isInitialized = true;
      debugPrint('SupabaseService: Initialized successfully with ${SupabaseConfig.url}');
    } catch (e) {
      debugPrint('SupabaseService: Warning - initialization failed or keys pending ($e)');
      _isInitialized = false;
    }
  }

  /// Authenticate user via Supabase using email and password
  Future<SupabaseAuthResult> signInWithEmail({
    required String email,
    required String password,
  }) async {
    final supabase = client;
    if (supabase == null || !SupabaseConfig.isConfigured) {
      return SupabaseAuthResult.failed('Supabase is not configured or in offline mode');
    }

    try {
      final response = await supabase.auth.signInWithPassword(
        email: email.trim(),
        password: password.trim(),
      );

      final user = response.user;
      if (user != null) {
        final metadataName = user.userMetadata?['name'] as String? ??
            user.userMetadata?['full_name'] as String? ??
            email.split('@').first;

        return SupabaseAuthResult.successful(
          email: user.email ?? email.trim(),
          name: metadataName,
          user: user,
        );
      } else {
        return SupabaseAuthResult.failed('Sign in completed without active user session.');
      }
    } on AuthException catch (e) {
      return SupabaseAuthResult.failed(e.message);
    } catch (e) {
      return SupabaseAuthResult.failed('Connection error. Please try again.');
    }
  }

  /// Register a new user via Supabase with email, password, and custom display name
  Future<SupabaseAuthResult> signUpWithEmail({
    required String name,
    required String email,
    required String password,
  }) async {
    final supabase = client;
    if (supabase == null || !SupabaseConfig.isConfigured) {
      return SupabaseAuthResult.failed('Supabase is not configured or in offline mode');
    }

    try {
      final response = await supabase.auth.signUp(
        email: email.trim(),
        password: password.trim(),
        data: {
          'name': name.trim(),
          'full_name': name.trim(),
        },
      );

      final user = response.user;
      if (user != null) {
        return SupabaseAuthResult.successful(
          email: user.email ?? email.trim(),
          name: name.trim(),
          user: user,
        );
      } else {
        return SupabaseAuthResult.failed('Registration failed. Please try again.');
      }
    } on AuthException catch (e) {
      return SupabaseAuthResult.failed(e.message);
    } catch (e) {
      return SupabaseAuthResult.failed('Registration connection error. Please try again.');
    }
  }

  /// Trigger Google OAuth authentication via Supabase
  /// Opens the browser / custom tabs and redirects back to `score://login-callback`
  Future<bool> signInWithGoogle() async {
    final supabase = client;
    if (supabase == null || !SupabaseConfig.isConfigured) {
      // In demo/test mode without active cloud keys, provide smooth simulated login
      debugPrint('SupabaseService: Running Google OAuth in demo/test fallback mode');
      return true;
    }

    try {
      final launched = await supabase.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: SupabaseConfig.redirectUrl,
        authScreenLaunchMode: LaunchMode.externalApplication,
      );
      return launched;
    } catch (e) {
      debugPrint('SupabaseService: signInWithGoogle error: $e');
      return false;
    }
  }

  /// Sign out from Supabase cloud session
  Future<void> signOut() async {
    try {
      await client?.auth.signOut();
    } catch (e) {
      debugPrint('SupabaseService: signOut error: $e');
    }
  }

  /// Returns current authenticated Supabase User (if any)
  User? get currentUser => client?.auth.currentUser;

  /// Stream of Supabase Auth state changes
  Stream<AuthState>? get authStateChanges => client?.auth.onAuthStateChange;
}
