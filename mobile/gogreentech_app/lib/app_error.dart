import 'package:dio/dio.dart';

String describeAppError(
  Object error, {
  String fallback = 'Something went wrong. Please try again.',
}) {
  if (error is DioException) {
    final responseData = error.response?.data;
    final responseMessage = _extractResponseMessage(responseData);
    if (responseMessage != null && responseMessage.isNotEmpty) {
      return responseMessage;
    }

    switch (error.type) {
      case DioExceptionType.connectionError:
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return 'Unable to reach GoGreenTech right now. Check your internet connection and try again.';
      default:
        break;
    }

    if (error.message != null && error.message!.trim().isNotEmpty) {
      return error.message!.trim();
    }
  }

  return fallback;
}

String? _extractResponseMessage(dynamic data) {
  if (data == null) {
    return null;
  }

  if (data is String) {
    final message = data.trim();
    return message.isEmpty ? null : message;
  }

  if (data is List) {
    final parts = data
        .map(_extractResponseMessage)
        .whereType<String>()
        .where((message) => message.trim().isNotEmpty)
        .toList();
    return parts.isEmpty ? null : parts.join('\n');
  }

  if (data is Map) {
    if (data['detail'] is String && (data['detail'] as String).trim().isNotEmpty) {
      return (data['detail'] as String).trim();
    }

    final parts = <String>[];
    for (final entry in data.entries) {
      final message = _extractResponseMessage(entry.value);
      if (message == null || message.trim().isEmpty) {
        continue;
      }

      final key = entry.key.toString().replaceAll('_', ' ');
      if (key == 'non field errors') {
        parts.add(message);
      } else {
        parts.add('$key: $message');
      }
    }

    return parts.isEmpty ? null : parts.join('\n');
  }

  return data.toString();
}
