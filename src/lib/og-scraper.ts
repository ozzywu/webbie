export interface OgMetadata {
  title: string;
  author: string | null;
  excerpt: string | null;
  og_image: string | null;
  source: string;
}

const SOURCE_MAP: Record<string, string> = {
  "substack.com": "substack",
  "medium.com": "medium",
  "x.com": "twitter",
  "twitter.com": "twitter",
  "arxiv.org": "arxiv",
  "github.com": "github",
  "youtube.com": "youtube",
  "youtu.be": "youtube",
  "nytimes.com": "nytimes",
  "wsj.com": "wsj",
  "bloomberg.com": "bloomberg",
  "theguardian.com": "guardian",
  "wired.com": "wired",
  "aeon.co": "aeon",
};

function deriveSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    for (const [domain, source] of Object.entries(SOURCE_MAP)) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        return source;
      }
    }
    return "web";
  } catch {
    return "web";
  }
}

function extractMetaContent(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim());
    }
  }
  return null;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

export async function scrapeOgMetadata(url: string): Promise<OgMetadata> {
  const source = deriveSource(url);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ToscaBot/1.0; +https://tosca.dev)",
        Accept: "text/html",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return { title: url, author: null, excerpt: null, og_image: null, source };
    }

    const html = await res.text();

    const title =
      extractMetaContent(html, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      ]) ??
      extractMetaContent(html, [
        /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
      ]) ??
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ??
      url;

    const author =
      extractMetaContent(html, [
        /<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']author["']/i,
        /<meta[^>]+property=["']article:author["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']article:author["']/i,
      ]);

    const excerpt =
      extractMetaContent(html, [
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
      ]) ??
      extractMetaContent(html, [
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
      ]);

    const og_image =
      extractMetaContent(html, [
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      ]);

    return {
      title: decodeHtmlEntities(title),
      author,
      excerpt,
      og_image,
      source,
    };
  } catch {
    return { title: url, author: null, excerpt: null, og_image: null, source };
  }
}
