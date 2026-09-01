// Real feed for @voyageenrail — pulled at build time from the Instagram
// Graph API (Instagram API with Instagram Login), not scraped or faked.
//
// This requires a token that only the account owner can generate — Instagram
// doesn't allow anonymous/public reads of a feed. One-time setup, done once
// by whoever owns @voyageenrail:
//
//   1. The Instagram account must be a Professional account (Business or
//      Creator) — Settings → Account type in the Instagram app.
//   2. Create an app at developers.facebook.com/apps (type: "Consumer" or
//      "Other" → add the "Instagram" product, "API setup with Instagram
//      login" flow — no Facebook Page needed with this newer flow).
//   3. Generate a long-lived access token for @voyageenrail through that
//      flow. Long-lived tokens last 60 days and can be refreshed
//      indefinitely by calling the refresh endpoint before they expire —
//      see https://developers.facebook.com/docs/instagram-platform.
//   4. Put it in the site's env as INSTAGRAM_ACCESS_TOKEN (in Netlify:
//      Site settings → Environment variables). Never commit it.
//
// Without that token (e.g. in local dev, or until it's set up), the site
// falls back to a static placeholder grid — see index.astro.

export type InstagramPost = {
  id: string;
  caption: string | null;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
};

const GRAPH_VERSION = 'v21.0';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[] | null> {
  const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const url = `https://graph.instagram.com/${GRAPH_VERSION}/me/media?fields=${FIELDS}&limit=${limit}&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[instagram] Graph API returned ${res.status}: ${await res.text()}`);
      return null;
    }
    const json = await res.json();
    const items: any[] = json.data ?? [];
    return items
      .filter((item) => item.media_type !== 'VIDEO' || item.thumbnail_url) // need something image-like to show
      .slice(0, limit)
      .map((item) => ({
        id: item.id,
        caption: item.caption ?? null,
        mediaUrl: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url,
        permalink: item.permalink,
        timestamp: item.timestamp,
      }));
  } catch (err) {
    console.warn('[instagram] fetch failed, falling back to placeholder grid:', err);
    return null;
  }
}
