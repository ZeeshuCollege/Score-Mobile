import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/supabase/supabase_config.dart';
import '../../core/services/device_token_service.dart';
import '../../data/local/app_database.dart';
import '../../data/remote/supabase_service.dart';

class AuthState {
  final bool isAuthenticated;
  final String? email;
  final String? name;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    this.isAuthenticated = false,
    this.email,
    this.name,
    this.isLoading = false,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    String? email,
    String? name,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      email: email ?? this.email,
      name: name ?? this.name,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  static const String _authPrefKey = 'score_is_authenticated';
  static const String _emailPrefKey = 'score_auth_email';
  static const String _namePrefKey = 'score_auth_name';

  @override
  AuthState build() {
    _loadStoredAuth();
    return const AuthState(isLoading: true);
  }

  Future<void> _loadStoredAuth() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isAuth = prefs.getBool(_authPrefKey) ?? false;
      final email = prefs.getString(_emailPrefKey);
      final name = prefs.getString(_namePrefKey);
      state = AuthState(
        isAuthenticated: isAuth,
        email: email,
        name: name,
        isLoading: false,
      );
    } catch (_) {
      state = const AuthState(isLoading: false);
    }
  }

  Future<void> _persistSession(String email, String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authPrefKey, true);
    await prefs.setString(_emailPrefKey, email.trim().toLowerCase());
    await prefs.setString(_namePrefKey, name);
  }

  /// Log in via Supabase cloud auth or local SQLite fallback
  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    // 1. If Supabase is configured with cloud keys, authenticate via Supabase
    if (SupabaseConfig.isConfigured) {
      try {
        final cloudResult = await SupabaseService.instance.signInWithEmail(
          email: email,
          password: password,
        );
        if (cloudResult.success) {
          final name = cloudResult.name ?? 'Aspirant Scholar';
          await _persistSession(email, name);
          // Mirror credentials locally for offline capabilities
          await AppDatabase.instance.registerUser(
            name: name,
            email: email,
            password: password,
          );

          state = AuthState(
            isAuthenticated: true,
            email: email.trim().toLowerCase(),
            name: name,
            isLoading: false,
          );
          return true;
        } else if (!email.trim().toLowerCase().contains('pinjari.work')) {
          // If explicitly rejected on cloud and not test user, report cloud error
          state = state.copyWith(
            isLoading: false,
            errorMessage: cloudResult.errorMessage,
          );
          return false;
        }
      } catch (e) {
        debugPrint('Supabase login error ($e). Checking local database fallback...');
      }
    }

    // 2. Local SQLite database authentication (including test ID pinjari.work@gmail.com)
    try {
      final success = await AppDatabase.instance.authenticateUser(email, password);
      if (success) {
        final user = await AppDatabase.instance.getUserByEmail(email);
        final name = user?['name'] as String? ?? 'Aspirant Scholar';
        await _persistSession(email, name);

        state = AuthState(
          isAuthenticated: true,
          email: email.trim().toLowerCase(),
          name: name,
          isLoading: false,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid email or password. Please try again.',
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Authentication failed. Please check credentials.',
      );
      return false;
    }
  }

  /// Sign up via Supabase cloud auth and mirror to local database
  Future<bool> signup(String name, String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    // 1. If Supabase is configured, create account in Supabase
    if (SupabaseConfig.isConfigured) {
      try {
        final cloudResult = await SupabaseService.instance.signUpWithEmail(
          name: name,
          email: email,
          password: password,
        );
        if (cloudResult.success) {
          await _persistSession(email, name.trim());
          await AppDatabase.instance.registerUser(
            name: name,
            email: email,
            password: password,
          );

          state = AuthState(
            isAuthenticated: true,
            email: email.trim().toLowerCase(),
            name: name.trim(),
            isLoading: false,
          );
          return true;
        } else if (cloudResult.errorMessage != null) {
          state = state.copyWith(
            isLoading: false,
            errorMessage: cloudResult.errorMessage,
          );
          return false;
        }
      } catch (e) {
        debugPrint('Supabase signup error ($e). Falling back to local...');
      }
    }

    // 2. Local SQLite database registration
    try {
      final registered = await AppDatabase.instance.registerUser(
        name: name,
        email: email,
        password: password,
      );

      if (registered) {
        await _persistSession(email, name.trim());

        state = AuthState(
          isAuthenticated: true,
          email: email.trim().toLowerCase(),
          name: name.trim(),
          isLoading: false,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'An account with this email already exists.',
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Registration failed. Please try again.',
      );
      return false;
    }
  }

  /// Sign in with Google via Supabase OAuth (redirects to `score://login-callback`).
  ///
  /// This launches the browser and returns immediately — the session is
  /// established asynchronously when the deep link brings the user back.
  /// The auth state is updated via [handleOAuthCallback] once the deep link
  /// is received.  Returns `true` if the browser was successfully launched,
  /// `false` on error.
  Future<bool> signInWithGoogle() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    if (!SupabaseConfig.isConfigured) {
      // Supabase not configured — reset loading and report
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Google Sign-In is not available in offline mode.',
      );
      return false;
    }

    try {
      final launched = await SupabaseService.instance.signInWithGoogle();
      if (!launched) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Could not open Google Sign-In. Please try again.',
        );
        return false;
      }
      // Browser launched — keep isLoading: true while we wait for the
      // deep-link callback to come back via handleOAuthCallback().
      return true;
    } catch (e) {
      debugPrint('Google OAuth launch error: $e');
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Google Sign-In failed. Please try again.',
      );
      return false;
    }
  }

  /// Called by the deep-link handler in main.dart when `score://login-callback`
  /// is received.  Supabase processes the URL and fires onAuthStateChange;
  /// this method extracts the user details and updates the auth state.
  Future<void> handleOAuthCallback(Uri uri) async {
    debugPrint('AuthNotifier: handleOAuthCallback — $uri');
    try {
      // Let Supabase exchange the OAuth code for a session
      await SupabaseService.instance.client?.auth.getSessionFromUrl(uri);

      final currentUser = SupabaseService.instance.currentUser;
      if (currentUser != null) {
        final googleEmail = currentUser.email ?? 'google.student@score.app';
        final googleName = currentUser.userMetadata?['name'] as String? ??
            currentUser.userMetadata?['full_name'] as String? ??
            'Google Aspirant';
        await _persistSession(googleEmail, googleName);
        state = AuthState(
          isAuthenticated: true,
          email: googleEmail,
          name: googleName,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Google Sign-In completed but no user found. Please try again.',
        );
      }
    } catch (e) {
      debugPrint('AuthNotifier: handleOAuthCallback error: $e');
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Google Sign-In failed. Please try again.',
      );
    }
  }

  Future<void> continueAsGuest() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authPrefKey, true);
    state = const AuthState(
      isAuthenticated: true,
      email: 'guest@score.app',
      name: 'Guest Aspirant',
      isLoading: false,
    );
  }

  Future<void> logout() async {
    // Deactivate FCM token BEFORE signOut (requires active auth session for RLS)
    await DeviceTokenService.instance.deactivateToken();
    await SupabaseService.instance.signOut();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_authPrefKey);
    await prefs.remove(_emailPrefKey);
    await prefs.remove(_namePrefKey);
    state = const AuthState(isAuthenticated: false);
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
