class ProfileModel {
  const ProfileModel({
    this.profilePhoto,
    this.city = '',
    this.qualification = '',
    this.bio = '',
  });

  final String? profilePhoto;
  final String city;
  final String qualification;
  final String bio;

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      profilePhoto: json['profile_photo'] as String?,
      city: (json['city'] ?? '') as String,
      qualification: (json['qualification'] ?? '') as String,
      bio: (json['bio'] ?? '') as String,
    );
  }
}

class UserModel {
  const UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.phoneNumber,
    required this.role,
    required this.isEmailVerified,
    required this.profile,
  });

  final int id;
  final String email;
  final String fullName;
  final String phoneNumber;
  final String role;
  final bool isEmailVerified;
  final ProfileModel profile;

  bool get isAdmin => role == 'admin';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int,
      email: (json['email'] ?? '') as String,
      fullName: (json['full_name'] ?? '') as String,
      phoneNumber: (json['phone_number'] ?? '') as String,
      role: (json['role'] ?? 'student') as String,
      isEmailVerified: (json['is_email_verified'] ?? false) as bool,
      profile: ProfileModel.fromJson(Map<String, dynamic>.from(json['profile'] ?? {})),
    );
  }
}

class HomepageContent {
  const HomepageContent({
    required this.siteName,
    required this.tagline,
    required this.heroTitle,
    required this.heroSubtitle,
    required this.introText,
    required this.introVideoUrls,
    required this.whyChooseUs,
    required this.learningModes,
    required this.ownerName,
    required this.ownerRole,
    required this.ownerEmail,
    required this.ownerWhatsapp,
    required this.ownerQualification,
  });

  final String siteName;
  final String tagline;
  final String heroTitle;
  final String heroSubtitle;
  final String introText;
  final List<String> introVideoUrls;
  final List<String> whyChooseUs;
  final List<String> learningModes;
  final String ownerName;
  final String ownerRole;
  final String ownerEmail;
  final String ownerWhatsapp;
  final String ownerQualification;

  factory HomepageContent.fromJson(Map<String, dynamic> json) {
    List<String> readList(String key) {
      final value = json[key];
      if (value is List) {
        return value.map((item) => item.toString()).toList();
      }
      return [];
    }

    return HomepageContent(
      siteName: (json['site_name'] ?? 'GoGreenTech Learning Academy') as String,
      tagline: (json['tagline'] ?? '') as String,
      heroTitle: (json['hero_title'] ?? '') as String,
      heroSubtitle: (json['hero_subtitle'] ?? '') as String,
      introText: (json['intro_text'] ?? '') as String,
      introVideoUrls: readList('intro_video_urls'),
      whyChooseUs: readList('why_choose_us'),
      learningModes: readList('learning_modes'),
      ownerName: (json['owner_name'] ?? '') as String,
      ownerRole: (json['owner_role'] ?? '') as String,
      ownerEmail: (json['owner_email'] ?? '') as String,
      ownerWhatsapp: (json['owner_whatsapp'] ?? '03470983567') as String,
      ownerQualification: (json['owner_qualification'] ?? '') as String,
    );
  }
}

class CourseCategoryModel {
  const CourseCategoryModel({
    required this.id,
    required this.title,
    required this.slug,
  });

  final int id;
  final String title;
  final String slug;

  factory CourseCategoryModel.fromJson(Map<String, dynamic> json) {
    return CourseCategoryModel(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      slug: (json['slug'] ?? '') as String,
    );
  }
}

class LessonModel {
  const LessonModel({
    required this.id,
    required this.title,
    required this.description,
    required this.videoUrl,
    required this.durationMinutes,
    required this.order,
    required this.isFreePreview,
  });

  final int id;
  final String title;
  final String description;
  final String videoUrl;
  final int durationMinutes;
  final int order;
  final bool isFreePreview;

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    return LessonModel(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      description: (json['description'] ?? '') as String,
      videoUrl: (json['video_url'] ?? '') as String,
      durationMinutes: (json['duration_minutes'] ?? 0) as int,
      order: (json['order'] ?? 0) as int,
      isFreePreview: (json['is_free_preview'] ?? false) as bool,
    );
  }
}

