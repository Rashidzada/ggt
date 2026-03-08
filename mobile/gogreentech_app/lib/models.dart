int _asInt(dynamic value) {
  if (value is int) {
    return value;
  }
  if (value is num) {
    return value.toInt();
  }
  return int.tryParse(value?.toString() ?? '') ?? 0;
}

String _asString(dynamic value, [String fallback = '']) {
  return value?.toString() ?? fallback;
}

bool _asBool(dynamic value) {
  if (value is bool) {
    return value;
  }
  if (value is num) {
    return value != 0;
  }
  final normalized = value?.toString().toLowerCase();
  return normalized == 'true' || normalized == '1';
}

DateTime? _asDateTime(dynamic value) {
  if (value is! String || value.isEmpty) {
    return null;
  }
  return DateTime.tryParse(value);
}

List<String> _asStringList(dynamic value) {
  if (value is! List) {
    return const [];
  }
  return value.map((item) => item.toString()).toList();
}

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
      city: _asString(json['city']),
      qualification: _asString(json['qualification']),
      bio: _asString(json['bio']),
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
    required this.createdAt,
    required this.profile,
  });

  final int id;
  final String email;
  final String fullName;
  final String phoneNumber;
  final String role;
  final bool isEmailVerified;
  final DateTime? createdAt;
  final ProfileModel profile;

  bool get isAdmin => role == 'admin';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: _asInt(json['id']),
      email: _asString(json['email']),
      fullName: _asString(json['full_name']),
      phoneNumber: _asString(json['phone_number']),
      role: _asString(json['role'], 'student'),
      isEmailVerified: _asBool(json['is_email_verified']),
      createdAt: _asDateTime(json['created_at']),
      profile: ProfileModel.fromJson(Map<String, dynamic>.from(json['profile'] ?? const {})),
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
    required this.aboutTitle,
    required this.aboutDescription,
    required this.introVideoUrls,
    required this.whyChooseUs,
    required this.learningModes,
    required this.ownerName,
    required this.ownerRole,
    required this.ownerEmail,
    required this.ownerWhatsapp,
    required this.ownerQualification,
    required this.ownerPhotoDisplayUrl,
    required this.ownerProfileUrl,
    required this.footerNote,
  });

  final String siteName;
  final String tagline;
  final String heroTitle;
  final String heroSubtitle;
  final String introText;
  final String aboutTitle;
  final String aboutDescription;
  final List<String> introVideoUrls;
  final List<String> whyChooseUs;
  final List<String> learningModes;
  final String ownerName;
  final String ownerRole;
  final String ownerEmail;
  final String ownerWhatsapp;
  final String ownerQualification;
  final String ownerPhotoDisplayUrl;
  final String ownerProfileUrl;
  final String footerNote;

  factory HomepageContent.fromJson(Map<String, dynamic> json) {
    return HomepageContent(
      siteName: _asString(json['site_name'], 'GoGreenTech Learning Academy'),
      tagline: _asString(json['tagline']),
      heroTitle: _asString(json['hero_title']),
      heroSubtitle: _asString(json['hero_subtitle']),
      introText: _asString(json['intro_text']),
      aboutTitle: _asString(json['about_title']),
      aboutDescription: _asString(json['about_description']),
      introVideoUrls: _asStringList(json['intro_video_urls']),
      whyChooseUs: _asStringList(json['why_choose_us']),
      learningModes: _asStringList(json['learning_modes']),
      ownerName: _asString(json['owner_name']),
      ownerRole: _asString(json['owner_role']),
      ownerEmail: _asString(json['owner_email']),
      ownerWhatsapp: _asString(json['owner_whatsapp'], '03470983567'),
      ownerQualification: _asString(json['owner_qualification']),
      ownerPhotoDisplayUrl: _asString(json['owner_photo_display_url']),
      ownerProfileUrl: _asString(json['owner_profile_url']),
      footerNote: _asString(json['footer_note']),
    );
  }
}

class TestimonialModel {
  const TestimonialModel({
    required this.id,
    required this.name,
    required this.role,
    required this.content,
    required this.avatarUrl,
    required this.isFeatured,
    required this.sortOrder,
  });

  final int id;
  final String name;
  final String role;
  final String content;
  final String avatarUrl;
  final bool isFeatured;
  final int sortOrder;

