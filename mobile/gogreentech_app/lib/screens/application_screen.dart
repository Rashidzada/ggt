import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../app_error.dart';
import '../models.dart';
import '../widgets/common_widgets.dart';

class ApplicationScreen extends StatefulWidget {
  const ApplicationScreen({super.key, required this.course});

  final CourseModel course;

  @override
  State<ApplicationScreen> createState() => _ApplicationScreenState();
}

class _ApplicationScreenState extends State<ApplicationScreen> {
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  final TextEditingController _messageController = TextEditingController();
  bool _preferredWhatsapp = true;
  bool _agreedViaWhatsapp = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    final user = context.read<AppController>().user;
    _nameController = TextEditingController(text: user?.fullName ?? '');
    _emailController = TextEditingController(text: user?.email ?? '');
    _phoneController = TextEditingController(text: user?.phoneNumber ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _isSubmitting = true);
    try {
      final result = await context.read<AppController>().applyForCourse(
            courseId: widget.course.id,
            name: _nameController.text.trim(),
            email: _emailController.text.trim(),
            phone: _phoneController.text.trim(),
            message: _messageController.text.trim(),
            preferredContactWhatsapp: _preferredWhatsapp,
            agreedViaWhatsapp: _agreedViaWhatsapp,
          );
      if (!mounted) {
        return;
      }
      await showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Application submitted'),
          content: Text('Your request for ${result.courseTitle} has been saved. Continue on WhatsApp now?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                openExternal(result.whatsappUrl);
              },
              child: const Text('Open WhatsApp'),
            ),
          ],
        ),
      );
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              describeAppError(
                error,
                fallback: 'Unable to submit your application right now.',
              ),
            ),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Apply for course')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(widget.course.title, style: GoogleFonts.fraunces(fontSize: 28, fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Name', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _emailController,
            decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _phoneController,
            decoration: const InputDecoration(labelText: 'Phone', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _messageController,
            maxLines: 4,
            decoration: const InputDecoration(
              labelText: 'Message',
              border: OutlineInputBorder(),
              hintText: 'Tell the academy about your goals or preferred learning mode.',
            ),
          ),
          const SizedBox(height: 14),
          SwitchListTile(
            value: _preferredWhatsapp,
            onChanged: (value) => setState(() => _preferredWhatsapp = value),
            title: const Text('Prefer WhatsApp contact'),
          ),
          SwitchListTile(
            value: _agreedViaWhatsapp,
            onChanged: (value) => setState(() => _agreedViaWhatsapp = value),
            title: const Text('Pricing can be finalized on WhatsApp'),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _isSubmitting ? null : _submit,
            child: Text(_isSubmitting ? 'Submitting...' : 'Submit application'),
          ),
        ],
      ),
    );
  }
}