class ResourceModel {
  const ResourceModel({
    required this.id,
    required this.title,
    required this.description,
    required this.resourceType,
    required this.driveLink,
    required this.visibility,
  });

  final int id;
  final String title;
  final String description;
  final String resourceType;
  final String driveLink;
  final String visibility;

  factory ResourceModel.fromJson(Map<String, dynamic> json) {
    return ResourceModel(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      description: (json['description'] ?? '') as String,
      resourceType: (json['resource_type'] ?? '') as String,
      driveLink: (json['drive_link'] ?? '') as String,
      visibility: (json['visibility'] ?? '') as String,
    );
  }
}

class CourseModel {
  const CourseModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.category,
    required this.shortDescription,
    required this.level,
    required this.duration,
    required this.instructorName,
    required this.courseType,
    required this.pricingModel,
    required this.priceDisplay,
    required this.featured,
    required this.introVideoUrl,
    required this.lessonsCount,
    required this.quizCount,
    this.fullDescription,
    this.lessons = const [],
    this.resources = const [],
    this.isEnrolled,
    this.progressPercent,
    this.whatsappApplyUrl,
  });

  final int id;
  final String title;
  final String slug;
  final CourseCategoryModel category;
  final String shortDescription;
  final String level;
  final String duration;
  final String instructorName;
  final String courseType;
  final String pricingModel;
  final String priceDisplay;
  final bool featured;
  final String introVideoUrl;
  final int lessonsCount;
  final int quizCount;
  final String? fullDescription;
  final List<LessonModel> lessons;
  final List<ResourceModel> resources;
  final bool? isEnrolled;
  final int? progressPercent;
  final String? whatsappApplyUrl;

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    List<LessonModel> lessons = [];
    if (json['lessons'] is List) {
      lessons = (json['lessons'] as List)
          .map((item) => LessonModel.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList();
    }

    List<ResourceModel> resources = [];
    if (json['resources'] is List) {
      resources = (json['resources'] as List)
          .map((item) => ResourceModel.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList();
    }

    return CourseModel(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      slug: (json['slug'] ?? '') as String,
      category: CourseCategoryModel.fromJson(Map<String, dynamic>.from(json['category'] ?? {})),
      shortDescription: (json['short_description'] ?? '') as String,
      level: (json['level'] ?? '') as String,
      duration: (json['duration'] ?? '') as String,
      instructorName: (json['instructor_name'] ?? '') as String,
      courseType: (json['course_type'] ?? '') as String,
      pricingModel: (json['pricing_model'] ?? '') as String,
      priceDisplay: (json['price_display'] ?? '') as String,
      featured: (json['featured'] ?? false) as bool,
      introVideoUrl: (json['intro_video_url'] ?? '') as String,
      lessonsCount: (json['lessons_count'] ?? 0) as int,
      quizCount: (json['quiz_count'] ?? 0) as int,
      fullDescription: json['full_description'] as String?,
      lessons: lessons,
      resources: resources,
      isEnrolled: json['is_enrolled'] as bool?,
      progressPercent: json['progress_percent'] as int?,
      whatsappApplyUrl: json['whatsapp_apply_url'] as String?,
    );
  }
}

class QuizSummary {
  const QuizSummary({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.passingScore,
    required this.questionCount,
  });

  final int id;
  final String title;
  final String slug;
  final String description;
  final int passingScore;
  final int questionCount;

  factory QuizSummary.fromJson(Map<String, dynamic> json) {
    return QuizSummary(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      slug: (json['slug'] ?? '') as String,
      description: (json['description'] ?? '') as String,
      passingScore: (json['passing_score'] ?? 0) as int,
      questionCount: (json['question_count'] ?? 0) as int,
    );
  }
}

