import { z } from "zod";

export const snsLinkSchema = z.object({
  type: z.enum(["x", "instagram", "linkedin", "other"]),
  url: z.string().url(),
  sortOrder: z.number().int().min(0),
});

export const profileSchema = z.object({
  bio: z.string().max(280).default(""),
  avatarImageUrl: z.string().url().optional().or(z.literal("")),
  snsLinks: z.array(snsLinkSchema).max(4),
});

export type ProfileInput = z.infer<typeof profileSchema>;
