import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../supabase/supabase_config.dart';
import '../../data/remote/supabase_service.dart';

/// Represents the dynamic application visual configuration synced from the Web Admin Portal.
class AppConfig {
  final String? logoUrl;
  final String? onboardingSlide1;
  final String? onboardingSlide2;
  final String? onboardingSlide3;
  final String? inAppSlide1;
  final String? inAppSlide2;
  final String? inAppSlide3;
  final bool isLoading;

  const AppConfig({
    this.logoUrl,
    this.onboardingSlide1,
    this.onboardingSlide2,
    this.onboardingSlide3,
    this.inAppSlide1,
    this.inAppSlide2,
    this.inAppSlide3,
    this.isLoading = false,
  });

  AppConfig copyWith({
    String? logoUrl,
    String? onboardingSlide1,
    String? onboardingSlide2,
    String? onboardingSlide3,
    String? inAppSlide1,
    String? inAppSlide2,
    String? inAppSlide3,
    bool? isLoading,
  }) {
    return AppConfig(
      logoUrl: logoUrl ?? this.logoUrl,
      onboardingSlide1: onboardingSlide1 ?? this.onboardingSlide1,
      onboardingSlide2: onboardingSlide2 ?? this.onboardingSlide2,
      onboardingSlide3: onboardingSlide3 ?? this.onboardingSlide3,
      inAppSlide1: inAppSlide1 ?? this.inAppSlide1,
      inAppSlide2: inAppSlide2 ?? this.inAppSlide2,
      inAppSlide3: inAppSlide3 ?? this.inAppSlide3,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  String? getOnboardingSlide(int index) {
    switch (index) {
      case 0:
        return onboardingSlide1;
      case 1:
        return onboardingSlide2;
      case 2:
        return onboardingSlide3;
      default:
        return null;
    }
  }

  String? getInAppSlide(int index) {
    switch (index) {
      case 0:
        return inAppSlide1;
      case 1:
        return inAppSlide2;
      case 2:
        return inAppSlide3;
      default:
        return null;
    }
  }

  bool get hasCustomInAppSlides =>
      (inAppSlide1 != null && inAppSlide1!.isNotEmpty) ||
      (inAppSlide2 != null && inAppSlide2!.isNotEmpty) ||
      (inAppSlide3 != null && inAppSlide3!.isNotEmpty);

  Map<String, dynamic> toJson() {
    return {
      'logoUrl': logoUrl,
      'onboardingSlide1': onboardingSlide1,
      'onboardingSlide2': onboardingSlide2,
      'onboardingSlide3': onboardingSlide3,
      'inAppSlide1': inAppSlide1,
      'inAppSlide2': inAppSlide2,
      'inAppSlide3': inAppSlide3,
    };
  }

  factory AppConfig.fromJson(Map<String, dynamic> json) {
    return AppConfig(
      logoUrl: json['logoUrl'] as String?,
      onboardingSlide1: json['onboardingSlide1'] as String?,
      onboardingSlide2: json['onboardingSlide2'] as String?,
      onboardingSlide3: json['onboardingSlide3'] as String?,
      inAppSlide1: json['inAppSlide1'] as String?,
      inAppSlide2: json['inAppSlide2'] as String?,
      inAppSlide3: json['inAppSlide3'] as String?,
    );
  }
}

/// Centralized service managing instant app logo and slideshow synchronization.
class AppConfigService {
  AppConfigService._();
  static final AppConfigService instance = AppConfigService._();

  static const String _prefCacheKey = 'score_app_config_cache';

  AppConfig _currentConfig = const AppConfig();
  AppConfig get currentConfig => _currentConfig;

  final ValueNotifier<AppConfig> configNotifier = ValueNotifier<AppConfig>(const AppConfig());
  RealtimeChannel? _realtimeChannel;
  StreamSubscription? _streamSub;

  /// Initialize local cached config and listen for live changes from Supabase
  Future<void> initialize() async {
    // 1. Load local cache immediately for instantaneous rendering without network wait
    await _loadFromLocalCache();

    // 2. Fetch fresh config from Supabase cloud if configured
    if (SupabaseConfig.isConfigured && SupabaseService.instance.isInitialized) {
      await fetchRemoteConfig();
      _subscribeToRealtimeChanges();
    }
  }

  Future<void> _loadFromLocalCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cachedJson = prefs.getString(_prefCacheKey);
      if (cachedJson != null && cachedJson.isNotEmpty) {
        final Map<String, dynamic> decoded = jsonDecode(cachedJson) as Map<String, dynamic>;
        _updateConfig(AppConfig.fromJson(decoded));
      }
    } catch (e) {
      debugPrint('AppConfigService: Error loading cached config ($e)');
    }
  }

