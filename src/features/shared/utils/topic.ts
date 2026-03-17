export function normalizeTopicKey(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 160);
}

export function buildRelationshipPair(userIdA: string, userIdB: string) {
  return [userIdA, userIdB].sort((left, right) => left.localeCompare(right)) as [string, string];
}

export function formatSourceContextLabel(value: string) {
  switch (value) {
    case "profile_interest":
      return "Profile";
    case "profile_thinking":
      return "Thinking";
    case "profile_doing":
      return "Doing";
    case "profile_bio":
      return "Bio";
    default:
      return value;
  }
}

export function formatOriginLabel(value: string) {
  switch (value) {
    case "empathy":
      return "共感";
    case "interest":
      return "興味";
    case "recommendation":
      return "推薦";
    case "reaction_to_recent":
      return "Recent";
    default:
      return value;
  }
}
