import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

Future<void> openExternal(String url) async {
  final uri = Uri.parse(url);
  if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
    throw Exception('Unable to open $url');
  }
}

String globalWhatsAppUrl([
  String message = 'Assalamualaikum, I want to know more about GoGreenTech Learning Academy.',
]) {
  return 'https://wa.me/923470983567?text=${Uri.encodeComponent(message)}';
}

class BrandLogo extends StatelessWidget {
  const BrandLogo({
    super.key,
    this.size = 56,
    this.radius = 18,
  });

  final double size;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: Image.asset(
        'assets/images/gogreentech_logo.png',
        width: size,
        height: size,
        fit: BoxFit.cover,
      ),
    );
  }
}

class BrandLockup extends StatelessWidget {
  const BrandLockup({
    super.key,
    this.logoSize = 56,
    this.titleSize = 24,
    this.showSubtitle = true,
    this.compact = false,
  });

  final double logoSize;
  final double titleSize;
  final bool showSubtitle;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: compact ? MainAxisSize.min : MainAxisSize.max,
      children: [
        BrandLogo(size: logoSize, radius: logoSize * 0.32),
        const SizedBox(width: 14),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'GoGreenTech',
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.fraunces(
                  fontSize: titleSize,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF163D2F),
                ),
              ),
              if (showSubtitle)
                const Text(
                  'Learning Academy',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    letterSpacing: 1.2,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF4D6B5D),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle({
    super.key,
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.fraunces(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF163D2F),
          ),
        ),
        const SizedBox(height: 6),
        Text(subtitle, style: const TextStyle(height: 1.5)),
      ],
    );
  }
}

class InfoPanel extends StatelessWidget {
  const InfoPanel({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(minWidth: 220, maxWidth: 360),
      child: Card(
        elevation: 0,
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: const Color(0xFF1F7A4D)),
              const SizedBox(height: 14),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 6),
              Text(subtitle),
            ],
          ),
        ),
      ),
    );
  }
}

class MetaTag extends StatelessWidget {
  const MetaTag({super.key, required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFE0F2E4),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(text),
    );
  }
}

class StatItem {
  const StatItem({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;
}

class StatStrip extends StatelessWidget {
  const StatStrip({super.key, required this.items});

  final List<StatItem> items;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 14,
      runSpacing: 14,
      children: items
          .map(
            (item) => SizedBox(
              width: 180,
              child: Card(
                elevation: 0,
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(item.icon, color: const Color(0xFF1F7A4D)),
                      const SizedBox(height: 12),
                      Text(item.label, style: const TextStyle(fontSize: 13)),
                      const SizedBox(height: 4),
                      Text(item.value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}
