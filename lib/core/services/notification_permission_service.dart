import 'package:flutter/foundation.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

/// Status of the device's notification permission.
enum NotificationPermissionStatus {
  /// Permission granted — notifications will be delivered.
  granted,

  /// Permission denied — notifications will not be delivered.
  denied,

  /// Permission permanently denied — the user must enable it in device settings.
  permanentlyDenied,

  /// Permission not yet requested on this device.
  notDetermined,
}

/// Manages notification permission requests using the Firebase Messaging API.
///
/// Design rules (enforced here):
/// - Permissions are NEVER requested at cold launch (app start).
/// - Request permission only at a contextual moment, such as:
///   - When the user reaches the notification settings screen
///   - When the user completes onboarding
///   - When the user enables notifications explicitly in a settings toggle
/// - The app must continue working normally if permission is denied.
class NotificationPermissionService {
  NotificationPermissionService._();
  static final NotificationPermissionService instance =
      NotificationPermissionService._();

  /// Request notification permission from the OS.
  ///
  /// Call this only at a contextually appropriate moment — NEVER at app launch.
  /// The user should understand why the app is requesting notification access
  /// before this method is called.
  ///
  /// On iOS: triggers the system permission dialog on first call.
  ///   Subsequent calls return the already-granted or already-denied status.
  ///
  /// On Android 13+: triggers the POST_NOTIFICATIONS permission dialog.
  ///   On Android < 13: permission is granted automatically at install time.
  ///
  /// Returns the resulting permission status.
  Future<NotificationPermissionStatus> requestPermission() async {
    if (kIsWeb) return NotificationPermissionStatus.notDetermined;

    try {
      final settings = await FirebaseMessaging.instance.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false, // Set true for iOS quiet delivery without asking
        sound: true,
      );

      return _mapToStatus(settings.authorizationStatus);
    } catch (e) {
      debugPrint('NotificationPermissionService: requestPermission failed');
      return NotificationPermissionStatus.notDetermined;
    }
  }

  /// Check the current notification permission status without triggering a request.
  ///
  /// Use this to adjust UI (e.g., show a banner, disable toggle) without
  /// requesting permission prematurely.
  Future<NotificationPermissionStatus> checkStatus() async {
    if (kIsWeb) return NotificationPermissionStatus.notDetermined;

    try {
      final settings =
          await FirebaseMessaging.instance.getNotificationSettings();
      return _mapToStatus(settings.authorizationStatus);
    } catch (e) {
      debugPrint('NotificationPermissionService: checkStatus failed');
      return NotificationPermissionStatus.notDetermined;
    }
  }

  /// Whether notifications are currently allowed for this app.
  Future<bool> get isPermissionGranted async {
    final status = await checkStatus();
    return status == NotificationPermissionStatus.granted;
  }

  NotificationPermissionStatus _mapToStatus(
      AuthorizationStatus status) {
    switch (status) {
      case AuthorizationStatus.authorized:
        return NotificationPermissionStatus.granted;
      case AuthorizationStatus.provisional:
        // iOS provisional = quiet delivery (no sound/banner) without explicit grant
        return NotificationPermissionStatus.granted;
      case AuthorizationStatus.denied:
        // On iOS, denied is always "denied" (can be re-requested via settings)
        // On Android, denied after one rejection = permanentlyDenied
        return NotificationPermissionStatus.denied;
      case AuthorizationStatus.notDetermined:
        return NotificationPermissionStatus.notDetermined;
    }
  }
}