  factory TestimonialModel.fromJson(Map<String, dynamic> json) {
    return TestimonialModel(
      id: _asInt(json['id']),
      name: _asString(json['name']),
      role: _asString(json['role']),
      content: _asString(json['content']),
      avatarUrl: _asString(json['avatar_url']),
      isFeatured: _asBool(json['is_featured']),
      sortOrder: _asInt(json['sort_order']),
    );
  }
}

class FreeLearningVideoModel {
  const FreeLearningVideoModel({
    required this.id,
    required this.title,
    required this.description,
    required this.videoUrl,
    required this.videoId,
    required this.embedUrl,
    required this.thumbnailUrl,
    required this.language,
    required this.sortOrder,
    required this.isPublished,
    required this.showOnHomepage,
  });

  final int id;
  final String title;
  final String description;
  final String videoUrl;
  final String videoId;
  final String embedUrl;
  final String thumbnailUrl;
  final String language;
  final int sortOrder;
  final bool isPublished;
  final bool showOnHomepage;

  factory FreeLearningVideoModel.fromJson(Map<String, dynamic> json) {
    return FreeLearningVideoModel(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      description: _asString(json['description']),
      videoUrl: _asString(json['video_url']),
      videoId: _asString(json['video_id']),
      embedUrl: _asString(json['embed_url']),
      thumbnailUrl: _asString(json['thumbnail_url']),
      language: _asString(json['language'], 'Pashto'),
      sortOrder: _asInt(json['sort_order']),
      isPublished: _asBool(json['is_published']),
      showOnHomepage: _asBool(json['show_on_homepage']),
    );
  }
}

class CourseCategoryModel {
  const CourseCategoryModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.iconName,
  });

  final int id;
  final String title;
  final String slug;
  final String description;
  final String iconName;

  factory CourseCategoryModel.fromJson(Map<String, dynamic> json) {
    return CourseCategoryModel(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      slug: _asString(json['slug']),
      description: _asString(json['description']),
      iconName: _asString(json['icon_name']),
    );
  }
}

class LessonModel {
  const LessonModel({
    required this.id,
    required this.title,
    required this.description,
    required this.videoUrl,
    required this.videoType,
    required this.durationMinutes,
    required this.order,
    required this.isFreePreview,
    required this.isPublished,
  });

