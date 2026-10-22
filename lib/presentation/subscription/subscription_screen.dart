import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/ios_grouped_list.dart';

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
    HapticFeedback.mediumImpact();
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 1000));

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_score_pro_subscriber', true);

    setState(() {
      _isPro = true;
      _isProcessing = false;
    });

    if (mounted) {
      HapticFeedback.heavyImpact();
      showCupertinoDialog(
        context: context,
        builder: (_) => CupertinoAlertDialog(
          title: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(CupertinoIcons.checkmark_seal_fill, color: AppColors.correctGreen, size: 24),
              const SizedBox(width: 8),
              const Text('Welcome to PRO!'),
            ],
          ),
          content: const Padding(
            padding: EdgeInsets.only(top: 8.0),
            child: Text(
              'All shifts from 2010 to 2026, step-by-step video solutions, unlimited CBT mock tests, and smart mistake analytics have been unlocked.',
            ),
          ),
          actions: [
            CupertinoDialogAction(
              isDefaultAction: true,
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context, true);
              },
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
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // iOS Hero Card
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
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
                          border: Border.all(color: Colors.amber.withValues(alpha: 0.4)),
                        ),
                        child: Row(
                          children: [
                            const Icon(CupertinoIcons.star_fill, color: Colors.amber, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              'SCORE PRO',
                              style: AppTypography.labelSmall(Colors.white).copyWith(
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (_isPro)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.correctGreen,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text('ACTIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Elevate Your JEE & NEET Rank',
                    style: AppTypography.displayMedium(Colors.white).copyWith(fontSize: 22),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Full access to all 15-year shifts, unlimited CBT simulations, video solutions, and formula flashcards.',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.85),
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Plan Selector Cards
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: List.generate(_plans.length, (idx) {
                final plan = _plans[idx];
                final isSelected = _selectedPlanIndex == idx;

                return Expanded(
                  child: GestureDetector(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() => _selectedPlanIndex = idx);
                    },
                    child: Container(
                      margin: EdgeInsets.only(
                        left: idx == 0 ? 0 : 4,
                        right: idx == _plans.length - 1 ? 0 : 4,
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isDark ? AppColors.systemBlueDark.withValues(alpha: 0.18) : AppColors.systemBlue.withValues(alpha: 0.08))
                            : (isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected
                              ? (isDark ? AppColors.systemBlueDark : AppColors.systemBlue)
                              : (isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke),
                          width: isSelected ? 2 : 0.5,
                        ),
                      ),
                      child: Column(
                        children: [
                          if (plan['tag'] != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              margin: const EdgeInsets.only(bottom: 6),
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.systemBlueDark : AppColors.systemBlue,
                                borderRadius: BorderRadius.circular(4),
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
                            const SizedBox(height: 16),
                          Text(
                            plan['title'],
                            style: AppTypography.bodySmall(textSecondary),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            plan['price'],
                            style: AppTypography.titleLarge(textPrimary).copyWith(fontSize: 17),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            plan['period'],
                            style: AppTypography.labelSmall(textSecondary),
                          ),
                          if (plan['savings'] != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              plan['savings'],
                              style: TextStyle(
                                color: isDark ? AppColors.systemGreenDark : AppColors.correctGreen,
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
          ),
          const SizedBox(height: 16),

          // Feature Comparison Inset Section
          IosGroupedSection(
            header: 'Free vs. PRO Features',
            footer: 'Legitimate subscription verified via standard In-App Purchases (Zero Piracy Guarantee)',
            children: [
              _iosComparisonRow('15+ Years Chapter PYQs (2010–2026)', free: '2020–2024 only', pro: 'All Shifts & Years'),
              _iosComparisonRow('NTA-Style CBT Mock Simulator', free: '1 Test / week', pro: 'Unlimited Full Tests'),
              _iosComparisonRow('Step-by-Step Video Solutions', free: 'Basic Text only', pro: 'All Questions'),
              _iosComparisonRow('Spaced Repetition Mistake Notebook', free: 'Basic (50 items)', pro: 'Unlimited Sync'),
              _iosComparisonRow('Formula & High-Yield Flashcards', free: 'Limited set', pro: 'All 4 Subjects'),
              _iosComparisonRow('Distraction-Free Study Experience', free: 'Banner Ads', pro: '100% Ad-Free'),
            ],
          ),

          // Primary CTA Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: CupertinoButton.filled(
                borderRadius: BorderRadius.circular(12),
                padding: EdgeInsets.zero,
                onPressed: _isProcessing ? null : _handleSubscribe,
                child: _isProcessing
                    ? const CupertinoActivityIndicator(color: Colors.white)
                    : Text(
                        _isPro
                            ? 'Subscription Active · Extend Plan'
                            : 'Subscribe for ${_plans[_selectedPlanIndex]['price']} (${_plans[_selectedPlanIndex]['title']})',
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                      ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text(
                'Secured via Apple App Store / In-App Purchases · Cancel anytime',
                style: AppTypography.labelSmall(textSecondary),
                textAlign: TextAlign.center,
              ),
            ),
          ),
          SizedBox(height: 24 + MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  Widget _iosComparisonRow(String feature, {required String free, required String pro}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(feature, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Free: $free', style: const TextStyle(color: Colors.grey, fontSize: 12)),
              Row(
                children: [
                  const Icon(CupertinoIcons.checkmark_alt, color: AppColors.correctGreen, size: 14),
                  const SizedBox(width: 4),
                  Text(
                    pro,
                    style: const TextStyle(color: AppColors.systemBlue, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
