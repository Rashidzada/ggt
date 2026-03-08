import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../models.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key, required this.quizSummary});

  final QuizSummary quizSummary;

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  QuizDetail? _quiz;
  final Map<String, int> _answers = {};
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadQuiz();
  }

  Future<void> _loadQuiz() async {
    final quiz = await context.read<AppController>().fetchQuizDetail(widget.quizSummary.slug);
    if (!mounted) {
      return;
    }
    setState(() => _quiz = quiz);
  }

  Future<void> _submit() async {
    if (_quiz == null || _answers.length != _quiz!.questions.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please answer all questions before submitting.')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final attempt = await context.read<AppController>().submitQuiz(
            slug: _quiz!.slug,
            answers: _answers,
          );
      if (!mounted) {
        return;
      }
      showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Quiz submitted'),
          content: Text('Score: ${attempt.score}%\nCorrect: ${attempt.correctAnswers}/${attempt.totalQuestions}'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_quiz == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: Text(_quiz!.title)),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(_quiz!.description),
          const SizedBox(height: 20),
          ..._quiz!.questions.map(
            (question) => Card(
              elevation: 0,
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(question.prompt, style: const TextStyle(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 12),
                    ...question.options.map(
                      (option) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: Icon(
                          _answers['${question.id}'] == option.id
                              ? Icons.radio_button_checked_rounded
                              : Icons.radio_button_off_rounded,
                          color: _answers['${question.id}'] == option.id
                              ? Theme.of(context).colorScheme.primary
                              : null,
                        ),
                        title: Text(option.text),
                        onTap: () => setState(() => _answers['${question.id}'] = option.id),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _isSubmitting ? null : _submit,
            child: Text(_isSubmitting ? 'Submitting...' : 'Submit quiz'),
          ),
        ],
      ),
    );
  }
}