  Future<void> _saveToLocalCache(AppConfig config) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefCacheKey, jsonEncode(config.toJson()));
    } catch (e) {
      debugPrint('AppConfigService: Error saving config to cache ($e)');
    }
  }

  /// Fetch the latest configuration from Supabase `app_config` table
  Future<void> fetchRemoteConfig() async {
    final client = SupabaseService.instance.client;
    if (client == null) return;

    try {
      final response = await client.from('app_config').select('key, value');
      _applyConfigRows(response);
    } catch (e) {
      debugPrint('AppConfigService: fetchRemoteConfig notice - table may be pending migration ($e)');
    }
  }

  /// Subscribe to Supabase Realtime broadcast for instant updates across all student devices
  void _subscribeToRealtimeChanges() {
    final client = SupabaseService.instance.client;
    if (client == null) return;

    try {
      _realtimeChannel?.unsubscribe();
      _streamSub?.cancel();

      // Listen via PostgreSQL changes stream
      _streamSub = client
          .from('app_config')
          .stream(primaryKey: ['key'])
          .listen((List<Map<String, dynamic>> rows) {
            debugPrint('AppConfigService: Realtime update received from Supabase (${rows.length} keys)');
            _applyConfigRows(rows);
          }, onError: (err) {
            debugPrint('AppConfigService: Realtime stream subscription notice: $err');
          });
    } catch (e) {
      debugPrint('AppConfigService: Realtime setup warning ($e)');
    }
  }

  void _applyConfigRows(dynamic rows) {
    if (rows == null || rows is! List) return;

    String? logoUrl = _currentConfig.logoUrl;
    String? ob1 = _currentConfig.onboardingSlide1;
    String? ob2 = _currentConfig.onboardingSlide2;
    String? ob3 = _currentConfig.onboardingSlide3;
    String? in1 = _currentConfig.inAppSlide1;
    String? in2 = _currentConfig.inAppSlide2;
    String? in3 = _currentConfig.inAppSlide3;

    for (final row in rows) {
      final key = row['key'] as String?;
      final value = row['value'];
      if (key == null || value == null) continue;

      Map<String, dynamic> valMap = {};
      if (value is Map<String, dynamic>) {
        valMap = value;
      } else if (value is String) {
        try {
          valMap = jsonDecode(value) as Map<String, dynamic>;
        } catch (_) {}
      }

      if (key == 'app_logo') {
        logoUrl = valMap['url'] as String?;
      } else if (key == 'onboarding_slides') {
        ob1 = valMap['slide1'] as String?;
        ob2 = valMap['slide2'] as String?;
        ob3 = valMap['slide3'] as String?;
      } else if (key == 'in_app_slides') {
        in1 = valMap['slide1'] as String?;
        in2 = valMap['slide2'] as String?;
        in3 = valMap['slide3'] as String?;
      }
    }

    final newConfig = AppConfig(
      logoUrl: logoUrl,
      onboardingSlide1: ob1,
      onboardingSlide2: ob2,
      onboardingSlide3: ob3,
      inAppSlide1: in1,
      inAppSlide2: in2,
      inAppSlide3: in3,
      isLoading: false,
    );

    _updateConfig(newConfig);
    _saveToLocalCache(newConfig);
  }

  void _updateConfig(AppConfig config) {
    _currentConfig = config;
    configNotifier.value = config;
  }

  void dispose() {
    _realtimeChannel?.unsubscribe();
    _streamSub?.cancel();
    configNotifier.dispose();
  }
}

/// Riverpod StateNotifier for dynamic AppConfig state
class AppConfigNotifier extends Notifier<AppConfig> {
  @override
  AppConfig build() {
    final service = AppConfigService.instance;
    // Connect service listener to update Riverpod state
    service.configNotifier.addListener(_onServiceConfigChanged);
    ref.onDispose(() {
      service.configNotifier.removeListener(_onServiceConfigChanged);
    });
    return service.currentConfig;
  }

  void _onServiceConfigChanged() {
    state = AppConfigService.instance.currentConfig;
  }
}

final appConfigProvider = NotifierProvider<AppConfigNotifier, AppConfig>(AppConfigNotifier.new);
