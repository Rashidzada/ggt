import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../widgets/common_widgets.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Card(
                elevation: 0,
                color: Colors.white.withValues(alpha: 0.92),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                child: Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const BrandLockup(
                        logoSize: 72,
                        titleSize: 30,
                        showSubtitle: true,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Login or create a student account to access lessons, dashboard, applications, and payment updates.',
                      ),
                      const SizedBox(height: 24),
                      const TabBar(
                        tabs: [
                          Tab(text: 'Login'),
                          Tab(text: 'Register'),
                        ],
                      ),
                      const SizedBox(
                        height: 520,
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
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login failed. Please check your credentials.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isBusy = context.watch<AppController>().isBusy;

    return Form(
      key: _formKey,
      child: Column(
        children: [
          const SizedBox(height: 24),
          TextFormField(
            controller: _emailController,
            decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
            validator: (value) => (value == null || value.isEmpty) ? 'Email is required.' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
            validator: (value) => (value == null || value.isEmpty) ? 'Password is required.' : null,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: isBusy ? null : _submit,
              child: Text(isBusy ? 'Signing in...' : 'Login'),
            ),
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
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration failed. Please review the details and try again.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isBusy = context.watch<AppController>().isBusy;

    return Form(
      key: _formKey,
      child: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 24),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full name', border: OutlineInputBorder()),
              validator: (value) => (value == null || value.isEmpty) ? 'Full name is required.' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
              validator: (value) => (value == null || value.isEmpty) ? 'Email is required.' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _phoneController,
              decoration: const InputDecoration(labelText: 'Phone number', border: OutlineInputBorder()),
              validator: (value) => (value == null || value.isEmpty) ? 'Phone number is required.' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
              validator: (value) => (value == null || value.length < 8) ? 'Minimum 8 characters required.' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _confirmPasswordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Confirm password', border: OutlineInputBorder()),
              validator: (value) => value != _passwordController.text ? 'Passwords do not match.' : null,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: isBusy ? null : _submit,
                child: Text(isBusy ? 'Creating account...' : 'Register'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
