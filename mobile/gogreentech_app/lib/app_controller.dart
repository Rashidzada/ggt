import 'package:flutter/foundation.dart';

import 'api_service.dart';
import 'models.dart';

class AppController extends ChangeNotifier {
  AppController(this.apiService);

  final ApiService apiService;

  bool isInitializing = true;
  bool isBusy = false;
  UserModel? user;
  HomepageContent? homepageContent;
  List<CourseModel> featuredCourses = const [];
  List<CourseModel> courses = const [];
  StudentDashboardData? studentDashboard;
  AdminDashboardData? adminDashboard;

  Future<void> initialize() async {
    await apiService.initialize();
    user = await apiService.restoreUser();

    if (user != null) {
      await loadHome();
      await loadCourses();
      await loadDashboard();
    }

    isInitializing = false;
    notifyListeners();
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    isBusy = true;
    notifyListeners();
    try {
      user = await apiService.login(email: email, password: password);
      await loadHome();
      await loadCourses();
      await loadDashboard();
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
      await loadHome();
      await loadCourses();
      await loadDashboard();
    } finally {
      isBusy = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await apiService.logout();
    user = null;
    studentDashboard = null;
    adminDashboard = null;
    notifyListeners();
  }

  Future<void> loadHome() async {
    homepageContent = await apiService.fetchHomepageContent();
    featuredCourses = await apiService.fetchFeaturedCourses();
    notifyListeners();
  }

  Future<void> loadCourses() async {
    courses = await apiService.fetchCourses();
    notifyListeners();
  }

  Future<void> loadDashboard() async {
    if (user == null) {
      return;
    }
    if (user!.isAdmin) {
      adminDashboard = await apiService.fetchAdminDashboard();
      studentDashboard = null;
    } else {
      studentDashboard = await apiService.fetchStudentDashboard();
      adminDashboard = null;
    }
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
    await loadDashboard();
    return attempt;
  }

  Future<void> markLessonComplete(int lessonId) async {
    await apiService.markLessonComplete(lessonId);
    await loadDashboard();
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
    await loadDashboard();
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
    await loadDashboard();
    notifyListeners();
  }
}
