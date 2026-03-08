import 'package:flutter/foundation.dart';

import 'api_service.dart';
import 'models.dart';

class AppController extends ChangeNotifier {
  AppController(this.apiService);

  final ApiService apiService;

  bool isInitializing = true;
  bool isBusy = false;
  String? startupError;

  UserModel? user;
  HomepageContent? homepageContent;
  FreeLearningVideoModel? featuredFreeVideo;
  List<TestimonialModel> testimonials = const [];
  List<CourseCategoryModel> categories = const [];
  List<CourseModel> featuredCourses = const [];
  List<CourseModel> courses = const [];
  List<FreeLearningVideoModel> freeVideos = const [];
  List<EnrollmentApplicationModel> applications = const [];
  List<EnrollmentModel> enrollments = const [];
  List<PaymentRecordModel> payments = const [];
  List<QuizAttemptModel> quizAttempts = const [];
  List<NotificationModel> notifications = const [];
  StudentDashboardData? studentDashboard;
  AdminDashboardData? adminDashboard;

  int get unreadNotificationsCount {
    if (notifications.isNotEmpty) {
      return notifications.where((item) => !item.isRead).length;
    }
    return studentDashboard?.unreadNotifications ?? 0;
  }

  Future<void> initialize() async {
    startupError = null;

    try {
      await apiService.initialize();
      await loadPublicData(notify: false);
      user = await apiService.restoreUser();

      if (user != null) {
        await loadAuthenticatedData(notify: false);
      }
    } catch (error) {
      startupError = error.toString();
    } finally {
      isInitializing = false;
      notifyListeners();
    }
  }

  Future<void> loadPublicData({bool notify = true}) async {
    final results = await Future.wait<dynamic>([
      apiService.fetchHomepageContent(),
      apiService.fetchCategories(),
      apiService.fetchTestimonials(),
      apiService.fetchFeaturedCourses(),
      apiService.fetchCourses(),
      apiService.fetchFeaturedFreeVideo(),
    ]);

    homepageContent = results[0] as HomepageContent;
    categories = results[1] as List<CourseCategoryModel>;
    testimonials = results[2] as List<TestimonialModel>;
    featuredCourses = results[3] as List<CourseModel>;
    courses = results[4] as List<CourseModel>;
    featuredFreeVideo = results[5] as FreeLearningVideoModel?;

    if (notify) {
      notifyListeners();
    }
  }

  Future<void> loadAuthenticatedData({bool notify = true}) async {
    if (user == null) {
      return;
    }

    if (user!.isAdmin) {
      adminDashboard = await apiService.fetchAdminDashboard();
      freeVideos = await apiService.fetchFreeLearningVideos();
      notifications = await apiService.fetchNotifications();
      applications = await apiService.fetchApplications();
      enrollments = await apiService.fetchEnrollments();
      payments = await apiService.fetchPayments();
      quizAttempts = await apiService.fetchQuizAttempts();
      studentDashboard = null;
    } else {
      final results = await Future.wait<dynamic>([
        apiService.fetchStudentDashboard(),
        apiService.fetchFreeLearningVideos(),
        apiService.fetchNotifications(),
        apiService.fetchApplications(),
        apiService.fetchEnrollments(),
        apiService.fetchPayments(),
        apiService.fetchQuizAttempts(),
      ]);

      studentDashboard = results[0] as StudentDashboardData;
      freeVideos = results[1] as List<FreeLearningVideoModel>;
      notifications = results[2] as List<NotificationModel>;
      applications = results[3] as List<EnrollmentApplicationModel>;
      enrollments = results[4] as List<EnrollmentModel>;
      payments = results[5] as List<PaymentRecordModel>;
      quizAttempts = results[6] as List<QuizAttemptModel>;
      adminDashboard = null;
    }

    if (notify) {
      notifyListeners();
    }
  }

  Future<void> refreshAll() async {
    await loadPublicData();
    if (user != null) {
      await loadAuthenticatedData();
    }
  }

  Future<void> loadHome() async {
    await loadPublicData();
  }

  Future<void> loadDashboard() async {
    if (user != null) {
      await loadAuthenticatedData();
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    isBusy = true;
    notifyListeners();
    try {
      user = await apiService.login(email: email, password: password);
      await loadAuthenticatedData(notify: false);
    } finally {
      isBusy = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String fullName,
    required String email,
    required String phoneNumber,
    required String password,
    required String confirmPassword,
  }) async {
    isBusy = true;
    notifyListeners();
    try {
      user = await apiService.register(
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        confirmPassword: confirmPassword,
      );
      await loadAuthenticatedData(notify: false);
    } finally {
      isBusy = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await apiService.logout();
    user = null;
    freeVideos = const [];
    applications = const [];
    enrollments = const [];
    payments = const [];
    quizAttempts = const [];
    notifications = const [];
    studentDashboard = null;
    adminDashboard = null;
    notifyListeners();
  }

  Future<void> refreshNotifications() async {
    if (user == null) {
      return;
    }
    notifications = await apiService.fetchNotifications();
    notifyListeners();
  }

  Future<void> markNotificationRead(NotificationModel notification) async {
    if (user == null || notification.isRead || notification.userId == 0) {
      return;
    }

    final updated = await apiService.markNotificationRead(notification.id);
    notifications = notifications
        .map((item) => item.id == notification.id ? updated : item)
        .toList();
    notifyListeners();
  }

  Future<void> loadCourses({String? categorySlug}) async {
    courses = await apiService.fetchCourses(categorySlug: categorySlug);
    notifyListeners();
  }

  Future<CourseModel> fetchCourseDetail(String slug) async {
    return apiService.fetchCourseDetail(slug);
  }

  Future<List<QuizSummary>> fetchCourseQuizzes(int courseId) async {
    return apiService.fetchCourseQuizzes(courseId);
  }

  Future<QuizDetail> fetchQuizDetail(String slug) async {
    return apiService.fetchQuizDetail(slug);
  }

  Future<QuizAttemptModel> submitQuiz({
    required String slug,
    required Map<String, int> answers,
  }) async {
    final attempt = await apiService.submitQuiz(slug: slug, answers: answers);
    if (user != null) {
      quizAttempts = await apiService.fetchQuizAttempts();
      if (!user!.isAdmin) {
        studentDashboard = await apiService.fetchStudentDashboard();
      }
      notifyListeners();
    }
    return attempt;
  }

  Future<void> markLessonComplete(int lessonId) async {
    await apiService.markLessonComplete(lessonId);
    if (user != null) {
      enrollments = await apiService.fetchEnrollments();
      if (!user!.isAdmin) {
        studentDashboard = await apiService.fetchStudentDashboard();
      }
      notifyListeners();
    }
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
    final result = await apiService.applyForCourse(
      courseId: courseId,
      name: name,
      email: email,
      phone: phone,
      message: message,
      preferredContactWhatsapp: preferredContactWhatsapp,
      agreedViaWhatsapp: agreedViaWhatsapp,
    );

    if (user != null) {
      applications = await apiService.fetchApplications();
      notifyListeners();
    }

    return result;
  }

  Future<void> updateProfile({
    required String fullName,
    required String phoneNumber,
    required String city,
    required String qualification,
    required String bio,
  }) async {
    user = await apiService.updateProfile(
      fullName: fullName,
      phoneNumber: phoneNumber,
      city: city,
      qualification: qualification,
      bio: bio,
    );
    if (user != null && !user!.isAdmin) {
      studentDashboard = await apiService.fetchStudentDashboard();
    }
    notifyListeners();
  }
}
