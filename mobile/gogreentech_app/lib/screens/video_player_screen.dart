import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';

import '../video_utils.dart';
import '../widgets/common_widgets.dart';

class VideoPlayerScreen extends StatefulWidget {
  const VideoPlayerScreen({
    super.key,
    required this.title,
    required this.videoUrl,
    this.description = '',
    this.primaryActionLabel,
    this.onPrimaryAction,
  });

  final String title;
  final String videoUrl;
  final String description;
  final String? primaryActionLabel;
  final Future<void> Function()? onPrimaryAction;

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  YoutubePlayerController? _controller;

  bool get _supportsEmbeddedVideo => !kIsWeb && (Platform.isAndroid || Platform.isIOS);

  String? get _videoId => extractYoutubeVideoId(widget.videoUrl);

  @override
  void initState() {
    super.initState();
    if (_supportsEmbeddedVideo && _videoId != null) {
      _controller = YoutubePlayerController.fromVideoId(
        videoId: _videoId!,
        autoPlay: false,
        params: const YoutubePlayerParams(
          enableCaption: false,
          showControls: true,
          showFullscreenButton: true,
          strictRelatedVideos: true,
        ),
      );
    }
  }

  @override
  void dispose() {
    _controller?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final videoId = _videoId;
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(28),
            child: AspectRatio(
              aspectRatio: 16 / 9,
              child: _controller != null
                  ? YoutubePlayer(
                      controller: _controller!,
                      aspectRatio: 16 / 9,
                    )
                  : Container(
                      color: const Color(0xFF163D2F),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          if (videoId != null)
                            Image.network(
                              youtubeThumbnailUrl(videoId),
                              fit: BoxFit.cover,
                              errorBuilder: (_, error, stackTrace) => const SizedBox.shrink(),
                            ),
                          Container(color: Colors.black.withValues(alpha: 0.3)),
                          Center(
                            child: FilledButton.icon(
                              onPressed: () => openExternal(widget.videoUrl),
                              icon: const Icon(Icons.open_in_new_rounded),
                              label: const Text('Open video'),
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            widget.title,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF163D2F),
                ),
          ),
          if (widget.description.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text(widget.description, style: const TextStyle(height: 1.6)),
          ],
          const SizedBox(height: 20),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              FilledButton.icon(
                onPressed: () => openExternal(widget.videoUrl),
                icon: const Icon(Icons.play_arrow_rounded),
                label: Text(_controller != null ? 'Open in YouTube' : 'Open video'),
              ),
              if (widget.onPrimaryAction != null && widget.primaryActionLabel != null)
                OutlinedButton.icon(
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    await widget.onPrimaryAction!();
                    if (!mounted) {
                      return;
                    }
                    messenger.showSnackBar(
                      SnackBar(content: Text('${widget.primaryActionLabel!} complete.')),
                    );
                  },
                  icon: const Icon(Icons.check_circle_rounded),
                  label: Text(widget.primaryActionLabel!),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
