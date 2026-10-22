# Flutter Wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Sqflite
-keep class com.tekartik.sqflite.** { *; }

# SharedPreferences
-keep class io.flutter.plugins.sharedpreferences.** { *; }

# Path Provider
-keep class io.flutter.plugins.pathprovider.** { *; }

# General Android Architecture & Native
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-dontwarn io.flutter.embedding.**

-keepclasseswithmembernames class * {
    native <methods>;
}
