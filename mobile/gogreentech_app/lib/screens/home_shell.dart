import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../models.dart';
import '../widgets/common_widgets.dart';
import 'course_detail_screen.dart';

class AcademyShell extends StatefulWidget {
  const AcademyShell({super.key});

  @override
  State<AcademyShell> createState() => _AcademyShellState();
}

class _AcademyShellState extends State<AcademyShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final tabs = [
      HomeTab(onBrowseCourses: () => setState(() => _index = 1)),
      const CoursesTab(),
      const DashboardTab(),
      const ProfileTab(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const BrandLockup(
          compact: true,
          logoSize: 34,
          titleSize: 20,
          showSubtitle: false,
        ),
        actions: [
          IconButton(
            tooltip: 'WhatsApp',
            onPressed: () => openExternal(globalWhatsAppUrl()),
            icon: const Icon(Icons.chat_bubble_rounded),
          ),
          IconButton(
            tooltip: 'Logout',
            onPressed: () => context.read<AppController>().logout(),
            icon: const Icon(Icons.logout_rounded),
          ),
        ],
      ),
      body: SafeArea(child: tabs[_index]),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => openExternal(globalWhatsAppUrl()),
        icon: const Icon(Icons.chat_rounded),
        label: const Text('WhatsApp'),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.menu_book_rounded), label: 'Courses'),
          NavigationDestination(icon: Icon(Icons.dashboard_rounded), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key, required this.onBrowseCourses});

  final VoidCallback onBrowseCourses;

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();
    final content = controller.homepageContent;

    if (content == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: () async {
        await controller.loadHome();
        await controller.loadCourses();
      },
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _HeroCard(content: content, onBrowseCourses: onBrowseCourses),
          const SizedBox(height: 20),
          SectionTitle(
            title: 'Why students choose GoGreenTech',
            subtitle: content.introText,
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 14,
            runSpacing: 14,
            children: content.whyChooseUs
                .map(
                  (item) => InfoPanel(
                    title: item,
                    subtitle: 'Student-friendly course delivery with guided support.',
                    icon: Icons.verified_rounded,
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 24),
          const SectionTitle(
            title: 'Featured courses',
            subtitle: 'Start from trial-ready tracks and move into full access after enrollment.',
          ),
          const SizedBox(height: 12),
          ...controller.featuredCourses.map(
            (course) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CourseTile(course: course),
            ),
          ),
        ],
      ),
    );
  }
}

class CoursesTab extends StatefulWidget {
  const CoursesTab({super.key});

  @override
  State<CoursesTab> createState() => _CoursesTabState();
}

class _CoursesTabState extends State<CoursesTab> {
  String _search = '';

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();
    final filteredCourses = controller.courses
        .where(
          (course) =>
              course.title.toLowerCase().contains(_search.toLowerCase()) ||
              course.shortDescription.toLowerCase().contains(_search.toLowerCase()),
        )
        .toList();

