import 'dart:convert';
import 'package:flutter/services.dart';

class QuoteEntity {
  final int day;
  final String quote;
  final String author;

  const QuoteEntity({
    required this.day,
    required this.quote,
    required this.author,
  });

  factory QuoteEntity.fromJson(Map<String, dynamic> json) {
    return QuoteEntity(
      day: json['day'] as int? ?? 1,
      quote: json['quote'] as String? ?? 'Keep practicing, success is near.',
      author: json['author'] as String? ?? 'SCORE',
    );
  }
}

class DailyQuoteService {
  static List<QuoteEntity>? _quotesCache;

  static Future<QuoteEntity> getTodayQuote() async {
    if (_quotesCache == null) {
      try {
        final jsonString = await rootBundle.loadString('assets/quotes.json');
        final List<dynamic> list = jsonDecode(jsonString);
        _quotesCache = list.map((item) => QuoteEntity.fromJson(item as Map<String, dynamic>)).toList();
      } catch (e) {
        return const QuoteEntity(
          day: 1,
          quote: 'Success is the sum of small efforts, repeated day in and day out.',
          author: 'Robert Collier',
        );
      }
    }

    if (_quotesCache == null || _quotesCache!.isEmpty) {
      return const QuoteEntity(
        day: 1,
        quote: 'Believe you can and you are halfway there.',
        author: 'Theodore Roosevelt',
      );
    }

    final now = DateTime.now();
    final dayOfYear = now.difference(DateTime(now.year, 1, 1)).inDays + 1;
    final index = (dayOfYear - 1) % _quotesCache!.length;
    return _quotesCache![index];
  }
}
