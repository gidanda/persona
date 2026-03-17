export type SnsLinkType = "x" | "instagram" | "linkedin" | "other";
export type InterestCategory = "music" | "movie" | "book" | "place" | "theme" | "other";

export type SnsLinkInput = {
  id?: string;
  type: SnsLinkType;
  url: string;
  sortOrder: number;
};

export type ProfileInterestInput = {
  id?: string;
  category: InterestCategory;
  label: string;
  provider?: string;
  externalId?: string;
  subtitle?: string;
  imageUrl?: string;
  deeplinkUrl?: string;
  sortOrder: number;
};

export type ProfileDraft = {
  userId: string;
  displayName: string;
  realName: string;
  bio: string;
  thinkingNow: string;
  doingNow: string;
  avatarImageUrl?: string | null;
  snsLinks: SnsLinkInput[];
  interests: ProfileInterestInput[];
};
