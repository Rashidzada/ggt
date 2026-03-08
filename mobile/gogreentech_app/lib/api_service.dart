import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app_config.dart';
import 'models.dart';

class ApiService {
  ApiService()
      : _baseUrl = AppConfig.apiBaseUrl,
        _dio = Dio(
          BaseOptions(
            baseUrl: AppConfig.apiBaseUrl,
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 20),
            sendTimeout: const Duration(seconds: 20),
            contentType: Headers.jsonContentType,
            responseType: ResponseType.json,
          ),
        ) {
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
      if (access == null || access.isEmpty) {
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
    return const [];
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
        // Remote logout failure should not block local logout.
      }
    }
    await _clearTokens();
  }

  Future<UserModel> fetchCurrentUser() async {
    final response = await _dio.get<Map<String, dynamic>>('/auth/me/');
    return UserModel.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
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
    return UserModel.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }

  Future<HomepageContent> fetchHomepageContent() async {
    final response = await _dio.get<Map<String, dynamic>>('/website/homepage/');
    return HomepageContent.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }

  Future<List<TestimonialModel>> fetchTestimonials() async {
    final response = await _dio.get('/website/testimonials/');
    return _extractResults(response.data).map(TestimonialModel.fromJson).toList();
  }

  Future<FreeLearningVideoModel?> fetchFeaturedFreeVideo() async {
    final response = await _dio.get('/website/free-videos/featured/');
    final data = response.data;
    if (data is Map<String, dynamic>) {
      return FreeLearningVideoModel.fromJson(data);
    }
    if (data is Map) {
      return FreeLearningVideoModel.fromJson(Map<String, dynamic>.from(data));
    }
    return null;
  }

  Future<List<FreeLearningVideoModel>> fetchFreeLearningVideos() async {
    final response = await _dio.get('/website/free-videos/');
    return _extractResults(response.data).map(FreeLearningVideoModel.fromJson).toList();
  }

  Future<List<CourseCategoryModel>> fetchCategories() async {
    final response = await _dio.get('/courses/categories/');
    return _extractResults(response.data).map(CourseCategoryModel.fromJson).toList();
  }

  Future<List<CourseModel>> fetchFeaturedCourses() async {
    final response = await _dio.get('/courses/featured/');
    return _extractResults(response.data).map(CourseModel.fromJson).toList();
  }

  Future<List<CourseModel>> fetchCourses({String? categorySlug}) async {
    final response = await _dio.get(
      '/courses/',
      queryParameters: categorySlug == null || categorySlug.isEmpty
          ? null
          : {'category__slug': categorySlug},
    );
    return _extractResults(response.data).map(CourseModel.fromJson).toList();
  }

  Future<CourseModel> fetchCourseDetail(String slug) async {
    final response = await _dio.get<Map<String, dynamic>>('/courses/$slug/');
    return CourseModel.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }

  Future<List<QuizSummary>> fetchCourseQuizzes(int courseId) async {
    final response = await _dio.get('/quizzes/', queryParameters: {'course': courseId});
    return _extractResults(response.data).map(QuizSummary.fromJson).toList();
  }

  Future<QuizDetail> fetchQuizDetail(String slug) async {
    final response = await _dio.get<Map<String, dynamic>>('/quizzes/$slug/');
    return QuizDetail.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }

  Future<List<QuizAttemptModel>> fetchQuizAttempts() async {
    final response = await _dio.get('/quizzes/attempts/');
    return _extractResults(response.data).map(QuizAttemptModel.fromJson).toList();
  }

  Future<QuizAttemptModel> submitQuiz({
    required String slug,
    required Map<String, int> answers,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/quizzes/$slug/submit/',
      data: {'answers': answers},
    );
    return QuizAttemptModel.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
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
    return StudentDashboardData.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }

  Future<AdminDashboardData> fetchAdminDashboard() async {
    final response = await _dio.get<Map<String, dynamic>>('/dashboard/admin/stats/');
    return AdminDashboardData.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
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
    return ApplicationResult.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }

  Future<List<EnrollmentApplicationModel>> fetchApplications() async {
    final response = await _dio.get('/courses/applications/');
    return _extractResults(response.data).map(EnrollmentApplicationModel.fromJson).toList();
  }

  Future<List<EnrollmentModel>> fetchEnrollments() async {
    final response = await _dio.get('/courses/enrollments/');
    return _extractResults(response.data).map(EnrollmentModel.fromJson).toList();
  }

  Future<List<PaymentRecordModel>> fetchPayments() async {
    final response = await _dio.get('/courses/payments/');
    return _extractResults(response.data).map(PaymentRecordModel.fromJson).toList();
  }

  Future<List<NotificationModel>> fetchNotifications() async {
    final response = await _dio.get('/notifications/');
    return _extractResults(response.data).map(NotificationModel.fromJson).toList();
  }

  Future<NotificationModel> markNotificationRead(int notificationId) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/notifications/$notificationId/mark_read/',
    );
    return NotificationModel.fromJson(Map<String, dynamic>.from(response.data ?? const {}));
  }
}
