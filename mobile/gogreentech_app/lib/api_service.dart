import 'dart:io';

import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'models.dart';

class ApiService {
  ApiService()
      : _baseUrl = Platform.isAndroid
            ? const String.fromEnvironment(
                'API_URL',
                defaultValue: 'http://10.0.2.2:8010/api',
              )
            : const String.fromEnvironment(
                'API_URL',
                defaultValue: 'http://127.0.0.1:8010/api',
              ),
        _dio = Dio() {
    _dio.options.baseUrl = _baseUrl;
    _dio.interceptors.add(
      QueuedInterceptorsWrapper(
        onRequest: (options, handler) {
          if (_accessToken != null && _accessToken!.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $_accessToken';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          final request = error.requestOptions;
          final isAuthPath = request.path.contains('/auth/login') ||
              request.path.contains('/auth/register') ||
              request.path.contains('/auth/refresh');

          if (!isAuthPath &&
              error.response?.statusCode == 401 &&
              request.extra['retried'] != true &&
              _refreshToken != null) {
            final refreshed = await _refreshAccessToken();
            if (refreshed) {
              request.extra['retried'] = true;
              request.headers['Authorization'] = 'Bearer $_accessToken';
              final response = await _dio.fetch(request);
              return handler.resolve(response);
            }
          }

          handler.next(error);
        },
      ),
    );
  }

  final Dio _dio;
  final String _baseUrl;
  SharedPreferences? _prefs;
  String? _accessToken;
  String? _refreshToken;

  Future<void> initialize() async {
    _prefs ??= await SharedPreferences.getInstance();
    _accessToken = _prefs?.getString('access_token');
    _refreshToken = _prefs?.getString('refresh_token');
  }

  Future<void> _persistTokens(String access, String refresh) async {
    _accessToken = access;
    _refreshToken = refresh;
    await _prefs?.setString('access_token', access);
    await _prefs?.setString('refresh_token', refresh);
  }

  Future<void> _clearTokens() async {
    _accessToken = null;
    _refreshToken = null;
    await _prefs?.remove('access_token');
    await _prefs?.remove('refresh_token');
  }

  Future<bool> _refreshAccessToken() async {
    if (_refreshToken == null) {
      return false;
    }

    try {
      final refreshDio = Dio(BaseOptions(baseUrl: _baseUrl));
      final response = await refreshDio.post<Map<String, dynamic>>(
        '/auth/refresh/',
        data: {'refresh': _refreshToken},
      );
      final data = response.data ?? {};
      final access = data['access'] as String?;
      if (access == null) {
        return false;
      }
      final refresh = data['refresh'] as String? ?? _refreshToken!;
      await _persistTokens(access, refresh);
      return true;
    } catch (_) {
      await _clearTokens();
      return false;
    }
  }

  List<Map<String, dynamic>> _extractResults(dynamic data) {
    if (data is List) {
      return data.map((item) => Map<String, dynamic>.from(item as Map)).toList();
    }
    if (data is Map<String, dynamic> && data['results'] is List) {
      return (data['results'] as List)
          .map((item) => Map<String, dynamic>.from(item as Map))
          .toList();
    }
    return [];
  }

  Future<UserModel?> restoreUser() async {
    if (_accessToken == null) {
      return null;
    }

    try {
      return await fetchCurrentUser();
    } catch (_) {
      await _clearTokens();
      return null;
    }
  }

  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/auth/login/',
      data: {'email': email, 'password': password},
    );
    final data = response.data ?? {};
    await _persistTokens(
      data['access'] as String,
      data['refresh'] as String,
    );
    return UserModel.fromJson(Map<String, dynamic>.from(data['user'] as Map));
  }

  Future<UserModel> register({
    required String fullName,
    required String email,
    required String phoneNumber,
    required String password,
    required String confirmPassword,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/auth/register/',
      data: {
        'full_name': fullName,
        'email': email,
        'phone_number': phoneNumber,
        'password': password,
        'confirm_password': confirmPassword,
      },
    );
    final data = response.data ?? {};
    await _persistTokens(
      data['access'] as String,
      data['refresh'] as String,
    );
    return UserModel.fromJson(Map<String, dynamic>.from(data['user'] as Map));
  }

  Future<void> logout() async {
    if (_refreshToken != null) {
      try {
        await _dio.post('/auth/logout/', data: {'refresh': _refreshToken});
      } catch (_) {
        // Ignore remote logout failures and clear local state anyway.
      }
    }
    await _clearTokens();
  }

  Future<UserModel> fetchCurrentUser() async {
    final response = await _dio.get<Map<String, dynamic>>('/auth/me/');
    return UserModel.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<UserModel> updateProfile({
    required String fullName,
    required String phoneNumber,
    required String city,
    required String qualification,
    required String bio,
  }) async {
    final response = await _dio.patch<Map<String, dynamic>>(
      '/auth/me/',
      data: {
        'full_name': fullName,
        'phone_number': phoneNumber,
        'profile': {
          'city': city,
          'qualification': qualification,
          'bio': bio,
        },
      },
    );
    return UserModel.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<HomepageContent> fetchHomepageContent() async {
    final response = await _dio.get<Map<String, dynamic>>('/website/homepage/');
    return HomepageContent.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<List<CourseModel>> fetchFeaturedCourses() async {
    final response = await _dio.get('/courses/featured/');
    return _extractResults(response.data).map(CourseModel.fromJson).toList();
  }

  Future<List<CourseModel>> fetchCourses() async {
    final response = await _dio.get('/courses/');
    return _extractResults(response.data).map(CourseModel.fromJson).toList();
  }

  Future<CourseModel> fetchCourseDetail(String slug) async {
    final response = await _dio.get<Map<String, dynamic>>('/courses/$slug/');
    return CourseModel.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<List<QuizSummary>> fetchCourseQuizzes(int courseId) async {
    final response = await _dio.get('/quizzes/', queryParameters: {'course': courseId});
    return _extractResults(response.data).map(QuizSummary.fromJson).toList();
  }

  Future<QuizDetail> fetchQuizDetail(String slug) async {
    final response = await _dio.get<Map<String, dynamic>>('/quizzes/$slug/');
    return QuizDetail.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<QuizAttemptModel> submitQuiz({
    required String slug,
    required Map<String, int> answers,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/quizzes/$slug/submit/',
      data: {'answers': answers},
    );
    return QuizAttemptModel.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<void> markLessonComplete(int lessonId) async {
    await _dio.post(
      '/courses/progress/',
      data: {
        'lesson': lessonId,
        'is_completed': true,
        'last_position_seconds': 0,
      },
    );
  }

  Future<StudentDashboardData> fetchStudentDashboard() async {
    final response = await _dio.get<Map<String, dynamic>>('/dashboard/student/');
    return StudentDashboardData.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<AdminDashboardData> fetchAdminDashboard() async {
    final response = await _dio.get<Map<String, dynamic>>('/dashboard/admin/stats/');
    return AdminDashboardData.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }

  Future<ApplicationResult> applyForCourse({
    required int courseId,
    required String name,
    required String email,
    required String phone,
    required String message,
    required bool preferredContactWhatsapp,
    required bool agreedViaWhatsapp,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/courses/applications/',
      data: {
        'course': courseId,
        'name': name,
        'email': email,
        'phone': phone,
        'message': message,
        'preferred_contact_whatsapp': preferredContactWhatsapp,
        'agreed_via_whatsapp': agreedViaWhatsapp,
      },
    );
    return ApplicationResult.fromJson(Map<String, dynamic>.from(response.data ?? {}));
  }
}
