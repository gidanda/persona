export function buildProfileShareValue(userId: string) {
  return userId;
}

export function extractProfileToken(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (!normalized.includes("://")) {
    return normalized.replace(/^@/, "");
  }

  try {
    const url = new URL(normalized);
    const segments = url.pathname.split("/").filter(Boolean);
    const token = segments.at(-1);

    return token ? token.replace(/^@/, "") : null;
  } catch {
    return null;
  }
}
