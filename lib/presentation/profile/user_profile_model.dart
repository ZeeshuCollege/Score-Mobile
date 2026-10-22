import 'dart:convert';
import 'package:flutter/material.dart';

/// Predefined Apple-inspired avatar gradients and icons for aspirant profiles
class AvatarStyle {
  final int id;
  final String label;
  final List<Color> gradientColors;
  final IconData icon;

  const AvatarStyle({
    required this.id,
    required this.label,
    required this.gradientColors,
    required this.icon,
  });
}

/// User profile data model with persistence capabilities.
class UserProfileData {
  final String name;
  final String description;
  final int avatarId;
  final String targetCollege;
  final String targetExam;
  final int solvedCount;
  final double accuracy;
  final int streakDays;
  final double studyHours;

  const UserProfileData({
    this.name = 'Aspirant Scholar',
    this.description = 'Target: Top 100 AIR · JEE 2026',
    this.avatarId = 0,
    this.targetCollege = 'IIT Bombay · Computer Science',
    this.targetExam = 'JEE Advanced',
    this.solvedCount = 1248,
    this.accuracy = 84.2,
    this.streakDays = 12,
    this.studyHours = 142.5,
  });

  /// Available avatar styles following Apple HIG vibrant color system
  static const List<AvatarStyle> avatarStyles = [
    AvatarStyle(
      id: 0,
      label: 'Deep Space',
      gradientColors: [Color(0xFF007AFF), Color(0xFF5856D6)],
      icon: Icons.person_rounded,
    ),
    AvatarStyle(
      id: 1,
      label: 'Electric Teal',
      gradientColors: [Color(0xFF00C7BE), Color(0xFF34C759)],
      icon: Icons.school_rounded,
    ),
    AvatarStyle(
      id: 2,
      label: 'Sunset Flame',
      gradientColors: [Color(0xFFFF9500), Color(0xFFFF2D55)],
      icon: Icons.local_fire_department_rounded,
    ),
    AvatarStyle(
      id: 3,
      label: 'Cosmic Purple',
      gradientColors: [Color(0xFFAF52DE), Color(0xFF5856D6)],
      icon: Icons.auto_awesome_rounded,
    ),
    AvatarStyle(
      id: 4,
      label: 'Neon Quantum',
      gradientColors: [Color(0xFF00F2FE), Color(0xFF4FACFE)],
      icon: Icons.psychology_rounded,
    ),
    AvatarStyle(
      id: 5,
      label: 'Golden Prodigy',
      gradientColors: [Color(0xFFFFD60A), Color(0xFFFF9500)],
      icon: Icons.emoji_events_rounded,
    ),
    AvatarStyle(
      id: 6,
      label: 'Emerald Ranker',
      gradientColors: [Color(0xFF30D158), Color(0xFF00897B)],
      icon: Icons.military_tech_rounded,
    ),
    AvatarStyle(
      id: 7,
      label: 'Starlight Medic',
      gradientColors: [Color(0xFFFF375F), Color(0xFFBF5AF2)],
      icon: Icons.favorite_rounded,
    ),
  ];

  AvatarStyle get avatarStyle {
    return avatarStyles.firstWhere(
      (s) => s.id == avatarId,
      orElse: () => avatarStyles.first,
    );
  }

  UserProfileData copyWith({
    String? name,
    String? description,
    int? avatarId,
    String? targetCollege,
    String? targetExam,
    int? solvedCount,
    double? accuracy,
    int? streakDays,
    double? studyHours,
  }) {
    return UserProfileData(
      name: name ?? this.name,
      description: description ?? this.description,
      avatarId: avatarId ?? this.avatarId,
      targetCollege: targetCollege ?? this.targetCollege,
      targetExam: targetExam ?? this.targetExam,
      solvedCount: solvedCount ?? this.solvedCount,
      accuracy: accuracy ?? this.accuracy,
      streakDays: streakDays ?? this.streakDays,
      studyHours: studyHours ?? this.studyHours,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'avatarId': avatarId,
      'targetCollege': targetCollege,
      'targetExam': targetExam,
      'solvedCount': solvedCount,
      'accuracy': accuracy,
      'streakDays': streakDays,
      'studyHours': studyHours,
    };
  }

  factory UserProfileData.fromMap(Map<String, dynamic> map) {
    return UserProfileData(
      name: map['name'] as String? ?? 'Aspirant Scholar',
      description: map['description'] as String? ?? 'Target: Top 100 AIR · JEE 2026',
      avatarId: map['avatarId'] as int? ?? 0,
      targetCollege: map['targetCollege'] as String? ?? 'IIT Bombay · Computer Science',
      targetExam: map['targetExam'] as String? ?? 'JEE Advanced',
      solvedCount: map['solvedCount'] as int? ?? 1248,
      accuracy: (map['accuracy'] as num?)?.toDouble() ?? 84.2,
      streakDays: map['streakDays'] as int? ?? 12,
      studyHours: (map['studyHours'] as num?)?.toDouble() ?? 142.5,
    );
  }

  String toJson() => json.encode(toMap());

  factory UserProfileData.fromJson(String source) =>
      UserProfileData.fromMap(json.decode(source) as Map<String, dynamic>);
}
