import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../app_error.dart';
import '../widgets/common_widgets.dart';
import 'video_player_screen.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();
    final content = controller.homepageContent;
    final featuredVideo = controller.featuredFreeVideo;

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        body: AppGradientBackground(
          child: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const BrandLockup(
                    logoSize: 62,
                    titleSize: 30,
                    showSubtitle: true,
                  ),
                  const SizedBox(height: 26),
                  Container(
                    padding: const EdgeInsets.all(26),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.82),
                      borderRadius: BorderRadius.circular(32),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        MetaTag(
                          text: content?.tagline.isNotEmpty == true
                              ? content!.tagline
                              : 'Practical courses with guided support',
                          backgroundColor: const Color(0xFFD8F0DE),
                        ),
                        const SizedBox(height: 18),
                        Text(
                          content?.heroTitle ?? 'Build real skills with guided tech learning',
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                fontWeight: FontWeight.w800,
                                color: const Color(0xFF0E2E23),
                                height: 1.05,
                              ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          content?.heroSubtitle ??
                              'Access free Pashto lessons, guided courses, quizzes, and direct academy support from one mobile app.',
                          style: const TextStyle(height: 1.6, fontSize: 15.5),
                        ),
                        const SizedBox(height: 18),
                        Wrap(
                          spacing: 10,
                          runSpacing: 10,
                          children: [
                            MetaTag(text: '${controller.featuredCourses.length} featured tracks'),
                            MetaTag(
                              text: featuredVideo != null
                                  ? 'Free learning available'
                                  : 'Student login and dashboard',
                              backgroundColor: const Color(0xFFFFE8D8),
                            ),
                          ],
                        ),
                        if (content != null && content.learningModes.isNotEmpty) ...[
                          const SizedBox(height: 18),
                          Wrap(
                            spacing: 10,
                            runSpacing: 10,
                            children: content.learningModes
                                .take(3)
                                .map((mode) => MetaTag(
                                      text: mode,
                                      backgroundColor: Colors.white,
                                    ))
                                .toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                  if (featuredVideo != null) ...[
                    const SizedBox(height: 18),
                    Card(
                      child: InkWell(
                        borderRadius: BorderRadius.circular(28),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => VideoPlayerScreen(
                                title: featuredVideo.title,
                                description: featuredVideo.description,
                                videoUrl: featuredVideo.videoUrl,
                              ),
                            ),
                          );
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(18),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const MetaTag(
                                      text: 'Free Pashto lesson',
                                      backgroundColor: Color(0xFFFFE8D8),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      featuredVideo.title,
                                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      featuredVideo.description.isEmpty
                                          ? 'Watch inside the app before you create your account.'
                                          : featuredVideo.description,
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(height: 1.5),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 12),
                              Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF163D2F),
                                  borderRadius: BorderRadius.circular(24),
                                ),
                                child: const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 34),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 18),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(22),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Student access',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Login to unlock the full free-learning library, dashboard updates, course applications, and payment progress.',
                            style: TextStyle(height: 1.5),
                          ),
                          if (controller.startupError != null) ...[
                            const SizedBox(height: 14),
                            Text(
                              'Startup note: ${controller.startupError}',
                              style: const TextStyle(
                                color: Color(0xFFB54B22),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                          const SizedBox(height: 18),
                          const TabBar(
                            tabs: [
                              Tab(text: 'Login'),
                              Tab(text: 'Register'),
                            ],
                          ),
                          const SizedBox(height: 18),
                          const SizedBox(
                            height: 428,
                            child: TabBarView(
                              children: [
                                LoginForm(),
                                RegisterForm(),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (controller.testimonials.isNotEmpty) ...[
                    const SizedBox(height: 18),
                    const SectionTitle(
                      title: 'Student voice',
                      subtitle: 'Recent feedback and learning outcomes from the academy.',
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 184,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: controller.testimonials.length.clamp(0, 5),
                        separatorBuilder: (_, index) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          final testimonial = controller.testimonials[index];
                          return SizedBox(
                            width: 280,
                            child: Card(
                              child: Padding(
                                padding: const EdgeInsets.all(18),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      testimonial.content,
                                      maxLines: 5,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(height: 1.5),
                                    ),
                                    const Spacer(),
                                    Text(
                                      testimonial.name,
                                      style: const TextStyle(fontWeight: FontWeight.w800),
                                    ),
                                    if (testimonial.role.isNotEmpty)
                                      Text(testimonial.role, style: const TextStyle(color: Color(0xFF4D6B5D))),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final controller = context.read<AppController>();
    try {
      await controller.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              describeAppError(
                error,
                fallback: 'Login failed. Please check your credentials.',
              ),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isBusy = context.watch<AppController>().isBusy;

    return Form(
      key: _formKey,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          TextFormField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            autofillHints: const [AutofillHints.username, AutofillHints.email],
            decoration: const InputDecoration(labelText: 'Email'),
            validator: (value) => (value == null || value.isEmpty) ? 'Email is required.' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            autofillHints: const [AutofillHints.password],
            decoration: const InputDecoration(labelText: 'Password'),
            validator: (value) => (value == null || value.isEmpty) ? 'Password is required.' : null,
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: isBusy ? null : _submit,
              child: Text(isBusy ? 'Signing in...' : 'Login'),
            ),
          ),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            onPressed: () => openExternal(globalWhatsAppUrl()),
            icon: const Icon(Icons.chat_rounded),
            label: const Text('Talk on WhatsApp'),
          ),
        ],
      ),
    );
  }
}

class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key});

  @override
  State<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final controller = context.read<AppController>();
    try {
      await controller.register(
        fullName: _nameController.text.trim(),
        email: _emailController.text.trim(),
        phoneNumber: _phoneController.text.trim(),
        password: _passwordController.text,
        confirmPassword: _confirmPasswordController.text,
      );
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              describeAppError(
                error,
                fallback: 'Registration failed. Please review the details and try again.',
              ),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isBusy = context.watch<AppController>().isBusy;

    return Form(
      key: _formKey,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          TextFormField(
            controller: _nameController,
            textCapitalization: TextCapitalization.words,
            autofillHints: const [AutofillHints.name],
            decoration: const InputDecoration(labelText: 'Full name'),
            validator: (value) => (value == null || value.isEmpty) ? 'Full name is required.' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            autofillHints: const [AutofillHints.email],
            decoration: const InputDecoration(labelText: 'Email'),
            validator: (value) => (value == null || value.isEmpty) ? 'Email is required.' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            autofillHints: const [AutofillHints.telephoneNumber],
            decoration: const InputDecoration(labelText: 'Phone number'),
            validator: (value) => (value == null || value.isEmpty) ? 'Phone number is required.' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            autofillHints: const [AutofillHints.newPassword],
            decoration: const InputDecoration(labelText: 'Password'),
            validator: (value) => (value == null || value.length < 8) ? 'Minimum 8 characters required.' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _confirmPasswordController,
            obscureText: true,
            autofillHints: const [AutofillHints.newPassword],
            decoration: const InputDecoration(labelText: 'Confirm password'),
            validator: (value) => value != _passwordController.text ? 'Passwords do not match.' : null,
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: isBusy ? null : _submit,
              child: Text(isBusy ? 'Creating account...' : 'Create account'),
            ),
          ),
        ],
      ),
    );
  }
}
