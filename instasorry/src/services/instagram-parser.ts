import { FollowerEntry, InstagramExportData } from "@/types";

// Parseia o formato JSON exportado pela Meta (Central de Contas)
// Estrutura: { relationships_followers: [{ string_list_data: [{ value, href, timestamp }] }] }
function parseJsonFormat(data: unknown): FollowerEntry[] {
  const entries: FollowerEntry[] = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      const listData = item?.string_list_data;
      if (Array.isArray(listData)) {
        for (const entry of listData) {
          if (entry?.value) {
            entries.push({
              username: entry.value,
              profileUrl: entry.href ?? undefined,
            });
          }
        }
      }
      // Formato alternativo: title + href direto
      if (item?.title) {
        entries.push({
          username: item.title,
          profileUrl: item.href ?? undefined,
        });
      }
    }
  }

  return entries;
}

// Parseia HTML exportado pela Meta
function parseHtmlFormat(html: string): FollowerEntry[] {
  const entries: FollowerEntry[] = [];
  // Extrai links de perfil do Instagram do HTML exportado
  const regex = /href="https:\/\/www\.instagram\.com\/([^/"]+)\/?"/gi;
  let match;
  const seen = new Set<string>();

  while ((match = regex.exec(html)) !== null) {
    const username = match[1].toLowerCase();
    if (!seen.has(username) && username !== "p" && username.length > 0) {
      seen.add(username);
      entries.push({
        username,
        profileUrl: `https://www.instagram.com/${username}/`,
      });
    }
  }

  return entries;
}

export function parseFollowersFile(content: string, filename: string): FollowerEntry[] {
  try {
    if (filename.endsWith(".json")) {
      const parsed = JSON.parse(content);
      // A Meta exporta como objeto com chave "relationships_followers"
      const arr = parsed?.relationships_followers ?? parsed;
      return parseJsonFormat(arr);
    }

    if (filename.endsWith(".html") || filename.endsWith(".htm")) {
      return parseHtmlFormat(content);
    }

    // Tenta JSON mesmo sem extensão
    try {
      const parsed = JSON.parse(content);
      const arr = parsed?.relationships_followers ?? parsed;
      return parseJsonFormat(arr);
    } catch {
      return parseHtmlFormat(content);
    }
  } catch (err) {
    throw new Error(`Erro ao processar arquivo ${filename}: ${err}`);
  }
}

export function parseFollowingFile(content: string, filename: string): FollowerEntry[] {
  try {
    if (filename.endsWith(".json")) {
      const parsed = JSON.parse(content);
      // A Meta exporta como objeto com chave "relationships_following"
      const arr =
        parsed?.relationships_following ??
        parsed?.following_hashtag_following ??
        parsed;
      return parseJsonFormat(arr);
    }

    if (filename.endsWith(".html") || filename.endsWith(".htm")) {
      return parseHtmlFormat(content);
    }

    try {
      const parsed = JSON.parse(content);
      const arr = parsed?.relationships_following ?? parsed;
      return parseJsonFormat(arr);
    } catch {
      return parseHtmlFormat(content);
    }
  } catch (err) {
    throw new Error(`Erro ao processar arquivo ${filename}: ${err}`);
  }
}

export function buildExportData(
  followersContent: string,
  followersFilename: string,
  followingContent: string,
  followingFilename: string
): InstagramExportData {
  return {
    followers: parseFollowersFile(followersContent, followersFilename),
    following: parseFollowingFile(followingContent, followingFilename),
  };
}