class QuizOption {
  const QuizOption({
    required this.id,
    required this.text,
  });

  final int id;
  final String text;

  factory QuizOption.fromJson(Map<String, dynamic> json) {
    return QuizOption(
      id: json['id'] as int,
      text: (json['text'] ?? '') as String,
    );
  }
}

class QuizQuestion {
  const QuizQuestion({
    required this.id,
    required this.prompt,
    required this.options,
  });

  final int id;
  final String prompt;
  final List<QuizOption> options;

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    final optionsJson = (json['options'] as List? ?? []);
    return QuizQuestion(
      id: json['id'] as int,
      prompt: (json['prompt'] ?? '') as String,
      options: optionsJson
          .map((item) => QuizOption.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList(),
    );
  }
}

class QuizDetail {
  const QuizDetail({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.passingScore,
    required this.questions,
  });

  final int id;
  final String title;
  final String slug;
  final String description;
  final int passingScore;
  final List<QuizQuestion> questions;

  factory QuizDetail.fromJson(Map<String, dynamic> json) {
    final questionsJson = (json['questions'] as List? ?? []);
    return QuizDetail(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      slug: (json['slug'] ?? '') as String,
      description: (json['description'] ?? '') as String,
      passingScore: (json['passing_score'] ?? 0) as int,
      questions: questionsJson
          .map((item) => QuizQuestion.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList(),
    );
  }
}

class EnrollmentModel {
  const EnrollmentModel({
    required this.id,
    required this.course,
    required this.status,
    required this.progressPercent,
  });

  final int id;
  final CourseModel course;
  final String status;
  final int progressPercent;

  factory EnrollmentModel.fromJson(Map<String, dynamic> json) {
    return EnrollmentModel(
      id: json['id'] as int,
      course: CourseModel.fromJson(Map<String, dynamic>.from(json['course'] ?? {})),
      status: (json['status'] ?? '') as String,
      progressPercent: (json['progress_percent'] ?? 0) as int,
    );
  }
}

class PaymentRecordModel {
  const PaymentRecordModel({
    required this.id,
    required this.courseTitle,
    required this.amountDue,
    required this.amountPaid,
    required this.status,
    required this.invoiceUrl,
  });

  final int id;
  final String courseTitle;
  final String amountDue;
  final String amountPaid;
  final String status;
  final String invoiceUrl;

  factory PaymentRecordModel.fromJson(Map<String, dynamic> json) {
    return PaymentRecordModel(
      id: json['id'] as int,
      courseTitle: (json['course_title'] ?? '') as String,
      amountDue: (json['amount_due'] ?? '') as String,
      amountPaid: (json['amount_paid'] ?? '') as String,
      status: (json['status'] ?? '') as String,
      invoiceUrl: (json['invoice_url'] ?? '') as String,
    );
  }
}

class QuizAttemptModel {
  const QuizAttemptModel({
    required this.id,
    required this.quizTitle,
    required this.score,
    required this.correctAnswers,
    required this.totalQuestions,
    required this.passed,
  });

  final int id;
  final String quizTitle;
  final int score;
  final int correctAnswers;
  final int totalQuestions;
  final bool passed;

  factory QuizAttemptModel.fromJson(Map<String, dynamic> json) {
    return QuizAttemptModel(
      id: json['id'] as int,
      quizTitle: (json['quiz_title'] ?? '') as String,
      score: (json['score'] ?? 0) as int,
      correctAnswers: (json['correct_answers'] ?? 0) as int,
      totalQuestions: (json['total_questions'] ?? 0) as int,
      passed: (json['passed'] ?? false) as bool,
    );
  }
}

class NotificationModel {
  const NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.isRead,
  });

  final int id;
  final String title;
  final String message;
  final bool isRead;

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as int,
      title: (json['title'] ?? '') as String,
      message: (json['message'] ?? '') as String,
      isRead: (json['is_read'] ?? false) as bool,
    );
  }
}

