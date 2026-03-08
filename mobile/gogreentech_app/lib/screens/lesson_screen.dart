import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../models.dart';
import '../widgets/common_widgets.dart';

class LessonScreen extends StatelessWidget {
  const LessonScreen({super.key, required this.lesson});

  final LessonModel lesson;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(lesson.title)),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(lesson.description, style: const TextStyle(height: 1.6)),
            const SizedBox(height: 20),
            Card(
              elevation: 0,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Duration: ${lesson.durationMinutes} minutes'),
                    const SizedBox(height: 16),
                    FilledButton.icon(
                      onPressed: () => openExternal(lesson.videoUrl),
                      icon: const Icon(Icons.play_circle_fill_rounded),
                      label: const Text('Open lesson video'),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      onPressed: () async {
                        await context.read<AppController>().markLessonComplete(lesson.id);
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Lesson marked as completed.')),
                          );
                        }
                      },
                      icon: const Icon(Icons.check_circle_rounded),
                      label: const Text('Mark completed'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
