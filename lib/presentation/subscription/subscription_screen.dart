import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  int _selectedPlanIndex = 1; // Default to 6 Months (Popular)
  bool _isPro = false;
  bool _isProcessing = false;

  final List<Map<String, dynamic>> _plans = [
    {
      'title': '1 Month',
      'price': '₹199',
      'period': '/ month',
      'tag': null,
      'savings': null,
    },
    {
      'title': '6 Months',
      'price': '₹799',
      'period': '₹133 / mo',
      'tag': 'MOST POPULAR',
      'savings': 'Save 33%',
    },
    {
      'title': '12 Months',
      'price': '₹1,299',
      'period': '₹108 / mo',
      'tag': 'BEST VALUE',
      'savings': 'Save 45%',
    },
  ];

  @override
  void initState() {
    super.initState();
    _checkSubscriptionStatus();
  }

  Future<void> _checkSubscriptionStatus() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _isPro = prefs.getBool('is_score_pro_subscriber') ?? false;
    });
  }

  Future<void> _handleSubscribe() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 1200));

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_score_pro_subscriber', true);

    setState(() {
      _isPro = true;
      _isProcessing = false;
    });

    if (mounted) {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.verified_rounded, color: AppColors.correctGreen, size: 28),
              const SizedBox(width: 8),
              const Text('Welcome to PRO!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'SCORE PRO Active',
                style: GoogleFonts.outfit(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.brandBlue,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'All shifts from 2010 to 2026, step-by-step video solutions, unlimited CBT mock tests, and smart mistake analytics have been unlocked.',
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context, true);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: Colors.white,
              ),
              child: const Text('Start Practicing'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Score PRO'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Pro Crown Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E3A8A), Color(0xFF2563EB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.brandBlue.withValues(alpha: 0.3),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.amber.withValues(alpha: 0.5)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.star_rounded, color: Colors.amber, size: 18),
                            const SizedBox(width: 4),
                            Text(
                              'SCORE PRO',
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (_isPro)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.correctGreen,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text('ACTIVE', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Supercharge Your JEE / NEET Rank',
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Full access to all 15-year shifts, unlimited CBT simulations, video solutions, and formula flashcards.',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.85),
                      fontSize: 14,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Plan Selector Cards
            Text('Choose Your Prep Plan', style: AppTypography.titleLarge(textPrimary)),
            const SizedBox(height: 12),

            Row(
              children: List.generate(_plans.length, (idx) {
                final plan = _plans[idx];
                final isSelected = _selectedPlanIndex == idx;

                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedPlanIndex = idx),
                    child: Container(
                      margin: EdgeInsets.only(
                        left: idx == 0 ? 0 : 4,
                        right: idx == _plans.length - 1 ? 0 : 4,
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.brandBlue.withValues(alpha: isDark ? 0.2 : 0.08)
                            : (isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.brandBlue
                              : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          if (plan['tag'] != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              margin: const EdgeInsets.only(bottom: 6),
                              decoration: BoxDecoration(
                                color: AppColors.brandBlue,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                plan['tag'],
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            )
                          else
                            const SizedBox(height: 18),
                          Text(
                            plan['title'],
                            style: AppTypography.bodySmall(textSecondary),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            plan['price'],
                            style: AppTypography.titleLarge(textPrimary),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            plan['period'],
                            style: AppTypography.labelSmall(textSecondary),
                          ),
                          if (plan['savings'] != null) ...[
                            const SizedBox(height: 6),
                            Text(
                              plan['savings'],
                              style: const TextStyle(
                                color: AppColors.correctGreen,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 28),

            // Feature Comparison Table
            Text('Free vs. PRO Comparison', style: AppTypography.titleLarge(textPrimary)),
            const SizedBox(height: 12),

            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _comparisonRow('15+ Years Chapter PYQs (2010-2026)', free: '2020-2024 only', pro: 'All Shifts & Years'),
                    const Divider(height: 20),
                    _comparisonRow('NTA-Style CBT Mock Simulator', free: '1 Test / week', pro: 'Unlimited Full Tests'),
                    const Divider(height: 20),
                    _comparisonRow('Step-by-Step Video Solutions', free: 'No', pro: 'All Questions'),
                    const Divider(height: 20),
                    _comparisonRow('Spaced Repetition Mistake Notebook', free: 'Basic (50 items)', pro: 'Unlimited Sync'),
                    const Divider(height: 20),
                    _comparisonRow('Formula & High-Yield Flashcards', free: 'Limited', pro: 'Full Physics/Chem/Math'),
                    const Divider(height: 20),
                    _comparisonRow('Ad-Free Clean Study Experience', free: 'Banner Ads', pro: '100% Ad-Free'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // CTA Subscribe Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _handleSubscribe,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brandBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                      )
                    : Text(
                        _isPro
                            ? 'Subscription Active · Extend Plan'
                            : 'Continue with ${_plans[_selectedPlanIndex]['title']} (${_plans[_selectedPlanIndex]['price']})',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
              ),
            ),
            const SizedBox(height: 12),
            Center(
              child: Text(
                'Secured via In-App Billing · Cancel anytime in Google Play Store',
                style: AppTypography.bodySmall(textSecondary),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _comparisonRow(String feature, {required String free, required String pro}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(feature, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        const SizedBox(height: 4),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Free: $free', style: const TextStyle(color: Colors.grey, fontSize: 12)),
            Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: AppColors.correctGreen, size: 14),
                const SizedBox(width: 4),
                Text(pro, style: const TextStyle(color: AppColors.brandBlue, fontSize: 12, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
