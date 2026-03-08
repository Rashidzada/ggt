import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../models.dart';
import 'video_player_screen.dart';

class LessonScreen extends StatelessWidget {
  const LessonScreen({super.key, required this.lesson});

  final LessonModel lesson;

  @override
  Widget build(BuildContext context) {
    return VideoPlayerScreen(
      title: lesson.title,
      description: lesson.description.isEmpty
          ? 'Lesson duration: ${lesson.durationMinutes} minutes'
          : '${lesson.description}\n\nDuration: ${lesson.durationMinutes} minutes',
      videoUrl: lesson.videoUrl,
      primaryActionLabel: 'Mark completed',
      onPrimaryAction: () => context.read<AppController>().markLessonComplete(lesson.id),
    );
  }
}
