export function extractYouTubeVideoId(url: string) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    if (hostname === "youtu.be") {
      return pathParts[0] ?? "";
    }

    if (hostname.endsWith("youtube.com") || hostname.endsWith("youtube-nocookie.com")) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v") ?? "";
      }

      if (pathParts.length >= 2 && ["embed", "shorts", "live"].includes(pathParts[0])) {
        return pathParts[1];
      }
    }
  } catch {
    return "";
  }

  return "";
}

export function buildYouTubeEmbedUrl(videoId: string) {
  if (!videoId) {
    return "";
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
}

export function toYouTubeEmbedUrl(url: string) {
  const videoId = extractYouTubeVideoId(url);
  return buildYouTubeEmbedUrl(videoId);
}