  final int id;
  final String title;
  final String description;
  final String videoUrl;
  final String videoType;
  final int durationMinutes;
  final int order;
  final bool isFreePreview;
  final bool isPublished;

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    return LessonModel(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      description: _asString(json['description']),
      videoUrl: _asString(json['video_url']),
      videoType: _asString(json['video_type']),
      durationMinutes: _asInt(json['duration_minutes']),
      order: _asInt(json['order']),
      isFreePreview: _asBool(json['is_free_preview']),
      isPublished: _asBool(json['is_published']),
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
    required this.codeContent,
    required this.isDownloadable,
    required this.visibility,
    required this.order,
  });

  final int id;
  final String title;
  final String description;
  final String resourceType;
  final String driveLink;
  final String codeContent;
  final bool isDownloadable;
  final String visibility;
  final int order;

  factory ResourceModel.fromJson(Map<String, dynamic> json) {
    return ResourceModel(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      description: _asString(json['description']),
      resourceType: _asString(json['resource_type']),
      driveLink: _asString(json['drive_link']),
      codeContent: _asString(json['code_content']),
      isDownloadable: _asBool(json['is_downloadable']),
      visibility: _asString(json['visibility']),
      order: _asInt(json['order']),
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
    required this.isPublished,
    required this.introVideoUrl,
    required this.thumbnailUrl,
    required this.lessonsCount,
    required this.quizCount,
    this.fullDescription,
    this.driveFolderUrl,
    this.codeOverview,
    this.trialLessonLimit,
    this.lessons = const [],
    this.resources = const [],
    this.isEnrolled,
    this.progressPercent,
    this.applicationStatus,
    this.latestPaymentStatus,
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
  final bool isPublished;
  final String introVideoUrl;
  final String thumbnailUrl;
  final int lessonsCount;
  final int quizCount;
  final String? fullDescription;
  final String? driveFolderUrl;
  final String? codeOverview;
  final int? trialLessonLimit;
  final List<LessonModel> lessons;
  final List<ResourceModel> resources;
  final bool? isEnrolled;
  final int? progressPercent;
  final String? applicationStatus;
  final String? latestPaymentStatus;
  final String? whatsappApplyUrl;

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    final lessonsJson = json['lessons'] as List? ?? const [];
    final resourcesJson = json['resources'] as List? ?? const [];

    return CourseModel(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      slug: _asString(json['slug']),
      category: CourseCategoryModel.fromJson(Map<String, dynamic>.from(json['category'] ?? const {})),
      shortDescription: _asString(json['short_description']),
      level: _asString(json['level']),
      duration: _asString(json['duration']),
      instructorName: _asString(json['instructor_name']),
      courseType: _asString(json['course_type']),
      pricingModel: _asString(json['pricing_model']),
      priceDisplay: _asString(json['price_display']),
      featured: _asBool(json['featured']),
      isPublished: _asBool(json['is_published']),
      introVideoUrl: _asString(json['intro_video_url']),
      thumbnailUrl: _asString(json['thumbnail_url']),
      lessonsCount: _asInt(json['lessons_count']),
      quizCount: _asInt(json['quiz_count']),
      fullDescription: json['full_description'] as String?,
      driveFolderUrl: json['drive_folder_url'] as String?,
      codeOverview: json['code_overview'] as String?,
      trialLessonLimit: json['trial_lesson_limit'] == null ? null : _asInt(json['trial_lesson_limit']),
      lessons: lessonsJson
          .map((item) => LessonModel.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList(),
      resources: resourcesJson
          .map((item) => ResourceModel.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList(),
      isEnrolled: json['is_enrolled'] == null ? null : _asBool(json['is_enrolled']),
      progressPercent: json['progress_percent'] == null ? null : _asInt(json['progress_percent']),
      applicationStatus: json['application_status'] as String?,
      latestPaymentStatus: json['latest_payment_status'] as String?,
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
    required this.courseTitle,
    required this.lessonTitle,
    required this.passingScore,
    required this.questionCount,
  });

  final int id;
  final String title;
  final String slug;
  final String description;
  final String courseTitle;
  final String lessonTitle;
  final int passingScore;
  final int questionCount;

  factory QuizSummary.fromJson(Map<String, dynamic> json) {
    return QuizSummary(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      slug: _asString(json['slug']),
      description: _asString(json['description']),
      courseTitle: _asString(json['course_title']),
      lessonTitle: _asString(json['lesson_title']),
      passingScore: _asInt(json['passing_score']),
      questionCount: _asInt(json['question_count']),
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
      id: _asInt(json['id']),
      text: _asString(json['text']),
    );
  }
}

class QuizQuestion {
  const QuizQuestion({
    required this.id,
    required this.prompt,
    required this.explanation,
    required this.options,
  });

  final int id;
  final String prompt;
  final String explanation;
  final List<QuizOption> options;

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    final optionsJson = json['options'] as List? ?? const [];
    return QuizQuestion(
      id: _asInt(json['id']),
      prompt: _asString(json['prompt']),
      explanation: _asString(json['explanation']),
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
    required this.courseTitle,
    required this.lessonTitle,
    required this.passingScore,
    required this.questions,
  });

  final int id;
  final String title;
  final String slug;
  final String description;
  final String courseTitle;
  final String lessonTitle;
  final int passingScore;
  final List<QuizQuestion> questions;

  factory QuizDetail.fromJson(Map<String, dynamic> json) {
    final questionsJson = json['questions'] as List? ?? const [];
    return QuizDetail(
      id: _asInt(json['id']),
      title: _asString(json['title']),
      slug: _asString(json['slug']),
      description: _asString(json['description']),
      courseTitle: _asString(json['course_title']),
      lessonTitle: _asString(json['lesson_title']),
      passingScore: _asInt(json['passing_score']),
      questions: questionsJson
          .map((item) => QuizQuestion.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList(),
    );
  }
}

class EnrollmentApplicationModel {
  const EnrollmentApplicationModel({
    required this.id,
    required this.courseId,
    required this.courseTitle,
    required this.name,
    required this.email,
    required this.phone,
    required this.message,
    required this.preferredContactWhatsapp,
    required this.agreedViaWhatsapp,
    required this.status,
    required this.quotedPrice,
    required this.adminNotes,
    required this.pricingNotes,
    required this.whatsappUrl,
    required this.createdAt,
  });

  final int id;
  final int courseId;
  final String courseTitle;
  final String name;
  final String email;
  final String phone;
  final String message;
  final bool preferredContactWhatsapp;
  final bool agreedViaWhatsapp;
  final String status;
  final String quotedPrice;
  final String adminNotes;
  final String pricingNotes;
  final String whatsappUrl;
  final DateTime? createdAt;

  factory EnrollmentApplicationModel.fromJson(Map<String, dynamic> json) {
    return EnrollmentApplicationModel(
      id: _asInt(json['id']),
      courseId: _asInt(json['course']),
      courseTitle: _asString(json['course_title']),
      name: _asString(json['name']),
      email: _asString(json['email']),
      phone: _asString(json['phone']),
      message: _asString(json['message']),
      preferredContactWhatsapp: _asBool(json['preferred_contact_whatsapp']),
      agreedViaWhatsapp: _asBool(json['agreed_via_whatsapp']),
      status: _asString(json['status']),
      quotedPrice: _asString(json['quoted_price']),
      adminNotes: _asString(json['admin_notes']),
      pricingNotes: _asString(json['pricing_notes']),
      whatsappUrl: _asString(json['whatsapp_url']),
      createdAt: _asDateTime(json['created_at']),
    );
  }
}

class EnrollmentModel {
  const EnrollmentModel({
    required this.id,
    required this.course,
    required this.status,
    required this.agreedPrice,
    required this.activatedAt,
    required this.expiresAt,
    required this.progressPercent,
    required this.createdAt,
  });

  final int id;
  final CourseModel course;
  final String status;
  final String agreedPrice;
  final DateTime? activatedAt;
  final DateTime? expiresAt;
  final int progressPercent;
  final DateTime? createdAt;

  factory EnrollmentModel.fromJson(Map<String, dynamic> json) {
    return EnrollmentModel(
      id: _asInt(json['id']),
      course: CourseModel.fromJson(Map<String, dynamic>.from(json['course'] ?? const {})),
      status: _asString(json['status']),
      agreedPrice: _asString(json['agreed_price']),
      activatedAt: _asDateTime(json['activated_at']),
      expiresAt: _asDateTime(json['expires_at']),
      progressPercent: _asInt(json['progress_percent']),
      createdAt: _asDateTime(json['created_at']),
    );
  }
}

class PaymentRecordModel {
  const PaymentRecordModel({
    required this.id,
    required this.invoiceNumber,
    required this.courseTitle,
    required this.amountDue,
    required this.amountPaid,
    required this.balance,
    required this.dueDate,
    required this.paidAt,
    required this.status,
    required this.paymentMethod,
    required this.transactionReference,
    required this.proofUrl,
    required this.notes,
    required this.invoiceUrl,
    required this.createdAt,
  });

  final int id;
  final String invoiceNumber;
  final String courseTitle;
  final String amountDue;
  final String amountPaid;
  final String balance;
  final DateTime? dueDate;
  final DateTime? paidAt;
  final String status;
  final String paymentMethod;
  final String transactionReference;
  final String proofUrl;
  final String notes;
  final String invoiceUrl;
  final DateTime? createdAt;

  factory PaymentRecordModel.fromJson(Map<String, dynamic> json) {
    return PaymentRecordModel(
      id: _asInt(json['id']),
      invoiceNumber: _asString(json['invoice_number']),
      courseTitle: _asString(json['course_title']),
      amountDue: _asString(json['amount_due']),
      amountPaid: _asString(json['amount_paid']),
      balance: _asString(json['balance']),
      dueDate: _asDateTime(json['due_date']),
      paidAt: _asDateTime(json['paid_at']),
      status: _asString(json['status']),
      paymentMethod: _asString(json['payment_method']),
      transactionReference: _asString(json['transaction_reference']),
      proofUrl: _asString(json['proof_url']),
      notes: _asString(json['notes']),
      invoiceUrl: _asString(json['invoice_url']),
      createdAt: _asDateTime(json['created_at']),
    );
  }
}

class QuizAttemptModel {
  const QuizAttemptModel({
    required this.id,
    required this.quizId,
    required this.quizTitle,
    required this.answers,
    required this.score,
    required this.correctAnswers,
    required this.totalQuestions,
    required this.passed,
    required this.createdAt,
  });

  final int id;
  final int quizId;
  final String quizTitle;
  final Map<String, dynamic> answers;
  final int score;
  final int correctAnswers;
  final int totalQuestions;
  final bool passed;
  final DateTime? createdAt;

  factory QuizAttemptModel.fromJson(Map<String, dynamic> json) {
    return QuizAttemptModel(
      id: _asInt(json['id']),
      quizId: _asInt(json['quiz']),
      quizTitle: _asString(json['quiz_title']),
      answers: Map<String, dynamic>.from(json['answers'] ?? const {}),
      score: _asInt(json['score']),
      correctAnswers: _asInt(json['correct_answers']),
      totalQuestions: _asInt(json['total_questions']),
      passed: _asBool(json['passed']),
      createdAt: _asDateTime(json['created_at']),
    );
  }
}

class NotificationModel {
  const NotificationModel({
    required this.id,
    required this.userId,
    required this.audience,
    required this.notificationType,
    required this.title,
    required this.message,
    required this.actionUrl,
    required this.isRead,
    required this.createdAt,
  });

  final int userId;
  final int id;
  final String audience;
  final String notificationType;
  final String title;
  final String message;
  final String actionUrl;
  final bool isRead;
  final DateTime? createdAt;

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: _asInt(json['id']),
      userId: _asInt(json['user']),
      audience: _asString(json['audience']),
      notificationType: _asString(json['notification_type']),
      title: _asString(json['title']),
      message: _asString(json['message']),
      actionUrl: _asString(json['action_url']),
      isRead: _asBool(json['is_read']),
      createdAt: _asDateTime(json['created_at']),
    );
  }

  NotificationModel copyWith({
    bool? isRead,
  }) {
    return NotificationModel(
      id: id,
      userId: userId,
      audience: audience,
      notificationType: notificationType,
      title: title,
      message: message,
      actionUrl: actionUrl,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt,
    );
  }
}