    return RefreshIndicator(
      onRefresh: controller.loadCourses,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            decoration: const InputDecoration(
              labelText: 'Search courses',
              prefixIcon: Icon(Icons.search_rounded),
              border: OutlineInputBorder(),
            ),
            onChanged: (value) => setState(() => _search = value),
          ),
          const SizedBox(height: 18),
          ...filteredCourses.map(
            (course) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CourseTile(course: course),
            ),
          ),
        ],
      ),
    );
  }
}

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();

    return RefreshIndicator(
      onRefresh: controller.loadDashboard,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: controller.user?.isAdmin == true
            ? _buildAdminDashboard(controller.adminDashboard)
            : _buildStudentDashboard(controller.studentDashboard),
      ),
    );
  }

  List<Widget> _buildStudentDashboard(StudentDashboardData? data) {
    if (data == null) {
      return const [SizedBox(height: 250, child: Center(child: CircularProgressIndicator()))];
    }

    return [
      const SectionTitle(
        title: 'Student dashboard',
        subtitle: 'Track course access, quiz history, notifications, and payment status.',
      ),
      const SizedBox(height: 12),
      StatStrip(
        items: [
          StatItem(label: 'Courses', value: '${data.enrollments.length}', icon: Icons.menu_book_rounded),
          StatItem(label: 'Unread', value: '${data.unreadNotifications}', icon: Icons.notifications_active_rounded),
          StatItem(label: 'Quizzes', value: '${data.quizAttempts.length}', icon: Icons.quiz_rounded),
        ],
      ),
      const SizedBox(height: 20),
      const SectionTitle(title: 'Enrollments', subtitle: 'Your active learning tracks.'),
      const SizedBox(height: 12),
      ...data.enrollments.map(
        (enrollment) => Card(
          elevation: 0,
          child: ListTile(
            title: Text(enrollment.course.title),
            subtitle: Text('${enrollment.status} - ${enrollment.progressPercent}% progress'),
          ),
        ),
      ),
      const SizedBox(height: 20),
      const SectionTitle(title: 'Payments', subtitle: 'Per-course payment records and invoice access.'),
      const SizedBox(height: 12),
      ...data.payments.map(
        (payment) => Card(
          elevation: 0,
          child: ListTile(
            title: Text(payment.courseTitle),
            subtitle: Text('Paid ${payment.amountPaid} / Due ${payment.amountDue} - ${payment.status}'),
            trailing: const Icon(Icons.picture_as_pdf_rounded),
            onTap: payment.invoiceUrl.isEmpty ? null : () => openExternal(payment.invoiceUrl),
          ),
        ),
      ),
    ];
  }

  List<Widget> _buildAdminDashboard(AdminDashboardData? data) {
    if (data == null) {
      return const [SizedBox(height: 250, child: Center(child: CircularProgressIndicator()))];
    }

    return [
      const SectionTitle(
        title: 'Admin dashboard',
        subtitle: 'Monitor student signups, enrollments, and course activity from one place.',
      ),
      const SizedBox(height: 12),
      StatStrip(
        items: [
          StatItem(label: 'Students', value: '${data.totalStudents}', icon: Icons.people_alt_rounded),
          StatItem(label: 'Enrollments', value: '${data.totalEnrollments}', icon: Icons.fact_check_rounded),
          StatItem(label: 'Courses', value: '${data.totalActiveCourses}', icon: Icons.dashboard_customize_rounded),
          StatItem(label: 'Applications', value: '${data.totalApplications}', icon: Icons.inbox_rounded),
        ],
      ),
      const SizedBox(height: 20),
      const SectionTitle(title: 'Recent applications', subtitle: 'New leads captured from the platform.'),
      const SizedBox(height: 12),
      ...data.recentApplications.map(
        (application) => Card(
          elevation: 0,
          child: ListTile(
            title: Text(application.name),
            subtitle: Text('${application.course} - ${application.status}'),
          ),
        ),
      ),
      const SizedBox(height: 20),
      const SectionTitle(title: 'Course statistics', subtitle: 'Enrollment distribution across active tracks.'),
      const SizedBox(height: 12),
      ...data.courseStatistics.map(
        (course) => Card(
          elevation: 0,
          child: ListTile(
            title: Text(course.title),
            subtitle: Text('${course.courseType} - ${course.enrollmentCount} enrollments'),
          ),
        ),
      ),
    ];
  }
}

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _cityController;
  late final TextEditingController _qualificationController;
  late final TextEditingController _bioController;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _phoneController = TextEditingController();
    _cityController = TextEditingController();
    _qualificationController = TextEditingController();
    _bioController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_initialized) {
      return;
    }
    final user = context.read<AppController>().user;
    if (user != null) {
      _nameController.text = user.fullName;
      _phoneController.text = user.phoneNumber;
      _cityController.text = user.profile.city;
      _qualificationController.text = user.profile.qualification;
      _bioController.text = user.profile.bio;
    }
    _initialized = true;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    _qualificationController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final controller = context.read<AppController>();
    try {
      await controller.updateProfile(
        fullName: _nameController.text.trim(),
        phoneNumber: _phoneController.text.trim(),
        city: _cityController.text.trim(),
        qualification: _qualificationController.text.trim(),
        bio: _bioController.text.trim(),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully.')),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Unable to update profile right now.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AppController>().user;
    if (user == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SectionTitle(
          title: 'Profile',
          subtitle: 'Update your contact details and learning background.',
        ),
        const SizedBox(height: 16),
        Card(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                TextField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Full name'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _phoneController,
                  decoration: const InputDecoration(labelText: 'Phone number'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _cityController,
                  decoration: const InputDecoration(labelText: 'City'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _qualificationController,
                  decoration: const InputDecoration(labelText: 'Qualification'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _bioController,
                  maxLines: 4,
                  decoration: const InputDecoration(labelText: 'Bio'),
                ),
                const SizedBox(height: 20),
                Align(
                  alignment: Alignment.centerLeft,
                  child: FilledButton(
                    onPressed: _save,
                    child: const Text('Save profile'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class CourseTile extends StatelessWidget {
  const CourseTile({super.key, required this.course});

  final CourseModel course;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: InkWell(
        borderRadius: BorderRadius.circular(28),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => CourseDetailScreen(course: course)),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Chip(label: Text(course.level)),
                  const Spacer(),
                  if (course.featured) const Icon(Icons.workspace_premium_rounded, color: Color(0xFF1F7A4D)),
                ],
              ),
              const SizedBox(height: 12),
              Text(course.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text(course.shortDescription, style: const TextStyle(height: 1.5)),
              const SizedBox(height: 14),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  MetaTag(text: course.category.title),
                  MetaTag(text: course.duration),
                  MetaTag(text: course.priceDisplay),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({required this.content, required this.onBrowseCourses});

  final HomepageContent content;
  final VoidCallback onBrowseCourses;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFEEF8F0), Color(0xFFD8F0DE)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(32),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const BrandLockup(
            logoSize: 64,
            titleSize: 28,
            showSubtitle: true,
          ),
          const SizedBox(height: 18),
          Text(
            content.tagline,
            style: const TextStyle(
              color: Color(0xFF1F7A4D),
              fontWeight: FontWeight.w700,
              letterSpacing: 0.6,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            content.heroTitle,
            style: GoogleFonts.fraunces(
              fontSize: 34,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF163D2F),
            ),
          ),
          const SizedBox(height: 12),
          Text(content.heroSubtitle, style: const TextStyle(height: 1.5)),
          const SizedBox(height: 20),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              FilledButton(
                onPressed: onBrowseCourses,
                child: const Text('Browse courses'),
              ),
              OutlinedButton(
                onPressed: () => openExternal(
                  globalWhatsAppUrl('Assalamualaikum, I want to discuss enrollment in GoGreenTech.'),
                ),
                child: const Text('WhatsApp'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
