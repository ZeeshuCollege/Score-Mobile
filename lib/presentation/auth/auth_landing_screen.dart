import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../main_nav_screen.dart';
import 'auth_provider.dart';

/// Single landing page with both Login and Signup forms, switchable via segmented pill,
/// with Google Sign-in/Sign-up buttons below each form, and SQLite testing credentials.
class AuthLandingScreen extends ConsumerStatefulWidget {
  final bool initialIsSignup;

  const AuthLandingScreen({
    super.key,
    this.initialIsSignup = false,
  });

  @override
  ConsumerState<AuthLandingScreen> createState() => _AuthLandingScreenState();
}

class _AuthLandingScreenState extends ConsumerState<AuthLandingScreen> {
  late bool _isSignup;

  // Login form controllers
  final _loginEmailController = TextEditingController();
  final _loginPasswordController = TextEditingController();

  // Signup form controllers
  final _signupNameController = TextEditingController();
  final _signupEmailController = TextEditingController();
  final _signupPasswordController = TextEditingController();
  final _signupConfirmPasswordController = TextEditingController();

  bool _obscureLoginPassword = true;
  bool _obscureSignupPassword = true;
  bool _obscureSignupConfirmPassword = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _isSignup = widget.initialIsSignup;
  }

  @override
  void dispose() {
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _signupNameController.dispose();
    _signupEmailController.dispose();
    _signupPasswordController.dispose();
    _signupConfirmPasswordController.dispose();
    super.dispose();
  }

  void _fillTestingCredentials() {
    HapticFeedback.lightImpact();
    setState(() {
      _loginEmailController.text = 'pinjari.work@gmail.com';
      _loginPasswordController.text = 'Student@123';
      _errorMessage = null;
    });
  }

  Future<void> _handleLogin() async {
    HapticFeedback.lightImpact();
    final email = _loginEmailController.text.trim();
    final password = _loginPasswordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Please enter both email and password.');
      return;
    }

    final success = await ref.read(authProvider.notifier).login(email, password);
    if (!mounted) return;

    if (success) {
      HapticFeedback.mediumImpact();
      Navigator.pushAndRemoveUntil(
        context,
        CupertinoPageRoute(builder: (_) => const MainNavScreen()),
        (route) => false,
      );
    } else {
      final authState = ref.read(authProvider);
      setState(() => _errorMessage = authState.errorMessage ?? 'Invalid email or password.');
    }
  }

  Future<void> _handleSignup() async {
    HapticFeedback.lightImpact();
    final name = _signupNameController.text.trim();
    final email = _signupEmailController.text.trim();
    final password = _signupPasswordController.text.trim();
    final confirm = _signupConfirmPasswordController.text.trim();

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Please complete all required fields.');
      return;
    }

    if (password != confirm) {
      setState(() => _errorMessage = 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setState(() => _errorMessage = 'Password must be at least 6 characters.');
      return;
    }

    final success = await ref.read(authProvider.notifier).signup(name, email, password);
    if (!mounted) return;

    if (success) {
      HapticFeedback.mediumImpact();
      Navigator.pushAndRemoveUntil(
        context,
        CupertinoPageRoute(builder: (_) => const MainNavScreen()),
        (route) => false,
      );
    } else {
      final authState = ref.read(authProvider);
      setState(() => _errorMessage = authState.errorMessage ?? 'Registration failed.');
    }
  }

  Future<void> _handleGoogleAuth() async {
    HapticFeedback.mediumImpact();
    final success = await ref.read(authProvider.notifier).signInWithGoogle();
    if (!mounted) return;

    if (success) {
      Navigator.pushAndRemoveUntil(
        context,
        CupertinoPageRoute(builder: (_) => const MainNavScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkCanvasBg : AppColors.lightCanvasBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: () => Navigator.pop(context),
          child: Icon(
            CupertinoIcons.chevron_left,
            color: isDark ? Colors.white : Colors.black87,
            size: 24,
          ),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // App Brand & Flutter Icon as Score Logo
                  Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      color: isDark ? Colors.white10 : Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF02569B).withValues(alpha: 0.15),
                          blurRadius: 18,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: FlutterLogo(size: 46),
                    ),
                  ),
                  const SizedBox(height: 14),

                  Text(
                    'SCORE',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 3,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),

                  Text(
                    _isSignup
                        ? 'Join thousands of top rankers today'
                        : 'Welcome back! Sign in to continue your prep',
                    style: TextStyle(
                      fontSize: 13,
                      color: textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  // Segmented Switcher Pill: [ Login | Sign Up ]
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTap: () {
                              HapticFeedback.selectionClick();
                              setState(() {
                                _isSignup = false;
                                _errorMessage = null;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: !_isSignup
                                    ? (isDark ? AppColors.darkCardSurface : Colors.white)
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: !_isSignup
                                    ? [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.1),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: Center(
                                child: Text(
                                  'Login',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: !_isSignup ? FontWeight.w700 : FontWeight.w500,
                                    color: !_isSignup
                                        ? (isDark ? Colors.white : Colors.black87)
                                        : textSecondary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTap: () {
                              HapticFeedback.selectionClick();
                              setState(() {
                                _isSignup = true;
                                _errorMessage = null;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _isSignup
                                    ? (isDark ? AppColors.darkCardSurface : Colors.white)
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: _isSignup
                                    ? [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.1),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: Center(
                                child: Text(
                                  'Sign Up',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: _isSignup ? FontWeight.w700 : FontWeight.w500,
                                    color: _isSignup
                                        ? (isDark ? Colors.white : Colors.black87)
                                        : textSecondary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Error Message Banner (if any)
                  if (_errorMessage != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppColors.errorRed.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.errorRed.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(CupertinoIcons.exclamationmark_circle_fill, color: AppColors.errorRed, size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: const TextStyle(
                                color: AppColors.errorRed,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Conditional Form: Login vs. Signup
                  if (!_isSignup)
                    _buildLoginForm(isDark, textPrimary, textSecondary, authState.isLoading)
                  else
                    _buildSignupForm(isDark, textPrimary, textSecondary, authState.isLoading),

                  const SizedBox(height: 18),

                  // "── OR ──" Centered Divider
                  Row(
                    children: [
                      Expanded(
                        child: Divider(
                          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                          thickness: 0.8,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Text(
                          'OR',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                            color: textSecondary,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Divider(
                          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                          thickness: 0.8,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Centered Google Auth Button (Sign in with Google / Sign up with Google)
                  _buildGoogleButton(isDark, textPrimary),

                  const SizedBox(height: 24),

                  // Bottom Testing Credentials Quick-Fill helper
                  if (!_isSignup) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white.withValues(alpha: 0.04) : Colors.black.withValues(alpha: 0.03),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                          width: 0.5,
                        ),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(CupertinoIcons.wrench_fill, size: 13, color: AppColors.systemBlue),
                              const SizedBox(width: 6),
                              Text(
                                'SQLite Testing Account',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: textPrimary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'pinjari.work@gmail.com  ·  Student@123',
                            style: TextStyle(
                              fontSize: 11,
                              color: textSecondary,
                              fontFamily: 'monospace',
                            ),
                          ),
                          const SizedBox(height: 8),
                          CupertinoButton(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                            color: AppColors.systemBlue.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                            onPressed: _fillTestingCredentials,
                            child: const Text(
                              'Auto-Fill Testing ID',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: AppColors.systemBlue,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // --- Login Form ---
  Widget _buildLoginForm(bool isDark, Color textPrimary, Color textSecondary, bool isLoading) {
    return Column(
      children: [
        _buildTextField(
          controller: _loginEmailController,
          label: 'Email Address',
          placeholder: 'Enter your email',
          icon: CupertinoIcons.mail_solid,
          keyboardType: TextInputType.emailAddress,
          isDark: isDark,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
        const SizedBox(height: 14),
        _buildTextField(
          controller: _loginPasswordController,
          label: 'Password',
          placeholder: 'Enter your password',
          icon: CupertinoIcons.lock_fill,
          obscureText: _obscureLoginPassword,
          isDark: isDark,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
          suffix: CupertinoButton(
            padding: EdgeInsets.zero,
            onPressed: () => setState(() => _obscureLoginPassword = !_obscureLoginPassword),
            child: Icon(
              _obscureLoginPassword ? CupertinoIcons.eye_slash_fill : CupertinoIcons.eye_fill,
              size: 18,
              color: textSecondary,
            ),
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: CupertinoButton(
            color: AppColors.systemBlue,
            borderRadius: BorderRadius.circular(14),
            padding: EdgeInsets.zero,
            onPressed: isLoading ? null : _handleLogin,
            child: isLoading
                ? const CupertinoActivityIndicator(color: Colors.white)
                : const Text(
                    'Login to SCORE',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
          ),
        ),
      ],
    );
  }

  // --- Signup Form ---
  Widget _buildSignupForm(bool isDark, Color textPrimary, Color textSecondary, bool isLoading) {
    return Column(
      children: [
        _buildTextField(
          controller: _signupNameController,
          label: 'Full Name',
          placeholder: 'e.g. Arjun Sharma',
          icon: CupertinoIcons.person_crop_circle_fill,
          isDark: isDark,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
        const SizedBox(height: 14),
        _buildTextField(
          controller: _signupEmailController,
          label: 'Email Address',
          placeholder: 'name@example.com',
          icon: CupertinoIcons.mail_solid,
          keyboardType: TextInputType.emailAddress,
          isDark: isDark,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
        const SizedBox(height: 14),
        _buildTextField(
          controller: _signupPasswordController,
          label: 'Password',
          placeholder: 'At least 6 characters',
          icon: CupertinoIcons.lock_fill,
          obscureText: _obscureSignupPassword,
          isDark: isDark,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
          suffix: CupertinoButton(
            padding: EdgeInsets.zero,
            onPressed: () => setState(() => _obscureSignupPassword = !_obscureSignupPassword),
            child: Icon(
              _obscureSignupPassword ? CupertinoIcons.eye_slash_fill : CupertinoIcons.eye_fill,
              size: 18,
              color: textSecondary,
            ),
          ),
        ),
        const SizedBox(height: 14),
        _buildTextField(
          controller: _signupConfirmPasswordController,
          label: 'Confirm Password',
          placeholder: 'Re-enter password',
          icon: CupertinoIcons.lock_shield_fill,
          obscureText: _obscureSignupConfirmPassword,
          isDark: isDark,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
          suffix: CupertinoButton(
            padding: EdgeInsets.zero,
            onPressed: () => setState(() => _obscureSignupConfirmPassword = !_obscureSignupConfirmPassword),
            child: Icon(
              _obscureSignupConfirmPassword ? CupertinoIcons.eye_slash_fill : CupertinoIcons.eye_fill,
              size: 18,
              color: textSecondary,
            ),
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: CupertinoButton(
            color: AppColors.systemBlue,
            borderRadius: BorderRadius.circular(14),
            padding: EdgeInsets.zero,
            onPressed: isLoading ? null : _handleSignup,
            child: isLoading
                ? const CupertinoActivityIndicator(color: Colors.white)
                : const Text(
                    'Create Account',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
          ),
        ),
      ],
    );
  }

  // --- Centered Google Sign-In / Sign-Up Button ---
  Widget _buildGoogleButton(bool isDark, Color textPrimary) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          backgroundColor: isDark ? AppColors.darkCardSurface : Colors.white,
          side: BorderSide(
            color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
            width: 1,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          elevation: isDark ? 0 : 1,
        ),
        onPressed: _handleGoogleAuth,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Google G Brand Icon
            Container(
              width: 22,
              height: 22,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
              ),
              child: const Center(
                child: Text(
                  'G',
                  style: TextStyle(
                    color: Color(0xFF4285F4),
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                    fontFamily: 'Roboto',
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              _isSignup ? 'Sign up with Google' : 'Sign in with Google',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String placeholder,
    required IconData icon,
    required bool isDark,
    required Color textPrimary,
    required Color textSecondary,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
    Widget? suffix,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 6),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: textSecondary,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
              width: 0.8,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
          child: Row(
            children: [
              Icon(icon, size: 18, color: textSecondary),
              const SizedBox(width: 10),
              Expanded(
                child: CupertinoTextField(
                  controller: controller,
                  placeholder: placeholder,
                  placeholderStyle: TextStyle(color: textSecondary.withValues(alpha: 0.5), fontSize: 14),
                  style: TextStyle(color: textPrimary, fontSize: 15, fontWeight: FontWeight.w500),
                  obscureText: obscureText,
                  keyboardType: keyboardType,
                  decoration: const BoxDecoration(color: Colors.transparent),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
              ?suffix,
            ],
          ),
        ),
      ],
    );
  }
}
