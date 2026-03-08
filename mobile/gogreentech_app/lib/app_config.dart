import 'dart:io';

import 'package:flutter/foundation.dart';

class AppConfig {
  static const String productionApiUrl = 'https://ggt.pythonanywhere.com/api';

  static String get apiBaseUrl {
    const override = String.fromEnvironment('API_URL', defaultValue: '');
    if (override.isNotEmpty) {
      return override;
    }

    if (kReleaseMode) {
      return productionApiUrl;
    }

    if (Platform.isAndroid) {
      return 'http://10.0.2.2:8010/api';
    }

    return 'http://127.0.0.1:8010/api';
  }
}
