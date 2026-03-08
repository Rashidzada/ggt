import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../models.dart';
import '../widgets/common_widgets.dart';
import 'application_screen.dart';
import 'lesson_screen.dart';
import 'quiz_screen.dart';
import 'video_player_screen.dart';

class CourseDetailScreen extends StatefulWidget {
  const CourseDetailScreen({super.key, required this.course});

  final CourseModel course;

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  CourseModel? _detail;
  List<QuizSummary> _quizzes = const [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final controller = context.read<AppController>();
    final detail = await controller.fetchCourseDetail(widget.course.slug);
    final quizzes = await controller.fetchCourseQuizzes(detail.id);
    if (!mounted) {
      return;
    }
    setState(() {
      _detail = detail;
      _quizzes = quizzes;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading || _detail == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final detail = _detail!;

    return Scaffold(
      appBar: AppBar(title: Text(detail.title)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (detail.thumbnailUrl.isNotEmpty) ...[
                    AppNetworkImage(
                      url: detail.thumbnailUrl,
                      width: double.infinity,
                      height: 220,
                      borderRadius: 26,
                    ),
                    const SizedBox(height: 18),
                  ],
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      MetaTag(text: detail.category.title),
                      MetaTag(text: detail.duration),
                      MetaTag(text: detail.priceDisplay, backgroundColor: const Color(0xFFFFE8D8)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    detail.fullDescription ?? detail.shortDescription,
                    style: const TextStyle(height: 1.6),
                  ),
                  const SizedBox(height: 18),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      FilledButton.icon(
                        onPressed: () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => ApplicationScreen(course: detail)),
                        ),
                        icon: const Icon(Icons.assignment_turned_in_rounded),
                        label: const Text('Apply'),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => openExternal(
                          detail.whatsappApplyUrl ??
                              globalWhatsAppUrl('Assalamualaikum, I want to discuss ${detail.title}.'),
                        ),
                        icon: const Icon(Icons.chat_bubble_rounded),
                        label: const Text('WhatsApp'),
                      ),
                      if (detail.introVideoUrl.isNotEmpty)
                        OutlinedButton.icon(
                          onPressed: () => Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => VideoPlayerScreen(
                                title: '${detail.title} intro',
                                description: detail.shortDescription,
                                videoUrl: detail.introVideoUrl,
                              ),
                            ),
                          ),
                          icon: const Icon(Icons.play_circle_fill_rounded),
                          label: const Text('Watch intro'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          SectionTitle(
            title: 'Lessons',
            subtitle: detail.isEnrolled == true
                ? 'Full lessons are available because you are enrolled.'
                : 'Preview lessons are visible until full enrollment is approved.',
          ),
          const SizedBox(height: 12),
          ...detail.lessons.map(
            (lesson) => Card(
              child: ListTile(
                title: Text(lesson.title),
                subtitle: Text('${lesson.durationMinutes} minutes'),
                trailing: lesson.isFreePreview
                    ? const Icon(Icons.lock_open_rounded, color: Color(0xFF1F7A4D))
                    : const Icon(Icons.lock_rounded),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => LessonScreen(lesson: lesson)),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 20),
          const SectionTitle(
            title: 'Resources',
            subtitle: 'Drive folders, notes, and code resources available for this track.',
          ),
          const SizedBox(height: 12),
          ...detail.resources.map(
            (resource) => Card(
              child: ListTile(
                title: Text(resource.title),
                subtitle: Text('${resource.resourceType.toUpperCase()} • ${resource.visibility}'),
                trailing: const Icon(Icons.open_in_new_rounded),
                onTap: resource.driveLink.isEmpty ? null : () => openExternal(resource.driveLink),
              ),
            ),
          ),
          const SizedBox(height: 20),
          const SectionTitle(
            title: 'Quizzes',
            subtitle: 'Attempt quiz practice directly inside the app.',
          ),
          const SizedBox(height: 12),
          ..._quizzes.map(
            (quiz) => Card(
              child: ListTile(
                title: Text(quiz.title),
                subtitle: Text('Passing score ${quiz.passingScore}%'),
                trailing: const Icon(Icons.quiz_rounded),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => QuizScreen(quizSummary: quiz)),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
