import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'firebase_notification_service.dart';

/// Manages FCM device token registration and lifecycle in Supabase.
///
/// Token lifecycle:
///   1. User authenticates → registerToken() called → token registered in device_tokens
///   2. FCM issues new token → listenForTokenRefresh triggers → token updated
///   3. User logs out → deactivateToken() called → is_active=false → no more notifications
///
/// Security:
/// - FCM tokens are stored in device_tokens with RLS (users see only their own)
/// - Token deactivation happens BEFORE Supabase signOut (requires auth session)
/// - Invalid tokens reported by FCM are deactivated server-side by send-notification function
/// - Device IDs use platform-provided identifiers (Build.ID on Android, identifierForVendor on iOS)
class DeviceTokenService {
  DeviceTokenService._();
  static final DeviceTokenService instance = DeviceTokenService._();

  final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  /// Register or refresh the FCM token for the currently authenticated user.
  ///
  /// Uses UPSERT on (user_id, device_id) unique constraint — safe to call
  /// multiple times. If the token has changed, the row is updated.
  ///
  /// Call this AFTER the user has successfully authenticated (Supabase session active).
  /// Also sets up the token refresh listener for automatic re-registration.
  Future<void> registerToken() async {
    if (kIsWeb) return;

    try {
      final client = Supabase.instance.client;
      final userId = client.auth.currentUser?.id;
      if (userId == null) {
        debugPrint('DeviceTokenService: registerToken called without active session');
        return;
      }

      final token = await FirebaseNotificationService.instance.getFcmToken();
      if (token == null) {
        debugPrint('DeviceTokenService: FCM token unavailable — Firebase may not be configured');
        return;
      }

      final deviceId = await _getDeviceId();
      final platform = Platform.isIOS ? 'ios' : 'android';
      final now = DateTime.now().toUtc().toIso8601String();

      await client.from('device_tokens').upsert(
        {
          'user_id': userId,
          'device_id': deviceId,
          'fcm_token': token,
          'platform': platform,
          'is_active': true,
          'notification_enabled': true,
          'last_seen_at': now,
          'updated_at': now,
        },
        onConflict: 'user_id,device_id',
      );

      // Listen for future token refreshes and re-register automatically
      FirebaseNotificationService.instance.listenForTokenRefresh(
        (newToken) => _updateToken(
          userId: userId,
          deviceId: deviceId,
          token: newToken,
          platform: platform,
        ),
      );

      debugPrint('DeviceTokenService: token registered for $platform device');
    } catch (e) {
      // Non-fatal — the app works without push notifications
      debugPrint('DeviceTokenService: registerToken failed (non-fatal)');
    }
  }

  /// Deactivate the FCM token for the current device on logout.
  ///
  /// IMPORTANT: Call this BEFORE Supabase signOut.
  /// The deactivation requires an active Supabase session for RLS to allow the update.
  /// After signOut, the RLS policy will block this operation.
  ///
  /// After deactivation, this device will no longer receive push notifications
  /// for the logged-out user, even if the token remains valid on Firebase's side.
  Future<void> deactivateToken() async {
    if (kIsWeb) return;

    try {
      final client = Supabase.instance.client;
      final userId = client.auth.currentUser?.id;
      if (userId == null) {
        debugPrint('DeviceTokenService: no active session to deactivate token for');
        return;
      }

      final deviceId = await _getDeviceId();
      final now = DateTime.now().toUtc().toIso8601String();

      await client
          .from('device_tokens')
          .update({'is_active': false, 'updated_at': now})
          .eq('user_id', userId)
          .eq('device_id', deviceId);

      debugPrint('DeviceTokenService: token deactivated for device $deviceId');
    } catch (e) {
      // Non-fatal — token may eventually be cleaned up server-side when
      // FCM reports it as UNREGISTERED
      debugPrint('DeviceTokenService: deactivateToken failed (non-fatal)');
    }
  }

  /// Update the stored FCM token for this device (called on token refresh).
  Future<void> _updateToken({
    required String userId,
    required String deviceId,
    required String token,
    required String platform,
  }) async {
    try {
      final client = Supabase.instance.client;
      final now = DateTime.now().toUtc().toIso8601String();

      await client.from('device_tokens').upsert(
        {
          'user_id': userId,
          'device_id': deviceId,
          'fcm_token': token,
          'platform': platform,
          'is_active': true,
          'notification_enabled': true,
          'last_seen_at': now,
          'updated_at': now,
        },
        onConflict: 'user_id,device_id',
      );

      debugPrint('DeviceTokenService: token updated after refresh');
    } catch (e) {
      debugPrint('DeviceTokenService: token refresh update failed (non-fatal)');
    }
  }

  /// Update the notification_enabled flag for this device.
  ///
  /// Call when the user toggles notifications in app settings.
  Future<void> setNotificationEnabled({required bool enabled}) async {
    if (kIsWeb) return;

    try {
      final client = Supabase.instance.client;
      final userId = client.auth.currentUser?.id;
      if (userId == null) return;

      final deviceId = await _getDeviceId();
      await client
          .from('device_tokens')
          .update({
            'notification_enabled': enabled,
            'updated_at': DateTime.now().toUtc().toIso8601String(),
          })
          .eq('user_id', userId)
          .eq('device_id', deviceId);
    } catch (e) {
      debugPrint('DeviceTokenService: setNotificationEnabled failed');
    }
  }

  /// Get a stable, platform-provided device identifier.
  ///
  /// Android: android.os.Build.ID (not privacy-sensitive, stable per device)
  /// iOS: identifierForVendor (resets on app reinstall, but stable per vendor)
  Future<String> _getDeviceId() async {
    try {
      if (Platform.isAndroid) {
        final info = await _deviceInfo.androidInfo;
        // Build.ID is stable and not considered PII on Android
        return 'android_${info.id}';
      } else if (Platform.isIOS) {
        final info = await _deviceInfo.iosInfo;
        final idfv = info.identifierForVendor ?? 'unknown';
        return 'ios_$idfv';
      }
    } catch (e) {
      debugPrint('DeviceTokenService: could not read device ID, using fallback');
    }
    // Fallback: timestamp-based ID (less stable but functional)
    return 'unknown_${DateTime.now().millisecondsSinceEpoch}';
  }
}

