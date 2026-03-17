import { z } from "zod";

export const interestSchema = z.object({
  category: z.enum(["music", "movie", "book", "place", "theme", "other"]),
  label: z.string().trim().min(1).max(120),
  provider: z.string().trim().max(40).optional().or(z.literal("")),
  externalId: z.string().trim().max(120).optional().or(z.literal("")),
  subtitle: z.string().trim().max(180).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  deeplinkUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().min(0),
});

export const snsLinkSchema = z.object({
  type: z.enum(["x", "instagram", "linkedin", "other"]),
  url: z.string().url(),
  sortOrder: z.number().int().min(0),
});

export const profileSchema = z.object({
  bio: z.string().max(280).default(""),
  thinkingNow: z.string().max(160).default(""),
  doingNow: z.string().max(160).default(""),
  avatarImageUrl: z.string().url().optional().or(z.literal("")),
  snsLinks: z.array(snsLinkSchema).max(4),
  interests: z.array(interestSchema).max(3),
});

export type ProfileInput = z.infer<typeof profileSchema>;