class StudentDashboardData {
  const StudentDashboardData({
    required this.profile,
    required this.enrollments,
    required this.quizAttempts,
    required this.notifications,
    required this.payments,
    required this.unreadNotifications,
  });

  final UserModel? profile;
  final List<EnrollmentModel> enrollments;
  final List<QuizAttemptModel> quizAttempts;
  final List<NotificationModel> notifications;
  final List<PaymentRecordModel> payments;
  final int unreadNotifications;

  factory StudentDashboardData.fromJson(Map<String, dynamic> json) {
    List<T> parseList<T>(String key, T Function(Map<String, dynamic>) parser) {
      final value = json[key];
      if (value is! List) {
        return const [];
      }
      return value
          .map((item) => parser(Map<String, dynamic>.from(item as Map)))
          .toList();
    }

    return StudentDashboardData(
      profile: json['profile'] is Map<String, dynamic>
          ? UserModel.fromJson(Map<String, dynamic>.from(json['profile'] as Map))
          : null,
      enrollments: parseList('enrollments', EnrollmentModel.fromJson),
      quizAttempts: parseList('quiz_attempts', QuizAttemptModel.fromJson),
      notifications: parseList('notifications', NotificationModel.fromJson),
      payments: parseList('payments', PaymentRecordModel.fromJson),
      unreadNotifications: _asInt(json['unread_notifications']),
    );
  }
}

