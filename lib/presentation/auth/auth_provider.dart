import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/local/app_database.dart';

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

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final success = await AppDatabase.instance.authenticateUser(email, password);
      if (success) {
        final user = await AppDatabase.instance.getUserByEmail(email);
        final name = user?['name'] as String? ?? 'Aspirant Scholar';
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool(_authPrefKey, true);
        await prefs.setString(_emailPrefKey, email.trim().toLowerCase());
        await prefs.setString(_namePrefKey, name);

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

  Future<bool> signup(String name, String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final registered = await AppDatabase.instance.registerUser(
        name: name,
        email: email,
        password: password,
      );

      if (registered) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool(_authPrefKey, true);
        await prefs.setString(_emailPrefKey, email.trim().toLowerCase());
        await prefs.setString(_namePrefKey, name.trim());

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

  Future<bool> signInWithGoogle() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    await Future.delayed(const Duration(milliseconds: 600));

    const googleEmail = 'google.student@score.app';
    const googleName = 'Google Aspirant';

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authPrefKey, true);
    await prefs.setString(_emailPrefKey, googleEmail);
    await prefs.setString(_namePrefKey, googleName);

    state = const AuthState(
      isAuthenticated: true,
      email: googleEmail,
      name: googleName,
      isLoading: false,
    );
    return true;
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
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_authPrefKey);
    await prefs.remove(_emailPrefKey);
    await prefs.remove(_namePrefKey);
    state = const AuthState(isAuthenticated: false);
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
