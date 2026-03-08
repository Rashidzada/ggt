String? extractYoutubeVideoId(String url) {
  final uri = Uri.tryParse(url);
  if (uri == null) {
    return null;
  }

  final queryVideoId = uri.queryParameters['v'];
  if (queryVideoId != null && queryVideoId.isNotEmpty) {
    return queryVideoId;
  }

  final parts = uri.pathSegments.where((part) => part.isNotEmpty).toList();
  if (uri.host.endsWith('youtu.be') && parts.isNotEmpty) {
    return parts.first;
  }

  if (parts.length >= 2 && {'embed', 'shorts', 'live'}.contains(parts.first)) {
    return parts[1];
  }

  return null;
}

String youtubeThumbnailUrl(String videoId) {
  return 'https://i.ytimg.com/vi/$videoId/hqdefault.jpg';
}