class RecentApplicationModel {
  const RecentApplicationModel({
    required this.id,
    required this.name,
    required this.course,
    required this.status,
    required this.createdAt,
  });

  final int id;
  final String name;
  final String course;
  final String status;
  final DateTime? createdAt;

  factory RecentApplicationModel.fromJson(Map<String, dynamic> json) {
    return RecentApplicationModel(
      id: _asInt(json['id']),
      name: _asString(json['name']),
      course: _asString(json['course']),
      status: _asString(json['status']),
      createdAt: _asDateTime(json['created_at']),
    );
  }
}

class CourseStatisticModel {
  const CourseStatisticModel({
    required this.title,
    required this.courseType,
    required this.enrollmentCount,
    required this.featured,
  });

  final String title;
  final String courseType;
  final int enrollmentCount;
  final bool featured;

  factory CourseStatisticModel.fromJson(Map<String, dynamic> json) {
    return CourseStatisticModel(
      title: _asString(json['title']),
      courseType: _asString(json['course_type']),
      enrollmentCount: _asInt(json['enrollment_count']),
      featured: _asBool(json['featured']),
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
        return const [];
      }
      return value
          .map((item) => parser(Map<String, dynamic>.from(item as Map)))
          .toList();
    }

    return AdminDashboardData(
      totalStudents: _asInt(json['total_students']),
      totalEnrollments: _asInt(json['total_enrollments']),
      totalActiveCourses: _asInt(json['total_active_courses']),
      totalApplications: _asInt(json['total_applications']),
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
      courseTitle: _asString(json['course_title']),
      whatsappUrl: _asString(json['whatsapp_url']),
    );
  }
}
