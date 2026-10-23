import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:permission_handler/permission_handler.dart';

/// Centralized service handling Camera and Notification permissions.
class PermissionService {
  PermissionService._();
  static final PermissionService instance = PermissionService._();

  /// Requests Camera and Notification permissions upon app startup / installation.
  Future<Map<Permission, PermissionStatus>> requestInitialPermissions() async {
    // In web or Flutter test environments, skip native permission requests
    if (kIsWeb || WidgetsBinding.instance.runtimeType.toString().contains('TestWidgetsFlutterBinding')) {
      return {};
    }

    try {
      if (Platform.isAndroid || Platform.isIOS) {
        final statuses = await [
          Permission.camera,
          Permission.notification,
        ].request();
        return statuses;
      }
    } catch (e) {
      debugPrint('PermissionService: requestInitialPermissions error: $e');
    }
    return {};
  }

  /// Requests camera permission specifically when editing profile photo or scanning.
  Future<bool> requestCameraPermission() async {
    if (kIsWeb || WidgetsBinding.instance.runtimeType.toString().contains('TestWidgetsFlutterBinding')) {
      return true;
    }

    try {
      if (Platform.isAndroid || Platform.isIOS) {
        final status = await Permission.camera.request();
        return status.isGranted;
      }
    } catch (e) {
      debugPrint('PermissionService: requestCameraPermission error: $e');
    }
    return true;
  }
}
