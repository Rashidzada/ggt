import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../app_error.dart';
import '../models.dart';
import '../widgets/common_widgets.dart';
import 'course_detail_screen.dart';
import 'notifications_screen.dart';
import 'video_player_screen.dart';

class AcademyShell extends StatefulWidget {
  const AcademyShell({super.key});

  @override
  State<AcademyShell> createState() => _AcademyShellState();
}

class _AcademyShellState extends State<AcademyShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();
    final tabs = [
      HomeTab(onBrowseCourses: () => setState(() => _index = 2)),
      const FreeLearningTab(),
      const CoursesTab(),
      const DashboardTab(),
      const ProfileTab(),
    ];

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const BrandLockup(
          compact: true,
          logoSize: 34,
          titleSize: 20,
          showSubtitle: false,
        ),
        actions: [
          BellIconButton(
            count: controller.unreadNotificationsCount,
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
            },
          ),
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
      body: AppGradientBackground(
        child: SafeArea(child: tabs[_index]),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.play_circle_outline_rounded), label: 'Learn'),
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
      onRefresh: controller.refreshAll,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
        children: [
          _HeroCard(content: content, onBrowseCourses: onBrowseCourses),
          if (controller.featuredFreeVideo != null) ...[
            const SizedBox(height: 18),
            Card(
              child: ListTile(
                contentPadding: const EdgeInsets.all(18),
                title: const Text(
                  'Featured free lesson',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    controller.featuredFreeVideo!.title,
                    style: const TextStyle(height: 1.5),
                  ),
                ),
                trailing: const Icon(Icons.play_circle_fill_rounded, color: Color(0xFF1F7A4D), size: 34),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => VideoPlayerScreen(
                        title: controller.featuredFreeVideo!.title,
                        description: controller.featuredFreeVideo!.description,
                        videoUrl: controller.featuredFreeVideo!.videoUrl,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
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
          if (content.learningModes.isNotEmpty) ...[
            const SizedBox(height: 22),
            const SectionTitle(
              title: 'Learning modes',
              subtitle: 'The academy supports structured courses, preview lessons, and direct guidance.',
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: content.learningModes
                  .map(
                    (mode) => MetaTag(
                      text: mode,
                      backgroundColor: Colors.white,
                    ),
                  )
                  .toList(),
            ),
          ],
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
          if (controller.testimonials.isNotEmpty) ...[
            const SizedBox(height: 20),
            const SectionTitle(
              title: 'Student voice',
              subtitle: 'Recent learner feedback from the academy.',
            ),
            const SizedBox(height: 12),
            ...controller.testimonials.take(3).map(
              (testimonial) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Card(
                  child: ListTile(
                    title: Text(testimonial.name),
                    subtitle: Text(
                      testimonial.content,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ),
            ),
          ],
          if (content.ownerName.isNotEmpty) ...[
            const SizedBox(height: 20),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SectionTitle(
                      title: 'Owner and mentor',
                      subtitle: 'Direct learning support from the academy owner.',
                    ),
                    const SizedBox(height: 14),
                    Text(
                      content.ownerName,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    Text(content.ownerRole),
                    if (content.aboutDescription.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text(content.aboutDescription, style: const TextStyle(height: 1.5)),
                    ],
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        FilledButton.icon(
                          onPressed: () => openExternal(globalWhatsAppUrl()),
                          icon: const Icon(Icons.chat_rounded),
                          label: const Text('Talk on WhatsApp'),
                        ),
                        if (content.ownerProfileUrl.isNotEmpty)
                          OutlinedButton.icon(
                            onPressed: () => openExternal(content.ownerProfileUrl),
                            icon: const Icon(Icons.open_in_new_rounded),
                            label: const Text('Owner profile'),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class FreeLearningTab extends StatelessWidget {
  const FreeLearningTab({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();
    final videos = controller.freeVideos;

    return RefreshIndicator(
      onRefresh: controller.refreshAll,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
        children: [
          SectionTitle(
            title: 'Free learning',
            subtitle: 'Watch your published Pashto lessons inside the app.',
            trailing: MetaTag(
              text: '${videos.length} videos',
              backgroundColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          if (videos.isEmpty)
            const EmptyStateCard(
              icon: Icons.ondemand_video_rounded,
              title: 'No free lessons yet',
              subtitle: 'When new free lessons are published from Django admin, they will appear here.',
            )
          else
            ...videos.map(
              (video) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: VideoTile(video: video),
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
  String _selectedCategorySlug = '';

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
      onRefresh: controller.refreshAll,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
        children: [
          const SectionTitle(
            title: 'Courses',
            subtitle: 'Browse guided tracks, project-based paths, and trial-ready lessons.',
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Search courses',
              prefixIcon: Icon(Icons.search_rounded),
            ),
            onChanged: (value) => setState(() => _search = value),
          ),
          const SizedBox(height: 14),
          SizedBox(
            height: 42,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: const Text('All'),
                    selected: _selectedCategorySlug.isEmpty,
                    onSelected: (_) async {
                      setState(() => _selectedCategorySlug = '');
                      await context.read<AppController>().loadCourses();
                    },
                  ),
                ),
                ...controller.categories.map(
                  (category) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(category.title),
                      selected: _selectedCategorySlug == category.slug,
                      onSelected: (_) async {
                        setState(() => _selectedCategorySlug = category.slug);
                        await context.read<AppController>().loadCourses(categorySlug: category.slug);
                      },
                    ),
                  ),
                ),
              ],
            ),
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
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
        children: controller.user?.isAdmin == true
            ? _buildAdminDashboard(controller.adminDashboard)
            : _buildStudentDashboard(controller),
      ),
    );
  }

  List<Widget> _buildStudentDashboard(AppController controller) {
    final data = controller.studentDashboard;
    if (data == null && controller.enrollments.isEmpty && controller.payments.isEmpty) {
      return const [SizedBox(height: 250, child: Center(child: CircularProgressIndicator()))];
    }

    return [
      SectionTitle(
        title: 'Student dashboard',
        subtitle: 'Track course access, quiz history, notifications, applications, and payment status.',
        trailing: MetaTag(
          text: '${controller.unreadNotificationsCount} unread',
          backgroundColor: const Color(0xFFFFE8D8),
        ),
      ),
      const SizedBox(height: 12),
      StatStrip(
        items: [
          StatItem(label: 'Courses', value: '${controller.enrollments.length}', icon: Icons.menu_book_rounded),
          StatItem(label: 'Applications', value: '${controller.applications.length}', icon: Icons.assignment_rounded),
          StatItem(label: 'Unread', value: '${controller.unreadNotificationsCount}', icon: Icons.notifications_active_rounded),
          StatItem(label: 'Quizzes', value: '${controller.quizAttempts.length}', icon: Icons.quiz_rounded),
        ],
      ),
      const SizedBox(height: 20),
      const SectionTitle(title: 'Enrollments', subtitle: 'Your active learning tracks.'),
      const SizedBox(height: 12),
      ...controller.enrollments.map(
        (enrollment) => Card(
          elevation: 0,
          child: ListTile(
            title: Text(enrollment.course.title),
            subtitle: Text('${enrollment.status} - ${enrollment.progressPercent}% progress'),
          ),
        ),
      ),
      if (controller.applications.isNotEmpty) ...[
        const SizedBox(height: 20),
        const SectionTitle(title: 'Applications', subtitle: 'Your submitted course requests and pricing updates.'),
        const SizedBox(height: 12),
        ...controller.applications.map(
          (application) => Card(
            elevation: 0,
            child: ListTile(
              title: Text(application.courseTitle),
              subtitle: Text(application.pricingNotes.isEmpty ? application.status : application.pricingNotes),
              trailing: MetaTag(text: application.status),
              onTap: application.whatsappUrl.isEmpty ? null : () => openExternal(application.whatsappUrl),
            ),
          ),
        ),
      ],
      const SizedBox(height: 20),
      const SectionTitle(title: 'Payments', subtitle: 'Per-course payment records and invoice access.'),
      const SizedBox(height: 12),
      ...controller.payments.map(
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
      if (controller.notifications.isNotEmpty) ...[
        const SizedBox(height: 20),
        const SectionTitle(title: 'Latest notifications', subtitle: 'Recent academy updates from the platform.'),
        const SizedBox(height: 12),
        ...controller.notifications.take(3).map(
          (notification) => Card(
            elevation: 0,
            child: ListTile(
              title: Text(notification.title),
              subtitle: Text(notification.message, maxLines: 2, overflow: TextOverflow.ellipsis),
              trailing: notification.isRead
                  ? null
                  : const Icon(Icons.brightness_1, size: 12, color: Color(0xFFFF7A30)),
            ),
          ),
        ),
      ],
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
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              describeAppError(
                error,
                fallback: 'Unable to update profile right now.',
              ),
            ),
          ),
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
              if (course.thumbnailUrl.isNotEmpty) ...[
                AppNetworkImage(
                  url: course.thumbnailUrl,
                  width: double.infinity,
                  height: 180,
                  borderRadius: 24,
                ),
                const SizedBox(height: 16),
              ],
              Row(
                children: [
                  MetaTag(text: course.level),
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
                  MetaTag(text: course.category.title, backgroundColor: Colors.white),
                  MetaTag(text: course.duration),
                  MetaTag(text: course.priceDisplay, backgroundColor: const Color(0xFFFFE8D8)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class VideoTile extends StatelessWidget {
  const VideoTile({super.key, required this.video});

  final FreeLearningVideoModel video;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: InkWell(
        borderRadius: BorderRadius.circular(28),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => VideoPlayerScreen(
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppNetworkImage(
                url: video.thumbnailUrl,
                width: double.infinity,
                height: 180,
                borderRadius: 24,
              ),
              const SizedBox(height: 14),
              Wrap(
                spacing: 10,
                runSpacing: 8,
                children: [
                  MetaTag(text: video.language),
                  if (video.showOnHomepage)
                    const MetaTag(
                      text: 'Featured',
                      backgroundColor: Color(0xFFFFE8D8),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(video.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
              if (video.description.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(video.description, style: const TextStyle(height: 1.5)),
              ],
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
