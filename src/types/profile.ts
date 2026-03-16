export type SnsLinkType = "x" | "instagram" | "linkedin" | "other";

export type SnsLinkInput = {
  id?: string;
  type: SnsLinkType;
  url: string;
  sortOrder: number;
};

export type ProfileDraft = {
  userId: string;
  displayName: string;
  realName: string;
  bio: string;
  avatarImageUrl?: string | null;
  snsLinks: SnsLinkInput[];
};
