export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Accept Instagram reel / post URLs and normalize to permalink + embed. */
export function parseInstagramReel(url: string): {
  permalink: string;
  embedUrl: string;
  shortcode: string;
} | null {
  try {
    const cleaned = url.trim();
    const match = cleaned.match(
      /instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i,
    );
    if (!match?.[1]) return null;
    const shortcode = match[1];
    const permalink = `https://www.instagram.com/reel/${shortcode}/`;
    const embedUrl = `https://www.instagram.com/reel/${shortcode}/embed`;
    return { permalink, embedUrl, shortcode };
  } catch {
    return null;
  }
}