class StudentDashboardData {
  const StudentDashboardData({
    required this.enrollments,
    required this.quizAttempts,
    required this.notifications,
    required this.payments,
    required this.unreadNotifications,
  });

  final List<EnrollmentModel> enrollments;
  final List<QuizAttemptModel> quizAttempts;
  final List<NotificationModel> notifications;
  final List<PaymentRecordModel> payments;
  final int unreadNotifications;

  factory StudentDashboardData.fromJson(Map<String, dynamic> json) {
    List<T> parseList<T>(String key, T Function(Map<String, dynamic>) parser) {
      final value = json[key];
      if (value is! List) {
        return [];
      }
      return value
          .map((item) => parser(Map<String, dynamic>.from(item as Map)))
          .toList();
    }

    return StudentDashboardData(
      enrollments: parseList('enrollments', EnrollmentModel.fromJson),
      quizAttempts: parseList('quiz_attempts', QuizAttemptModel.fromJson),
      notifications: parseList('notifications', NotificationModel.fromJson),
      payments: parseList('payments', PaymentRecordModel.fromJson),
      unreadNotifications: (json['unread_notifications'] ?? 0) as int,
    );
  }
}

class RecentApplicationModel {
  const RecentApplicationModel({
    required this.id,
    required this.name,
    required this.course,
    required this.status,
  });

  final int id;
  final String name;
  final String course;
  final String status;

  factory RecentApplicationModel.fromJson(Map<String, dynamic> json) {
    return RecentApplicationModel(
      id: json['id'] as int,
      name: (json['name'] ?? '') as String,
      course: (json['course'] ?? '') as String,
      status: (json['status'] ?? '') as String,
    );
  }
}

class CourseStatisticModel {
  const CourseStatisticModel({
    required this.title,
    required this.courseType,
    required this.enrollmentCount,
  });

  final String title;
  final String courseType;
  final int enrollmentCount;

  factory CourseStatisticModel.fromJson(Map<String, dynamic> json) {
    return CourseStatisticModel(
      title: (json['title'] ?? '') as String,
      courseType: (json['course_type'] ?? '') as String,
      enrollmentCount: (json['enrollment_count'] ?? 0) as int,
    );
  }
}

class AdminDashboardData {
  const AdminDashboardData({
    required this.totalStudents,
    required this.totalEnrollments,
    required this.totalActiveCourses,
    required this.totalApplications,
    required this.recentApplications,
    required this.courseStatistics,
  });

  final int totalStudents;
  final int totalEnrollments;
  final int totalActiveCourses;
  final int totalApplications;
  final List<RecentApplicationModel> recentApplications;
  final List<CourseStatisticModel> courseStatistics;

  factory AdminDashboardData.fromJson(Map<String, dynamic> json) {
    List<T> parseList<T>(String key, T Function(Map<String, dynamic>) parser) {
      final value = json[key];
      if (value is! List) {
        return [];
      }
      return value
          .map((item) => parser(Map<String, dynamic>.from(item as Map)))
          .toList();
    }

    return AdminDashboardData(
      totalStudents: (json['total_students'] ?? 0) as int,
      totalEnrollments: (json['total_enrollments'] ?? 0) as int,
      totalActiveCourses: (json['total_active_courses'] ?? 0) as int,
      totalApplications: (json['total_applications'] ?? 0) as int,
      recentApplications: parseList('recent_applications', RecentApplicationModel.fromJson),
      courseStatistics: parseList('course_statistics', CourseStatisticModel.fromJson),
    );
  }
}

class ApplicationResult {
  const ApplicationResult({
    required this.courseTitle,
    required this.whatsappUrl,
  });

  final String courseTitle;
  final String whatsappUrl;

  factory ApplicationResult.fromJson(Map<String, dynamic> json) {
    return ApplicationResult(
      courseTitle: (json['course_title'] ?? '') as String,
      whatsappUrl: (json['whatsapp_url'] ?? '') as String,
    );
  }
}
