"use server";

import { routes } from "@/constants/routes";
import type { ProfileInput } from "@/features/profile/schemas/profile-schema";
import { profileSchema } from "@/features/profile/schemas/profile-schema";
import { prisma } from "@/lib/prisma";
import { requireSessionUserId } from "@/lib/session";
import type { ProfileDraft, SnsLinkInput } from "@/types/profile";

export type ProfileActionState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function normalizeOptionalUrl(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

function buildSnsLinks(formData: FormData): SnsLinkInput[] {
  return [0, 1]
    .map((index) => {
      const type = String(formData.get(`snsLinks.${index}.type`) ?? "").trim();
      const url = String(formData.get(`snsLinks.${index}.url`) ?? "").trim();

      if (!type || !url) {
        return null;
      }

      return {
        type: type as SnsLinkInput["type"],
        url,
        sortOrder: index,
      };
    })
    .filter((link): link is SnsLinkInput => link !== null);
}

export async function saveProfile(input: ProfileInput): Promise<ProfileActionState> {
  const userId = await requireSessionUserId();
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "入力内容を確認してください。",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!currentUser) {
    return {
      ok: false,
      message: "ユーザー情報が見つかりません。",
    };
  }

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {
      bio: parsed.data.bio,
      avatarImageUrl: normalizeOptionalUrl(parsed.data.avatarImageUrl),
      avatarSeed: currentUser.userId,
    },
    create: {
      userId,
      bio: parsed.data.bio,
      avatarImageUrl: normalizeOptionalUrl(parsed.data.avatarImageUrl),
      avatarSeed: currentUser.userId,
    },
    select: {
      id: true,
    },
  });

  await prisma.$transaction([
    prisma.snsLink.deleteMany({
      where: { profileId: profile.id },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { profileCompleted: true },
    }),
    ...(parsed.data.snsLinks.length > 0
      ? [
          prisma.snsLink.createMany({
            data: parsed.data.snsLinks.map((link) => ({
              profileId: profile.id,
              type: link.type,
              url: link.url,
              sortOrder: link.sortOrder,
            })),
          }),
        ]
      : []),
  ]);

  return {
    ok: true,
    message: "",
    redirectTo: routes.profile,
  };
}

export async function saveProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  return saveProfile({
    bio: String(formData.get("bio") ?? ""),
    avatarImageUrl: String(formData.get("avatarImageUrl") ?? ""),
    snsLinks: buildSnsLinks(formData),
  });
}

export async function getMyProfile() {
  const userId = await requireSessionUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          snsLinks: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    userId: user.userId,
    displayName: user.displayName,
    realName: user.realName,
    bio: user.profile?.bio ?? "",
    avatarImageUrl: user.profile?.avatarImageUrl ?? null,
    snsLinks: user.profile?.snsLinks ?? [],
  } satisfies ProfileDraft;
}
