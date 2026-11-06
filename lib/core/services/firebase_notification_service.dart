import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

// ─── Background Message Handler ──────────────────────────────────────────────
// IMPORTANT: Must be a top-level function (not a class method or closure).
// This requirement is enforced by firebase_messaging.
// @pragma('vm:entry-point') ensures tree-shaker does not remove it.

@pragma('vm:entry-point')
Future<void> _firebaseBackgroundMessageHandler(RemoteMessage message) async {
  // Firebase must be re-initialized in background isolates on Android.
  // On iOS this handler runs in the main app process.
  try {
    await Firebase.initializeApp();
  } catch (_) {
    // Already initialized — safe to ignore
  }
  // Handle data-only background messages here if needed.
  // Do not show local notifications from here (use FCM notification payload instead).
  debugPrint('FCM: background message received (id: ${message.messageId})');
}

// ─── Firebase Notification Service ───────────────────────────────────────────

/// Manages Firebase Cloud Messaging initialization and notification handling.
///
/// Architecture:
///   FCM → Firebase Cloud → App (foreground: local notification, background: system tray)
///
/// Security:
/// - FCM device token is a device identifier — never log it
/// - Service account credentials are stored only in Supabase Edge Function secrets
/// - App never sends notifications directly; it only receives them
///
/// Usage:
///   1. Call FirebaseNotificationService.instance.initialize() in main() before runApp()
///   2. After authentication, call DeviceTokenService.instance.registerToken()
///   3. On logout, call DeviceTokenService.instance.deactivateToken() before signOut()
class FirebaseNotificationService {
  FirebaseNotificationService._();
  static final FirebaseNotificationService instance = FirebaseNotificationService._();

  bool _initialized = false;
  bool get isInitialized => _initialized;

  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  // Android notification channel configuration
  static const AndroidNotificationChannel _defaultChannel =
      AndroidNotificationChannel(
    'score_high_importance',          // ID — must match AndroidManifest.xml meta-data
    'SCORE Notifications',            // Name shown to users in Settings
    description: 'Exam updates, preparation reminders, and important announcements from SCORE',
    importance: Importance.high,
    playSound: true,
    enableVibration: true,
  );

  // Pending navigation route from notification tap (foreground or background)
  String? _pendingNavigationRoute;

  /// Initialize Firebase and FCM.
  ///
  /// Call once in main() after WidgetsFlutterBinding.ensureInitialized(),
  /// before runApp(). The app continues normally if Firebase initialization
  /// fails (e.g., GoogleService-Info.plist / google-services.json not yet configured).
  Future<void> initialize() async {
    if (_initialized) return;
    if (kIsWeb) return; // FCM push notifications are not configured for web

    try {
      // Initialize Firebase app
      await Firebase.initializeApp();
      _initialized = true;

      // Register background message handler BEFORE any other FirebaseMessaging calls
      FirebaseMessaging.onBackgroundMessage(_firebaseBackgroundMessageHandler);

      // Setup local notifications plugin (for foreground message display)
      await _setupLocalNotifications();

      // Listen for messages when app is in foreground
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Listen for notification taps when app was in background (not terminated)
      FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationOpenedApp);

      // On iOS: configure foreground notification presentation
      await FirebaseMessaging.instance
          .setForegroundNotificationPresentationOptions(
        alert: false, // We show our own local notification in foreground
        badge: true,
        sound: false,
      );

      debugPrint('FirebaseNotificationService: initialized successfully');
    } on Exception catch (e) {
      // This is expected when google-services.json / GoogleService-Info.plist
      // has not yet been configured. The app continues without FCM.
      debugPrint('FirebaseNotificationService: initialization failed — '
          'Firebase configuration may be missing. '
          'Push notifications will be unavailable until Firebase is configured. '
          'Error type: ${e.runtimeType}');
      _initialized = false;
    }
  }

  /// Setup flutter_local_notifications for in-app foreground notification display.
  Future<void> _setupLocalNotifications() async {
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosInit = DarwinInitializationSettings(
      requestAlertPermission: false, // We handle permissions separately
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const initSettings = InitializationSettings(
      android: androidInit,
      iOS: iosInit,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // User tapped a local notification — extract route from payload
        _pendingNavigationRoute = response.payload;
        debugPrint('FirebaseNotificationService: local notification tapped');
      },
    );

    // Create the Android notification channel (required for Android 8.0+)
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_defaultChannel);
  }

  /// Handle a notification received while the app is in the foreground.
  void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;

    // Show a local notification for foreground messages (system tray won't show it)
    if (notification != null) {
      _localNotifications.show(
        // Use message hash as ID — prevents duplicate notifications
        message.hashCode,
        notification.title,
        notification.body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            _defaultChannel.id,
            _defaultChannel.name,
            channelDescription: _defaultChannel.description,
            importance: Importance.high,
            priority: Priority.high,
            icon: '@mipmap/ic_launcher',
            playSound: true,
          ),
          iOS: const DarwinNotificationDetails(
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
          ),
        ),
        // Pass navigation route as payload if provided in data
        payload: message.data['route'],
      );
    }
  }

  /// Handle a notification tap when the app was in the background (not terminated).
  void _handleNotificationOpenedApp(RemoteMessage message) {
    debugPrint('FirebaseNotificationService: notification tapped from background');
    _pendingNavigationRoute = message.data['route'];
  }

  /// Retrieve and consume any pending navigation route from a notification tap.
  ///
  /// Also checks for the initial message if the app was launched from a
  /// terminated state via a notification tap.
  ///
  /// Call this after app initialization and authentication are complete.
  /// Returns null if there is no pending navigation.
  Future<String?> consumePendingNavigationRoute() async {
    if (!_initialized) return null;

    try {
      // Check if the app was launched by tapping a notification from terminated state
      final initialMessage =
          await FirebaseMessaging.instance.getInitialMessage();
      if (initialMessage != null) {
        return initialMessage.data['route'];
      }
    } catch (_) {
      // Firebase not configured — no initial message
    }

    // Return and clear any in-memory pending route (from background tap)
    final route = _pendingNavigationRoute;
    _pendingNavigationRoute = null;
    return route;
  }

  /// Get the current FCM device token.
  ///
  /// Returns null if Firebase is not initialized, permission was not granted,
  /// or token retrieval failed.
  ///
  /// The returned token is a device identifier — it must not be logged
  /// or exposed in error messages.
  Future<String?> getFcmToken() async {
    if (!_initialized) return null;

    try {
      return await FirebaseMessaging.instance.getToken();
    } catch (e) {
      debugPrint('FirebaseNotificationService: getFcmToken failed');
      return null;
    }
  }

  /// Register a listener for FCM token refresh events.
  ///
  /// FCM tokens are periodically refreshed by Firebase. When a new token is
  /// issued, the old token becomes invalid. Call this after user authentication
  /// to ensure the new token is registered in Supabase.
  ///
  /// [onRefresh] receives the new token value.
  void listenForTokenRefresh(void Function(String newToken) onRefresh) {
    if (!_initialized) return;

    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
      debugPrint('FirebaseNotificationService: FCM token refreshed');
      onRefresh(newToken);
    });
  }
}

