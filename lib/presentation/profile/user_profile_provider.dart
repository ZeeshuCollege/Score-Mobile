import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'user_profile_model.dart';

class UserProfileNotifier extends Notifier<UserProfileData> {
  static const String _prefKey = 'score_user_profile_data';

  @override
  UserProfileData build() {
    _loadProfile();
    return const UserProfileData();
  }

  Future<void> _loadProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKey);
      if (saved != null && saved.isNotEmpty) {
        state = UserProfileData.fromJson(saved);
      }
    } catch (_) {}
  }

  Future<void> updateProfile({
    String? name,
    String? description,
    int? avatarId,
    String? targetCollege,
    String? targetExam,
  }) async {
    state = state.copyWith(
      name: name,
      description: description,
      avatarId: avatarId,
      targetCollege: targetCollege,
      targetExam: targetExam,
    );

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, state.toJson());
    } catch (_) {}
  }
}

final userProfileProvider =
    NotifierProvider<UserProfileNotifier, UserProfileData>(UserProfileNotifier.new);
