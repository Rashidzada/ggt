import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_controller.dart';
import '../models.dart';
import '../widgets/common_widgets.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppController>();
    final notifications = controller.notifications;

    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: RefreshIndicator(
        onRefresh: controller.refreshNotifications,
        child: notifications.isEmpty
            ? ListView(
                padding: const EdgeInsets.all(24),
                children: const [
                  SizedBox(height: 80),
                  Icon(Icons.notifications_none_rounded, size: 68, color: Color(0xFF4D6B5D)),
                  SizedBox(height: 14),
                  Text(
                    'No notifications yet.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Updates from the academy will appear here.',
                    textAlign: TextAlign.center,
                  ),
                ],
              )
            : ListView.separated(
                padding: const EdgeInsets.all(20),
                itemBuilder: (context, index) => _NotificationTile(notification: notifications[index]),
                separatorBuilder: (_, index) => const SizedBox(height: 12),
                itemCount: notifications.length,
              ),
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  const _NotificationTile({required this.notification});

  final NotificationModel notification;

  IconData _iconForType() {
    switch (notification.notificationType) {
      case 'quiz':
        return Icons.quiz_rounded;
      case 'resource':
        return Icons.folder_open_rounded;
      case 'course':
        return Icons.menu_book_rounded;
      case 'enrollment':
        return Icons.workspace_premium_rounded;
      default:
        return Icons.notifications_active_rounded;
    }
  }

  String _formatTimestamp(DateTime? timestamp) {
    if (timestamp == null) {
      return '';
    }
    final local = timestamp.toLocal();
    return '${local.year}-${local.month.toString().padLeft(2, '0')}-${local.day.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(18),
        leading: CircleAvatar(
          backgroundColor: notification.isRead ? const Color(0xFFE4ECE7) : const Color(0xFFD7F0DE),
          child: Icon(_iconForType(), color: const Color(0xFF1F7A4D)),
        ),
        title: Text(
          notification.title,
          style: TextStyle(
            fontWeight: notification.isRead ? FontWeight.w600 : FontWeight.w800,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(notification.message, style: const TextStyle(height: 1.5)),
              if (notification.createdAt != null) ...[
                const SizedBox(height: 8),
                Text(
                  _formatTimestamp(notification.createdAt),
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF4D6B5D),
                  ),
                ),
              ],
            ],
          ),
        ),
        trailing: notification.isRead
            ? null
            : Container(
                width: 10,
                height: 10,
                decoration: const BoxDecoration(
                  color: Color(0xFF1F7A4D),
                  shape: BoxShape.circle,
                ),
              ),
        onTap: () async {
          await context.read<AppController>().markNotificationRead(notification);
          if (context.mounted && notification.actionUrl.isNotEmpty) {
            await openExternal(notification.actionUrl);
          }
        },
      ),
    );
  }
}
